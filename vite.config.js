// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import typescript from '@rollup/plugin-typescript';
// import path from 'node:path';

const entries = {
	Tabs: fileURLToPath(new URL('src/lib/components/tabs/index.ts', import.meta.url)),
	Accordions: fileURLToPath(new URL('src/lib/components/Accordions/index.js', import.meta.url)),
};

export default defineConfig({
	plugins: [
		typescript({}),
	],
	build: {
		minify: false,
		lib: {
			// entry: fileURLToPath(new URL('src/lib/index.ts', import.meta.url)),
			entry: entries,
			name: 'digitalbutlers-components',
			fileName: 'digitalbutlers-components',
		},
		rollupOptions: {
			// Указываем Rollup обрабатывать каждый компонент как отдельный входной файл
			// input: entries,
			output: {
				entryFileNames: '[name]/index.js',
				chunkFileNames: '[name]/[hash].js',
				assetFileNames: '[name]/[hash].[ext]',
			},
		},
	},
	server: {
		port: 3000,
	},
});
