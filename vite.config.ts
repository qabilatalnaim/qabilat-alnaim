import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'

const isProd = process.env.NODE_ENV === 'production' || process.env.BUILD_MODE === 'prod'
export default defineConfig({
  plugins: [
    react(),
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: 'data-matrix',
      includeProps: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        // Manual chunks لتقسيم bundle بشكل أفضل
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'components-vendor': [
            './src/components/SEO.tsx',
            './src/components/Footer.tsx',
            './src/components/Breadcrumbs.tsx',
            './src/components/OptimizedImage.tsx',
          ],
        },
      },
    },
    // تحسين حجم الـ bundle
    chunkSizeWarningLimit: 800,
  },
})