/* @ngInject */
export default function ProtectedResourceInterceptor(salteAuthService, $q, $rootScope) {
  return {
    request: function(config) {
      if (config) {
        config.headers = config.headers || {};
        let resource = salteAuthService.getResourceForEndpoint(config.url);
        salteAuthService.verbose('Url: ' + config.url + ' maps to resource: ' + resource);

        if (resource === null) {
          return config;
        }

        let tokenStored = salteAuthService.getCachedToken(resource);
        if (tokenStored) {
          salteAuthService.info('Token is available for this url ' + config.url);
          // check endpoint mapping if provided
          config.headers.Authorization = 'Bearer ' + tokenStored;
          return config;
        }

        // Cancel request if login is starting
        let delayedRequest;
        if (salteAuthService.loginInProgress()) {
          if (salteAuthService.config.popUp) {
            salteAuthService.info('Url: ' + config.url + ' will be loaded after login is successful');
            delayedRequest = $q.defer();
            $rootScope.$on('salte-auth:loginSuccess', function(event, token) {
              if (token) {
                salteAuthService.info('Login completed, sending request for ' + config.url);
                config.headers.Authorization = 'Bearer ' + tokenStored;
                delayedRequest.resolve(config);
              }
            });
            return delayedRequest.promise;
          }

          salteAuthService.info('login is in progress.');
          config.data = 'login in progress, cancelling the request for ' + config.url;
          return $q.reject(config);
        }

        // delayed request to return after iframe completes
        delayedRequest = $q.defer();
        salteAuthService.acquireToken(resource).then(function(token) {
          salteAuthService.verbose('Token is available');
          config.headers.Authorization = 'Bearer ' + token;
          delayedRequest.resolve(config);
        }, function(err) {
          config.data = err;
          delayedRequest.reject(config);
        });

        return delayedRequest.promise;
      }
    },
    responseError: function(rejection) {
      salteAuthService.info('Getting error in the response.');
      if (rejection) {
        if (rejection.status === 401) {
          let resource = salteAuthService.getResourceForEndpoint(rejection.config.url);
          salteAuthService.clearCacheForResource(resource);
          $rootScope.$broadcast('salte-auth:notAuthorized', rejection, resource);
        } else {
          $rootScope.$broadcast('salte-auth:errorResponse', rejection);
        }
        return $q.reject(rejection);
      }
    }
  };
}
