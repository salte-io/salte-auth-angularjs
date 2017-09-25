import uiRouter from '@uirouter/angularjs';
import salteAuthAngular from '../src/salte-auth-angular.module.js';

// Test app Ui-Router
let uiRouterApp = angular.module('UIRouterApp', [
  uiRouter,
  salteAuthAngular
]);

uiRouterApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'salteAuthServiceProvider', ($stateProvider, $urlRouterProvider, $httpProvider, salteAuthServiceProvider) => {
  $stateProvider.state({
    name: 'settings',
    url: '/settings',
    templateUrl: 'settings.html'
  }).state({
    name: 'settings.profile',
    url: '/profile',
    templateUrl: 'profile.html'
  }).state({
    name: 'settings.profile.name',
    url: '/name',
    templateUrl: 'name.html'
  }).state({
    name: 'settings.profile.email',
    url: '/email',
    templateUrl: 'email.html'
  }).state({
    name: 'settings.account',
    url: '/account/Id/:accountId',
    templateUrl: function(stateParams) {
      if (stateParams.accountId === 'testId') return 'account.html';
    }
  }).state({
    name: 'settings.account.name',
    url: '/name/Name/:accountName',
    templateUrl: function(stateParams) {
      if (stateParams.accountName === 'testName') return 'name.html';
    }
  }).state({
    name: 'settings.account.email',
    url: '/email',
    templateUrl: 'email.html'
  });
  $urlRouterProvider.otherwise('settings');

  salteAuthServiceProvider.init({
    url: 'https://identity.provider.com/',
    clientId: 'clientid123',
    loginResource: 'loginResource123',
    redirectUri: 'https://myapp.com/page',
    securedEndpoints: {}
  },
    $httpProvider // pass http provider to inject request interceptor to attach tokens
  );
}]);

uiRouterApp.controller('StateCtrl', ['$scope', '$location', 'salteAuthService', ($scope, $location, salteAuthService) => {}]);

export default uiRouterApp.name;
