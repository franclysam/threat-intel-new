const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  wallet: String,
  category: {
    type: String,
    required: true,
  },
  data: String,
  hash: String,
  status: {
    type: String,
    default: "pending",
  },
  upvotes: [{
    type: String, // Wallet addresses
  }],
  downvotes: [{
    type: String, // Wallet addresses
  }],
  rewardsDistributed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Report", reportSchema);
