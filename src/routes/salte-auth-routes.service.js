export default class SalteAuthRoutesService {
  constructor($injector, $location) {
    this.$injector = $injector;
    this.$location = $location;
  }

  get uirouter() {
    const routes = [];
    if (this.$injector.has('$state')) {
      const $state = this.$injector.get('$state');
      const states = $state.get();

      for (let i = 0; i < states.length; i++) {
        const state = states[i];

        if (!state.secured) continue;

        const url = $state.href(state.name, {}, {absolute: true});
        routes.push(url);
      }
    }
    return routes;
  }

  get ngroute() {
    const originalUrl = this.$location.absUrl();
    const routes = [];
    if (this.$injector.has('$route')) {
      const $route = this.$injector.get('$route');

      Object.keys($route.routes).forEach((url) => {
        const route = $route.routes[url];

        if (!route.secured) return;

        this.$location.path(url);

        routes.push(this.$location.absUrl());
      });
    }
    this.$location.absUrl(originalUrl);
    return routes;
  }
}

SalteAuthRoutesService.$inject = ['$injector', '$location'];
