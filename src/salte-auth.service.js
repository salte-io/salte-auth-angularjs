import { SalteAuth } from '@salte-io/salte-auth';

export default class SalteAuthServiceProvider {
  setup(config) {
    return new SalteAuth(config);
  }

  $get($rootScope, $q, SalteAuthRoutesService) {
    return class SalteAuthService {
      static digest(promise) {
        return promise.then((response) => {
          $rootScope.$digest();
          return response;
        }).catch((error) => {
          $rootScope.$digest();
          throw error;
        });
      }

      static loginWithRedirect(...args) {
        return this.$auth.loginWithRedirect(...args);
      }

      static loginWithIframe(...args) {
        return this.digest(this.$auth.loginWithIframe(...args));
      }

      static loginWithPopup(...args) {
        return this.digest(this.$auth.loginWithPopup(...args));
      }

      static logoutWithRedirect(...args) {
        return this.$auth.logoutWithRedirect(...args);
      }

      static logoutWithIframe(...args) {
        return this.digest(this.$auth.logoutWithIframe(...args));
      }

      static logoutWithPopup(...args) {
        return this.digest(this.$auth.logoutWithPopup(...args));
      }

      static retrieveAccessToken() {
        return this.digest(this.$auth.retrieveAccessToken());
      }

      static get profile() {
        return this.$auth.profile;
      }

      static get $auth() {
        if (!window.salte || !window.salte.auth) {
          return null;
        }
        return window.salte.auth;
      }

      static $$onStorageChanged(event) {
        if (event.storageArea.length && event.key.indexOf('salte.auth') === -1) return;

        $rootScope.$digest();
      }

      static $$registerRoutes() {
        if ([false, true].indexOf(this.$auth.$config.routes) !== -1) return;
        this.$auth.$config.routes = this.$auth.$config.routes || [];
        this.$auth.$config.routes = this.$auth.$config.routes.concat(SalteAuthRoutesService.uirouter);
        this.$auth.$config.routes = this.$auth.$config.routes.concat(SalteAuthRoutesService.ngroute);
      }
    };
  }
}

SalteAuthServiceProvider.prototype.$get.$inject = ['$rootScope', '$q', 'SalteAuthRoutesService'];
