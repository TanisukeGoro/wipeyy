module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'eslint:recommended', 
    'plugin:vue/recommended', 
    'plugin:prettier/recommended', 
    'prettier/vue'
  ],
  plugins: ['vue'],
  rules: {
    semi: ['error', 'never'],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-self-closing': [ 'error', { html: { void: 'always' }} ],
    'vue/html-closing-bracket-spacing': 'off',
    'prettier/prettier': ['error', { semi: false }]
  },
  globals: {
    'chrome': true
  }
}
