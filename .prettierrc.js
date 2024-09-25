module.exports = {
    printWidth: 79,
    tabWidth: 4,
    trailingComma: "all",
    semi: true,
    importOrder: [
        "react", // React itself
        "^(\\@)?next/.*$",
        "<THIRD_PARTY_MODULES>", // node_modules
        "^(cplibrary|cpicons|cputil|cpclient|@cpclient|cpshots).*$", // Workspace packages
        "components/.*$", // React Components
        "^(constants|data|hooks|util|utils)/.*$", // Various helpers
        "^(\\@)/.*$", // Any local imports that AREN'T styles.
        "^(\\.|\\.\\.)/(.(?!.(css|scss)))*$", // Any local imports that AREN'T styles.
        "\\.(css|scss)$", // Styles
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    plugins: [
        "prettier-plugin-tailwindcss",
        "@trivago/prettier-plugin-sort-imports",
    ],
};
