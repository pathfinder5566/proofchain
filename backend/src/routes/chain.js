const express = require("express");
const db = require("../db/database");
const { toCertificate } = require("../utils/certificates");

const router = express.Router();

router.get("/chain/:certId", (req, res) => {
  const chain = [];
  let currentId = req.params.certId;
  const seen = new Set();

  while (currentId && !seen.has(currentId)) {
    seen.add(currentId);
    const row = db.prepare("SELECT * FROM proofs WHERE id = ?").get(currentId);
    if (!row) break;
    chain.unshift(toCertificate(row));
    currentId = row.parent_cert_id;
  }

  if (chain.length === 0) {
    return res.status(404).json({ status: "NOT_FOUND", chain: [] });
  }

  return res.json({ status: "FOUND", chain });
});

module.exports = router;
