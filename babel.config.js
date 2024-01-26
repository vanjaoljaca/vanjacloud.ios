module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // [
      //   'babel-plugin-module-resolver',
      //   {
      //     alias: {
      //       path: 'react-native-path',
      //     },
      //   },
      // ],
      ['babel-plugin-inline-dotenv']
    ],
  };
};
