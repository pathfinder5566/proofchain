const express = require("express");
const db = require("../db/database");
const { logVerification, toCertificate } = require("../utils/certificates");

const router = express.Router();

router.get("/verify/:certId", (req, res) => {
  const row = db.prepare("SELECT * FROM proofs WHERE id = ?").get(req.params.certId);

  if (!row) {
    logVerification(db, { cert_id: req.params.certId, result: "NOT_FOUND" });
    return res.status(404).json({ status: "NOT_FOUND", message: "Certificate not found" });
  }

  logVerification(db, { cert_id: row.id, hash_checked: row.hash, result: "VALID" });
  return res.json({ status: "VALID", certificate: toCertificate(row) });
});

module.exports = router;
