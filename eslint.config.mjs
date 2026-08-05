import nx from '@nx/eslint-plugin';

export default [
    ...nx.configs['flat/base'],
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        rules: {
            '@nx/enforce-module-boundaries': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            'no-prototype-builtins': 'off',
            'prefer-const': 'off',
            'no-cond-assign': 'off',
            'no-var': 'off',
            'no-empty': 'off',
        },
    },
    ...nx.configs['flat/typescript'],
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/no-inferrable-types': 'off',
            'no-prototype-builtins': 'off',
            'prefer-const': 'off',
            'no-cond-assign': 'off',
            'no-var': 'off',
            'no-empty': 'off',
        },
    },
    ...nx.configs['flat/javascript'],
];
