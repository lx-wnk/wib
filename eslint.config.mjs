import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import { includeIgnoreFile } from '@eslint/compat';
import { fileURLToPath } from 'node:url';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

const gitignorePath = fileURLToPath(new URL('.gitignore', import.meta.url));

export default defineConfig([
    includeIgnoreFile(gitignorePath, 'Imported .gitignore patterns'),
    globalIgnores(['node_modules', 'src/orm/migrations', '/dist']),

    { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], plugins: { js }, extends: ['js/recommended'] },
    { files: ['**/*.{js,mjs,cjs,ts,mts,cts}'], languageOptions: { globals: globals.node } },
    tseslint.configs.recommended,
    prettierConfig,
    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
        plugins: {
            prettier: prettierPlugin
        },
        rules: {
            // Apply Prettier as an ESLint rule
            'prettier/prettier': [
                'error',
                {
                    printWidth: 120,
                    tabWidth: 4,
                    useTabs: false,
                    semi: true,
                    singleQuote: true,
                    quoteProps: 'as-needed',
                    trailingComma: 'none',
                    bracketSpacing: true,
                    arrowParens: 'always',
                    endOfLine: 'lf'
                }
            ],
            // TypeScript-specific rules
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unused-vars': 'error',
            '@typescript-eslint/no-require-imports': 'error',
            // Indentation rules
            indent: ['error', 4, { ignoredNodes: ['PropertyDefinition[decorators]', 'ClassProperty[decorators]'] }],
            // Other rules
            quotes: ['error', 'single', { avoidEscape: true }],
            semi: ['error', 'always'],
            'no-unused-vars': 'error',
            'max-len': ['error', { code: 120 }],
            'linebreak-style': ['error', 'unix']
        }
    }
]);
