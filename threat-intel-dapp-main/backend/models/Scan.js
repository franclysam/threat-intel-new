const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
    fileName: String,
    fileSize: String,
    threatLevel: String,
    malwareDetected: Boolean,
    scanTime: String,
    hash: String,
    explanation: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Scan", scanSchema);
