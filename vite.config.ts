import { svelte } from '@sveltejs/vite-plugin-svelte';
import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte(), cssInjectedByJsPlugin(), legacy({
		targets: 'chrome>=60'
	})],
	build: {
		rollupOptions: {
			output: {
				format: 'commonjs',
				entryFileNames: 'app.js',
				manualChunks: undefined
			}
		}
	}
});
