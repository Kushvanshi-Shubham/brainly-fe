import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    }), 
    tailwindcss()
  ],
  build: {
    // Code splitting optimization
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React libraries
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Router
          if (id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          // UI/Animation libraries
          if (id.includes('node_modules/framer-motion')) {
            return 'ui-vendor';
          }
          if (id.includes('node_modules/react-hot-toast')) {
            return 'ui-vendor';
          }
          // DnD Kit for drag-drop
          if (id.includes('node_modules/@dnd-kit')) {
            return 'dnd-vendor';
          }
          // HTTP client
          if (id.includes('node_modules/axios')) {
            return 'axios';
          }
          // Image cropping
          if (id.includes('node_modules/react-easy-crop')) {
            return 'image-vendor';
          }
        },
        // Optimize chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 600,
    // Use esbuild for faster minification
    minify: 'esbuild',
    // Target modern browsers for smaller output
    target: 'es2020',
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Source maps for production debugging (optional)
    sourcemap: false,
  },
  // Performance optimization
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom', 
      'axios', 
      'framer-motion',
      'react-hot-toast',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
    ],
    // Force re-optimization on config change
    force: false,
  },
  // Server optimization
  server: {
    // Enable HMR
    hmr: true,
    // Open browser on start
    open: false,
  },
  // Preview server config
  preview: {
    port: 4173,
    strictPort: false,
  },
})

