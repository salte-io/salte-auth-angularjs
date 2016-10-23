import ngResource from 'angular-resource';
import ngRoute from 'angular-route';
import salteAuthAngular from '../src/salte-auth-angular.module.js';

let ngRouteApp = angular.module('NgRouteApp', [ngResource, ngRoute, salteAuthAngular]);

ngRouteApp.config(function($httpProvider, $routeProvider, salteAuthServiceProvider) {
  $routeProvider.when('/home', {
    controller: 'homeController',
    template: '<div>home</div>'
  }).when('/about', {
    controller: 'aboutController',
    templateUrl: 'about.html'
  }).when('/todoList', {
    controller: 'todoListController',
    template: '<div>todoList</div>',
    requireADLogin: true
  }).otherwise({
    redirectTo: '/home'
  });

  let endpoints = {
    '/api/Todo/': 'resource1',
    '/anotherApi/Item/': 'resource2',
    'https://testapi.com/': 'resource1'
  };

  salteAuthServiceProvider.init({
    url: 'https://identity.provider.com/',
    clientId: 'clientid123',
    loginResource: 'loginResource123',
    redirectUri: 'https://myapp.com/page',
    securedEndpoints: endpoints },
    $httpProvider
  );
});

ngRouteApp.factory('ItemFactory', ['$http', function($http) {
  let serviceFactory = {};
  let _getItem = function(id) {
    return $http.get('/anotherApi/Item/' + id);
  };

  serviceFactory.getItem = _getItem;
  return serviceFactory;
}]);

ngRouteApp.factory('TaskFactory', ['$http', function($http) {
  let serviceFactory = {};
  let _getItem = function(id) {
    return $http.get('/api/Todo/' + id);
  };

  let _getItem2 = function(url) {
    return $http.get(url);
  };
  serviceFactory.getItem = _getItem;
  serviceFactory.getItem2 = _getItem2;
  return serviceFactory;
}]);

ngRouteApp.controller('TaskCtl', ['$scope', '$location', 'salteAuthService', 'TaskFactory', 'ItemFactory', function($scope, $location, salteAuthService, TaskFactory, ItemFactory) {
  $scope.taskCall = function() {
    TaskFactory.getItem(5).success(function(data) {
      $scope.task = data;
    }).error(function(err) {
      $scope.error = err;
      $scope.loadingMsg = '';
    });
  };

  $scope.itemCall = function() {
    ItemFactory.getItem(13).success(function(data) {
      $scope.item = data;
    }).error(function(err) {
      $scope.error = err;
      $scope.loadingMsg = '';
    });
  };

  $scope.taskCall2 = function() {
    TaskFactory.getItem2('https://test.com/').success(function(data) {
      $scope.task = data;
    }).error(function(err) {
      $scope.error = err;
      $scope.loadingMsg = '';
    });
  };

  $scope.taskCall3 = function() {
    TaskFactory.getItem2('https://testapi.com/').success(function(data) {
      $scope.task = data;
    }).error(function(err) {
      $scope.error = err;
      $scope.loadingMsg = '';
    });
  };

  $scope.taskCall4 = function() {
    TaskFactory.getItem2('/someapi/item').success(function(data) {
      $scope.task = data;
    }).error(function(err) {
      $scope.error = err;
      $scope.loadingMsg = '';
    });
  };

  $scope.taskCall5 = function() {
    TaskFactory.getItem2('https://myapp.com/someapi/item').success(function(data) {
      $scope.task = data;
    }).error(function(err) {
      $scope.error = err;
      $scope.loadingMsg = '';
    });
  };

  $scope.taskCall6 = function() {
    TaskFactory.getItem2('http://testwebapi.com/').success(function(data) {
      $scope.task = data;
    }).error(function(err) {
      $scope.error = err;
      $scope.loaingMsg = '';
    });
  };

  $scope.user = salteAuthService.userInfo;
}]);

export default ngRouteApp.name;
