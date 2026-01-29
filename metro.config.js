// Learn more https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// --- SVG SUPPORT ---
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');

config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

// --- NATIVEWIND ---
module.exports = withNativeWind(config, { input: './global.css' });
