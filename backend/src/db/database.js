const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");

const defaultDataDir = path.join(__dirname, "../../data");
const dbPath = process.env.DB_PATH || path.join(defaultDataDir, "proofchain.sqlite");
const schemaPath = path.join(__dirname, "schema.sql");

fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.exec(fs.readFileSync(schemaPath, "utf8"));

module.exports = db;
