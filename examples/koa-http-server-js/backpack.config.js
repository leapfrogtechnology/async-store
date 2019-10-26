const path = require('path');

module.exports = {
  webpack: config => {
    config.context = path.resolve(__dirname, 'src');
    config.entry = {
      main: './index.js'
    };
    config.output.path = path.resolve(__dirname, 'dist');
    config.resolve.extensions = ['.js', '.json'];

    // When we build with webpack it messes up the global '__dirname'
    // given by node. To undo this we have to set this configuration
    // https://github.com/webpack/webpack/issues/1599
    config.node = {
      __dirname: false
    };

    return config;
  }
};
