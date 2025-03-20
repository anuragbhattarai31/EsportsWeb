import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Match the actual folder name casing
      '@': path.resolve(__dirname, './src'),
      '@/Components': path.resolve(__dirname, './src/Components'),
      '@/lib': path.resolve(__dirname, './src/lib')
    }
  }
})