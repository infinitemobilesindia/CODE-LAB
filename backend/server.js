const express = require("express");
const cors = require("cors");
const { runCode } = require("./runner/runner");

const app = express();

const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
    res.json({
        name: "CodeLab Backend",
        version: "1.0.0",
        status: "online"
    });
});

app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.post("/api/run", async (req, res) => {
    const { language, code, input = "" } = req.body;

    if (!language) {
        return res.status(400).json({
            success: false,
            error: "Language is required"
        });
    }

    if (!code) {
        return res.status(400).json({
            success: false,
            error: "Code is required"
        });
    }

    try {
        const result = runCode(
            language.toLowerCase(),
            code,
            input
        );

        res.json(result);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            output: "",
            error: "Backend execution error"
        });
    }
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodeLab Backend running on port ${PORT}`);
});
