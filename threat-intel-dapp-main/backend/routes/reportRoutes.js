const express = require("express");
const crypto = require("crypto");
const Report = require("../models/Report");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { encrypt } = require("../services/encryption");

const router = express.Router();

// Submit report
router.post("/", async (req, res) => {
  try {
    const { wallet, category, data, expiryDays } = req.body;

    if (!wallet || !category || !data) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Create hash
    const hash = crypto
      .createHash("sha256")
      .update(data + wallet)
      .digest("hex");

    const reportData = {
      wallet,
      category,
      data,
      hash,
    };

    if (expiryDays) {
      reportData.expiryDate = new Date(+new Date() + parseInt(expiryDays) * 24 * 60 * 60 * 1000);
    }

    const report = new Report(reportData);

    const savedReport = await report.save();

    // Emit real-time update
    if (req.app.get("io")) {
      req.app.get("io").emit("newReport", savedReport);
    }

    res.json({
      message: "Report submitted",
      reportId: savedReport._id,
      hash,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get global stats
router.get("/stats", async (req, res) => {
  try {
    const totalReports = await Report.countDocuments();
    const uniqueWallets = await Report.distinct("wallet");

    const tokenResult = await User.aggregate([{ $group: { _id: null, total: { $sum: "$tokens" } } }]);
    const tokensEarned = tokenResult.length > 0 ? tokenResult[0].total : 0;

    res.json({
      threatsDetected: totalReports + 1200, // Mixing with fixed starting count for "scale"
      activeDefenders: uniqueWallets.length + 500,
      tokensEarned: tokensEarned.toLocaleString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get user-specific stats
router.get("/stats/:wallet", async (req, res) => {
  try {
    const { wallet } = req.params;
    const reportCount = await Report.countDocuments({ wallet: { $regex: new RegExp(`^${wallet}$`, "i") } });
    const validatedCount = await Report.countDocuments({ upvotes: { $regex: new RegExp(`^${wallet}$`, "i") } });
    
    let user = await User.findOne({ wallet: { $regex: new RegExp(`^${wallet}$`, "i") } });
    if (!user) {
      // create default user if not exists to return initial stats
      user = new User({ wallet, tokens: 0 });
      await user.save();
    }

    res.json({
      reportsSubmitted: reportCount,
      reportsValidated: validatedCount,
      reputationScore: 50 + (reportCount * 5) > 100 ? 99 : 50 + (reportCount * 5),
      tokensEarned: user.tokens,
      memberSince: "Feb 2025"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Vote on a report (Upvote / Downvote)
router.post("/:id/vote", async (req, res) => {
  try {
    const { id } = req.params;
    const { wallet, action } = req.body; // action: 'upvote' or 'downvote'

    if (!wallet || !action || !['upvote', 'downvote'].includes(action)) {
      return res.status(400).json({ error: "Invalid request" });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    if (report.expiryDate && new Date() > report.expiryDate) {
      return res.status(400).json({ error: "Voting has expired for this report" });
    }

    // Remove existing vote if any
    report.upvotes = report.upvotes.filter(w => w.toLowerCase() !== wallet.toLowerCase());
    report.downvotes = report.downvotes.filter(w => w.toLowerCase() !== wallet.toLowerCase());

    // Add new vote
    if (action === 'upvote') {
      report.upvotes.push(wallet);
    } else {
      report.downvotes.push(wallet);
    }

    // Validation Logic: 75% positive ratio required to verify
    const totalVotes = report.upvotes.length + report.downvotes.length;
    
    // Require at least 3 total votes for validation to trigger (prevents 1 upvote from instantly verifying)
    if (totalVotes >= 3) {
      const upvoteRatio = report.upvotes.length / totalVotes;
      if (upvoteRatio >= 0.75) {
        report.status = "VERIFIED";
      } else {
        report.status = "pending";
      }
    } else {
      report.status = "pending";
    }

    const updatedReport = await report.save();

    // Emit real-time update
    if (req.app.get("io")) {
      req.app.get("io").emit("voteUpdate", {
        reportId: updatedReport._id,
        upvotes: updatedReport.upvotes,
        downvotes: updatedReport.downvotes,
      });
    }

    res.json({
      message: `Successfully ${action}d report`,
      upvotes: report.upvotes.length,
      downvotes: report.downvotes.length,
      status: report.status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Withdraw rewards for an expired report
router.post("/:id/withdraw", async (req, res) => {
  try {
    const { id } = req.params;
    const { wallet } = req.body;

    if (!wallet) {
      return res.status(400).json({ error: "Wallet is required" });
    }

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Check if the requester is the owner
    if (report.wallet.toLowerCase() !== wallet.toLowerCase()) {
      return res.status(403).json({ error: "Only the creator can withdraw rewards" });
    }

    // Check if report has expired
    if (!report.expiryDate || new Date() <= report.expiryDate) {
      return res.status(400).json({ error: "Report has not expired yet" });
    }

    if (report.rewardsDistributed) {
      return res.status(400).json({ error: "Rewards already distributed for this report" });
    }

    // Calculate reward based on ratio
    const upvotes = report.upvotes.length;
    const downvotes = report.downvotes.length;
    const totalVotes = upvotes + downvotes;
    
    // Reward Config Based on Upvote Ratio
    const getRewardMultiplier = (ratio) => {
      if (ratio < 70) return 0.25; // "1-70 is 0.25"
      if (ratio < 80) return 0.50; // "70-80 is 0.5"
      if (ratio < 90) return 0.75; // "80-90 is 0.75"
      return 1.0;                  // "90-100 is 1.0"
    };

    const ratio = totalVotes > 0 ? (upvotes / totalVotes) * 100 : 0;
    const multiplier = getRewardMultiplier(ratio);
    
    // Formula: 10 base tokens per net upvote, scaled by the ratio multiplier
    const netVotes = Math.max(0, upvotes - downvotes);
    const rewardAmount = netVotes * 10 * multiplier;

    if (rewardAmount > 0) {
      await User.findOneAndUpdate(
        { wallet: { $regex: new RegExp(`^${report.wallet}$`, "i") } },
        { $inc: { pendingTokens: rewardAmount }, $setOnInsert: { wallet: report.wallet } },
        { upsert: true, new: true }
      );
      await Transaction.create({
        hash: "0x" + crypto.randomBytes(32).toString("hex"),
        wallet: report.wallet,
        type: "EARNED",
        amount: rewardAmount
      });
    }

    report.rewardsDistributed = true;
    await report.save();

    // Emit real-time update for the vault
    if (req.app.get("io")) {
      req.app.get("io").emit("vaultUpdate", { wallet: report.wallet });
    }

    res.json({
      message: "Rewards successfully withdrawn to your vault",
      amount: rewardAmount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
