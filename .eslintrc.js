module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  plugins: [
    '@typescript-eslint',
  ],
  extends: [
    'google',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    "comma-dangle": "off",
    "yoda": [
      "error",
      "always"
    ],
    "one-var": "off",
    "require-jsdoc": "off",
    "no-invalid-this": "off",
    "max-len": [2, 120, 4]
  }
};
