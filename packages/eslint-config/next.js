import { FlatCompat } from '@eslint/eslintrc';
import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import typeScriptESLintParser from '@typescript-eslint/parser';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import turboPlugin from 'eslint-plugin-turbo';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default tseslint.config(
  {
    languageOptions: {
      parser: typeScriptESLintParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      ...compat.extends('next/core-web-vitals'),
    ],
    plugins: {
      import: importPlugin,
      turbo: turboPlugin,
    },
    rules: {
      // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'parent',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin', 'external', 'object', 'type'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],

      // https://eslint.org/docs/latest/rules/no-unused-vars
      'no-unused-vars': 'off',

      // https://eslint.org/docs/latest/rules/no-console
      'no-console': [
        'warn',
        {
          allow: ['info', 'warn', 'error'],
        },
      ],

      // https://eslint.org/docs/latest/rules/require-await
      'require-await': 'off',

      // https://github.com/vercel/turborepo/blob/main/packages/eslint-plugin-turbo/docs/rules/no-undeclared-env-vars.md
      'turbo/no-undeclared-env-vars': 'warn',

      '@next/next/no-img-element': 'off',

      // https://typescript-eslint.io/rules/consistent-indexed-object-style/
      '@typescript-eslint/consistent-indexed-object-style': 'off',

      // https://typescript-eslint.io/rules/consistent-type-definitions/
      '@typescript-eslint/consistent-type-definitions': 'off',

      // https://typescript-eslint.io/rules/no-floating-promises/
      '@typescript-eslint/no-floating-promises': ['error', { ignoreIIFE: true }],

      // https://typescript-eslint.io/rules/no-misused-promises/
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],

      // https://typescript-eslint.io/rules/no-unused-vars/
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],

      // https://typescript-eslint.io/rules/prefer-find/
      '@typescript-eslint/prefer-find': 'error',

      // https://typescript-eslint.io/rules/restrict-template-expressions/
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowAny: false,
          allowArray: false,
          allowBoolean: false,
          allowNever: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false,
        },
      ],

      // https://typescript-eslint.io/rules/return-await/
      '@typescript-eslint/return-await': ['error', 'always'],

      // https://typescript-eslint.io/rules/require-await/
      '@typescript-eslint/require-await': 'error',
    },
  },

  eslintConfigPrettier,
);
