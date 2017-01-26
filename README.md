# Salte Auth Angular

[![Greenkeeper badge](https://badges.greenkeeper.io/salte-io/salte-auth-angular.svg)](https://greenkeeper.io/)
[![Slack Status][slack-image]][slack-url]
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Travis][travis-ci-image]][travis-ci-url]
[![Coveralls][coveralls-image]][coveralls-url]

[![Commitizen friendly][commitizen-image]][commitizen-url]
[![semantic-release][semantic-release-image]][semantic-release-url]
[![Greenkeeper badge][greenkeeper-image]][greenkeeper-url]

## Description
This library allows you to easily incorporate OpenID Connect implicit flow authentication into your single page application.  It can also retrieve the access token(s) required to make secured REST API calls and will enrich outgoing requests to these APIs with the an authorization header containing the applicable access token.  It will also monitor the expiration time associated with each token and refresh them as needed.     
## Install

You can install this package either with `npm` or with `bower`.

## npm

```sh
$ npm install salte-auth-angular
```
Then add a `<script>` to your index.html:
```html
<script src="/node_modules/salte-auth-angular/salte-auth-angular.js"></script>
```
Or `require('salte-auth-angular')` from your code.

## bower

```sh
$ bower install salte-io/salte-auth-angular
```
Then add a `<script>` to your index.html:
```html
<script src="/bower_components/salte-auth-angular/salte-auth-angular.js"></script>
```
## Typical Usage Scenario
The following is a sample JavaScript file used to bootstrap an AngularJS 1.x application that uses ngRoute (uiRouter is also supported):
```javascript
'use strict';

var module = angular.module('Sample', ['ngRoute', 'salte.auth-angular', 'ngResource', 'ui.bootstrap']);

module.config(['$routeProvider', '$httpProvider', 'salteAuthServiceProvider', function($routeProvider, $httpProvider, salteAuthServiceProvider) {
  $routeProvider.when("/Welcome", {
    controller: "WelcomeController",
    templateUrl: "templates/welcome.html"
  }).when("/SomeSecuredPage", {
    controller: "GithubUsers",
    controllerAs: 'vm',
    templateUrl: "templates/githubUsers.html",
    requireAuthentication: true
  }).otherwise({ redirectTo: "/Home" });

  salteAuthServiceProvider.init({
      responseType: 'id_token',
      scope: 'openid',
      clientId: 'XE9mdXnr0j2z6_nED5ifDIW4S9oa',
      url: 'https://login.microsoftonline.com/common/oauth2/',
      extraQueryParameter: 'tenantDomain=tenant123',
      redirectUri: 'https://<my registered application url>/',
      securedEndpoints: {"/api" : "mySecuredAPI"},
      anonymousEndpoints: ['templates'],
      cacheLocation: 'localStorage',
      hashPrefix: '!',
      tokenCallbackTimeout: '12000'
    },
    $httpProvider
  );
}]);
```
The following table describes each of the initialization parameters listed above:

Parameter Name|Required|Default|Description
--------------|--------|-------|-----------
responseType  |No|id_token | The value of this field is not validated by the library.  However, according to the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html), this parameter should be passed as either "id_token" or "id_token token".  Ultimately, the responseType passed must result in a valid id_token being returned from the identity provider for the user to be successfully authenticated.
scope|No|Not Passed|According to the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html), this parameter must contain, at minimum, the value "openid".  Additionally, if supported by your identity provider, you may specify profile, email, address, and phone to request that specific sets of information be returned as claim values in the id_token.  Additional identity provider-specific scopes may also be supported to identity what access privileges are being requested.  As with responseType, the value of this parameter is not validated by the library.
url|Yes|None|This is the base url for the identity provider's authorize and token endpoint; not including the word authorize or token.
extraQueryParameter|No|None|Value to be included as an additional query parameter when calling the identity provider's authorize and token endpoints.  Should be formatted as "name=value".
redirectUri|No|Current Window Location|Redirection URI to which the response will be sent. This URI MUST match the redirection URI pre-registered with the identity provider.
securedEndpoints|No|None|This is a JSON object containing one or more named endpoints formatted as { "Endpoint": "ResourceId" }.  Endpoint may contain a partial URL to be matched against outgoing REST API calls.  All calls matching a given "Endpoint"  will share the same access token.  "ResourceId" is just an arbitrary name used to group matching endpoints.
anonymousEndpoints|No|None|This is an array containing one or more partial URLs to be matched against outgoing REST API calls.  Calls matching one of these partial URLs  are considered anonymous and will not have a token attached.  A typical use of this parameter is to identify the path to partial HTML files used in single page applications.
cacheLocation|No|sessionStorage|Specifies where this component should store state information including, but not limited to, the application's id_token and access_token(s).
hashPrefix|No|Empty String|As of AngularJS 1.6.0, the hashPrefix default value was changed from empty string to an exclamation point (!).  As a result, AngularJS 1.6.0+ applications that are not running in HTML5 mode, or that will run in browsers that do not support HTML5 mode, must indicate what value they are using for the $locationProvider's hashPrefix value; whether that be the new default value or something else.
tokenCallbackTimeout|No|6000|This is the amount of time, in milliseconds, that the component will wait for renew token requests sent to the identity provider.
In addition, the "requireAuthentication: true" parameter/value, currently tied to the "/SomeSecuredPage" route, can be moved to the salteAuthServiceProvider "init" function (like those listed in the table above) to require authentication for all routes.

## License

The MIT License

Copyright (c) 2016 Salte. https://www.salte.io

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

[slack-image]: https://salte-slack.herokuapp.com/badge.svg
[slack-url]: https://salte-slack.herokuapp.com/

[npm-version-image]: http://img.shields.io/npm/v/salte-auth-angular.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/salte-auth-angular.svg?style=flat
[npm-url]: https://npmjs.org/package/salte-auth-angular

[travis-ci-image]: https://img.shields.io/travis/salte-io/salte-auth-angular/master.svg?style=flat
[travis-ci-url]: https://travis-ci.org/salte-io/salte-auth-angular

[coveralls-image]: https://img.shields.io/coveralls/salte-io/salte-auth-angular/master.svg
[coveralls-url]: https://coveralls.io/github/salte-io/salte-auth-angular

[commitizen-image]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/

[semantic-release-url]: https://github.com/semantic-release/semantic-release
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg

[greenkeeper-url]: https://greenkeeper.io
[greenkeeper-image]: https://badges.greenkeeper.io/salte-io/salte-auth-angular.svg
