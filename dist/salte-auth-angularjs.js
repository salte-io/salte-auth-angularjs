/**
 * @salte-io/salte-auth-angularjs JavaScript Library v2.1.2
 *
 * @license MIT (https://github.com/salte-io/salte-auth-angularjs/blob/master/LICENSE)
 *
 * Made with ♥ by Dave Woodward <dave@salte.io>, Nick Woodward <nick@salte.io
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("angular"), require("@salte-auth/salte-auth"));
	else if(typeof define === 'function' && define.amd)
		define("salte-auth-angularjs", ["angular", "@salte-auth/salte-auth"], factory);
	else if(typeof exports === 'object')
		exports["salte-auth-angularjs"] = factory(require("angular"), require("@salte-auth/salte-auth"));
	else
		root["salte-auth-angularjs"] = factory(root["angular"], root["salte.auth"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE__2__, __WEBPACK_EXTERNAL_MODULE__6__) {
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
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _routes_salte_auth_routes_module_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _salte_auth_service_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);



var module = angular__WEBPACK_IMPORTED_MODULE_0___default.a.module('salte.auth', [_routes_salte_auth_routes_module_js__WEBPACK_IMPORTED_MODULE_1__["default"]]);
module.provider('SalteAuthService', _salte_auth_service_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
module.run(['SalteAuthService', function (SalteAuthService) {
  window.addEventListener('storage', SalteAuthService.$$onStorageChanged);
  SalteAuthService.$$registerRoutes();
  SalteAuthService.$$registerEvents();
}]);
/* harmony default export */ __webpack_exports__["default"] = (module.name);

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var angular__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(angular__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _salte_auth_routes_service_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);


var module = angular__WEBPACK_IMPORTED_MODULE_0___default.a.module('salte.auth.routes', []);
module.service('SalteAuthRoutesService', _salte_auth_routes_service_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
/* harmony default export */ __webpack_exports__["default"] = (module.name);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SalteAuthRoutesService; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var SalteAuthRoutesService =
/*#__PURE__*/
function () {
  function SalteAuthRoutesService($injector, $location) {
    _classCallCheck(this, SalteAuthRoutesService);

    this.$injector = $injector;
    this.$location = $location;
  }

  _createClass(SalteAuthRoutesService, [{
    key: "uirouter",
    get: function get() {
      var routes = [];

      if (this.$injector.has('$state')) {
        var $state = this.$injector.get('$state');
        var states = $state.get();

        for (var i = 0; i < states.length; i++) {
          var state = states[i];
          if (!state.secured) continue;
          var url = $state.href(state.name, {}, {
            absolute: true
          });
          routes.push(url);
        }
      }

      return routes;
    }
  }, {
    key: "ngroute",
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


SalteAuthRoutesService.$inject = ['$injector', '$location'];

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SalteAuthServiceProvider; });
/* harmony import */ var _salte_auth_salte_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _salte_auth_salte_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_salte_auth_salte_auth__WEBPACK_IMPORTED_MODULE_0__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var SalteAuthServiceProvider =
/*#__PURE__*/
function () {
  function SalteAuthServiceProvider() {
    _classCallCheck(this, SalteAuthServiceProvider);
  }

  _createClass(SalteAuthServiceProvider, [{
    key: "setup",
    value: function setup(config) {
      return new _salte_auth_salte_auth__WEBPACK_IMPORTED_MODULE_0__["SalteAuth"](config);
    }
  }, {
    key: "$get",
    value: function $get($rootScope, $q, SalteAuthRoutesService) {
      return (
        /*#__PURE__*/
        function () {
          function SalteAuthService() {
            _classCallCheck(this, SalteAuthService);
          }

          _createClass(SalteAuthService, null, [{
            key: "digest",
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
            key: "on",
            value: function on(eventType, callback) {
              if (!this.$listeners[eventType]) {
                this.$listeners[eventType] = [];
              }

              this.$listeners[eventType].push(callback);
            }
          }, {
            key: "off",
            value: function off(eventType, callback) {
              var index = this.$listeners[eventType].indexOf(callback);
              this.$listeners[eventType].splice(index, 1);
            }
          }, {
            key: "loginWithRedirect",
            value: function loginWithRedirect() {
              var _this$$auth;

              return (_this$$auth = this.$auth).loginWithRedirect.apply(_this$$auth, arguments);
            }
          }, {
            key: "loginWithIframe",
            value: function loginWithIframe() {
              var _this$$auth2;

              return (_this$$auth2 = this.$auth).loginWithIframe.apply(_this$$auth2, arguments);
            }
          }, {
            key: "loginWithPopup",
            value: function loginWithPopup() {
              var _this$$auth3;

              return (_this$$auth3 = this.$auth).loginWithPopup.apply(_this$$auth3, arguments);
            }
          }, {
            key: "logoutWithRedirect",
            value: function logoutWithRedirect() {
              var _this$$auth4;

              return (_this$$auth4 = this.$auth).logoutWithRedirect.apply(_this$$auth4, arguments);
            }
          }, {
            key: "logoutWithIframe",
            value: function logoutWithIframe() {
              var _this$$auth5;

              return (_this$$auth5 = this.$auth).logoutWithIframe.apply(_this$$auth5, arguments);
            }
          }, {
            key: "logoutWithPopup",
            value: function logoutWithPopup() {
              var _this$$auth6;

              return (_this$$auth6 = this.$auth).logoutWithPopup.apply(_this$$auth6, arguments);
            }
          }, {
            key: "retrieveAccessToken",
            value: function retrieveAccessToken() {
              return this.$auth.retrieveAccessToken();
            }
          }, {
            key: "$$onStorageChanged",
            value: function $$onStorageChanged(event) {
              if (event.storageArea.length && event.key.indexOf('salte.auth') === -1) return;
              $rootScope.$digest();
            }
          }, {
            key: "$$registerRoutes",
            value: function $$registerRoutes() {
              if ([false, true].indexOf(this.$auth.$config.routes) !== -1) return;
              this.$auth.$config.routes = this.$auth.$config.routes || [];
              this.$auth.$config.routes = this.$auth.$config.routes.concat(SalteAuthRoutesService.uirouter);
              this.$auth.$config.routes = this.$auth.$config.routes.concat(SalteAuthRoutesService.ngroute);
            }
          }, {
            key: "$$registerEvents",
            value: function $$registerEvents() {
              var _this = this;

              var eventTypes = ['login', 'logout', 'refresh'];

              var _loop = function _loop(i) {
                var eventType = eventTypes[i];

                _this.$auth.on(eventType, function (error, data) {
                  var listeners = _this.$listeners[eventType];

                  if (listeners) {
                    for (var _i = 0; _i < listeners.length; _i++) {
                      listeners[_i](error, data);
                    }
                  }

                  $rootScope.$digest();
                });
              };

              for (var i = 0; i < eventTypes.length; i++) {
                _loop(i);
              }
            }
          }, {
            key: "profile",
            get: function get() {
              return this.$auth.profile;
            }
          }, {
            key: "$auth",
            get: function get() {
              if (!window.salte || !window.salte.auth) {
                return null;
              }

              return window.salte.auth;
            }
          }, {
            key: "$listeners",
            get: function get() {
              if (!this.$$listeners) {
                this.$$listeners = {};
              }

              return this.$$listeners;
            }
          }]);

          return SalteAuthService;
        }()
      );
    }
  }]);

  return SalteAuthServiceProvider;
}();


SalteAuthServiceProvider.prototype.$get.$inject = ['$rootScope', '$q', 'SalteAuthRoutesService'];

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE__6__;

/***/ })
/******/ ]);
});
//# sourceMappingURL=salte-auth-angularjs.js.map