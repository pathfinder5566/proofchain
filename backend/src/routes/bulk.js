const express = require("express");
const db = require("../db/database");
const { isSha256, normalizeHash, logVerification, toCertificate } = require("../utils/certificates");

const router = express.Router();

router.post("/bulk-verify", (req, res) => {
  const hashes = Array.isArray(req.body?.hashes) ? req.body.hashes.slice(0, 25) : [];
  const results = hashes.map((hash) => {
    if (!isSha256(hash)) {
      return { hash, status: "INVALID_HASH" };
    }

    const normalizedHash = normalizeHash(hash);
    const row = db.prepare("SELECT * FROM proofs WHERE hash = ?").get(normalizedHash);
    const status = row ? "REGISTERED" : "UNREGISTERED";
    logVerification(db, { cert_id: row?.id || null, hash_checked: normalizedHash, result: status });
    return {
      hash: normalizedHash,
      status,
      certificate: row ? toCertificate(row) : null
    };
  });

  return res.json({ results });
});

module.exports = router;
