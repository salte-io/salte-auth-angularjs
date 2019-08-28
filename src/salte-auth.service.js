import { SalteAuth } from '@salte-auth/salte-auth';

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

      static on(eventType, callback) {
        if (!this.$listeners[eventType]) {
          this.$listeners[eventType] = [];
        }

        this.$listeners[eventType].push(callback);
      }

      static off(eventType, callback) {
        const index = this.$listeners[eventType].indexOf(callback);
        this.$listeners[eventType].splice(index, 1);
      }

      static loginWithRedirect(...args) {
        return this.$auth.loginWithRedirect(...args);
      }

      static loginWithIframe(...args) {
        return this.$auth.loginWithIframe(...args);
      }

      static loginWithPopup(...args) {
        return this.$auth.loginWithPopup(...args);
      }

      static logoutWithRedirect(...args) {
        return this.$auth.logoutWithRedirect(...args);
      }

      static logoutWithIframe(...args) {
        return this.$auth.logoutWithIframe(...args);
      }

      static logoutWithPopup(...args) {
        return this.$auth.logoutWithPopup(...args);
      }

      static retrieveAccessToken() {
        return this.$auth.retrieveAccessToken();
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

      static get $listeners() {
        if (!this.$$listeners) {
          this.$$listeners = {};
        }
        return this.$$listeners;
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

      static $$registerEvents() {
        const eventTypes = ['login', 'logout', 'refresh'];

        for (let i = 0; i < eventTypes.length; i++) {
          const eventType = eventTypes[i];
          this.$auth.on(eventType, (error, data) => {
            const listeners = this.$listeners[eventType];

            if (listeners) {
              for (let i = 0; i < listeners.length; i++) {
                listeners[i](error, data);
              }
            }

            $rootScope.$digest();
          });
        }
      }
    };
  }
}

SalteAuthServiceProvider.prototype.$get.$inject = ['$rootScope', '$q', 'SalteAuthRoutesService'];
