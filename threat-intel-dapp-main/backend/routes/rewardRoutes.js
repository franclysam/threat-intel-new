const express = require("express");
const crypto = require("crypto");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const router = express.Router();

// Get user rewards (pending and total)
router.get("/:wallet", async (req, res) => {
  try {
    const { wallet } = req.params;
    const user = await User.findOne({ wallet: { $regex: new RegExp(`^${wallet}$`, "i") } });
    
    if (!user) {
      return res.json({ tokens: 0, pendingTokens: 0 });
    }

    res.json({ tokens: user.tokens, pendingTokens: user.pendingTokens });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Claim pending rewards
router.post("/claim", async (req, res) => {
  try {
    const { wallet } = req.body;
    
    if (!wallet) {
      return res.status(400).json({ error: "Wallet address required" });
    }

    const user = await User.findOne({ wallet: { $regex: new RegExp(`^${wallet}$`, "i") } });
    
    if (!user || user.pendingTokens <= 0) {
      return res.status(400).json({ error: "No pending rewards to claim" });
    }

    const amount = user.pendingTokens;

    // Move pending to actual tokens
    user.tokens += amount;
    user.pendingTokens = 0;
    await user.save();

    // Log the transaction
    const tx = new Transaction({
      hash: "0x" + crypto.randomBytes(32).toString('hex'),
      wallet: user.wallet,
      type: "CLAIMED",
      amount: amount
    });
    
    await tx.save();

    res.json({
      message: "Rewards claimed successfully",
      tokens: user.tokens,
      transactionHash: tx.hash
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Transfer tokens to another wallet
router.post("/transfer", async (req, res) => {
  try {
    const { fromWallet, toWallet, amount } = req.body;
    
    if (!fromWallet || !toWallet || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid transfer parameters" });
    }

    const sender = await User.findOne({ wallet: { $regex: new RegExp(`^${fromWallet}$`, "i") } });
    
    if (!sender || sender.tokens < amount) {
      return res.status(400).json({ error: "Insufficient token balance" });
    }

    // Deduct from sender
    sender.tokens -= amount;
    await sender.save();

    // Add to receiver (create if doesn't exist)
    const receiver = await User.findOneAndUpdate(
      { wallet: { $regex: new RegExp(`^${toWallet}$`, "i") } },
      { $inc: { tokens: amount }, $setOnInsert: { wallet: toWallet } },
      { upsert: true, new: true }
    );

    // Create a transaction record for sender
    const tx = new Transaction({
      hash: "0x" + crypto.randomBytes(32).toString('hex'),
      wallet: sender.wallet,
      type: "TRANSFERRED",
      amount: amount,
      toWallet: receiver.wallet
    });
    await tx.save();
    
    // Create a transaction record for receiver
    const rxTx = new Transaction({
        hash: "0x" + crypto.randomBytes(32).toString('hex'), // unique hash
        wallet: receiver.wallet,
        type: "RECEIVED",
        amount: amount,
        toWallet: sender.wallet // "from" perspective
    });
    await rxTx.save();

    res.json({
      message: "Transfer successful",
      transactionHash: tx.hash
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user transaction history
router.get("/transactions/:wallet", async (req, res) => {
  try {
    const { wallet } = req.params;
    const transactions = await Transaction.find({ 
      wallet: { $regex: new RegExp(`^${wallet}$`, "i") } 
    }).sort({ createdAt: -1 }).limit(50);
    
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
