import ngRouteApp from '../ngRouteApp.js';

describe('angular ngRoute tests', function() {
  let $scope, $httpBackend, salteAuthService, $rootScope, $controller, $q, $window, $route, $location;

  beforeEach(angular.mock.module(ngRouteApp));

  beforeEach(angular.mock.inject.strictDi(true));

  beforeEach(angular.mock.inject(function(_salteAuthService_, _$rootScope_, _$controller_, _$httpBackend_, _$q_, _$window_, _$route_, _$location_) {
    salteAuthService = _salteAuthService_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $window = _$window_;
    $route = _$route_;
    $location = _$location_;
    $scope = $rootScope.$new();

    salteAuthService.getCachedToken = function(resource) {
      if (resource === 'resource1') {
        return 'Token3434';
      }

      if (resource === 'resource2') {
        return 'Token123';
      }

      if (resource === salteAuthService.config.loginResource) {
        return 'Token456';
      }

      return '';
    };

    salteAuthService.acquireToken = function(resource) {
      let token = '';
      if (resource === 'resource1') {
        token = 'RenewToken3434';
      }

      if (resource === 'resource2') {
        token = 'RenewToken123';
      }

      if (resource === salteAuthService.config.loginResource) {
        token = 'RenewToken456';
      }
      return $q.when(token);
    };

    $controller('TaskCtl', {
      $scope: $scope,
      salteAuthService: salteAuthService
    });
  }));

  afterEach(function() {
    $window.parent.AuthenticationContext = null;
    $window.AuthenticationContext = null;
  });

  it('assigns user', function() {
    expect($scope.user.userName).toBe('');
    expect($scope.user.isAuthenticated).toBe(false);
  });

  it('send tokens for webapi call in endpoints list', function() {
    $httpBackend.expectGET('/api/Todo/5', function(headers) {
      return headers.Authorization === 'Bearer Token3434';
    }).respond(200, {
      id: 5,
      name: 'TODOItem1'
    });
    $scope.taskCall();
    $httpBackend.flush();

    let task = $scope.task;
    expect(task.name).toBe('TODOItem1');
  });

  it('send tokens for webapi call in endpoints list', function() {
    $httpBackend.expectGET('/anotherApi/Item/13', function(headers) {
      return headers.Authorization === 'Bearer Token123';
    }).respond(200, {
      id: 5,
      itemName: 'ItemWithoutAuth'
    });
    $scope.itemCall();
    $httpBackend.flush();

    let task = $scope.item;
    expect(task.itemName).toBe('ItemWithoutAuth');
  });

  it('send tokens for webapi call in endpoints list', function() {
    $httpBackend.expectGET('https://testapi.com/', function(headers) {
      return headers.Authorization === 'Bearer Token3434';
    }).respond(200);
    $scope.taskCall3();
    $httpBackend.flush();
  });

  it('does not send tokens for webapi(https) call not in endpoints list', function() {
    $httpBackend.expectGET('https://test.com/', function(headers) {
      return headers.hasOwnProperty('Authorization') === false;
    }).respond(200);
    $scope.taskCall2();
    $httpBackend.flush();
  });

  it('does not send tokens for webapi(http) call not in endpoint list', function() {
    $httpBackend.expectGET('http://testwebapi.com/', function(headers) {
      return headers.hasOwnProperty('Authorization') === false;
    }).respond(200);
    $scope.taskCall6();
    $httpBackend.flush();
  });

  it('send tokens for app backend call not in endpoints list', function() {
    $httpBackend.expectGET('/someapi/item', function(headers) {
      return headers.Authorization === 'Bearer Token456';
    }).respond(200);
    $scope.taskCall4();
    $httpBackend.flush();
  });

  it('send tokens for app backend call', function() {
    $httpBackend.expectGET('https://myapp.com/someapi/item', function(headers) {
      return headers.Authorization === 'Bearer Token456';
    }).respond(200);
    $scope.taskCall5();
    $httpBackend.flush();
  });

  it('renews tokens for app backend', function() {
    // This makes adal to try renewing the token since no token is returned from cache
    salteAuthService.getCachedToken = function() {
      return '';
    };
    $httpBackend.expectGET('https://myapp.com/someapi/item', function(headers) {
      return headers.Authorization === 'Bearer RenewToken456';
    }).respond(200, {
      id: 5,
      name: 'TODOItem2'
    });
    $scope.taskCall5();
    $httpBackend.flush();

    let task = $scope.task;
    expect(task.name).toBe('TODOItem2');
  });

  it('renews tokens for webapi in endpoint list', function() {
    salteAuthService.getCachedToken = function() {
      return '';
    };
    $httpBackend.expectGET('/anotherApi/Item/13', function(headers) {
      return headers.Authorization === 'Bearer RenewToken123';
    }).respond(200, {
      id: 5,
      itemName: 'ItemWithoutAuth'
    });
    $scope.itemCall();
    $httpBackend.flush();

    let task = $scope.item;
    expect(task.itemName).toBe('ItemWithoutAuth');
  });

  it('renews tokens for webapi in endpoint list', function() {
    salteAuthService.getCachedToken = function() {
      return '';
    };
    $httpBackend.expectGET('https://testapi.com/', function(headers) {
      return headers.Authorization === 'Bearer RenewToken3434';
    }).respond(200);
    $scope.taskCall3();
    $httpBackend.flush();
  });

  it('tests errorResponse broadcast when login is in progress', function() {
    salteAuthService.getCachedToken = function() {
      return '';
    };
    salteAuthService.loginInProgress = function() {
      return true;
    };
    spyOn($rootScope, '$broadcast').and.callThrough();
    $httpBackend.expectGET('https://myapp.com/someapi/item', function(headers) {
      return headers.Authorization === 'Bearer Token456';
    }).respond(200);

    $scope.$on('salte-auth:errorResponse', function(event, message) {
      expect(event.name).toBe('salte-auth:errorResponse');
      expect(message.data).toBe('login in progress, cancelling the request for https://myapp.com/someapi/item');
    });
    $scope.taskCall5();
    $scope.$apply();
    expect($rootScope.$broadcast).toHaveBeenCalled();
  });

  it('tests stateMismatch broadcast when state does not match', function() {
    $window.parent.AuthenticationContext = (function() {
      return {
        callback: function() {},
        _renewStates: []
      };
    })();

    $window.location.hash = 'id_token=sample&state=4343';
    spyOn($rootScope, '$broadcast').and.callThrough();
    $scope.$on('salte-auth:stateMismatch', function(event, message) {
      expect(event.name).toBe('salte-auth:stateMismatch');
      expect(message).toBe('Invalid_state. state: 4343');
    });
    $scope.$apply();
    expect($rootScope.$broadcast).toHaveBeenCalled();
  });

  it('tests callback is called when response contains error', function() {
    $window.parent.AuthenticationContext = (function() {
      return {
        callback: function() {},
        _renewStates: ['4343'],
        callBackMappedToRenewStates: []
      };
    })();

    $window.parent.AuthenticationContext.callBackMappedToRenewStates['4343'] = function(error, token) {
      expect(error).toBe('renewfailed');
    };
    $window.location.hash = 'error=sample&error_description=renewfailed&state=4343';
    $scope.$apply();
  });

  it('tests callback is called when response contains access token', function() {
    window.parent.AuthenticationContext = (function() {
      return {
        callback: function() {},
        _renewStates: ['4343'],
        callBackMappedToRenewStates: []
      };
    })();

    window.parent.AuthenticationContext.callBackMappedToRenewStates['4343'] = function(error, token) {
      expect(error).toBe('');
      expect(token).toBe('newAccessToken123');
    };
    window.location.hash = 'access_token=newAccessToken123&state=4343';
    $scope.$apply();
  });

  it('tests callback is called when response contains id token', function() {
    window.parent.AuthenticationContext = (function() {
      return {
        callback: function() {},
        _renewStates: ['4343'],
        callBackMappedToRenewStates: []
      };
    })();

    window.parent.AuthenticationContext.callBackMappedToRenewStates['4343'] = function(error, token) {
      expect(error).toBe('Invalid id_token. id_token: newIdToken123');
      expect(token).toBe('newIdToken123');
    };
    window.location.hash = 'id_token=newIdToken123&state=4343';
    $scope.$apply();
  });

  it('tests login failure after users logs in', function() {
    window.parent.AuthenticationContext = (function() {
      return {
        callback: 'callback',
        _renewStates: ['1234'],
        callBackMappedToRenewStates: []
      };
    })();

    window.parent.AuthenticationContext.callBackMappedToRenewStates['1234'] = 'callback';
    let mockInvalidClientIdToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjbGllbnQxMjMiLCJuYW1lIjoiSm9obiBEb2UiLCJ1cG4iOiJqb2huQGVtYWlsLmNvbSJ9.zNX4vfLzlbFeKHZ9BMN3sYLtEEE-0o1RoL4NUhXz-l8';
    window.location.hash = 'id_token=' + mockInvalidClientIdToken + '&state=1234';
    spyOn($rootScope, '$broadcast').and.callThrough();
    $scope.$on('adal:loginFailure', function(event, message) {
      expect(event.name).toBe('adal:loginFailure');
      expect(message).toBe('Invalid id_token. id_token: ' + mockInvalidClientIdToken);
    });
    $scope.$apply();
    expect($rootScope.$broadcast).toHaveBeenCalled();
  });

  it('tests login success after users logs in', function() {
    window.parent.AuthenticationContext = (function() {
      return {
        callback: 'callback',
        _renewStates: ['1234'],
        callBackMappedToRenewStates: []
      };
    })();

    window.parent.AuthenticationContext.callBackMappedToRenewStates['1234'] = 'callback';
    let mockIdToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjbGllbnRpZDEyMyIsIm5hbWUiOiJKb2huIERvZSIsInVwbiI6ImpvaG5AZW1haWwuY29tIiwibm9uY2UiOm51bGx9.DLCO6yIWhnNBYfHH8qFPswcH4M2Alpjn6AZy7K6HENY';
    window.location.hash = 'id_token=' + mockIdToken + '&state=1234';
    spyOn($rootScope, '$broadcast').and.callThrough();
    $scope.$on('adal:loginSuccess', function(event, message) {
      expect(event.name).toBe('adal:loginSuccess');
      expect(salteAuthService.userInfo.userName).toBe('john@email.com');
      expect(salteAuthService.userInfo.profile.upn).toBe('john@email.com');
      expect(salteAuthService.userInfo.profile.aud).toBe('clientid123');
    });
    $scope.$apply();
    expect($rootScope.$broadcast).toHaveBeenCalled();
  });

  it('tests auto id token renew when id token expires', function() {
    window.parent.AuthenticationContext = (function() {
      return {
        callback: 'callback',
        _renewStates: ['1234'],
        callBackMappedToRenewStates: []
      };
    })();

    window.parent.AuthenticationContext.callBackMappedToRenewStates['1234'] = 'callback';
    let loginResourceOldValue = salteAuthService.config.loginResource;
    salteAuthService.config.loginResource = null;
    window.location.hash = 'hash';
    spyOn($rootScope, '$broadcast').and.callThrough();
    $scope.$on('adal:loginFailure', function(event, message) {
      expect(event.name).toBe('adal:loginFailure');
      expect(message).toBe('auto renew failure');
    });
    $scope.$apply();
    salteAuthService.config.loginResource = loginResourceOldValue;
    expect($rootScope.$broadcast).toHaveBeenCalled();
  });

  it('tests login handler', function() {
    spyOn($rootScope, '$broadcast').and.callThrough();
    spyOn(salteAuthService.salteAuth, 'promptUser');

    salteAuthService.config.localLoginUrl = 'localLoginUrl';
    salteAuthService.login();
    $scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
      expect(newUrl).toContain('localLoginUrl');
      event.preventDefault();
    });
    expect(salteAuthService.loginInProgress()).toBe(false);
    $scope.$apply();
    expect($rootScope.$broadcast).toHaveBeenCalled();

    $scope.$on('salte-auth:loginRedirect', function(event, message) {
      expect(event.name).toBe('salte-auth:loginRedirect');
    });

    salteAuthService.config.localLoginUrl = null;
    salteAuthService.login();
    expect(salteAuthService.loginInProgress()).toBe(true);
    expect($rootScope.$broadcast).toHaveBeenCalled();
  });

  it('tests route change handler', function() {
    spyOn(salteAuthService.salteAuth, 'promptUser');
    let todoRoute = $route.routes['/todoList'];
    let homeRoute = $route.routes['/home'];
    let aboutRoute = $route.routes['/about'];

    $location.url('/todoList');
    $scope.$apply();
    expect($route.current.controller).toBe(todoRoute.controller);
    expect($route.current.template).toBe(todoRoute.template);

    $location.url('/home');
    $scope.$apply();
    expect($route.current.controller).toBe(homeRoute.controller);
    expect($route.current.template).toBe(homeRoute.template);

    $httpBackend.expectGET('about.html').respond(200);
    $location.url('/about');
    $scope.$apply();
    expect($route.current.controller).toBe(aboutRoute.controller);
    expect($route.current.templateUrl).toBe(aboutRoute.templateUrl);
    expect(salteAuthService.config.anonymousEndpoints).toContain(aboutRoute.templateUrl);
    $httpBackend.flush();
  });

  it('checks if Logging is defined', function() {
    let logMessage;
    Logging.level = 2;
    Logging.log = function(message) {
      logMessage = message;
    };
    salteAuthService.info('test message');
    expect(logMessage).toContain('test message');
    expect(Logging.level).toEqual(2);
  });
});
