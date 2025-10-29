import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        outDir: 'dist',
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks: {
              // Vendor libraries - core React dependencies
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              // Chart and visualization libraries - lazy loaded on Dashboard
              'vendor-charts': ['recharts'],
              // AI and API libraries - large dependencies (Cohere, Google GenAI, AWS SDK)
              // These are loaded on-demand and acceptable to be >500kB
              'vendor-ai': ['cohere-ai', '@google/genai'],
            },
          },
        },
      },
      plugins: [react()],
      define: {
        // Support both old and new environment variable names for backward compatibility
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        // New provider-agnostic configuration
        'process.env.AI_PROVIDER': JSON.stringify(env.AI_PROVIDER || 'gemini'),
        'process.env.GROQ_API_KEY': JSON.stringify(env.GROQ_API_KEY || ''),
        'process.env.COHERE_API_KEY': JSON.stringify(env.COHERE_API_KEY || ''),
        // Backend API URL configuration
        'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:3001'),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
