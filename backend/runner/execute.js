const { spawn } = require("child_process");

function execute(command, args, options = {}) {
    return new Promise((resolve) => {
        const timeout = options.timeout || 5000;

        const process = spawn(command, args, {
            cwd: options.cwd,
            env: {
                PATH: process.env.PATH
            },
            stdio: ["pipe", "pipe", "pipe"]
        });

        let output = "";
        let error = "";
        let finished = false;

        const timer = setTimeout(() => {
            if (!finished) {
                finished = true;
                process.kill("SIGKILL");

                resolve({
                    success: false,
                    output,
                    error: "Execution timed out"
                });
            }
        }, timeout);

        process.stdout.on("data", (data) => {
            output += data.toString();
        });

        process.stderr.on("data", (data) => {
            error += data.toString();
        });

        process.on("close", (code) => {
            if (finished) return;

            finished = true;
            clearTimeout(timer);

            resolve({
                success: code === 0,
                output,
                error
            });
        });

        process.on("error", (err) => {
            if (finished) return;

            finished = true;
            clearTimeout(timer);

            resolve({
                success: false,
                output,
                error: err.message
            });
        });

        if (options.input) {
            process.stdin.write(options.input);
        }

        process.stdin.end();
    });
}

module.exports = {
    execute
};
