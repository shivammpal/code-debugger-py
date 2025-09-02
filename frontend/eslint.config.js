// Import necessary ESLint plugins and configurations.
import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';

// --- ESLint Configuration ---
export default defineConfig([
  // --- Global Ignores ---
  globalIgnores(['dist']),
  {
    // --- File Targeting ---
    files: ['**/*.{js,jsx}'],
    
    // --- Extended Configurations ---
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    
    // --- Language Options ---
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    
    // --- Rules ---
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
]);