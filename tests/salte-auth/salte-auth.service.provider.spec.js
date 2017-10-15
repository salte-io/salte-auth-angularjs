import { expect } from 'chai';

import salteAuth from '../../src/salte-auth.module.js';

describe('provider(SalteAuthService)', () => {
  let SalteAuthServiceProvider;

  beforeEach(() => {
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
  beforeEach(angular.mock.inject());

  describe('function(setup)', () => {
    beforeEach(() => {
      delete window.salte.auth;
    });

    it('should setup "salte.auth" with the given config', () => {
      const auth = SalteAuthServiceProvider.setup({
        provider: 'auth0'
      });
      expect(auth).to.deep.equal(window.salte.auth);
      expect(auth.$config).to.deep.equal({
        provider: 'auth0'
      });
    });
  });
});
