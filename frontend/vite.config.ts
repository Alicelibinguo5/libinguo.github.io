import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
	plugins: [react()],
	// GitHub Pages project path (update when repo name changes)
	base: mode === 'production' ? '/portfolio/' : '/',
}))


