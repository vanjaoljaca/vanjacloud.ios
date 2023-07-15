/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('expo/metro-config');

const path = require('path');
const extraNodeModules = {
    'vanjacloud.shared.js': path.resolve(__dirname + '/../vanjacloud.shared.js'),
};

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
    transform: {
        experimentalImportSupport: false, inlineRequires: true
    }
});
config.resolver.extraNodeModules = {
    'vanjacloud.shared.js': path.resolve(__dirname + '/../vanjacloud.shared.js')
};

config.watchFolders = [path.resolve(__dirname + '/../vanjacloud.shared.js')];

module.exports = config;