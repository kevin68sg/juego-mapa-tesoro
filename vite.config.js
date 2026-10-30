import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base './' hace que la web funcione en cualquier hosting (Netlify, GitHub Pages...)
export default defineConfig({ plugins: [react()], base: './' })
