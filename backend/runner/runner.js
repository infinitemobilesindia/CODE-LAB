const fs = require("fs/promises");
const os = require("os");
const path = require("path");

const { execute } = require("./execute");

const runners = {
    python: {
        command: "python3",
        file: "main.py",
        args: (file) => [file]
    },

    javascript: {
        command: "node",
        file: "main.js",
        args: (file) => [file]
    },

    ruby: {
        command: "ruby",
        file: "main.rb",
        args: (file) => [file]
    },

    php: {
        command: "php",
        file: "main.php",
        args: (file) => [file]
    }
};

async function runCode(language, code, input = "") {
    const runner = runners[language];

    if (!runner) {
        return {
            success: false,
            output: "",
            error: "Language not available"
        };
    }

    const workspace = await fs.mkdtemp(
        path.join(os.tmpdir(), "codelab-")
    );

    const filePath = path.join(workspace, runner.file);

    try {
        await fs.writeFile(filePath, code, "utf8");

        const result = await execute(
            runner.command,
            runner.args(filePath),
            {
                cwd: workspace,
                input,
                timeout: 5000
            }
        );

        return result;

    } finally {
        await fs.rm(workspace, {
            recursive: true,
            force: true
        });
    }
}

module.exports = {
    runCode
};
