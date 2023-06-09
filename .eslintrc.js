module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/recommended",
    "eslint:recommended"
    // "prettier/vue",
    // "plugin:prettier/recommended"
  ],
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
    "vue/component-name-in-template-casing": ["error", "PascalCase"],
    "import/no-unresolved": "off",
    "no-unused-expressions": ["error", { allowTernary: true }],
    "no-param-reassign": 0,
    "quote-props": ["error", "consistent"],
    "vue/html-self-closing": "off",
    "vue/max-attributes-per-line": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/multiline-html-element-content-newline": "off",
    "vue/html-indent": "off",
    // vue rules
    "vue/order-in-components": [
      "error",
      {
        order: [
          "el",
          "name",
          "parent",
          "functional",
          ["delimiters", "comments"],
          ["components", "directives", "filters"],
          "extends",
          "mixins",
          "inheritAttrs",
          "model",
          ["props", "propsData"],
          "computed",
          "data",
          "watch",
          "methods",
          "LIFECYCLE_HOOKS",
          ["template", "render"],
          "renderError"
        ]
      }
    ]
    // "prettier/prettier": ["error", { printWidth: 100 }]
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  overrides: [
    {
      files: [
        "**/__tests__/*.{j,t}s?(x)",
        "**/tests/unit/**/*.spec.{j,t}s?(x)"
      ],
      env: {
        jest: true
      }
    }
  ]
};
