module.exports = function (api) {
  api.cache(true);

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      'react-native-worklets/plugin',
      [
        'module-resolver',
        {
          alias: {
            '@': './',
            '@assets': './assets',
            '@src': './src',
            '@ui': './src/ui',
            '@modules': './src/modules',
            '@store': './src/store',
            '@utils': './src/utils',
          },
        },
      ],
    ],
  };
};
