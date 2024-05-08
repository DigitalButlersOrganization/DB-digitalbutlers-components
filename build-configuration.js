import fs from 'node:fs';
import path from 'node:path';

const distributionDirection = './dist';
const packageJsonPath = './package.json';

function generateExportsObjectAndIndexJS() {
	const exports = {};

	const components = fs.readdirSync(distributionDirection, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	components.forEach((componentName) => {
		if (componentName === 'assets') return;

		const jsPath = path.posix.join(
			'.', distributionDirection, componentName, 'index.js',
		);
		const cssPath = path.posix.join(
			'.', distributionDirection, componentName, 'index.css',
		);

		exports[`./${componentName}`] = `./${jsPath}`;
		exports[`./${componentName}/index.css`] = `./${cssPath}`;
	});

	return [exports];
}

function updatePackageJsonExports() {
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
	const computedData = generateExportsObjectAndIndexJS();

	const exportsObject = computedData[0];

	packageJson.exports = exportsObject;
	fs.writeFileSync(packageJsonPath, JSON.stringify(
		packageJson, undefined, 2,
	));
}

updatePackageJsonExports();
