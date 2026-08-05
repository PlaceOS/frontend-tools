import baseConfig from '../../eslint.config.mjs';

export default [
    ...baseConfig,
    {
        rules: {},
    },
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@angular-eslint/component-selector': 'off',
            '@angular-eslint/directive-selector': 'off',
            '@angular-eslint/prefer-inject': 'off',
            '@angular-eslint/no-input-rename': 'off',
            '@angular-eslint/no-output-on-prefix': 'off',
            '@angular-eslint/template/no-negated-async': 'off',
        },
    },
];
