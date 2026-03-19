import js from '@eslint/js';
import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const SIMPLE_IMPORT_SORT_GROUPS = [
  ['^\\u0000'],
  ['^node:', '^(?!@(?:domain|usecase|infrastructure)/)@?\\w'],
  ['^@(domain|usecase|infrastructure)/'],
  ['^\\.'],
  ['^.*\\u0000$'],
];

const DOMAIN_ALLOWED_IMPORTS_REGEX = '^(?!\\.|@domain/|@infrastructure/|node:).+';
const USE_CASE_ALLOWED_IMPORTS_REGEX =
  '^(?!\\.|@domain/|@usecase/|@infrastructure/|node:).+';

export default [
  {
    ignores: [
      '**/.eslintrc.js',
      'scripts/*',
      '**/.dependency-cruiser.js',
      '**/jestTestDescriptionExtractor.js',
      'src/app/infrastructure/prisma/seeds/**/*',
      'dist/**/*',
      'src/app/infrastructure/prisma/generated/**/*',
    ],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...typescriptEslintPlugin.configs.recommended.rules,
      'simple-import-sort/imports': [
        'error',
        {
          groups: SIMPLE_IMPORT_SORT_GROUPS,
        },
      ],
      'no-console': 'error',
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "TSQualifiedName[left.name='z'][right.name='infer'], MemberExpression[object.name='z'][property.name='infer']",
          message:
            'Usage of z.infer is not allowed. Use explicit interfaces instead for compatibility with Compodoc and easier type export.',
        },
      ],
    },
  },
  {
    files: ['src/app/infrastructure/common/loggers/rfLogger.service.ts'],
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: ['src/app/domain/**/!(*.spec).ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: DOMAIN_ALLOWED_IMPORTS_REGEX,
              message: 'External imports are not allowed in the domain layer.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/app/useCase/**/!(*.spec).ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              regex: USE_CASE_ALLOWED_IMPORTS_REGEX,
              message: 'External imports are not allowed in the useCase layer.',
            },
          ],
        },
      ],
    },
  },
];
