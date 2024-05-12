import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

import { fileURLToPath } from 'node:url';
import typescript from '@rollup/plugin-typescript';


function findEntries(startPath) {
	const entries = {};
	const files = fs.readdirSync(startPath);

	files.forEach((file) => {
		const directoryPath = path.join(startPath, file);
		const stat = fs.lstatSync(directoryPath);

		if (stat.isDirectory()) {
			const possibleIndexFiles = ['index.js', 'index.ts'];
			for (let index = 0; index < possibleIndexFiles.length; index += 1) {
				const indexFile = possibleIndexFiles[index];
				const indexPath = path.join(directoryPath, indexFile);
				if (fs.existsSync(indexPath)) {
					const componentName = path.basename(file);
					entries[componentName] = fileURLToPath(new URL(indexPath, import.meta.url));
					break;
				}
			}
		}
	});

	return entries;
}

const entries = findEntries('./src/lib/components');

export default defineConfig({
	plugins: [
		typescript({}),
	],
	build: {
		logLevel: 'info',
		minify: false,
		cssCodeSplit: true,
		lib: {
			entry: entries,
			name: 'digitalbutlers-components',
			fileName: 'digitalbutlers-components',
			formats: ['es'],
		},
		rollupOptions: {
			output: {
				entryFileNames: '[name]/index.js',
				chunkFileNames: 'assets/[hash].js',
				assetFileNames: (chunkInfo) => {
					const arrayOfChunks = chunkInfo.name.split('/');
					const currentFileExtension = arrayOfChunks[arrayOfChunks.length - 1].split('.')[1];

					if (chunkInfo.name && chunkInfo.type === 'asset' && currentFileExtension === 'css') {
						const currentComponentName = arrayOfChunks[arrayOfChunks.length - 2];
						return `${currentComponentName}/index.css`;
					}
					return 'assets/[name].[ext]';
				},
			},
		},
	},
	server: {
		port: 3000,
	},
});
