# Salte Auth Angular

[![NPM Version][npm-version-image]][npm-url]
[![NPM Downloads][npm-downloads-image]][npm-url]
[![CI Build][github-actions-image]][github-actions-url]
[![Coveralls][coveralls-image]][coveralls-url]

[![semantic-release][semantic-release-image]][semantic-release-url]

An Angular 1.x extension to [salte-auth](https://github.com/salte-io/salte-auth) that automatically registers any secured routes for `ng-route` and `ui-router`.

## Install

You can install this package either with `npm` or with `bower`.

## npm

```sh
$ npm install @salte-io/salte-auth-angularjs
```

Then add a `<script>` to your index.html:

```html
<script src="/node_modules/@salte-io/salte-auth-angularjs/dist/salte-auth-angularjs.js"></script>
```

Or `require('@salte-io/salte-auth-angularjs')` from your code.

## bower

```sh
$ bower install salte-io/salte-auth-angularjs
```

Then add a `<script>` to your index.html:

```html
<script src="/bower_components/salte-auth-angularjs/dist/salte-auth-angularjs.js"></script>
```

## Usage

Setting up OAuth in Angular is as simple as providing a config!

See the documentation for [salte-auth](https://salte-io.github.io/salte-auth/typedef/index.html#static-typedef-Config) for a full list of the configuration options.

```javascript
import SalteAuthAngular from '@salte-io/salte-auth-angularjs';

const module = angular.module('Example', [
  SalteAuthAngular
]);

module.config((SalteAuthServiceProvider) => {
  // It's possible to secure individual routes with the following libraries:
  // NG Route
  // $routeProvider.when('/', {
  //   template: 'Home',
  //   secured: true
  // });
  // UI Router
  // $stateProvider.state('home', {
  //   url: '/',
  //   secured: true
  // });

  SalteAuthServiceProvider.setup({
    providerUrl: 'https://salte-alpha.auth0.com',
    responseType: 'id_token',
    redirectUrl: location.origin,
    clientId: 'mM6h2LHJikwdbkvdoiyE8kHhL7gcV8Wb',
    scope: 'openid',

    endpoints: [
        'https://jsonplaceholder.typicode.com/posts/1'
    ],

    provider: 'auth0'
  });
}]);

module.run((SalteAuthService) => {
  SalteAuthService.signInWithIframe().then(() => {
    console.log('we did it!');
  });
});
```

## Documentation

`SalteAuthService` has all the same public properties and methods as [salte-auth](https://salte-io.github.io/salte-auth/class/src/salte-auth.js~SalteAuth.html).

[npm-version-image]: https://img.shields.io/npm/v/@salte-io/salte-auth-angularjs.svg?style=flat
[npm-downloads-image]: https://img.shields.io/npm/dm/@salte-io/salte-auth-angularjs.svg?style=flat
[npm-url]: https://npmjs.org/package/@salte-io/salte-auth-angularjs

[github-actions-image]: https://github.com/salte-io/salte-auth-angularjs/actions/workflows/ci.yml/badge.svg?branch=main
[github-actions-url]: https://github.com/salte-io/salte-auth-angularjs/actions/workflows/ci.yml

[coveralls-image]: https://img.shields.io/coveralls/salte-io/salte-auth-angularjs/main.svg
[coveralls-url]: https://coveralls.io/github/salte-io/salte-auth-angularjs

[semantic-release-url]: https://github.com/semantic-release/semantic-release
[semantic-release-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
