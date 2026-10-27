import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'build/**',
      'src/serviceWorker.ts',
    ],
  },
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  reactHooks.configs['recommended-latest'],
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: {
      import: importPlugin,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: {
        version: 'detect',
      },
      // Treat absolute app imports as "internal" (same idea as AV's @app-velocity/)
      'import/internal-regex': '^(src/|smartbox-)',
    },
    rules: {
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      // Prefer `src/...` over `../../../...` (sibling `./` still ok)
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', '../**'],
              message:
                "Use absolute `src/...` (or smartbox-*) imports instead of relative parent paths.",
            },
          ],
        },
      ],
      'import/order': [
        'error',
        {
          // no separate `type` group — autofix can't move value imports past top-of-file `import type`
          groups: [
            'builtin',
            'external',
            'internal',
            ['parent', 'sibling', 'index'],
            'object',
            'unknown',
          ],
          pathGroups: [
            {
              pattern: 'src/**',
              group: 'internal',
            },
            {
              pattern: 'smartbox-{tables,types}',
              group: 'internal',
            },
            {
              pattern: 'src/**/*.{css,scss}',
              group: 'object',
              position: 'after',
            },
            {
              pattern: '{.,..}/**/*.{css,scss}',
              group: 'object',
              position: 'after',
            },
            {
              pattern: '**/*.{css,scss}',
              group: 'object',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: [],
          'newlines-between': 'always-and-inside-groups',
          distinctGroup: false,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      'array-callback-return': 'error',
      'no-nested-ternary': 'error',
      'no-unneeded-ternary': 'error',
      'no-else-return': 'error',
      'no-lonely-if': 'error',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'react/no-array-index-key': 'warn',
      'react/jsx-curly-brace-presence': [
        'error',
        {
          props: 'never',
          children: 'never',
          propElementValues: 'always',
        },
      ],
    },
  },
  eslintConfigPrettier,
]);
