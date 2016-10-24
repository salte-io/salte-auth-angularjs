# Salte Auth Angular
[![Slack Status][slack-image]][slack-url]
[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![Travis][travis-ci-image]][travis-ci-url]
[![Coveralls][coveralls-image]][coveralls-url]

[![Commitizen friendly][commitizen-image]][commitizen-url]
[![semantic-release][semantic-release-image]][semantic-release-url]

## Description
This library allows you to incorporate OpenID Connect authentication into your single page application.  It will also retrieve the access token(s) required to make secured API calls and will enrich the authorization header of the outgoing requests to these APIs with the applicable token.  It will also monitor the expiration time associated with each token and refresh them when needed.     

<<<<<<< HEAD
This library was originally forked from the [AzureAD Active Dirctory Authentication Library for JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js).  We decided to break from the original repository because we needed the library to support a wider-variety of OpenID Connect identity providers.  To achieve this, it had to support a more flexible identity provider URL parameter and a user-defined scope parameter. Making the library more generally applicable wasn't something the original repository owners wanted to entertain so we took their foundation and built upon it.  The underlying authentication library [salte-auth](https://github.com/salte-io/salte-auth) has been broken out into a seperate repository since it isn't AngularJS-specific and will be used to support additional UI frameworks in the future.  We've also updated some of the configuration parameters to make them less AD-specific and made several improvements, including but not limited to, converting parts of the source to es6 and incorporating a first-class linting, build, and release process.  We've also stripped out a few polyfills that were in place to support older versions of IE.
=======
This library was originally forked from the [AzureAD Active Dirctory Authentication Library for JavaScript](https://github.com/AzureAD/azure-activedirectory-library-for-js).  We decided to break from the original repository because we needed the library to support a wider-variety of OpenID Connect identity providers.  To achieve this, it had to support a more flexible identity provider URL parameter and a user-defined scope parameter. Making the library more generally applicable wasn't something the original repository owners wanted to entertain so we took their foundation and built upon it.  The underlying authentication library [salte-auth](https://github.com/salte-io/salte-auth) has been broken out into a seperate repository since it isn't AngularJS-specific and will be used to support additional UI frameworks in the future.  We've also updated some of the configuration parameters to make them less AD-specific and made several improvements, including but not limited to, converting parts of the source to es6 and incorporating a first-class linting, build, and release process.  We've also stripped out a few polyfills that were in place to support older versions of IE.
>>>>>>> 8d0b83ea6ef57b5e6d7eb7969d257ac70faf0a58

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
The following is a sample JavaScript file used to bootstrap an AngularJS 1.x application:
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
      redirectUri: 'https://<my registered application url>/',
      securedEndpoints: {"/api" : "mySecuredAPI"},
      anonymousEndpoints: ['templates']
    },
    $httpProvider
  );
}]);
```
The following table describes each of the initialization parameters listed above:

Parameter Name|Required|Default|Description
--------------|--------|-------|-----------
responseType  |No|id_token | According to the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html), this parameter should be set to either "id_token" or "id_token token".  However, the value of this field is not validated by the library.  Ultimately, the responseType passed must result in a valid id_token being returned from the identity provider for the user to be successfully authenticated.
scope|No|Not Passed|According to the [OpenID Connect specification](http://openid.net/specs/openid-connect-core-1_0.html), this parameter must contain, at minimum, the value "openid".  Additionally, if supported by your identity provider, you may specify profile, email, address, and phone to request that specific sets of information be returned as claim values in the id_token.  Additional identity provider-specific scopes may also be supported to identity what access privileges are being requested.  As with responseType, the value of this parameter is not validated by the library.
url|Yes|None|This is the base url for the identity provider's authorize endpoint; not including the word authorize.  It must be a valid https endpoint that ends in a forward slash.
redirectUri|No|Current Window Location|Redirection URI to which the response will be sent. This URI MUST match the redirection URI value pre-registered with the identity provider.
securedEndpoints|No|None|This is a JSON object containing one or more named endpoints formatted as { "Endpoint": "ResourceId" }.  This object is used to identify endpoints to which tokens should be attached.  If the value contained within "Endpoint" exists anywhere within an endpoint being called then it is considered a match.  If the endpoint doesn't match one of the endpoints contained in this object then either no token will be passed or, if the endpoint's hostname matches the application hostname, the id_token will be passed.  The "ResourceId" value is an arbitrary name you assign to the endpoints that will match the "Endpoint" value.  In the example above, any calls that include "/api" are associated with "mySecuredAPI" and will share the same access_token.
anonymousEndpoints|No|None|This is an array containing one or more endpoints to which a token need not be attached.  If the endpoint specified exists anywhere within the endpoint being called then it is considered to be a match.  In this example, a token will not be attached when the user navigates to any of the html partial views located in the "template" subfolder.
In addition, the "requireAuthentication: true" parameter/value, currently tied to the "/SomeSecuredPage" route, can be moved to the salteAuthServiceProvider "init" function (like those listed in the table above) to require authentication for all routes.
## License

The MIT License

Copyright (c) 2012-2016 Salte. https://salte.io

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
