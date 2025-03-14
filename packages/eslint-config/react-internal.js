import eslint from '@eslint/js';
import eslintConfigPrettier from "eslint-config-prettier"
import reactPlugin from "eslint-plugin-react"
import reactHooks from 'eslint-plugin-react-hooks';
import typeScriptESLintParser from '@typescript-eslint/parser';

import tseslint from "typescript-eslint"

import {fileURLToPath} from "url";
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  {
    ...
      reactPlugin.configs.flat.recommended,
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
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
    },
  },

  eslintConfigPrettier,
);
