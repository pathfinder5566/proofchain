import { useEffect, useRef, useState } from "react";
import { Search, Upload } from "lucide-react";
import hashFile from "../utils/hashFile";
import formatFileSize from "../utils/formatFileSize";

const tabs = ["cert", "file", "hash"];

export default function VerifyPanel({ initialCertId }) {
  const fileRef = useRef(null);
  const [mode, setMode] = useState(initialCertId ? "cert" : "file");
  const [certId, setCertId] = useState(initialCertId || "");
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initialCertId) {
      verifyCert(initialCertId);
    }
  }, [initialCertId]);

  async function request(url, options) {
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch(url, options);
      const payload = await response.json();
      setResult(payload);
    } catch (err) {
      setResult({ status: "ERROR", message: err.message });
    } finally {
      setBusy(false);
    }
  }

  function verifyCert(id = certId) {
    if (!id) return;
    request(`/api/verify/${id}`);
  }

  function verifyHash(value = hash) {
    if (!value) return;
    request("/api/verify-hash", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash: value })
    });
  }

  async function verifyFile(file) {
    if (!file) return;
    setBusy(true);
    const hashed = await hashFile(file);
    setHash(hashed.hash);
    setBusy(false);
    verifyHash(hashed.hash);
  }

  return (
    <section className="tool-panel">
      <div className="tabs" role="tablist" aria-label="Verification modes">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={mode === tab ? "active" : ""}
            onClick={() => setMode(tab)}
          >
            {tab === "cert" ? "Certificate" : tab === "file" ? "File" : "Hash"}
          </button>
        ))}
      </div>

      {mode === "cert" && (
        <div className="verify-form">
          <input value={certId} onChange={(event) => setCertId(event.target.value)} placeholder="Certificate ID" />
          <button type="button" onClick={() => verifyCert()} disabled={busy}>
            <Search size={18} aria-hidden="true" />
            Verify Certificate
          </button>
        </div>
      )}

      {mode === "file" && (
        <button type="button" className="drop-zone compact-drop" onClick={() => fileRef.current?.click()}>
          <Upload size={28} aria-hidden="true" />
          <span>Select file to verify</span>
          <small>The file is hashed locally, then only the hash is checked</small>
          <input ref={fileRef} type="file" hidden onChange={(event) => verifyFile(event.target.files[0])} />
        </button>
      )}

      {mode === "hash" && (
        <div className="verify-form vertical">
          <textarea value={hash} onChange={(event) => setHash(event.target.value)} placeholder="Paste SHA-256 hash" rows={3} />
          <button type="button" onClick={() => verifyHash()} disabled={busy}>
            <Search size={18} aria-hidden="true" />
            Verify Hash
          </button>
        </div>
      )}

      {busy && <p className="muted">Checking registry...</p>}
      {result && <VerificationResult result={result} />}
    </section>
  );
}

function VerificationResult({ result }) {
  const ok = ["VALID", "MATCH"].includes(result.status);
  const certificate = result.certificate;

  return (
    <div className={ok ? "result-banner valid" : "result-banner invalid"}>
      <strong>{ok ? result.status : "TAMPERED or UNREGISTERED"}</strong>
      <span>{result.message || (ok ? "Proof found in registry" : "No matching proof was found")}</span>
      {certificate && (
        <dl className="detail-list compact">
          <div>
            <dt>Certificate</dt>
            <dd>{certificate.cert_id}</dd>
          </div>
          <div>
            <dt>File</dt>
            <dd>{certificate.filename}</dd>
          </div>
          <div>
            <dt>Size</dt>
            <dd>{formatFileSize(certificate.filesize)}</dd>
          </div>
          <div>
            <dt>Registered</dt>
            <dd>{new Date(certificate.registered_at).toLocaleString()}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}
