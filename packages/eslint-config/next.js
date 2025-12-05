import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import turboPlugin from 'eslint-plugin-turbo';

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
      turbo: turboPlugin,
    },
    rules: {
      // https://github.com/lydell/eslint-plugin-simple-import-sort
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md
      'import/no-unresolved': 'error',

      // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unused-modules.md
      'import/no-unused-modules': 'warn',

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

      // https://typescript-eslint.io/rules/naming-convention/
      '@typescript-eslint/naming-convention': [
        'error',
        {
          // class, enum, interface, typeAlias, typeParameter
          // https://typescript-eslint.io/rules/naming-convention/#group-selectors
          selector: ['typeLike'],
          format: ['PascalCase'],
        },
        // classMethod, objectLiteralMethod, typeMethod
        // https://typescript-eslint.io/rules/naming-convention/#group-selectors
        {
          selector: ['method'],
          format: ['camelCase'],
        },
        // 関数パラメーターは先頭のアンダースコアを許容する
        {
          selector: ['parameter'],
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        // 関数コンポーネントが存在するのでキャメルケースとパスカルケースの両方を許可する
        {
          selector: ['function', 'variable'],
          format: ['camelCase', 'PascalCase'],
        },
        {
          selector: ['variable'],
          types: ['boolean'],
          prefix: ['is', 'has', 'exists', 'should', 'can'],
          format: ['PascalCase'],
        },
      ],

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
  prettier,
]);
