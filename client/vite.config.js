import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
	plugins: [react({ include: /src\/.*\.js$/ })],
	esbuild: { loader: 'jsx', include: /src\/.*\.js$/, exclude: [] },
	server: { port: 5173, proxy: { '/api': 'http://localhost:5000' } }
});