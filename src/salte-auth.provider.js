import SalteAuth from 'salte-auth';

export default function() {
  let salteAuth = null;
  let _oauthData = {
    isAuthenticated: false,
    userName: '',
    loginError: '',
    profile: ''
  };

  let updateDataFromCache = function(resource) {
    // only cache lookup here to not interrupt with events
    let token = salteAuth.getCachedToken(resource);
    _oauthData.isAuthenticated = token !== null && token.length > 0;
    let user = salteAuth.getCachedUser() || {
      userName: ''
    };
    _oauthData.userName = user.userName;
    _oauthData.profile = user.profile;
    _oauthData.loginError = salteAuth.getLoginError();
  };

  this.init = function(configOptions, httpProvider) {
    if (configOptions) {
      // redirect and logout_redirect are set to current location by default
      let existingHash = window.location.hash;
      let pathDefault = window.location.href;
      if (existingHash) {
        pathDefault = pathDefault.replace(existingHash, '');
      }
      configOptions.redirectUri = configOptions.redirectUri || pathDefault;
      configOptions.postLogoutRedirectUri = configOptions.postLogoutRedirectUri || pathDefault;
      configOptions.isAngular = true;

      if (httpProvider && httpProvider.interceptors) {
        httpProvider.interceptors.push('ProtectedResourceInterceptor');
      }

      // create instance with given config
      salteAuth = new SalteAuth(configOptions);
    } else {
      throw new Error('You must set configOptions, when calling init');
    }

    // loginResource is used to set authenticated status
    updateDataFromCache(salteAuth.config.loginResource);
  };

  /* @ngInject */
  this.$get = function SalteAuthService($rootScope, $window, $q, $location, $timeout, $injector) {
    let locationChangeHandler = function(event, newUrl, oldUrl) {
      salteAuth.verbose('Location change event from ' + oldUrl + ' to ' + newUrl);
      let hash = $window.location.hash;
      let search = $window.location.search;

      if (salteAuth.isCallback(hash, search)) {
        // callback can come from login or iframe request
        salteAuth.verbose('Processing Callback, Hash: ' + hash + '; Search String: ' + search);
        let requestInfo = salteAuth.getRequestInfo(hash, search);
        salteAuth.saveTokenFromHash(requestInfo);

        // Return to callback if it is sent from iframe
        if (requestInfo.stateMatch) {
          if (requestInfo.requestType === salteAuth.REQUEST_TYPE.RENEW_TOKEN) {
            let callback = $window.parent.AuthenticationContext.callBackMappedToRenewStates[requestInfo.stateResponse];
            // since this is a token renewal request in iFrame, we don't need to proceed with the location change.
            event.preventDefault();

            // Call within the same context without full page redirect keeps the callback
            if (callback && typeof callback === 'function') {
              // id_token or access_token can be renewed
              if (requestInfo.parameters.access_token) {
                callback(salteAuth._getItem(salteAuth.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters.access_token);
                return;
              } else if (requestInfo.parameters.id_token) {
                callback(salteAuth._getItem(salteAuth.CONSTANTS.STORAGE.ERROR_DESCRIPTION), requestInfo.parameters.id_token);
                return;
              } else if (requestInfo.parameters.error) {
                callback(salteAuth._getItem(salteAuth.CONSTANTS.STORAGE.ERROR_DESCRIPTION), null);
                return;
              }
            }
          } else if (requestInfo.requestType === salteAuth.REQUEST_TYPE.LOGIN) {
            // normal full login redirect happened on the page
            updateDataFromCache(salteAuth.config.loginResource);
            if (_oauthData.userName) {
              $timeout(function() {
                // id_token is added as token for the app
                updateDataFromCache(salteAuth.config.loginResource);
                $rootScope.userInfo = _oauthData;
              }, 1);

              $rootScope.$broadcast('salte-auth:loginSuccess', salteAuth._getItem(salteAuth.CONSTANTS.STORAGE.IDTOKEN));
            } else {
              $rootScope.$broadcast('salte-auth:loginFailure', salteAuth._getItem(salteAuth.CONSTANTS.STORAGE.ERROR_DESCRIPTION));
            }

            if (salteAuth.callback && typeof salteAuth.callback === 'function') {
              salteAuth.callback(salteAuth._getItem(salteAuth.CONSTANTS.STORAGE.ERROR_DESCRIPTION), salteAuth._getItem(salteAuth.CONSTANTS.STORAGE.IDTOKEN));
            }

            // redirect to login start page
            if (!salteAuth.popUp) {
              let loginStartPage = salteAuth._getItem(salteAuth.CONSTANTS.STORAGE.LOGIN_REQUEST);
              if (typeof loginStartPage !== 'undefined' && loginStartPage && loginStartPage.length !== 0) {
                // prevent the current location change and redirect the user back to the login start page
                salteAuth.verbose('Redirecting to start page: ' + loginStartPage);
                if (!$location.$$html5 && loginStartPage.indexOf('#') > -1) {
                  $location.url(loginStartPage.substring(loginStartPage.indexOf('#') + 1));
                }
                $window.location = loginStartPage;
              }
            } else {
              event.preventDefault();
            }
          }
        } else {
          // state did not match, broadcast an error
          $rootScope.$broadcast('salte-auth:stateMismatch', salteAuth._getItem(salteAuth.CONSTANTS.STORAGE.ERROR_DESCRIPTION));
        }
      } else {
        // No callback. App resumes after closing or moving to new page.
        // Check token and username
        updateDataFromCache(salteAuth.config.loginResource);
        if (!_oauthData.isAuthenticated && _oauthData.userName && !salteAuth._renewActive) {
          // id_token is expired or not present
          salteAuth._renewActive = true;
          salteAuth.acquireToken(salteAuth.config.loginResource, function(error, tokenOut) {
            salteAuth._renewActive = false;
            if (error) {
              $rootScope.$broadcast('salte-auth:loginFailure', 'auto renew failure');
            } else if (tokenOut) {
              _oauthData.isAuthenticated = true;
            }
          });
        }
      }

      $timeout(function() {
        updateDataFromCache(salteAuth.config.loginResource);
        $rootScope.userInfo = _oauthData;
      }, 1);
    };

    let loginHandler = function() {
      salteAuth.info('Login event for:' + $location.$$url);
      if (salteAuth.config && salteAuth.config.localLoginUrl) {
        $location.path(salteAuth.config.localLoginUrl);
      } else {
        // directly start login flow
        salteAuth.info('Start login at:' + window.location.href);
        $rootScope.$broadcast('salte-auth:loginRedirect');
        salteAuth.login($location.absUrl());
      }
    };

    function isADLoginRequired(route, global) {
      return global.requireAuthentication ? route.requireAuthentication !== false : Boolean(route.requireAuthentication);
    }

    function isAnonymousEndpoint(url) {
      if (salteAuth.config && salteAuth.config.anonymousEndpoints) {
        for (let i = 0; i < salteAuth.config.anonymousEndpoints.length; i++) {
          if (url.indexOf(salteAuth.config.anonymousEndpoints[i]) > -1) {
            return true;
          }
        }
      }
      return false;
    }

    function getStates(toState) {
      let state = null;
      let states = [];
      if (toState.hasOwnProperty('parent')) {
        state = toState;
        while (state) {
          states.unshift(state);
          state = $injector.get('$state').get(state.parent);
        }
      } else {
        let stateNames = toState.name.split('.');
        for (let i = 0, stateName = stateNames[0]; i < stateNames.length; i++) {
          state = $injector.get('$state').get(stateName);
          if (state) {
            states.push(state);
          }
          stateName += '.' + stateNames[i + 1];
        }
      }
      return states;
    }

    let routeChangeHandler = function(e, nextRoute) {
      if (nextRoute && nextRoute.$$route) {
        if (isADLoginRequired(nextRoute.$$route, salteAuth.config)) {
          if (!_oauthData.isAuthenticated) {
            if (!salteAuth._renewActive && !salteAuth.loginInProgress()) {
              salteAuth.info('Route change event for:' + $location.$$url);
              loginHandler();
            }
          }
        } else {
          let nextRouteUrl;
          if (typeof nextRoute.$$route.templateUrl === 'function') {
            nextRouteUrl = nextRoute.$$route.templateUrl(nextRoute.params);
          } else {
            nextRouteUrl = nextRoute.$$route.templateUrl;
          }

          if (nextRouteUrl && !isAnonymousEndpoint(nextRouteUrl)) {
            salteAuth.config.anonymousEndpoints.push(nextRouteUrl);
          }
        }
      }
    };

    let stateChangeHandler = function(e, toState, toParams, fromState, fromParams) { // jshint ignore:line
      if (toState) {
        let states = getStates(toState);
        let state = null;
        for (let i = 0; i < states.length; i++) {
          state = states[i];
          if (isADLoginRequired(state, salteAuth.config)) {
            if (!_oauthData.isAuthenticated) {
              if (!salteAuth._renewActive && !salteAuth.loginInProgress()) {
                salteAuth.info('State change event for:' + $location.$$url);
                loginHandler();
              }
            }
          } else if (state.templateUrl) {
            let nextStateUrl;
            if (typeof state.templateUrl === 'function') {
              nextStateUrl = state.templateUrl(toParams);
            } else {
              nextStateUrl = state.templateUrl;
            }
            if (nextStateUrl && !isAnonymousEndpoint(nextStateUrl)) {
              salteAuth.config.anonymousEndpoints.push(nextStateUrl);
            }
          }
        }
      }
    };

    let stateChangeErrorHandler = function(event, toState, toParams, fromState, fromParams, error) {
      salteAuth.verbose('State change error occured. Error: ' + error);

      if (error && error.data) {
        salteAuth.info('Setting defaultPrevented to true if state change error occured because the request was rejected. Error: ' + error.data);
        event.preventDefault();
      }
    };

    // Route change event tracking to receive fragment and also auto renew tokens
    $rootScope.$on('$routeChangeStart', routeChangeHandler);

    $rootScope.$on('$stateChangeStart', stateChangeHandler);

    $rootScope.$on('$locationChangeStart', locationChangeHandler);

    $rootScope.$on('$stateChangeError', stateChangeErrorHandler);

    updateDataFromCache(salteAuth.config.loginResource);
    $rootScope.userInfo = _oauthData;

    return {
      // public methods will be here that are accessible from Controller
      config: salteAuth.config,
      login: function() {
        loginHandler();
      },
      loginInProgress: function() {
        return salteAuth.loginInProgress();
      },
      logOut: function() {
        salteAuth.logOut();
        // call signout related method
      },
      getCachedToken: function(resource) {
        return salteAuth.getCachedToken(resource);
      },
      userInfo: _oauthData,
      acquireToken: function(resource) {
        // automated token request call
        let deferred = $q.defer();
        salteAuth._renewActive = true;
        salteAuth.acquireToken(resource, function(error, tokenOut) {
          salteAuth._renewActive = false;
          if (error) {
            salteAuth.error('Error when acquiring token for resource: ' + resource, error);
            deferred.reject(error);
          } else {
            deferred.resolve(tokenOut);
          }
        });

        return deferred.promise;
      },
      getUser: function() {
        let deferred = $q.defer();
        salteAuth.getUser(function(error, user) {
          if (error) {
            salteAuth.error('Error when getting user', error);
            deferred.reject(error);
          } else {
            deferred.resolve(user);
          }
        });

        return deferred.promise;
      },
      getResourceForEndpoint: function(endpoint) {
        return salteAuth.getResourceForEndpoint(endpoint);
      },
      clearCache: function() {
        salteAuth.clearCache();
      },
      clearCacheForResource: function(resource) {
        salteAuth.clearCacheForResource(resource);
      },
      info: function(message) {
        salteAuth.info(message);
      },
      verbose: function(message) {
        salteAuth.verbose(message);
      },
      salteAuth: salteAuth
    };
  };
  this.$get.$inject = ['$rootScope', '$window', '$q', '$location', '$timeout', '$injector'];
}
