module.exports = {
	parser: '@typescript-eslint/parser',
	plugins: [
		'@typescript-eslint',
		'jest',
		'jsdoc',
	],
	globals: {
		BigInt: true,
		'jest/globals': true,
	},
	env: {},
	extends: [
		'eslint:recommended',
		'airbnb-base',
		'plugin:@typescript-eslint/recommended',
		'plugin:jsdoc/recommended',
		'plugin:jest/recommended',
		'plugin:jest/style',
	],
	settings: {
		'import/resolver': {
			node: {
				extensions: [
					'.ts',
				],
			},
		},
	},
	rules: {
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'brace-style': [
			'error',
			'stroustrup',
			{
				allowSingleLine: false,
			},
		],
		indent: [
			'error',
			'tab',
		],
		'func-names': ['error', 'always', { generators: 'as-needed' }],
		'jsdoc/require-param-type': 'off',
		'jsdoc/require-returns-type': 'off',
		'lines-between-class-members': 'off',
		'no-bitwise': 'off',
		'no-dupe-class-members': 'off',
		'import/extensions': 'off',
		'import/no-extraneous-dependencies': [
			'error',
			{
				devDependencies: [
					'src/**/*.test.ts',
				],
			},
		],
		'no-multi-spaces': 'off',
		'no-plusplus': 'off',
		'no-tabs': 'off',
		'no-underscore-dangle': 'off',
		'max-len': [
			'warn',
			{
				code: 180,
			},
		],
	},
};
