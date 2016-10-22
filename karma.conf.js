const webpackConfig = require('./webpack.test.config.js');
webpackConfig.module.preLoaders.push({
  test: /\.js$/,
  exclude: /tests|node_modules/,
  loader: 'isparta'
});

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: [
      'jasmine'
    ],

    files: [
      'tests/index.js'
    ],

    preprocessors: {
      'tests/index.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      noInfo: true
    },

    reporters: ['mocha', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'text' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.info' }
      ]
    },

    port: 9876,

    colors: true,

    logLevel: config.LOG_INFO,

    autoWatch: true,

    browsers: ['PhantomJS'],

    browserNoActivityTimeout: 120000,

    singleRun: false
  });
};
