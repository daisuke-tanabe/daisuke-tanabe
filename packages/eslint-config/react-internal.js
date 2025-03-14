import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import typeScriptESLintParser from '@typescript-eslint/parser';

import tseslint from 'typescript-eslint';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import turboPlugin from "eslint-plugin-turbo";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  {
    ...reactPlugin.configs.flat.recommended,
    languageOptions: {
      ...reactPlugin.configs.flat.recommended.languageOptions,
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
    ],
  },
  {
    plugins: {
      'react-hooks': reactHooks,
      turbo: turboPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // https://www.npmjs.com/package/eslint-plugin-react-hooks
      ...reactHooks.configs.recommended.rules,

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
          pathGroupsExcludedImportTypes: [
            'builtin',
            'external',
            'object',
            'type',
          ],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],

      // https://www.npmjs.com/package/eslint-plugin-react
      'react/prop-types': 'off',
    },
  },

  eslintConfigPrettier,
);
