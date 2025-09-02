// Import necessary Vite plugins and configurations.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// Export the Vite configuration.
export default defineConfig({
  // Configure Vite plugins.
  plugins: [
    // Enable React support in Vite.
    react()
  ],
});