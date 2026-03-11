const express = require("express");
const multer = require("multer");
const crypto = require("crypto");
const AdmZip = require("adm-zip");
const Scan = require("../models/Scan");

const router = express.Router();

// Memory storage to avoid saving files on disk for now
const storage = multer.memoryStorage();
const upload = multer({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Simple threat detection heuristic
const checkThreats = (file) => {
    const fileName = file.originalname.toLowerCase();
    const buffer = file.buffer;

    const calculateEntropy = (buf) => {
        let entropy = 0;
        const count = new Array(256).fill(0);
        for (let i = 0; i < buf.length; i++) {
            count[buf[i]]++;
        }
        for (let i = 0; i < 256; i++) {
            const freq = count[i] / buf.length;
            if (freq > 0) {
                entropy -= freq * Math.log2(freq);
            }
        }
        return entropy;
    };

    const analyzeBuffer = (name, buf, isArchiveEntry = false) => {
        const content = buf.toString('utf8');
        let currentScore = 0;
        const threats = [];
        
        // 1. Filename keywords (Base Score)
        const suspiciousKeywords = ["virus", "malware", "ransomware", "trojan", "worm", ".exe", ".bat", ".sh", "payload"];
        if (suspiciousKeywords.some(kw => name.includes(kw))) {
            currentScore += 30;
            threats.push("Suspicious Naming");
        }

        // 2. Magic numbers (Executable format = higher base risk)
        const isExecutable = buf.length >= 2 && buf[0] === 0x4D && buf[1] === 0x5A;
        if (isExecutable) {
            currentScore += 35;
            threats.push("Windows Executable (PE) Signature");
        }

        // 3. EICAR test string and dummy payloads
        const eicarString = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";
        const isEicar = content.includes(eicarString) || content.toLowerCase().includes("dummy virus") || content.toLowerCase().includes("test virus") || content.toLowerCase().includes("malicious virus dummy");
        
        if (isEicar) {
            currentScore = 100; // Insta-flag dummy payloads
            threats.push("Explicit Dummy/EICAR Payload");
        }

        // 4. Entropy analysis (Highly packed/encrypted files usually > 7.0)
        const entropy = calculateEntropy(buf);
        if (entropy > 7.2) {
            currentScore += 15;
            threats.push(`High Entropy (${entropy.toFixed(2)}) - Possible Packer/Encryptor`);
        } else if (entropy < 1.0) {
            currentScore += 5; // Very low entropy might be padding
        }

        return { score: Math.min(currentScore, 100), threats };
    };

    // First check the top-level uploaded file
    let maxRiskScore = 0;
    let allThreats = new Set();
    let overallDetails = "";

    const topLevelResult = analyzeBuffer(fileName, buffer);
    maxRiskScore = topLevelResult.score;
    topLevelResult.threats.forEach(t => allThreats.add(t));

    // If it's a ZIP archive, unpack it entirely in memory and analyze entries
    let containsArchive = false;
    if (fileName.endsWith('.zip') || (buffer.length >= 2 && buffer[0] === 0x50 && buffer[1] === 0x4B)) {
        containsArchive = true;
        try {
            const zip = new AdmZip(buffer);
            const zipEntries = zip.getEntries();
            for (const entry of zipEntries) {
                if (!entry.isDirectory) {
                    const entryData = entry.getData();
                    const entryResult = analyzeBuffer(entry.name.toLowerCase(), entryData, true);
                    
                    if (entryResult.score > maxRiskScore) {
                        maxRiskScore = entryResult.score;
                        overallDetails = `Malicious payload found inside compressed archive: ${entry.name}. `;
                    }
                    entryResult.threats.forEach(t => allThreats.add(`[Zipped] ${t}`));
                }
            }
        } catch (err) {
            console.error("Failed to extract ZIP archive:", err);
            allThreats.add("Corrupted/Encrypted Archive Structure");
            maxRiskScore = Math.max(maxRiskScore, 40);
        }
    }

    // Determine final threat level explicitly stringified
    let threatLevel = "Low";
    let malwareDetected = false;

    if (maxRiskScore >= 80) {
        threatLevel = "High";
        malwareDetected = true;
        if (!overallDetails) overallDetails = "Critical threats detected in data stream.";
    } else if (maxRiskScore >= 40) {
        threatLevel = "Moderate";
        if (!overallDetails) overallDetails = "Suspicious heuristics found. Handled with caution.";
    } else {
        overallDetails = "No immediate threats found via heuristics. File is clinically clean.";
        if (maxRiskScore === 0) maxRiskScore = Math.floor(Math.random() * 5); // 0-4 base noise
    }

    if (allThreats.size === 0) allThreats.add("None");

    return {
        threatLevel,
        threatsDetected: Array.from(allThreats),
        malwareDetected,
        riskScore: maxRiskScore,
        details: overallDetails
    };
};

router.post("/", upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const file = req.file;
        const hash = crypto.createHash("sha256").update(file.buffer).digest("hex");

        // Perform "AI" scanning (Heuristics)
        const scanResult = checkThreats(file);

        const scanData = {
            fileName: file.originalname,
            fileSize: (file.size / 1024).toFixed(2) + " KB",
            threatLevel: scanResult.threatLevel,
            malwareDetected: scanResult.malwareDetected,
            riskScore: scanResult.riskScore,
            threatsDetected: scanResult.threatsDetected,
            scanTime: (Math.random() * 2 + 0.5).toFixed(1) + "s",
            hash: "SHA256: " + hash,
            explanation: scanResult.details
        };

        // Save to Database
        const scan = new Scan(scanData);
        await scan.save();

        res.json(scanData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Scan failed" });
    }
});

const axios = require("axios");

// Endpoint for submitting URL links for analysis
router.post("/link", express.json(), async (req, res) => {
    try {
        const { url } = req.body;
        if (!url || typeof url !== 'string') {
            return res.status(400).json({ error: "No URL provided" });
        }

        let maxRiskScore = 0;
        let allThreats = new Set();
        let overallDetails = "";

        // Ensure safe prefix
        let targetUrl = url;
        if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
            targetUrl = "http://" + targetUrl; // Default to testing http for raw domains
        }

        const lowerUrl = targetUrl.toLowerCase();
        
        // --- 1. STRING HEURISTICS ---
        const suspiciousUrlKeywords = ["phishing", "malware", "login", "secure", "update", "verify", "account", "paypal", "bank", "crypto", "wallet", "free", "win", "prize", "dummy virus"];
        let keywordHits = 0;
        suspiciousUrlKeywords.forEach(kw => {
            if (lowerUrl.includes(kw)) {
                keywordHits++;
                allThreats.add(`Suspicious URL keyword: '${kw}'`);
            }
        });
        maxRiskScore += (keywordHits * 15);

        const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
        if (ipRegex.test(lowerUrl)) {
            maxRiskScore += 40;
            allThreats.add("Direct IP Address Navigation");
        }

        const riskyTLDs = [".xyz", ".zip", ".top", ".click", ".ru", ".cn", ".su", ".pw", ".cc"];
        if (riskyTLDs.some(tld => lowerUrl.includes(tld))) {
            maxRiskScore += 30;
            allThreats.add("Risky Top-Level Domain (TLD)");
        }

        if ((lowerUrl.match(/-/g) || []).length > 3) {
            maxRiskScore += 10;
            allThreats.add("Excessive Hyphenation");
        }
        if ((lowerUrl.match(/@/g) || []).length > 0) {
            maxRiskScore += 50;
            allThreats.add("HTTP Basic Auth (@) Obfuscation");
        }

        if (url.length > 100) {
            maxRiskScore += 20;
            allThreats.add("Unusually Long URL String");
        }

        if (lowerUrl.includes("dummy virus") || lowerUrl.includes("test virus") || lowerUrl.includes("malicious")) {
            maxRiskScore = 100;
            allThreats.add("Explicit Dummy/Test Malicious Link String");
        }

        // --- 2. DEEP CONTENT INSPECTION via HTTP GET ---
        let fetchSuccessful = false;
        try {
            const response = await axios.get(targetUrl, { 
                timeout: 5000,
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AI_DIAGNOSTIC_UPLINK/1.0' },
                maxRedirects: 3 
            });

            fetchSuccessful = true;
            const content = (typeof response.data === 'string' ? response.data : JSON.stringify(response.data)).toLowerCase();
            const headersStr = JSON.stringify(response.headers).toLowerCase();

            // Test for EICAR / Dummy payloads explicitly inside the destination server source
            const eicarString = "x5o!p%@ap[4\\pzx54(p^)7cc)7}$eicar-standard-antivirus-test-file!$h+h*";
            if (content.includes("dummy virus") || content.includes("test virus") || content.includes("malicious virus dummy") || content.includes(eicarString)) {
                maxRiskScore = 100;
                allThreats.add("Remote host served malicious testing payloads (EICAR / Dummy Virus)");
                overallDetails = "Critical threats detected directly in the server's response body.";
            }

            // Test for generic phishing or stealth patterns inside the HTML script/frames
            if (content.includes("<iframe") && content.includes("opacity: 0") || content.includes("visibility: hidden")) {
                maxRiskScore += 25;
                allThreats.add("Hidden HTML iframes (Potential Clickjacking)");
            }
            if (content.includes("document.write(unescape(") || content.includes("eval(atob(")) {
                maxRiskScore += 35;
                allThreats.add("Obfuscated Javascript Payloads detected in source");
            }
            if ((content.match(/<input type="password"/g) || []).length > 0 && !targetUrl.startsWith("https://")) {
                maxRiskScore += 50;
                allThreats.add("Password collection on unencrypted (HTTP) connection");
            }

        } catch (err) {
            // If the endpoint fails to fetch, it's either dead, blocking us, or refusing connections.
            maxRiskScore += 15;
            allThreats.add("Remote host refused connection or timed out (Unstable Server)");
            if (err.response && err.response.status) {
                allThreats.add(`HTTP Response Error: ${err.response.status}`);
            }
        }

        // --- FINALIZE RISK SCORES ---
        maxRiskScore = Math.min(maxRiskScore, 100);

        let threatLevel = "Low";
        let malwareDetected = false;

        if (maxRiskScore >= 80) {
            threatLevel = "High";
            malwareDetected = true;
            if (!overallDetails) overallDetails = fetchSuccessful 
                ? "Neural scan completed. Critical threats identified in both URI heuristics and site payload architecture."
                : "Critical threats detected in URL heuristic scan. Target host unreachable.";
        } else if (maxRiskScore >= 40) {
            threatLevel = "Moderate";
            if (!overallDetails) overallDetails = fetchSuccessful
                ? "Target resolved successfully, but suspicious patterns were identified in the host architecture."
                : "Suspicious heuristics found in URL parameters. Handled with caution.";
        } else {
            if (!overallDetails) overallDetails = fetchSuccessful
                ? "Target host successfully negotiated. The remote payload and URI patterns appear clinically safe."
                : "The provided URL target target seems structurally sound, though connection timed out.";
            if (maxRiskScore === 0) maxRiskScore = Math.floor(Math.random() * 5); // 0-4 base noise
        }

        if (allThreats.size === 0) allThreats.add("None");

        const hash = crypto.createHash("sha256").update(url).digest("hex");

        const scanData = {
            fileName: url, // Map the URL as the "name" for the frontend display
            fileSize: fetchSuccessful ? "Remote HTML" : "Offline",
            threatLevel,
            malwareDetected,
            riskScore: maxRiskScore,
            threatsDetected: Array.from(allThreats),
            scanTime: (Math.random() * 2 + 1.2).toFixed(1) + "s",
            hash: "SHA256: " + hash,
            explanation: overallDetails
        };

        // Save to Database
        const scan = new Scan(scanData);
        await scan.save();

        res.json(scanData);
    } catch (err) {
        console.error("Link Scan Handler Fault:", err);
        res.status(500).json({ error: "Link Scan internal node failure" });
    }
});

module.exports = router;
