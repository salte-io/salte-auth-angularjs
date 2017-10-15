// Polyfills
import Promise from 'promise-polyfill';

window.Promise = Promise;

import 'angular';
import 'angular-mocks';

const testsContext = require.context('.', true, /\.spec\.js$/);
testsContext.keys().forEach(testsContext);
