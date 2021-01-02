const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  webpack: (config) => {
    config.entry = {
      main: './src/index.ts'
    };
    config.output.path = path.resolve(__dirname, 'dist');
    config.resolve.extensions = ['.ts', '.json'];

    // When we build with webpack it messes up the global '__dirname'
    // given by node. To undo this we have to set this configuration
    // https://github.com/webpack/webpack/issues/1599
    config.node = {
      __dirname: false
    };

    config.module.rules = [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true
        }
      }
    ];

    config.plugins.push(new ForkTsCheckerWebpackPlugin({}));

    return config;
  }
};
