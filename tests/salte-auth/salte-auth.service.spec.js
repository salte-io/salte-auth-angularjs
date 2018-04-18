import { expect } from 'chai';

import salteAuth from '../../src/salte-auth.module.js';

function afterNextRender() {
  return new Promise((resolve) => {
    setTimeout(resolve);
  });
}

describe('service(SalteAuthService)', () => {
  let $rootScope, SalteAuthServiceProvider, SalteAuthService, SalteAuthRoutesService, sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    if (window.salte && window.salte.auth) {
      delete window.salte.auth;
    }
  });

  beforeEach(angular.mock.module(salteAuth, (_SalteAuthServiceProvider_) => {
    SalteAuthServiceProvider = _SalteAuthServiceProvider_;
    SalteAuthServiceProvider.setup({
      provider: 'auth0'
    });
  }));

  beforeEach(angular.mock.inject.strictDi(true));
  beforeEach(angular.mock.inject((_$rootScope_, $compile, _SalteAuthService_, _SalteAuthRoutesService_) => {
    $rootScope = _$rootScope_;
    SalteAuthService = _SalteAuthService_;
    SalteAuthRoutesService = _SalteAuthRoutesService_;
    SalteAuthService.profile.$clear();
  }));

  afterEach(() => {
    sandbox.restore();
  });

  describe('function(digest)', () => {
    it('should run a $digest when the promise is successful', () => {
      const $digestSpy = sandbox.spy($rootScope, '$digest');
      expect($digestSpy.callCount).to.equal(0);

      return SalteAuthService.digest(Promise.resolve()).then(() => {
        expect($digestSpy.callCount).to.equal(1);
      });
    });

    it('should run a $digest when the promise is fails', () => {
      const $digestSpy = sandbox.spy($rootScope, '$digest');
      expect($digestSpy.callCount).to.equal(0);

      return SalteAuthService.digest(Promise.reject('stuff broke')).catch(() => {
        expect($digestSpy.callCount).to.equal(1);
      });
    });
  });

  describe('function(loginWithRedirect)', () => {
    it('should support logging in with redirect', () => {
      sandbox.stub(SalteAuthService.$auth, 'loginWithRedirect').returns(Promise.resolve());

      SalteAuthService.loginWithRedirect();
      expect(SalteAuthService.$auth.loginWithRedirect.callCount).to.equal(1);
    });
  });

  describe('function(loginWithIframe)', () => {
    it('should run a $digest when signing in', () => {
      sandbox.stub(SalteAuthService.$auth, 'loginWithIframe').returns(Promise.resolve());
      const $digestSpy = sandbox.spy($rootScope, '$digest');
      expect($digestSpy.callCount).to.equal(0);

      return SalteAuthService.loginWithIframe().then(() => {
        expect($digestSpy.callCount).to.equal(1);
      });
    });
  });

  describe('function(loginWithPopup)', () => {
    it('should run a $digest when signing in', () => {
      sandbox.stub(SalteAuthService.$auth, 'loginWithPopup').returns(Promise.resolve());
      const $digestSpy = sandbox.spy($rootScope, '$digest');
      expect($digestSpy.callCount).to.equal(0);

      return SalteAuthService.loginWithPopup().then(() => {
        expect($digestSpy.callCount).to.equal(1);
      });
    });
  });

  describe('function(logoutWithRedirect)', () => {
    it('should support logging out with redirect', () => {
      sandbox.stub(SalteAuthService.$auth, 'logoutWithRedirect').returns(Promise.resolve());

      SalteAuthService.logoutWithRedirect();
      expect(SalteAuthService.$auth.logoutWithRedirect.callCount).to.equal(1);
    });
  });

  describe('function(logoutWithIframe)', () => {
    it('should run a $digest when signing out', () => {
      sandbox.stub(SalteAuthService.$auth, 'logoutWithIframe').returns(Promise.resolve());
      const $digestSpy = sandbox.spy($rootScope, '$digest');
      expect($digestSpy.callCount).to.equal(0);

      return SalteAuthService.logoutWithIframe().then(() => {
        expect($digestSpy.callCount).to.equal(1);
      });
    });
  });

  describe('function(logoutWithPopup)', () => {
    it('should run a $digest when signing out', () => {
      sandbox.stub(SalteAuthService.$auth, 'logoutWithPopup').returns(Promise.resolve());
      const $digestSpy = sandbox.spy($rootScope, '$digest');
      expect($digestSpy.callCount).to.equal(0);

      return SalteAuthService.logoutWithPopup().then(() => {
        expect($digestSpy.callCount).to.equal(1);
      });
    });
  });

  describe('function(retrieveAccessToken)', () => {
    it('should run a $digest when signing out', () => {
      sandbox.stub(SalteAuthService.$auth, 'retrieveAccessToken').returns(Promise.resolve());
      const $digestSpy = sandbox.spy($rootScope, '$digest');
      expect($digestSpy.callCount).to.equal(0);

      return SalteAuthService.retrieveAccessToken().then(() => {
        expect($digestSpy.callCount).to.equal(1);
      });
    });
  });

  describe('getter(profile)', () => {
    it('should return the profile from "salte.auth"', () => {
      const profile = SalteAuthService.profile;
      expect(profile).to.not.be.undefined;
      expect(profile).to.deep.equal(salte.auth.profile);
    });
  });

  describe('getter($auth)', () => {
    const salte = window.salte;
    after(() => {
      window.salte = salte;
    });

    it('should return "salte.auth"', () => {
      const $auth = SalteAuthService.$auth;
      expect($auth).to.not.be.undefined;
      expect($auth).to.deep.equal(window.salte.auth);
    });

    it('should be null when "salte.auth" is undefined', () => {
      delete window.salte.auth;
      expect(SalteAuthService.$auth).to.equal(null);
    });

    it('should be null when "salte" is undefined', () => {
      delete window.salte;
      expect(SalteAuthService.$auth).to.equal(null);
    });
  });

  describe('function($$onStorageChanged)', () => {
    it('should react to "salte.auth" changes', () => {
      sandbox.stub($rootScope, '$digest');

      expect($rootScope.$digest.callCount).to.equal(0);

      SalteAuthService.$$onStorageChanged({
        storageArea: [0, 1],
        key: 'salte.auth.test'
      });

      expect($rootScope.$digest.callCount).to.equal(1);
    });

    it('should react to storage getting cleared', () => {
      sandbox.stub($rootScope, '$digest');

      expect($rootScope.$digest.callCount).to.equal(0);

      SalteAuthService.$$onStorageChanged({
        storageArea: []
      });

      expect($rootScope.$digest.callCount).to.equal(1);
    });

    it('should not react to non "salte.auth" changes', () => {
      sandbox.stub($rootScope, '$digest');

      expect($rootScope.$digest.callCount).to.equal(0);

      SalteAuthService.$$onStorageChanged({
        storageArea: [0, 1],
        key: 'some-other-key'
      });

      expect($rootScope.$digest.callCount).to.equal(0);
    });
  });

  describe('function($$registerRoutes)', () => {
    it('should skip registering any routes if true', () => {
      // NOTE: We want to bypass the initial route detection
      return afterNextRender().then(() => {
        SalteAuthService.$auth.$config.routes = true;

        SalteAuthService.$$registerRoutes();

        expect(SalteAuthService.$auth.$config.routes).to.equal(true);
      });
    });

    it('should skip registering any routes if false', () => {
      SalteAuthService.$auth.$config.routes = false;

      SalteAuthService.$$registerRoutes();

      expect(SalteAuthService.$auth.$config.routes).to.equal(false);
    });

    it('should default routes to an empty array', () => {
      SalteAuthService.$auth.$config.routes = null;

      SalteAuthService.$$registerRoutes();

      expect(SalteAuthService.$auth.$config.routes).to.deep.equal([]);
    });

    it('should retain existing routes', () => {
      SalteAuthService.$auth.$config.routes = ['test'];

      SalteAuthService.$$registerRoutes();

      expect(SalteAuthService.$auth.$config.routes).to.deep.equal(['test']);
    });

    it('should add routes from ui-router', () => {
      sandbox.stub(SalteAuthRoutesService, 'uirouter').get(() => [
        'example'
      ]);

      SalteAuthService.$$registerRoutes();

      expect(SalteAuthService.$auth.$config.routes).to.deep.equal([
        'example'
      ]);
    });

    it('should add routes from ngRoute', () => {
      sandbox.stub(SalteAuthRoutesService, 'ngroute').get(() => [
        'example'
      ]);

      SalteAuthService.$$registerRoutes();

      expect(SalteAuthService.$auth.$config.routes).to.deep.equal([
        'example'
      ]);
    });
  });
});
