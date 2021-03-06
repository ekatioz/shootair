const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.js',
  output: {
    path: path.resolve(__dirname, 'target'),
    filename: 'app.js',
  },
  watch: true,
  devtool: 'source-map',
};
