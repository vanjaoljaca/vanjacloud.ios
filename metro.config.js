/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');
const extraNodeModules = {
  'vanjacloudjs.shared': path.resolve(__dirname + '/../vanjacloudjs.shared'),
  'vanjacloudjs.private': path.resolve(__dirname + '/../vanjacloudjs.private'),
};
const watchFolders = [
  path.resolve(__dirname + '/../vanjacloudjs.shared'),
  path.resolve(__dirname + '/../vanjacloudjs.private')
];
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
            },
        }),
    }, 
  resolver: {
    extraNodeModules
    },
  watchFolders,
};