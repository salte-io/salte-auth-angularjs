import uiRouter from 'angular-ui-router';
import salteAuthAngular from '../src/salte-auth-angular.module.js';

// Test app Ui-Router
let uiRouterApp = angular.module('UIRouterApp', [
  uiRouter,
  salteAuthAngular
]);

uiRouterApp.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'salteAuthServiceProvider', ($stateProvider, $urlRouterProvider, $httpProvider, salteAuthServiceProvider) => {
  $stateProvider.state('settings', {
    url: '/settings',
    templateUrl: 'settings.html'
  }).state('settings.profile', {
    url: '/profile',
    templateUrl: 'profile.html'
  }).state('settings.profile.name', {
    url: '/name',
    templateUrl: 'name.html'
  }).state('settings.profile.email', {
    url: '/email',
    templateUrl: 'email.html'
  }).state('settings.account', {
    parent: 'settings',
    url: '/account/Id/:accountId',
    templateUrl: function(stateParams) {
      if (stateParams.accountId === 'testId')
        return 'account.html';
    }
  }).state('settings.account.name', {
    parent: 'settings.account',
    url: '/name/Name/:accountName',
    templateUrl: function(stateParams) {
      if (stateParams.accountName === 'testName')
        return 'name.html';
    }
  }).state('settings.account.email', {
    url: '/email',
    templateUrl: 'email.html'
  });
  $urlRouterProvider.otherwise('/settings');
  let endpoints = {};

  salteAuthServiceProvider.init({
    url: 'https://identity.provider.com/',
    clientId: 'clientid123',
    loginResource: 'loginResource123',
    redirectUri: 'https://myapp.com/page',
    securedEndpoints: endpoints
  },
    $httpProvider // pass http provider to inject request interceptor to attach tokens
  );
}]);

uiRouterApp.controller('StateCtrl', ['$scope', '$location', 'salteAuthService', ($scope, $location, salteAuthService) => {}]);

export default uiRouterApp.name;
