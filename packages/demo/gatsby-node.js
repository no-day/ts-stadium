const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

exports.onCreateWebpackConfig = ({
  stage,
  rules,
  loaders,
  plugins,
  actions,
}) => {
  actions.setWebpackConfig({
    resolve: {
      plugins: [
        new TsconfigPathsPlugin({
          configFile: '../../tsconfig.settings.json',
        }),
      ],

      // alias: {
      //   : path.resolve(__dirname, 'path/to/file.js'),
      // },
    },
  });
};
