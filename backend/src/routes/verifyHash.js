const express = require("express");
const db = require("../db/database");
const { isSha256, normalizeHash, logVerification, toCertificate } = require("../utils/certificates");

const router = express.Router();

router.post("/verify-hash", (req, res) => {
  const { hash } = req.body || {};

  if (!isSha256(hash)) {
    return res.status(400).json({ status: "INVALID_HASH", message: "hash must be a 64-character hex SHA-256 value" });
  }

  const normalizedHash = normalizeHash(hash);
  const row = db.prepare("SELECT * FROM proofs WHERE hash = ?").get(normalizedHash);

  if (!row) {
    logVerification(db, { hash_checked: normalizedHash, result: "NO_MATCH" });
    return res.status(404).json({
      status: "NO_MATCH",
      message: "No proof found for this file"
    });
  }

  logVerification(db, { cert_id: row.id, hash_checked: normalizedHash, result: "MATCH" });
  return res.json({
    status: "MATCH",
    message: "File matches registered proof",
    certificate: toCertificate(row)
  });
});

module.exports = router;
