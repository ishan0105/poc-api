const tsParser = require('@typescript-eslint/parser');
const pluginJs = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');

const eslintrc = require('@eslint/eslintrc');
const utility = require('@eslint/compat');

const compat = new eslintrc.FlatCompat();

module.exports = [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  ...utility.fixupConfigRules(compat.extends('airbnb-base')),
  {
    files: ['**/*.ts', '**/*.js'],

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: 'module' // Allows for the use of imports,
      },
      globals: {
        Buffer: true,
        File: true,
        NodeJS: true,
        describe: 'readonly',
        it: 'readonly',
        before: 'readonly',
        after: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        Express: true,
        AWS: true
      }
    },

    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts']
      },

      'import/resolver': {
        node: {
          extensions: ['.js', '.ts']
        }
      }
    },

    rules: {
      'max-len': 'off',
      'no-tabs': 'off',
      'max-nested-callbacks': ['warn', 5],
      'max-depth': ['error', 8],
      'linebreak-style': 'off',
      'comma-dangle': 'off',
      'arrow-parens': 'off',
      camelcase: 'off',
      'arrow-body-style': ['error', 'always'],
      'function-paren-newline': 'off',
      'consistent-return': 'off',
      'no-underscore-dangle': 'off',
      'object-shorthand': 'off',
      'no-param-reassign': 'off',
      'import/extensions': 'off',
      radix: 'off',
      'class-methods-use-this': 'off',
      'import/prefer-default-export': 'off',
      '@typescript-eslint/camelcase': 'off',
      'no-shadow': 'off',
      'no-await-in-loop': 'off',
      'no-empty': 'off',
      'no-case-declarations': 'off',
      'object-curly-newline': 'off',
      'no-unused-vars': 'off',
      'operator-linebreak': 'off',
      quotes: 'off',
      curly: 'off',
      'quote-props': 'off',
      'import/no-unresolved': [
        2,
        {
          caseSensitive: false
        }
      ]
    }
  },
  {
    ignores: [
      'lib/*',
      'node_modules/*',
      '*.config.js',
      '.eslintrc.js',
      'coverage/*'
    ]
  }
];
