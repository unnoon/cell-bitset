module.exports = {
	globals: {
		'ts-jest': {
			tsconfig: 'tsconfig.test.json',
		},
	},
	preset: 'ts-jest',
	testEnvironment: 'node',
	testRegex: '(/__tests__/.*|(\\.|/)(unit-test))\\.[jt]sx?$',
};
