import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    cssMinify: true,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        // three.js stays in its own long-cached chunk; it is only fetched when the showroom
        // or a 3D preview is opened (see React.lazy in App.jsx / ProductPanel.jsx).
        manualChunks: { three: ['three'] },
      },
    },
  },
});
