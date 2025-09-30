import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
	plugins: [react()],
	// Use project base path for GitHub Pages project site
	base: '/libinguo.io/',
})


