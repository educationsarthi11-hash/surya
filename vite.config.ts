import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, (process as any).cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      // Securely map the API_KEY from the .env file to process.env.API_KEY
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Fallback for other process.env usages if necessary, but avoid exposing everything if possible
      'process.env': JSON.stringify(env)
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      minify: 'esbuild',
      target: 'esnext'
    }
  };
});