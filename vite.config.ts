import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],

    // ✅ GitHub Pages용 base (항상 동일하게)
    base: "/test_myReactProject/",

    server: {
      port: 3000,
      host: true,
    },



    resolve: {
      alias: {},
    },
  };
});
