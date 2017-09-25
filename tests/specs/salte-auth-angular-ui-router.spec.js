import { expect } from 'chai';
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
    window.onbeforeunload = sinon.spy();
  }));

  afterEach(() => {
    $window.parent.AuthenticationContext = null;
    $window.AuthenticationContext = null;
    window.onbeforeunload = null;
  });

  it('checks if anonymous endpoints are populated on statechange event if states are nested and separated by .', (done) => {
    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
      expect(toState.name).to.equal('settings.profile.name');
      let states = urlNavigate.split('/');
      for (let i = 0; i < states.length; i++) {
        expect(salteAuthService.config.anonymousEndpoints[i]).to.equal(states[i] + '.html');
      }
      done();
    });
    let urlNavigate = 'settings/profile/name';
    $location.url(urlNavigate);
    $rootScope.$digest();
  });

  it('checks if state is resolved when templateUrl is a function which depends on stateParams and states have parent property', (done) => {
    $rootScope.$on('$stateChangeSuccess', (event, toState) => {
      expect(toState.name).to.equal('settings.account.name');
      let states = toState.name.split('.');
      for (let i = 0; i < states.length; i++) {
        expect(salteAuthService.config.anonymousEndpoints[i]).to.equal(states[i] + '.html');
      }
      done();
    });
    $location.url('settings/account/Id/testId/name/Name/testName');
    $rootScope.$digest();
    expect($stateParams.accountId).to.equal('testId');
    expect($stateParams.accountName).to.equal('testName');
  });
});
