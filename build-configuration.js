import fs from 'node:fs';
import path from 'node:path';

const distributionDirection = './dist';
const packageJsonPath = './package.json';
const mainFilePath = path.join(distributionDirection, 'index.js');


function generateExportsObjectAndIndexJS() {
	const exports = { '.': './index.js' }; // сразу добавил файл index.js в корень dist
	let indexJsContent = '';
	const components = fs.readdirSync(distributionDirection, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	components.forEach((componentName) => {
		if (componentName === 'assets') return;

		const className = componentName.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join('');
		const jsFilePath = path.posix.join(componentName, 'index.js');
		const jsPath = path.posix.join(
			distributionDirection, componentName, 'index.js',
		);
		const cssFilePath = path.posix.join(
			distributionDirection, componentName, 'index.css',
		);

		indexJsContent += `export { ${className} } from './${jsFilePath}';\n`;
		exports[`./${componentName}`] = `./${jsPath}`;
		if (fs.existsSync(cssFilePath)) {
			exports[`./${componentName}/index.css`] = `./${cssFilePath}`;
		}
	});

	return [exports, indexJsContent];
}

function updatePackageJsonExports() {
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	const [exportsObject, indexJsContent] = generateExportsObjectAndIndexJS();

	packageJson.exports = exportsObject;
	fs.writeFileSync(packageJsonPath, JSON.stringify(
		packageJson, undefined, 2,
	));
	fs.writeFileSync(mainFilePath, indexJsContent);
}

updatePackageJsonExports();
