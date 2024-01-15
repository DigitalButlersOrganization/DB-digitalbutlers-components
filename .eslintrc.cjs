module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		'airbnb-base',
		'plugin:unicorn/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	ignorePatterns: ['dist/**/*.*'],
	rules: {
		'linebreak-style': 0,
		'no-param-reassign': 0,
		'no-multiple-empty-lines': [1, { max: 2 }],
		indent: [1, 'tab'],
		'no-tabs': [1, { allowIndentationTabs: true }],
		'max-len': [1, {
			code: 120,
			ignoreUrls: true,
			ignoreStrings: true,
			ignoreTrailingComments: true,
			ignoreTemplateLiterals: true,
		}],
		'function-paren-newline': [1, { minItems: 3 }],
		'import/extensions': 0,
		'import/prefer-default-export': 0,
		'unicorn/no-for-loop': 0,
		'unicorn/no-array-for-each': 0,
		'unicorn/prefer-spread': 0,
		'lines-between-class-members': [1, 'always', { exceptAfterSingleLine: true }],
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx'],
			},
		},
	},
};
