function runCode(language, code, input = "") {
    const supportedLanguages = [
        "python",
        "javascript",
        "java",
        "c",
        "cpp",
        "go",
        "rust",
        "ruby",
        "php"
    ];

    if (!supportedLanguages.includes(language)) {
        return {
            success: false,
            output: "",
            error: "Language not available"
        };
    }

    return {
        success: false,
        output: "",
        error: "Runner is not connected yet"
    };
}

module.exports = {
    runCode
};
