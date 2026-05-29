const rateLimit = require("express-rate-limit");
const { hashIP } = require("./hashIP");

const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  keyGenerator: (req) => hashIP(req),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Registration limit reached. Try again later."
  }
});

module.exports = { registerRateLimit };
