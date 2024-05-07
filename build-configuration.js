import fs from 'node:fs';
import path from 'node:path';

const distributionDirection = './dist';
const packageJsonPath = './package.json';
const mainFilePath = path.join(distributionDirection, 'index.js');

function generateExportsObjectAndIndexJS() {
	const exports = {};
	let indexJsContent = '';

	const components = fs.readdirSync(distributionDirection, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	exports['.'] = './dist/index.js';
	components.forEach((componentName) => {
		if (componentName === 'assets') return;

		const functionName = componentName[0].toUpperCase() + componentName.slice(1);
		const jsFilePath = path.posix.join(componentName, 'index.js');

		const jsPath = path.posix.join(
			'.', distributionDirection, componentName, 'index.js',
		);
		const cssPath = path.posix.join(
			'.', distributionDirection, componentName, 'index.css',
		);

		indexJsContent += `export { ${functionName} } from './${jsFilePath}';\n`;
		exports[`./${componentName}`] = `./${jsPath}`;
		exports[`./${componentName}/index.css`] = `./${cssPath}`;
	});

	return [exports, indexJsContent];
}

function updatePackageJsonExports() {
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	const computedData = generateExportsObjectAndIndexJS();

	const exportsObject = computedData[0];
	const indexJsContent = computedData[1];

	packageJson.exports = exportsObject;
	fs.writeFileSync(packageJsonPath, JSON.stringify(
		packageJson, undefined, 2,
	));
	fs.writeFileSync(mainFilePath, indexJsContent);
}

updatePackageJsonExports();
