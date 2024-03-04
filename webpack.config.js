module.exports = {
  entry: './src/app.js',
  output: {
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'clean-css-loader', 'less-loader'],
      },
    ],
  },
};
