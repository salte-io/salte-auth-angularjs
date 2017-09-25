import { expect } from 'chai';

import ngRouteApp from '../ngRouteApp.js';

describe('angular ngRoute tests', () => {
  let $scope, $httpBackend, salteAuthService, $rootScope, $controller, $q, $window, $route, $location;

  beforeEach(angular.mock.module(ngRouteApp));

  beforeEach(angular.mock.inject.strictDi(true));

  beforeEach(angular.mock.inject((_salteAuthService_, _$rootScope_, _$controller_, _$httpBackend_, _$q_, _$window_, _$route_, _$location_) => {
    salteAuthService = _salteAuthService_;
    $rootScope = _$rootScope_;
    $controller = _$controller_;
    $httpBackend = _$httpBackend_;
    $q = _$q_;
    $window = _$window_;
    $route = _$route_;
    $location = _$location_;
    $scope = $rootScope.$new();
    window.onbeforeunload = sinon.spy();
    sinon.spy($rootScope, '$broadcast');
    sinon.spy(salteAuthService.salteAuth, 'promptUser');

    salteAuthService.getCachedToken = (resource) => {
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

    salteAuthService.acquireToken = (resource) => {
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

  afterEach(() => {
    $window.parent.AuthenticationContext = null;
    $window.AuthenticationContext = null;
    window.onbeforeunload = null;
    $rootScope.$broadcast.restore();
    salteAuthService.salteAuth.promptUser.restore();
  });

  it('assigns user', () => {
    expect($scope.user.userName).to.equal('');
    expect($scope.user.isAuthenticated).to.equal(false);
  });

  it('send tokens for webapi call in endpoints list', () => {
    $httpBackend.expectGET('/api/Todo/5', (headers) => {
      return headers.Authorization === 'Bearer Token3434';
    }).respond(200, {
      id: 5,
      name: 'TODOItem1'
    });
    $scope.taskCall();
    $httpBackend.flush();

    let task = $scope.task;
    expect(task.name).to.equal('TODOItem1');
  });

  it('send tokens for webapi call in endpoints list', () => {
    $httpBackend.expectGET('/anotherApi/Item/13', (headers) => {
      return headers.Authorization === 'Bearer Token123';
    }).respond(200, {
      id: 5,
      itemName: 'ItemWithoutAuth'
    });
    $scope.itemCall();
    $httpBackend.flush();

    let task = $scope.item;
    expect(task.itemName).to.equal('ItemWithoutAuth');
  });

  it('send tokens for webapi call in endpoints list', () => {
    $httpBackend.expectGET('https://testapi.com/', (headers) => {
      return headers.Authorization === 'Bearer Token3434';
    }).respond(200);
    $scope.taskCall3();
    $httpBackend.flush();
  });

  it('does not send tokens for webapi(https) call not in endpoints list', () => {
    $httpBackend.expectGET('https://test.com/', (headers) => {
      return headers.hasOwnProperty('Authorization') === false;
    }).respond(200);
    $scope.taskCall2();
    $httpBackend.flush();
  });

  it('does not send tokens for webapi(http) call not in endpoint list', () => {
    $httpBackend.expectGET('http://testwebapi.com/', (headers) => {
      return headers.hasOwnProperty('Authorization') === false;
    }).respond(200);
    $scope.taskCall6();
    $httpBackend.flush();
  });

  it('send tokens for app backend call not in endpoints list', () => {
    $httpBackend.expectGET('/someapi/item', (headers) => {
      return headers.Authorization === 'Bearer Token456';
    }).respond(200);
    $scope.taskCall4();
    $httpBackend.flush();
  });

  it('send tokens for app backend call', () => {
    $httpBackend.expectGET('https://myapp.com/someapi/item', (headers) => {
      return headers.Authorization === 'Bearer Token456';
    }).respond(200);
    $scope.taskCall5();
    $httpBackend.flush();
  });

  it('renews tokens for app backend', () => {
    // This makes adal to try renewing the token since no token is returned from cache
    salteAuthService.getCachedToken = () => {
      return '';
    };
    $httpBackend.expectGET('https://myapp.com/someapi/item', (headers) => {
      return headers.Authorization === 'Bearer RenewToken456';
    }).respond(200, {
      id: 5,
      name: 'TODOItem2'
    });
    $scope.taskCall5();
    $httpBackend.flush();

    let task = $scope.task;
    expect(task.name).to.equal('TODOItem2');
  });

  it('renews tokens for webapi in endpoint list', () => {
    salteAuthService.getCachedToken = () => {
      return '';
    };
    $httpBackend.expectGET('/anotherApi/Item/13', (headers) => {
      return headers.Authorization === 'Bearer RenewToken123';
    }).respond(200, {
      id: 5,
      itemName: 'ItemWithoutAuth'
    });
    $scope.itemCall();
    $httpBackend.flush();

    let task = $scope.item;
    expect(task.itemName).to.equal('ItemWithoutAuth');
  });

  it('renews tokens for webapi in endpoint list', () => {
    salteAuthService.getCachedToken = () => {
      return '';
    };
    $httpBackend.expectGET('https://testapi.com/', (headers) => {
      return headers.Authorization === 'Bearer RenewToken3434';
    }).respond(200);
    $scope.taskCall3();
    $httpBackend.flush();
  });

  it('tests errorResponse broadcast when login is in progress', () => {
    salteAuthService.getCachedToken = () => {
      return '';
    };
    salteAuthService.loginInProgress = () => {
      return true;
    };
    $httpBackend.expectGET('https://myapp.com/someapi/item', (headers) => {
      return headers.Authorization === 'Bearer Token456';
    }).respond(200);

    $scope.$on('salte-auth:errorResponse', (event, message) => {
      expect(event.name).to.equal('salte-auth:errorResponse');
      expect(message.data).to.equal('login in progress, cancelling the request for https://myapp.com/someapi/item');
    });
    $scope.taskCall5();
    $scope.$apply();
    expect($rootScope.$broadcast.callCount).to.be.ok;
  });

  it('tests stateMismatch broadcast when state does not match', () => {
    $window.parent.AuthenticationContext = {
      callback: () => {},
      _renewStates: []
    };

    $window.location.hash = 'id_token=sample&state=4343';
    $scope.$on('salte-auth:stateMismatch', (event, message) => {
      expect(event.name).to.equal('salte-auth:stateMismatch');
      expect(message).to.equal('Invalid_state. state: 4343');
    });
    $scope.$apply();
    expect($rootScope.$broadcast.callCount).to.be.ok;
  });

  it('tests callback is called when response contains error', () => {
    $window.parent.AuthenticationContext = {
      callback: () => {},
      _renewStates: ['4343'],
      callBackMappedToRenewStates: []
    };

    $window.parent.AuthenticationContext.callBackMappedToRenewStates['4343'] = (error, token) => {
      expect(error).to.equal('renewfailed');
    };
    $window.location.hash = 'error=sample&error_description=renewfailed&state=4343';
    $scope.$apply();
  });

  it('tests callback is called when response contains access token', () => {
    window.parent.AuthenticationContext = {
      callback: () => {},
      _renewStates: ['4343'],
      callBackMappedToRenewStates: []
    };

    window.parent.AuthenticationContext.callBackMappedToRenewStates['4343'] = (error, token) => {
      expect(error).to.equal('');
      expect(token).to.equal('newAccessToken123');
    };
    window.location.hash = 'access_token=newAccessToken123&state=4343';
    $scope.$apply();
  });

  it('tests callback is called when response contains id token', () => {
    window.parent.AuthenticationContext = {
      callback: () => {},
      _renewStates: ['4343'],
      callBackMappedToRenewStates: []
    };

    window.parent.AuthenticationContext.callBackMappedToRenewStates['4343'] = (error, token) => {
      expect(error).to.equal('Invalid id_token. id_token: newIdToken123');
      expect(token).to.equal('newIdToken123');
    };
    window.location.hash = 'id_token=newIdToken123&state=4343';
    $scope.$apply();
  });

  it('tests login failure after users logs in', () => {
    window.parent.AuthenticationContext = {
      callback: 'callback',
      _renewStates: ['1234'],
      callBackMappedToRenewStates: []
    };

    window.parent.AuthenticationContext.callBackMappedToRenewStates['1234'] = 'callback';
    let mockInvalidClientIdToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjbGllbnQxMjMiLCJuYW1lIjoiSm9obiBEb2UiLCJ1cG4iOiJqb2huQGVtYWlsLmNvbSJ9.zNX4vfLzlbFeKHZ9BMN3sYLtEEE-0o1RoL4NUhXz-l8';
    window.location.hash = 'id_token=' + mockInvalidClientIdToken + '&state=1234';
    $scope.$on('adal:loginFailure', (event, message) => {
      expect(event.name).to.equal('adal:loginFailure');
      expect(message).to.equal('Invalid id_token. id_token: ' + mockInvalidClientIdToken);
    });
    $scope.$apply();
    expect($rootScope.$broadcast.callCount).to.be.ok;
  });

  it('tests login success after users logs in', () => {
    window.parent.AuthenticationContext = {
      callback: 'callback',
      _renewStates: ['1234'],
      callBackMappedToRenewStates: []
    };

    window.parent.AuthenticationContext.callBackMappedToRenewStates['1234'] = 'callback';
    let mockIdToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjbGllbnRpZDEyMyIsIm5hbWUiOiJKb2huIERvZSIsInVwbiI6ImpvaG5AZW1haWwuY29tIiwibm9uY2UiOm51bGx9.DLCO6yIWhnNBYfHH8qFPswcH4M2Alpjn6AZy7K6HENY';
    window.location.hash = 'id_token=' + mockIdToken + '&state=1234';
    $scope.$on('adal:loginSuccess', (event, message) => {
      expect(event.name).to.equal('adal:loginSuccess');
      expect(salteAuthService.userInfo.userName).to.equal('john@email.com');
      expect(salteAuthService.userInfo.profile.upn).to.equal('john@email.com');
      expect(salteAuthService.userInfo.profile.aud).to.equal('clientid123');
    });
    $scope.$apply();
    expect($rootScope.$broadcast.callCount).to.be.ok;
  });

  it('tests auto id token renew when id token expires', () => {
    window.parent.AuthenticationContext = {
      callback: 'callback',
      _renewStates: ['1234'],
      callBackMappedToRenewStates: []
    };

    window.parent.AuthenticationContext.callBackMappedToRenewStates['1234'] = 'callback';
    let loginResourceOldValue = salteAuthService.config.loginResource;
    salteAuthService.config.loginResource = null;
    window.location.hash = 'hash';
    $scope.$on('adal:loginFailure', (event, message) => {
      expect(event.name).to.equal('adal:loginFailure');
      expect(message).to.equal('auto renew failure');
    });
    $scope.$apply();
    salteAuthService.config.loginResource = loginResourceOldValue;
    expect($rootScope.$broadcast.callCount).to.be.ok;
  });

  it('tests login handler', () => {
    salteAuthService.config.localLoginUrl = 'localLoginUrl';
    salteAuthService.login();
    $scope.$on('$locationChangeStart', (event, newUrl, oldUrl) => {
      expect(newUrl).to.contain('localLoginUrl');
      event.preventDefault();
    });
    expect(salteAuthService.loginInProgress()).to.equal(false);
    $scope.$apply();
    expect($rootScope.$broadcast.callCount).to.be.ok;

    $scope.$on('salte-auth:loginRedirect', (event, message) => {
      expect(event.name).to.equal('salte-auth:loginRedirect');
    });

    salteAuthService.config.localLoginUrl = null;
    salteAuthService.login();
    expect(salteAuthService.loginInProgress()).to.equal(true);
    expect($rootScope.$broadcast.callCount).to.be.ok;
  });

  it('tests route change handler', () => {
    let todoRoute = $route.routes['/todoList'];
    let homeRoute = $route.routes['/home'];
    let aboutRoute = $route.routes['/about'];

    $location.url('/todoList');
    $scope.$apply();
    expect($route.current.controller).to.equal(todoRoute.controller);
    expect($route.current.template).to.equal(todoRoute.template);

    $location.url('/home');
    $scope.$apply();
    expect($route.current.controller).to.equal(homeRoute.controller);
    expect($route.current.template).to.equal(homeRoute.template);

    $httpBackend.expectGET('about.html').respond(200);
    $location.url('/about');
    $scope.$apply();
    expect($route.current.controller).to.equal(aboutRoute.controller);
    expect($route.current.templateUrl).to.equal(aboutRoute.templateUrl);
    expect(salteAuthService.config.anonymousEndpoints).to.contain(aboutRoute.templateUrl);
    $httpBackend.flush();
  });

  it('checks if Logging is defined', () => {
    let logMessage;
    Logging.level = 2;
    Logging.log = (message) => {
      logMessage = message;
    };
    salteAuthService.info('test message');
    expect(logMessage).to.contain('test message');
    expect(Logging.level).to.equal(2);
  });
});
