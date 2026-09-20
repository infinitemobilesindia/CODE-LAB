const { execute } = require("./execute");

const runners = {
    python: {
        command: "python3",
        args: (file) => [file]
    },

    javascript: {
        command: "node",
        args: (file) => [file]
    },

    ruby: {
        command: "ruby",
        args: (file) => [file]
    },

    php: {
        command: "php",
        args: (file) => [file]
    }
};

async function runCode(language, code, input = "") {
    if (!runners[language]) {
        return {
            success: false,
            output: "",
            error: "Language not available"
        };
    }

    return {
        success: false,
        output: "",
        error: "Language runner setup is not finished yet"
    };
}

module.exports = {
    runCode
};
