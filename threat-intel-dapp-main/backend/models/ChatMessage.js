const mongoose = require("mongoose");

const chatMessageSchema = new mongoose.Schema({
    sender: String,
    text: String,
    isOfficial: {
        type: Boolean,
        default: false,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("ChatMessage", chatMessageSchema);
