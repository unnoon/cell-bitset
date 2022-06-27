// The typescript projects for the @typescript-eslint/parser & eslint-import-resolver-typescript
const projects = ["./tsconfig.json", "./packages/*/tsconfig.json"];

// TODO see what is necessary this is copy pasted from monolith

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: projects,
  },
  plugins: ["@typescript-eslint", "import", "jest", "jsdoc"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-base",
    "plugin:jsdoc/recommended",
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".js", ".jsx", ".ts", ".tsx"],
    },
    "import/resolver": {
      node: {},
      typescript: {
        project: projects,
        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
      },
    },
    "import/ignore": ["node_modules", "dist"],
    jsdoc: {
      mode: "typescript",
    },
  },
  env: {
    es6: true,
    "jest/globals": true,
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          2,
          {
            args: "none",
          },
        ],
        "import/extensions": "off",
        "jsdoc/require-param-type": "off",
        "jsdoc/require-returns-type": "off",
      },
    },
  ],
  rules: {
    indent: ["error", "tab"],
    "max-len": ["warn", { code: 120 }],
    "no-bitwise": "off",
    "no-plusplus": "off",
    "no-restricted-syntax": "off", // TODO could use refinement
    "no-tabs": "off",
    "no-underscore-dangle": "off",
    "no-use-before-define": ["error", { functions: false, classes: false }],
    "object-curly-newline": ["error", { consistent: true }],
    radix: "off",
    semi: ["error", "never"],
    "jsdoc/require-jsdoc": "off",
  },
};
