import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiKey = env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || ''

  if (mode === 'lib') {
    return {
      plugins: [react()],
      build: {
        outDir: 'dist',
        emptyOutDir: false,
        lib: {
          entry: path.resolve(import.meta.dirname, 'src/lib.ts'),
          name: 'Embidly',
          fileName: (format) => (format === 'es' ? 'embidly.js' : 'embidly.umd.cjs'),
          formats: ['es', 'cjs'],
        },
        rollupOptions: {
          external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            'react/jsx-dev-runtime',
          ],
          output: {
            banner: '"use client";\n',
            globals: {
              react: 'React',
              'react-dom': 'ReactDOM',
              'react/jsx-runtime': 'jsxRuntime',
              'react/jsx-dev-runtime': 'jsxRuntime',
            },
            assetFileNames: (assetInfo) => {
              if (assetInfo.name?.endsWith('.css')) return 'style.css'
              return assetInfo.name || ''
            },
          },
        },
      },
    }
  }

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey),
      'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
    },
  }
})
