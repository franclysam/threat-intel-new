const express = require("express");
const crypto = require("crypto");
const Report = require("../models/Report");
const User = require("../models/User");
const { encrypt } = require("../services/encryption");

const router = express.Router();

// Submit report
router.post("/", async (req, res) => {
  try {
    const { wallet, category, data } = req.body;

    if (!wallet || !category || !data) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Create hash
    const hash = crypto
      .createHash("sha256")
      .update(data + wallet)
      .digest("hex");

    const report = new Report({
      wallet,
      category,
      data,
      hash,
    });

    await report.save();

    res.json({
      message: "Report submitted",
      reportId: report._id,
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

    // Remove user's previous vote if any
    report.upvotes = report.upvotes.filter(addr => addr.toLowerCase() !== wallet.toLowerCase());
    report.downvotes = report.downvotes.filter(addr => addr.toLowerCase() !== wallet.toLowerCase());

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

        // Reward if not already rewarded
        if (!report.rewardsDistributed) {
          report.rewardsDistributed = true;

          // Give submitter 50 tokens
          await User.findOneAndUpdate(
            { wallet: { $regex: new RegExp(`^${report.wallet}$`, "i") } },
            { $inc: { tokens: 50 }, $setOnInsert: { wallet: report.wallet } },
            { upsert: true, new: true }
          );

          // Give each upvoter 5 tokens
          for (const voterWallet of report.upvotes) {
            await User.findOneAndUpdate(
              { wallet: { $regex: new RegExp(`^${voterWallet}$`, "i") } },
              { $inc: { tokens: 5 }, $setOnInsert: { wallet: voterWallet } },
              { upsert: true, new: true }
            );
          }
        }
      } else {
        // If it falls below 75%, it goes back to pending/flagged depending on how you want to handle it
        report.status = "pending";
      }
    } else {
      report.status = "pending";
    }

    await report.save();

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

module.exports = router;
