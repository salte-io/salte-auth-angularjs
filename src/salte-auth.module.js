import angular from 'angular';

import RoutesModule from './routes/salte-auth-routes.module.js';
import SalteAuthService from './salte-auth.service.js';

const module = angular.module('salte.auth', [
  RoutesModule
]);

module.provider('SalteAuthService', SalteAuthService);

module.run(['SalteAuthService', (SalteAuthService) => {
  window.addEventListener('storage', SalteAuthService.$$onStorageChanged);
  SalteAuthService.$$registerRoutes();
}]);

export default module.name;
