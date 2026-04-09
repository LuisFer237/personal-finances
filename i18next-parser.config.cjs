module.exports = {
    input: [
        "src/app/**/*.{js,jsx,ts,tsx}",
        "src/components/**/*.{js,jsx,ts,tsx}",
        "src/lib/**/*.{js,jsx,ts,tsx}",
        "src/hooks/**/*.{js,jsx,ts,tsx}",
    ],
    output: "public/locales/$LOCALE/$NAMESPACE.json",
    locales: ["en", "es"],
    defaultNamespace: "common",
    createOldCatalogs: false,
    keepRemoved: false,
    keySeparator: false,
    namespaceSeparator: false,
    lexers: {
        js: ["JavascriptLexer"],
        jsx: ["JsxLexer"],
        ts: ["JavascriptLexer"],
        tsx: ["JsxLexer"],
        default: ["JavascriptLexer"],
    },
    functions: ["t"],
};
