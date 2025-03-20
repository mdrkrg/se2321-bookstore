/// <reference types="vite/client" />

import type { UserConfig } from 'vite'
import path from 'node:path'
import { TanStackRouterVite } from '@tanstack/router-vite-plugin'

import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite(),
    UnoCSS(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@lib': path.resolve(__dirname, 'src', 'lib'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: import.meta.env.VITE_PUBLIC_API_BASE,
        changeOrigin: true,
        secure: false,
      },
    },
  },
} satisfies UserConfig)
