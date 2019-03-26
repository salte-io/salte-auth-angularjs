const common = require('./webpack.common.config.js');

module.exports = [
  common({
    minified: false
  }),

  common({
    minified: true
  })
];
