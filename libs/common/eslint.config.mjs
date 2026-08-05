import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
    ...baseConfig,
    ...nx.configs['flat/angular'],
    {
        files: ['**/*.ts'],
        rules: {
            '@angular-eslint/directive-selector': 'off',
            '@angular-eslint/component-selector': 'off',
            '@angular-eslint/prefer-standalone': 'off',
            // Newly enabled by typescript-eslint v8 recommended; not enforced pre-upgrade.
            '@typescript-eslint/no-unused-expressions': 'off',
            '@angular-eslint/prefer-inject': 'off',
            '@angular-eslint/no-input-rename': 'off',
            '@angular-eslint/no-output-on-prefix': 'off',
            '@angular-eslint/template/no-negated-async': 'off',
        },
    },
    ...nx.configs['flat/angular-template'],
    {
        files: ['**/*.html'],
        rules: {
            // Newly enabled by angular-eslint v22 template preset; not enforced pre-upgrade.
            '@angular-eslint/template/alt-text': 'off',
            '@angular-eslint/template/click-events-have-key-events': 'off',
            '@angular-eslint/template/interactive-supports-focus': 'off',
            '@angular-eslint/template/label-has-associated-control': 'off',
            '@angular-eslint/component-selector': 'off',
            '@angular-eslint/directive-selector': 'off',
            '@angular-eslint/prefer-inject': 'off',
            '@angular-eslint/no-input-rename': 'off',
            '@angular-eslint/no-output-on-prefix': 'off',
            '@angular-eslint/template/no-negated-async': 'off',
        },
    },
];
