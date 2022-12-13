// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	build: {
		minify: false,
		lib: {
			entry: fileURLToPath(new URL('src/lib/index.ts', import.meta.url)),
			name: 'digitalbutlers-components',
			fileName: 'digitalbutlers-components',
		},
	},
	server: {
		port: 3000,
	},
});
