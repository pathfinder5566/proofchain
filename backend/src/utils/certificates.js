const crypto = require("crypto");

function isSha256(hash) {
  return typeof hash === "string" && /^[a-fA-F0-9]{64}$/.test(hash);
}

function normalizeHash(hash) {
  return hash.toLowerCase();
}

function signCertificate({ id, hash, registered_at }) {
  const secret = process.env.HMAC_SECRET || "changeme";
  return crypto
    .createHmac("sha256", secret)
    .update(`${id}:${hash}:${registered_at}`)
    .digest("hex");
}

function verifyUrlFor(id) {
  const base = process.env.FRONTEND_URL || "http://localhost:5173";
  return `${base.replace(/\/$/, "")}/verify/${id}`;
}

function toCertificate(row) {
  if (!row) return null;
  return {
    cert_id: row.id,
    hash: row.hash,
    filename: row.filename,
    filesize: row.filesize,
    description: row.description,
    registered_at: row.registered_at,
    expires_at: row.expires_at,
    parent_cert_id: row.parent_cert_id,
    hmac_signature: row.hmac_signature,
    verify_url: verifyUrlFor(row.id)
  };
}

function logVerification(db, { cert_id = null, hash_checked = null, result }) {
  db.prepare(
    "INSERT INTO verifications (cert_id, hash_checked, result, checked_at) VALUES (?, ?, ?, ?)"
  ).run(cert_id, hash_checked, result, new Date().toISOString());
}

module.exports = {
  isSha256,
  normalizeHash,
  signCertificate,
  toCertificate,
  verifyUrlFor,
  logVerification
};
