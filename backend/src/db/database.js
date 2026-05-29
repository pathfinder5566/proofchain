const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "../../data");
fs.mkdirSync(dataDir, { recursive: true });

const dbPath = process.env.DB_PATH || path.join(dataDir, "proofchain.sqlite");
const schemaPath = path.join(__dirname, "schema.sql");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.exec(fs.readFileSync(schemaPath, "utf8"));

module.exports = db;
