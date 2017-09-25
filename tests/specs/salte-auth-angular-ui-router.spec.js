import { expect } from 'chai';
import uiRouterApp from '../app.ui-router.js';

describe.only('UI Router', () => {
  let salteAuthService, $rootScope, $transitions, $location, $templateCache, $stateParams, $window;
  // mock Application to allow us to inject our own dependencies
  beforeEach(angular.mock.module(uiRouterApp));
  // mock the controller for the same reason and include $scope and $controller
  beforeEach(angular.mock.inject((_salteAuthService_, _$rootScope_, _$transitions_, _$location_, _$templateCache_, _$stateParams_, _$window_) => {
    $window = _$window_;
    salteAuthService = _salteAuthService_;
    $rootScope = _$rootScope_;
    $transitions = _$transitions_;
    $location = _$location_;
    $templateCache = _$templateCache_;
    $stateParams = _$stateParams_;

    $templateCache.put('settings.html', '<div>settings</div>');
    $templateCache.put('name.html', '<div>name</div>');
    $templateCache.put('profile.html', '<div>profile</div>');
    $templateCache.put('account.html', '<div>account</div>');
    salteAuthService.config.anonymousEndpoints = [];
    window.onbeforeunload = sinon.spy();
  }));

  afterEach(() => {
    $window.parent.AuthenticationContext = null;
    $window.AuthenticationContext = null;
    window.onbeforeunload = null;
  });

  it('checks if anonymous endpoints are populated on statechange event if states are nested and separated by .', (done) => {
    $transitions.onSuccess({}, (transition) => {
      expect(transition.to().name).to.equal('settings.profile.name');
      let states = urlNavigate.split('/');
      for (let i = 0; i < states.length; i++) {
        expect(salteAuthService.config.anonymousEndpoints[i]).to.equal(states[i] + '.html');
      }
      done();
    });
    let urlNavigate = '/settings/profile/name';
    $location.url(urlNavigate);
    $rootScope.$digest();
  });

  it('checks if state is resolved when templateUrl is a function which depends on stateParams and states have parent property', (done) => {
    $transitions.onSuccess({}, (transition) => {
      expect(transition.to().name).to.equal('settings.account.name');
      let states = urlNavigate.split('/');
      for (let i = 0; i < states.length; i++) {
        expect(salteAuthService.config.anonymousEndpoints[i]).to.equal(states[i] + '.html');
      }
      done();
    });
    let urlNavigate = 'settings/account/Id/testId/name/Name/testName';
    $location.url(urlNavigate);
    $rootScope.$digest();
    expect($stateParams.accountId).to.equal('testId');
    expect($stateParams.accountName).to.equal('testName');
  });
});
