const common = require('./webpack.common.config.js');

module.exports = function(config) {
  const customLaunchers = {
    InternetExplorer11: {
      base: 'BrowserStack',
      browser: 'IE',
      browser_version: '11',
      os: 'Windows',
      os_version: '10'
    }
  };

  const karmaConfig = {
    basePath: '',

    frameworks: [
      'mocha',
      'sinon',
      'webpack'
    ],

    files: [
      'tests/index.js'
    ],

    preprocessors: {
      'tests/index.js': ['webpack', 'sourcemap']
    },

    webpack: common({
      minified: false,
      coverage: false,
      test: true
    }),

    webpackMiddleware: {
      noInfo: true,
      stats: 'errors-only'
    },

    reporters: ['mocha', 'BrowserStack'],

    mochaReporter: {
      showDiff: true
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    customLaunchers: customLaunchers,
    browsers: Object.keys(customLaunchers),
    captureTimeout: 0,
    browserNoActivityTimeout: 120000,

    singleRun: true
  };

  config.set(karmaConfig);
};
