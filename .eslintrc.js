module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'react/no-unstable-nested-components': ['warn', { allowAsProps: true }],
    '@typescript-eslint/no-shadow': 'off',
  },
};
