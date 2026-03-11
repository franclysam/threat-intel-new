const axios = require("axios");

const API = "http://localhost:5001/api";

async function run() {
  try {
    const caller = "0xSubmitter";
    const voter1 = "0xVoterA";
    const voter2 = "0xVoterB";
    const voter3 = "0xVoterC";

    // 1. Submit report
    const res = await axios.post(`${API}/reports`, {
      wallet: caller,
      category: "MALWARE",
      data: "Test threat intel data for incentivization checking"
    });
    console.log("Report submitted:", res.data);
    const reportId = res.data.reportId;

    // 2. Upvote by voter1
    await axios.post(`${API}/reports/${reportId}/vote`, { wallet: voter1, action: "upvote" });
    console.log("Voter1 upvoted");

    // 3. Upvote by voter2
    await axios.post(`${API}/reports/${reportId}/vote`, { wallet: voter2, action: "upvote" });
    console.log("Voter2 upvoted");

    // 4. Upvote by voter3 (should hit 75%+ and >=3 votes to verify)
    const voteRes = await axios.post(`${API}/reports/${reportId}/vote`, { wallet: voter3, action: "upvote" });
    console.log("Voter3 upvoted. Report status:", voteRes.data.status); // Expect VERIFIED

    // 5. Check stats for submitter
    const stat1 = await axios.get(`${API}/reports/stats/${caller}`);
    console.log("Submitter tokens:", stat1.data.tokensEarned); // Expect 50

    // 6. Check stats for voter
    const stat2 = await axios.get(`${API}/reports/stats/${voter1}`);
    console.log("Voter1 tokens:", stat2.data.tokensEarned); // Expect 5

  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

run();
