/**
 * @see https://github.com/trivago/prettier-plugin-sort-imports
 * @type {import("@trivago/prettier-plugin-sort-imports").PluginConfig}
 */
const sortImportsConfig = {
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrder: [
    // Place React itself at the top.
    "react",
    // Framework-related imports.
    "^(\\@)?next/.*$",
    // node_modules
    "<THIRD_PARTY_MODULES>",
    // Local imports.
    "^(\\@)(app|components|shared|lib)/.*$",
    // Relative imports that are NOT styles.
    "^(\\.|\\.\\.)/(.(?!.(css|scss)))*$",
    // CSS styles
    "\\.(css|scss)$",
  ],
};

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
export default {
  printWidth: 79,
  tabWidth: 4,
  plugins: [
    // For consistent, organized imports at the top of every file.
    "@trivago/prettier-plugin-sort-imports",
    // For consistent, organized TailwindCSS attributes.
    "prettier-plugin-tailwindcss",
  ],
  ...sortImportsConfig,
};
