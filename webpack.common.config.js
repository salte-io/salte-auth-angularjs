const path = require('path');
const webpack = require('webpack');
const deindent = require('deindent');
const { name, version, contributors, browserslist } = require('./package.json');

module.exports = function({ minified, coverage, test }) {
  return {
    context: path.join(__dirname, 'src'),
    entry: {
      'salte-auth-angularjs': ['./salte-auth.module.js']
    },
    mode: 'none',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: `[name]${minified ? '.min' : ''}.js`,
      sourceMapFilename: '[file].map',
      library: 'salte-auth-angularjs',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },
    externals: test ? {} : {
      'angular': 'angular',
      '@salte-auth/salte-auth': {
        root: 'salte.auth',
        commonjs: '@salte-auth/salte-auth',
        commonjs2: '@salte-auth/salte-auth',
        amd: '@salte-auth/salte-auth'
      }
    },
    devtool: test ? 'inline-source-map' : 'source-map',
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules\/(?!(whatwg-url|@webcomponents|lit-html|lit-element|@polymer)\/).*/,
        options: {
          presets: [['@babel/preset-env', {
            modules: false,
            targets: {
              browsers: browserslist
            }
          }]]
        }
      }].concat(coverage ? [{
        enforce: 'pre',
        test: /\.js$/,
        exclude: /tests|node_modules/,
        use: {
          loader: 'istanbul-instrumenter-loader',
          options: { esModules: true }
        }
      }] : [])
    },
    optimization: {
      minimize: minified ? true : false
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: deindent(`
          /**
           * ${name} JavaScript Library v${version}
           *
           * @license MIT (https://github.com/salte-io/salte-auth-angularjs/blob/master/LICENSE)
           *
           * Made with ♥ by ${contributors.join(', ')}
           */
        `).trim(),
        raw: true
      })
    ]
  };
};
