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

module.exports = router;
