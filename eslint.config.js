/* eslint-env node */
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,

  // Ignorar dist
  {
    ignores: ['dist/*'],
  },

  // Resolver de alias (⬅️ ESTA ES LA CLAVE REAL)
  {
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@', './'],
            ['@assets', './assets'],
            ['@src', './src'],
            ['@ui', './src/ui'],
            ['@modules', './src/modules'],
            ['@store', './src/store'],
            ['@utils', './src/utils'],
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      },
    },
  },

  // Reglas personalizadas
  {
    rules: {
      'react/display-name': 'off',

      'import/no-unresolved': [
        'error',
        {
          ignore: ['\\.svg$'], // Ignora imports de SVG
        },
      ],
    },
  },
]);
