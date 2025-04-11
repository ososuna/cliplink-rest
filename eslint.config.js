import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'prettier': prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...prettierConfig.rules,
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**', '*.js', '!jest.config.js'],
  },
]; 