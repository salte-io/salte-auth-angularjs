import angular from 'angular';
import ProtectedResourceInterceptor from './protected-resource-interceptor.factory.js';
import salteAuthService from './salte-auth.provider.js';

const module = angular.module('salte.auth-angular', []);

module.factory('ProtectedResourceInterceptor', ProtectedResourceInterceptor);
module.provider('salteAuthService', salteAuthService);

export default module.name;
