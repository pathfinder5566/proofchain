const crypto = require("crypto");

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}

function hashIP(req) {
  return crypto.createHash("sha256").update(getClientIp(req)).digest("hex");
}

module.exports = { hashIP };
