const fs = require("fs/promises");
const os = require("os");
const path = require("path");
const { execute } = require("./execute");

const LANGUAGES = {
    python: {
        file: "main.py",
        command: "python3",
        args: file => [file]
    },

    javascript: {
        file: "main.js",
        command: "node",
        args: file => [file]
    },

    ruby: {
        file: "main.rb",
        command: "ruby",
        args: file => [file]
    },

    php: {
        file: "main.php",
        command: "php",
        args: file => [file]
    }
};

async function runCode(language, code, input = "") {
    language = String(language || "").toLowerCase().trim();

    const config = LANGUAGES[language];

    if (!config) {
        return {
            success: false,
            output: "",
            error: "Language not available"
        };
    }

    if (typeof code !== "string" || !code.trim()) {
        return {
            success: false,
            output: "",
            error: "Code is required"
        };
    }

    let workspace;

    try {
        workspace = await fs.mkdtemp(
            path.join(os.tmpdir(), "codelab-")
        );

        const filePath = path.join(
            workspace,
            config.file
        );

        await fs.writeFile(
            filePath,
            code,
            "utf8"
        );

        const result = await execute(
            config.command,
            config.args(filePath),
            {
                cwd: workspace,
                input: String(input || ""),
                timeout: 5000
            }
        );

        return {
            success: result.success,
            output: result.output || "",
            error: result.error || ""
        };

    } catch (error) {
        return {
            success: false,
            output: "",
            error: error.message || "Execution failed"
        };

    } finally {
        if (workspace) {
            await fs.rm(workspace, {
                recursive: true,
                force: true
            });
        }
    }
}

module.exports = {
    runCode
};
