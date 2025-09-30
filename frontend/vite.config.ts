import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
	plugins: [react()],
	// Update to the GitHub Pages project path after repo rename
	base: mode === 'production' ? '/portforlio/' : '/',
}))


