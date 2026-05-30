require("dotenv").config();

const express = require("express");
const cors = require("cors");

require("./db/database");

const registerRoutes = require("./routes/register");
const verifyRoutes = require("./routes/verify");
const verifyHashRoutes = require("./routes/verifyHash");
const verifyHmacRoutes = require("./routes/verifyHMAC");
const bulkRoutes = require("./routes/bulk");
const rawRoutes = require("./routes/raw");
const chainRoutes = require("./routes/chain");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "proofchain" });
});

app.use("/api", registerRoutes);
app.use("/api", verifyRoutes);
app.use("/api", verifyHashRoutes);
app.use("/api", verifyHmacRoutes);
app.use("/api", bulkRoutes);
app.use("/api", rawRoutes);
app.use("/api", chainRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(port, () => {
  console.log(`ProofChain API listening on http://localhost:${port}`);
});
