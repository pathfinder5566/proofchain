const express = require("express");
const { signCertificate } = require("../utils/certificates");

const router = express.Router();

router.post("/verify-hmac", (req, res) => {
  const { cert_id, hash, registered_at, hmac_signature } = req.body || {};
  if (!cert_id || !hash || !registered_at || !hmac_signature) {
    return res.status(400).json({ status: "INVALID", message: "cert_id, hash, registered_at and hmac_signature are required" });
  }

  const expected = signCertificate({ id: cert_id, hash, registered_at });
  const valid = expected === hmac_signature;
  return res.json({
    status: valid ? "VALID_HMAC" : "INVALID_HMAC",
    valid
  });
});

module.exports = router;
