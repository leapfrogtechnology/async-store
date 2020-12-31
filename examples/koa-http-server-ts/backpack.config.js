const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  webpack: (config) => {
    config.context = path.resolve(__dirname, 'src');
    config.entry = {
      main: './index.ts'
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

    // Setup polling on MacOS for hot-reloads
    if (process.env.OS === 'darwin') {
      config.watch = true;

      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/
      };
    }

    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        tsconfig: path.resolve(__dirname, 'tsconfig.json')
      })
    );

    return config;
  }
};
