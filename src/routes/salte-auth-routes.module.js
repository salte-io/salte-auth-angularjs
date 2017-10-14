import angular from 'angular';

import SalteAuthRoutesService from './salte-auth-routes.service.js';

const module = angular.module('salte.auth.routes', []);

module.service('SalteAuthRoutesService', SalteAuthRoutesService);

export default module.name;
