import { svelte } from '@sveltejs/vite-plugin-svelte';
import legacy from '@vitejs/plugin-legacy';
import { defineConfig } from 'vite';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

import Package from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [svelte(), cssInjectedByJsPlugin(), legacy({
		targets: 'chrome>=60'
	})],
	define: {
		__APP_VERSION__: `"v${Package.version}"`
	},
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
