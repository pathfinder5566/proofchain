const express = require("express");
const { randomUUID } = require("crypto");
const db = require("../db/database");
const { hashIP } = require("../middleware/hashIP");
const { registerRateLimit } = require("../middleware/rateLimit");
const {
  isSha256,
  normalizeHash,
  signCertificate,
  toCertificate
} = require("../utils/certificates");

const router = express.Router();

function insertProof({ hash, filename, filesize, description, parent_cert_id, expires_at, ip_hash }) {
  const id = randomUUID();
  const registered_at = new Date().toISOString();
  const hmac_signature = signCertificate({ id, hash, registered_at });

  db.prepare(
    `INSERT INTO proofs
      (id, hash, filename, filesize, description, registered_at, ip_hash, expires_at, parent_cert_id, hmac_signature)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    hash,
    filename,
    Number.isFinite(filesize) ? filesize : null,
    description || null,
    registered_at,
    ip_hash,
    expires_at || null,
    parent_cert_id || null,
    hmac_signature
  );

  return db.prepare("SELECT * FROM proofs WHERE id = ?").get(id);
}

function registerProof(req, res, forcedParentId = null) {
  const { hash, filename, filesize, description, parent_cert_id, expires_at } = req.body || {};
  const chainParentId = forcedParentId || parent_cert_id || null;

  if (!isSha256(hash)) {
    return res.status(400).json({ success: false, error: "hash must be a 64-character hex SHA-256 value" });
  }

  if (!filename || typeof filename !== "string") {
    return res.status(400).json({ success: false, error: "filename is required" });
  }

  const normalizedHash = normalizeHash(hash);
  const existing = db.prepare("SELECT * FROM proofs WHERE hash = ?").get(normalizedHash);

  if (existing) {
    return res.json({
      success: true,
      idempotent: true,
      certificate: toCertificate(existing)
    });
  }

  const row = insertProof({
    hash: normalizedHash,
    filename,
    filesize: Number(filesize),
    description,
    parent_cert_id: chainParentId,
    expires_at,
    ip_hash: hashIP(req)
  });

  return res.status(201).json({ success: true, idempotent: false, certificate: toCertificate(row) });
}

router.post("/register", registerRateLimit, (req, res) => {
  return registerProof(req, res);
});

router.post("/register-chain", registerRateLimit, (req, res) => {
  const { parent_cert_id } = req.body || {};
  if (!parent_cert_id) {
    return res.status(400).json({ success: false, error: "parent_cert_id is required" });
  }

  const parent = db.prepare("SELECT * FROM proofs WHERE id = ?").get(parent_cert_id);
  if (!parent) {
    return res.status(404).json({ success: false, error: "Parent certificate not found" });
  }

  return registerProof(req, res, parent_cert_id);
});

module.exports = router;
