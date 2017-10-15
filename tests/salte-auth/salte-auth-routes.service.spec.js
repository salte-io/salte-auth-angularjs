import { expect } from 'chai';
import uiRouterModule from '@uirouter/angularjs';
import uiRouterPreOneModule from 'angular-ui-router';
import ngRouteModule from 'angular-route';

import salteAuth from '../../src/routes/salte-auth-routes.module.js';

describe('service(SalteAuthRoutesService)', () => {
  let SalteAuthRoutesService;

  describe('getter(uirouter)', () => {
    describe('UI Router: 1.0+', () => {
      beforeEach(angular.mock.module(salteAuth, uiRouterModule, ($stateProvider) => {
        $stateProvider.state('home', {
          url: '/',

          secured: true
        }).state({
          name: 'account',
          url: '/account'
        }).state({
          name: 'admin',
          url: '/admin',

          secured: true
        });
      }));

      beforeEach(angular.mock.inject.strictDi(true));
      beforeEach(angular.mock.inject((_SalteAuthRoutesService_) => {
        SalteAuthRoutesService = _SalteAuthRoutesService_;
      }));

      it('should secure and routes specified', () => {
        expect(SalteAuthRoutesService.uirouter).to.deep.equal([
          'http://server/#!/',
          'http://server/#!/admin'
        ]);
      });
    });

    describe('UI Router: Pre 1.0', () => {
      beforeEach(angular.mock.module(salteAuth, uiRouterPreOneModule, ($stateProvider) => {
        $stateProvider.state('home', {
          url: '/',

          secured: true
        }).state({
          name: 'account',
          url: '/account'
        }).state({
          name: 'admin',
          url: '/admin',

          secured: true
        });
      }));

      beforeEach(angular.mock.inject.strictDi(true));
      beforeEach(angular.mock.inject((_SalteAuthRoutesService_) => {
        SalteAuthRoutesService = _SalteAuthRoutesService_;
      }));

      it('should secure and routes specified', () => {
        expect(SalteAuthRoutesService.uirouter).to.deep.equal([
          'http://server/#!/',
          'http://server/#!/admin'
        ]);
      });
    });
  });

  describe('getter(ngroute)', () => {
    beforeEach(angular.mock.module(salteAuth, ngRouteModule, ($routeProvider) => {
      $routeProvider.when('/', {
        template: 'Home',

        secured: true
      }).when('/account', {
        template: 'Account'
      }).when('/admin', {
        template: 'Admin',

        secured: true
      });
    }));

    beforeEach(angular.mock.inject.strictDi(true));
    beforeEach(angular.mock.inject((_SalteAuthRoutesService_) => {
      SalteAuthRoutesService = _SalteAuthRoutesService_;
    }));

    it('should secure and routes specified', () => {
      expect(SalteAuthRoutesService.ngroute).to.deep.equal([
        'http://server/#!/',
        'http://server/#!/admin'
      ]);
    });
  });
});
