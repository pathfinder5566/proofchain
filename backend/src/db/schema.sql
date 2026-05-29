CREATE TABLE IF NOT EXISTS proofs (
  id TEXT PRIMARY KEY,
  hash TEXT NOT NULL UNIQUE,
  filename TEXT,
  filesize INTEGER,
  description TEXT,
  registered_at TEXT NOT NULL,
  ip_hash TEXT,
  expires_at TEXT,
  parent_cert_id TEXT,
  hmac_signature TEXT
);

CREATE TABLE IF NOT EXISTS verifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cert_id TEXT,
  hash_checked TEXT,
  result TEXT,
  checked_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_proofs_hash ON proofs(hash);
CREATE INDEX IF NOT EXISTS idx_verifications_cert_id ON verifications(cert_id);
