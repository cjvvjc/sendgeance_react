module.exports = {
  "extends": [
    "airbnb",
    "prettier",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/errors",
    "plugin:import/warnings"
  ],
  "parser": "@babel/eslint-parser",
  "parserOptions": {
    "requireConfigFile": false,
    "babelOptions": {
      "presets": ["@babel/preset-env", "@babel/preset-react"]
    },
    // Merged parserOptions
    "ecmaVersion": 8,
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": [
    "react",
    "jsx-a11y",
    "import",
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "no-underscore-dangle": "off",
    "no-await-in-loop": "off",
    "react/sort-comp": "off",
    "class-methods-use-this": "off",
    "import/no-extraneous-dependencies": ["error", {"devDependencies": ["**/deploy.js", "**/build.js", "**/develop.js", "**/remove.js", "**/*.test.js"]}],
    "no-console": ["error", { allow: ["warn", "info", "error", "assert"] }],
    "jsx-a11y/anchor-is-valid": "off",
    "jsx-a11y/mouse-events-have-key-events": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "jsx-a11y/interactive-supports-focus": "off",
    "jsx-a11y/label-has-associated-control": [ 2, {
      "labelComponents": ["CustomInputLabel"],
      "labelAttributes": ["label"],
      "controlComponents": ["Dropbox", "Checkbox"],
      "depth": 3,
    }],
    "jsx-a11y/label-has-for": "off"
  },
  "env": {
    "browser": true,
    "node": true,
    "jest": true
  }
}
