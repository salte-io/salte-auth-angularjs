const common = require('./webpack.common.config.js');
const config = common({ minified: false });

config.externals = [];
config.entry.vendor = [
  '@uirouter/angularjs'
];
config.entry['salte-auth-angularjs'] = ['../index.html', '../index.js'];
config.module.rules.push({
  test: /\.html$/,
  loader: 'file-loader?name=[path][name].[ext]'
});
config.devtool = 'inline-source-map';
config.devServer = {
  host: '0.0.0.0',
  historyApiFallback: true,
  disableHostCheck: true
};

module.exports = config;
