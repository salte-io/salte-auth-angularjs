import uiRouterModule from '@uirouter/angularjs';
import uiRouterPreOneModule from 'angular-ui-router';
import ngRouteModule from 'angular-route';
import salteAuthModule from './src/salte-auth.module.js';

const routeProviderMatch = location.search.match(/route-provider=([^&]+)/);
const routeProvider = routeProviderMatch ? routeProviderMatch[1] : localStorage.getItem('salte.auth.demo.route-provider') || 'ui-router';
localStorage.setItem('salte.auth.demo.route-provider', routeProvider);

let demoModule;
if (routeProvider === 'ng-route') {
  demoModule = angular.module('app', [
    ngRouteModule,
    salteAuthModule
  ]);

  demoModule.config(($routeProvider) => {
    $routeProvider.when('/', {
      template: 'Home',
      controller: 'HomeController',
      controllerAs: '$ctrl'
    }).when('/account', {
      template: `
        <a href="/account/settings">Settings</a>
        <div>Account</div>
      `,

      secured: true
    }).when('/account/settings', {
      template: '<div>Account Settings</div>',

      secured: true
    }).when('/admin', {
      template: '<div>Admin</div>',

      secured: true
    }).otherwise('/');
  });
} else if (routeProvider === 'ui-router-pre-1.x') {
  demoModule = angular.module('app', [
    uiRouterPreOneModule,
    salteAuthModule
  ]);

  demoModule.config(($stateProvider, $urlRouterProvider) => {
    $stateProvider.state({
      name: 'home',
      url: '/',
      template: 'Home',
      controller: 'HomeController',
      controllerAs: '$ctrl'
    }).state({
      name: 'account',
      url: '/account',
      template: `
        <a href="/account/settings">Settings</a>
        <div>Account</div>
        <ui-view></ui-view>
      `,

      secured: true
    }).state({
      name: 'account.settings',
      url: '/settings',
      template: '<div>Account Settings</div>',

      secured: true
    }).state({
      name: 'admin',
      url: '/admin',
      template: '<div>Admin</div>',

      secured: true
    });
    $urlRouterProvider.otherwise('/admin');
  });
} else {
  demoModule = angular.module('app', [
    uiRouterModule,
    salteAuthModule
  ]);

  demoModule.config(($stateProvider, $urlRouterProvider) => {
    $stateProvider.state({
      name: 'home',
      url: '/',
      template: 'Home',
      controller: 'HomeController',
      controllerAs: '$ctrl'
    }).state({
      name: 'account',
      url: '/account',
      template: `
        <a href="/account/settings">Settings</a>
        <div>Account</div>
        <ui-view></ui-view>
      `,

      secured: true
    }).state({
      name: 'account.settings',
      url: '/settings',
      template: '<div>Account Settings</div>',

      secured: true
    }).state({
      name: 'admin',
      url: '/admin',
      template: '<div>Admin</div>',

      secured: true
    });
    $urlRouterProvider.otherwise('/admin');
  });
}

demoModule.config(($locationProvider, SalteAuthServiceProvider) => {
  $locationProvider.html5Mode(true);
  SalteAuthServiceProvider.setup({
    providerUrl: 'https://salte-io.auth0.com',
    responseType: 'id_token',
    redirectUrl: location.origin,
    clientId: 'Hzl9Rvu_Ws_s1QKIhI2TXi8NZRn672FC',
    scope: 'openid',

    endpoints: [
      'https://jsonplaceholder.typicode.com/posts/1'
    ],

    provider: 'auth0'
  });
});

demoModule.controller('AppController', class AppController {
  constructor(SalteAuthService) {
    this.SalteAuthService = SalteAuthService;
  }

  onChange() {
    location.reload();
  }

  get routeProvider() {
    return localStorage.getItem('salte.auth.demo.route-provider');
  }

  set routeProvider(routeProvider) {
    return localStorage.setItem('salte.auth.demo.route-provider', routeProvider);
  }
});

demoModule.controller('HomeController', class HomeController {
  constructor(SalteAuthService, $http) {
    this.SalteAuthService = SalteAuthService;
    this.$http = $http;

    this.$http.get('https://jsonplaceholder.typicode.com/posts/1').then((response) => {
      console.log(response);
    });
  }
});
