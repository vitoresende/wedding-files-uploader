module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "google",
  ],
  rules: {
    "quotes": ["error", "double"],
    "arrow-parens": ["error", "as-needed"],
    "max-len": "off", // Disable the max-len rule
  },
  parserOptions: {
    ecmaVersion: 2017,
  },
};
