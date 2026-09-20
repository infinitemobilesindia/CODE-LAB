const express = require("express");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Home
app.get("/", (req, res) => {
    res.json({
        name: "CodeLab Backend",
        version: "1.0.0",
        status: "online"
    });
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

// Code execution endpoint
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

    // Compiler will be connected here in the next step.
    res.json({
        success: false,
        language: language,
        output: "",
        error: "Compiler not connected yet"
    });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodeLab Backend running on port ${PORT}`);
});
