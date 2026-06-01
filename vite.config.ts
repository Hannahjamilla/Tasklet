import { defineConfig } from 'vite'
import react_plugin from '@vitejs/plugin-react'
import tailwind_plugin from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react_plugin(),
    tailwind_plugin(),
  ],
})
