const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "zlib": require.resolve("browserify-zlib"),
    "stream": require.resolve("stream-browserify"),
    "url": require.resolve("url/"),
    "assert": require.resolve("assert/"),
    "util": require.resolve("util/"),
    "buffer": require.resolve("buffer/"),
    "process/browser": require.resolve("process/browser.js")
  };

  config.resolve.alias = {
    ...config.resolve.alias,
    'process/browser': require.resolve('process/browser.js')
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer']
    })
  ];

  return config;
};
