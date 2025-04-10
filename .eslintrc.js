module.exports = {
    root: true,
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:react-native/all',
      'plugin:@typescript-eslint/recommended',
      'prettier'
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['react', 'react-native', '@typescript-eslint', 'prettier'],
    rules: {
      'prettier/prettier': 'error',
      'react/prop-types': 'off',
      'react-native/no-inline-styles': 'warn',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
  