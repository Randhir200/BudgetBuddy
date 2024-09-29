import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Adjust if deploying to a subfolder
  build: {
    outDir: 'dist',
  },
});
