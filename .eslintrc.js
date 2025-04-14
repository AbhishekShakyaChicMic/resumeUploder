module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
    },
    extends: 'airbnb-base',
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        // customize rules here
        'no-console': 'off',
        'comma-dangle': ['error', 'never'],
        'quotes': ['error', 'single']
    },
};
