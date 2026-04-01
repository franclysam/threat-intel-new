const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
    unique: true
  },
  wallet: {
    type: String,
    required: true,
    lowercase: true
  },
  type: {
    type: String,
    enum: ["EARNED", "CLAIMED", "TRANSFERRED", "RECEIVED"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  toWallet: {
    type: String,
    lowercase: true,
    default: null
  },
  status: {
    type: String,
    default: "Completed"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
