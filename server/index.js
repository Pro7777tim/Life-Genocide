const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const PROGRESS_FILE = "progress.json";

const readProgress = () => {
    if (fs.existsSync(PROGRESS_FILE)) {
        return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8"));
    }
    return {};
};

const writeProgress = (data) => {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
};

app.get("/progress/:playerId", (req, res) => {
    const playerId = req.params.playerId;
    const progress = readProgress();
    res.json(progress[playerId] || {});
});

app.post("/progress/:playerId", (req, res) => {
    const playerId = req.params.playerId;
    const progress = readProgress();

    progress[playerId] = req.body;
    writeProgress(progress);

    res.json({ success: true, message: "Progress saved!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
