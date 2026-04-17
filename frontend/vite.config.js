import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Redesigned for Premium Institutional Control Hub
export default defineConfig({
  plugins: [react()],
  root: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  }
});
