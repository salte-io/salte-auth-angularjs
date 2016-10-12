var path = require('path');

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: './salte-auth-angular.module.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'salte-auth-angular.js',
    sourceMapFilename: '[file].map',
    library: 'salte-auth-angular',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: [{
    'angular': {
      root: 'angular',
      commonjs2: 'angular',
      commonjs: 'angular',
      amd: 'angular'
    },
    'salte-auth': {
      root: 'salte-auth',
      commonjs2: 'salte-auth',
      commonjs: 'salte-auth',
      amd: 'salte-auth'
    }
  }],
  devtool: 'source-map',
  module: {
    preLoaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint'
    }],
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'ng-annotate?map=false!babel'
    }]
  }
};
