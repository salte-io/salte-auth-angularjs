/**
 * @salte-io/salte-auth-angularjs JavaScript Library v2.0.3
 *
 * @license MIT (https://github.com/salte-io/salte-auth/blob/master/LICENSE)
 *
 * Made with ♥ by Dave Woodward <dave@salte.io>, Ceci <nick@salte.io
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("salte-auth"), require("angular"));
	else if(typeof define === 'function' && define.amd)
		define("salte-auth-angularjs", ["salte-auth", "angular"], factory);
	else if(typeof exports === 'object')
		exports["salte-auth-angularjs"] = factory(require("salte-auth"), require("angular"));
	else
		root["salte-auth-angularjs"] = factory(root["salte.auth"], root["angular"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__salte_io_salte_auth__, __WEBPACK_EXTERNAL_MODULE_angular__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./routes/salte-auth-routes.module.js":
/*!********************************************!*\
  !*** ./routes/salte-auth-routes.module.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _angular = __webpack_require__(/*! angular */ "angular");

var _angular2 = _interopRequireDefault(_angular);

var _salteAuthRoutesService = __webpack_require__(/*! ./salte-auth-routes.service.js */ "./routes/salte-auth-routes.service.js");

var _salteAuthRoutesService2 = _interopRequireDefault(_salteAuthRoutesService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _module = _angular2.default.module('salte.auth.routes', []);

_module.service('SalteAuthRoutesService', _salteAuthRoutesService2.default);

exports.default = _module.name;

/***/ }),

/***/ "./routes/salte-auth-routes.service.js":
/*!*********************************************!*\
  !*** ./routes/salte-auth-routes.service.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SalteAuthRoutesService = function () {
  function SalteAuthRoutesService($injector, $location) {
    _classCallCheck(this, SalteAuthRoutesService);

    this.$injector = $injector;
    this.$location = $location;
  }

  _createClass(SalteAuthRoutesService, [{
    key: 'uirouter',
    get: function get() {
      var routes = [];
      if (this.$injector.has('$state')) {
        var $state = this.$injector.get('$state');
        var states = $state.get();

        for (var i = 0; i < states.length; i++) {
          var state = states[i];

          if (!state.secured) continue;

          var url = $state.href(state.name, {}, { absolute: true });
          routes.push(url);
        }
      }
      return routes;
    }
  }, {
    key: 'ngroute',
    get: function get() {
      var _this = this;

      var originalUrl = this.$location.absUrl();
      var routes = [];
      if (this.$injector.has('$route')) {
        var $route = this.$injector.get('$route');

        Object.keys($route.routes).forEach(function (url) {
          var route = $route.routes[url];

          if (!route.secured) return;

          _this.$location.path(url);

          routes.push(_this.$location.absUrl());
        });
      }
      this.$location.absUrl(originalUrl);
      return routes;
    }
  }]);

  return SalteAuthRoutesService;
}();

exports.default = SalteAuthRoutesService;


SalteAuthRoutesService.$inject = ['$injector', '$location'];

/***/ }),

/***/ "./salte-auth.module.js":
/*!******************************!*\
  !*** ./salte-auth.module.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _angular = __webpack_require__(/*! angular */ "angular");

var _angular2 = _interopRequireDefault(_angular);

var _salteAuthRoutesModule = __webpack_require__(/*! ./routes/salte-auth-routes.module.js */ "./routes/salte-auth-routes.module.js");

var _salteAuthRoutesModule2 = _interopRequireDefault(_salteAuthRoutesModule);

var _salteAuthService = __webpack_require__(/*! ./salte-auth.service.js */ "./salte-auth.service.js");

var _salteAuthService2 = _interopRequireDefault(_salteAuthService);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _module = _angular2.default.module('salte.auth', [_salteAuthRoutesModule2.default]);

_module.provider('SalteAuthService', _salteAuthService2.default);

_module.run(['SalteAuthService', function (SalteAuthService) {
  window.addEventListener('storage', SalteAuthService.$$onStorageChanged);
  SalteAuthService.$$registerRoutes();
}]);

exports.default = _module.name;

/***/ }),

/***/ "./salte-auth.service.js":
/*!*******************************!*\
  !*** ./salte-auth.service.js ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _salteAuth = __webpack_require__(/*! @salte-io/salte-auth */ "@salte-io/salte-auth");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SalteAuthServiceProvider = function () {
  function SalteAuthServiceProvider() {
    _classCallCheck(this, SalteAuthServiceProvider);
  }

  _createClass(SalteAuthServiceProvider, [{
    key: 'setup',
    value: function setup(config) {
      return new _salteAuth.SalteAuth(config);
    }
  }, {
    key: '$get',
    value: function $get($rootScope, $q, SalteAuthRoutesService) {
      return function () {
        function SalteAuthService() {
          _classCallCheck(this, SalteAuthService);
        }

        _createClass(SalteAuthService, null, [{
          key: 'digest',
          value: function digest(promise) {
            return promise.then(function (response) {
              $rootScope.$digest();
              return response;
            }).catch(function (error) {
              $rootScope.$digest();
              throw error;
            });
          }
        }, {
          key: 'loginWithRedirect',
          value: function loginWithRedirect() {
            var _$auth;

            return (_$auth = this.$auth).loginWithRedirect.apply(_$auth, arguments);
          }
        }, {
          key: 'loginWithIframe',
          value: function loginWithIframe() {
            var _$auth2;

            return this.digest((_$auth2 = this.$auth).loginWithIframe.apply(_$auth2, arguments));
          }
        }, {
          key: 'loginWithPopup',
          value: function loginWithPopup() {
            var _$auth3;

            return this.digest((_$auth3 = this.$auth).loginWithPopup.apply(_$auth3, arguments));
          }
        }, {
          key: 'logoutWithRedirect',
          value: function logoutWithRedirect() {
            var _$auth4;

            return (_$auth4 = this.$auth).logoutWithRedirect.apply(_$auth4, arguments);
          }
        }, {
          key: 'logoutWithIframe',
          value: function logoutWithIframe() {
            var _$auth5;

            return this.digest((_$auth5 = this.$auth).logoutWithIframe.apply(_$auth5, arguments));
          }
        }, {
          key: 'logoutWithPopup',
          value: function logoutWithPopup() {
            var _$auth6;

            return this.digest((_$auth6 = this.$auth).logoutWithPopup.apply(_$auth6, arguments));
          }
        }, {
          key: 'retrieveAccessToken',
          value: function retrieveAccessToken() {
            return this.digest(this.$auth.retrieveAccessToken());
          }
        }, {
          key: '$$onStorageChanged',
          value: function $$onStorageChanged(event) {
            if (event.storageArea.length && event.key.indexOf('salte.auth') === -1) return;

            $rootScope.$digest();
          }
        }, {
          key: '$$registerRoutes',
          value: function $$registerRoutes() {
            if ([false, true].indexOf(this.$auth.$config.routes) !== -1) return;
            this.$auth.$config.routes = this.$auth.$config.routes || [];
            this.$auth.$config.routes = this.$auth.$config.routes.concat(SalteAuthRoutesService.uirouter);
            this.$auth.$config.routes = this.$auth.$config.routes.concat(SalteAuthRoutesService.ngroute);
          }
        }, {
          key: 'profile',
          get: function get() {
            return this.$auth.profile;
          }
        }, {
          key: '$auth',
          get: function get() {
            if (!window.salte || !window.salte.auth) {
              return null;
            }
            return window.salte.auth;
          }
        }]);

        return SalteAuthService;
      }();
    }
  }]);

  return SalteAuthServiceProvider;
}();

exports.default = SalteAuthServiceProvider;


SalteAuthServiceProvider.prototype.$get.$inject = ['$rootScope', '$q', 'SalteAuthRoutesService'];

/***/ }),

/***/ 0:
/*!************************************!*\
  !*** multi ./salte-auth.module.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./salte-auth.module.js */"./salte-auth.module.js");


/***/ }),

/***/ "@salte-io/salte-auth":
/*!**********************************************************************************************************!*\
  !*** external {"root":"salte.auth","commonjs":"salte-auth","commonjs2":"salte-auth","amd":"salte-auth"} ***!
  \**********************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__salte_io_salte_auth__;

/***/ }),

/***/ "angular":
/*!**************************!*\
  !*** external "angular" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_angular__;

/***/ })

/******/ });
});
//# sourceMappingURL=salte-auth-angularjs.js.map