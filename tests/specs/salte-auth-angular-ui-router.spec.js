import uiRouterApp from '../uiRouterApp.js';

describe('angular-ui-router tests', () => {
  let $httpBackend, salteAuthService, $rootScope, $location, $templateCache, $stateParams, $window;
  // mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module(uiRouterApp));
  // mock the controller for the same reason and include $scope and $controller
  beforeEach(angular.mock.inject((_salteAuthService_, _$rootScope_, _$httpBackend_, _$location_, _$templateCache_, _$stateParams_, _$window_) => {
    $window = _$window_;
    salteAuthService = _salteAuthService_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;
    $location = _$location_;
    $templateCache = _$templateCache_;
    $stateParams = _$stateParams_;
    $httpBackend.expectGET('settings.html').respond(200);
    $httpBackend.expectGET('profile.html').respond(200);
    $httpBackend.expectGET('name.html').respond(200);
    $httpBackend.expectGET('account.html').respond(200);
    $templateCache.put('profile.html', '');
    $templateCache.put('settings.html', '');
    $templateCache.put('account.html', '');
    $templateCache.put('name.html', '');
    salteAuthService.config.anonymousEndpoints = [];
  }));

  afterEach(function() {
    $window.parent.AuthenticationContext = null;
    $window.AuthenticationContext = null;
  });

  it('checks if anonymous endpoints are populated on statechange event if states are nested and separated by .', function() {
    var state;
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      state = toState;
    });
    var urlNavigate = 'settings/profile/name';
    $location.url(urlNavigate);
    $rootScope.$digest();
    expect(state.name).toEqual('settings.profile.name');
    var states = urlNavigate.split('/');
    for (var i = 0; i < states.length; i++) {
      expect(salteAuthService.config.anonymousEndpoints[i]).toEqual(states[i] + '.html');
    }
  });

  it('checks if state is resolved when templateUrl is a function which depends on stateParams and states have parent property', function() {
    var state;
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
      state = toState;
    });
    var urlNavigate = 'settings/account/Id/testId/name/Name/testName';
    $location.url(urlNavigate);
    $rootScope.$digest();
    expect($stateParams.accountId).toEqual('testId');
    expect($stateParams.accountName).toEqual('testName');
    expect(state.name).toEqual('settings.account.name');
    var states = state.name.split('.');
    for (var i = 0; i < states.length; i++) {
      expect(salteAuthService.config.anonymousEndpoints[i]).toEqual(states[i] + '.html');
    }
  });
});
