module.exports = {
  'env': {
    'browser': true,
    'es6': true,
  },
  'extends': [
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'rules': {
    'comma-dangle': 'off',
    'yoda': ["error", "always"],
    'one-var': "off",
    'no-invalid-this': "off",
    'max-len': [2, 120, 4]
  },
};
