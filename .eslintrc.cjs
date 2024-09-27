module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
        jest: true,
    },
    extends: [
        'plugin:react/recommended',
        'airbnb',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.eslint.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
    },

    plugins: ['react', '@typescript-eslint'],
    rules: {
        'no-unused-vars': 'off',
        'react/jsx-filename-extension': [
            2,
            {
                extensions: ['.js', '.tsx', '.ts', '.jsx'],
            },
        ],
        'react/function-component-definition': 'off',
        indent: ['error', 4],
        'linebreak-style': 'off',
        'import/no-unresolved': 'off',
        'no-shadow': 'off',
        'import/extensions': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-import-module-exports': 'off',
        'consistent-return': 'warn',
        'no-underscore-dangle': 'off',
        camelcase: 'off',
        'prefer-destructuring': 'off',
        'react/jsx-indent': ['error', 4],
        'import/prefer-default-export': 'off',
        'no-mixed-spaces-and-tabs': 'off',
        'no-tabs': 'off',
        'arrow-body-style': 'off',
        'prefer-const': 'off',
        'prefer-arrow-callback': 'off',
        'import/no-mutable-exports': 'off',
        'no-param-reassign': 'off',
        'operator-linebreak': 'off',
        'object-curly-newline': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'prettier/prettier': 'off',
        'react/self-closing-comp': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
    },
};
