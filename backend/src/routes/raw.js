const express = require("express");
const db = require("../db/database");

const router = express.Router();

router.get("/raw/:certId", (req, res) => {
  const row = db.prepare("SELECT * FROM proofs WHERE id = ?").get(req.params.certId);
  res.type("text/plain");

  if (!row) {
    return res.status(404).send("NOT_FOUND");
  }

  return res.send(`${row.id}\n${row.hash}\n${row.registered_at}`);
});

module.exports = router;
