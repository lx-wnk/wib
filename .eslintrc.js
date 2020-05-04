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
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "guard-for-in": "off",
    "max-len": [2, 120, 4]
  }
};
