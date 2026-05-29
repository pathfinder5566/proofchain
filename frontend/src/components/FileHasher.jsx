import { useRef, useState } from "react";
import { FileUp, ShieldCheck } from "lucide-react";
import CertificateCard from "./CertificateCard";
import hashFile from "../utils/hashFile";
import formatFileSize from "../utils/formatFileSize";

const truncate = (hash) => `${hash.slice(0, 16)}...${hash.slice(-16)}`;

export default function FileHasher() {
  const inputRef = useRef(null);
  const [hashResult, setHashResult] = useState(null);
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const [error, setError] = useState("");

  async function handleFile(file) {
    if (!file) return;
    setError("");
    setCertificate(null);
    setBusy(true);
    setProgress(0);

    try {
      setHashResult(await hashFile(file, setProgress));
    } catch (err) {
      setError(err.message || "Could not hash file");
    } finally {
      setBusy(false);
    }
  }

  async function registerProof() {
    if (!hashResult) return;
    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...hashResult, description })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "Registration failed");
      setCertificate(payload.certificate);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="tool-panel" id="register">
      <div className="section-heading">
        <p className="eyebrow">Register proof</p>
        <h2>Create a timestamp without uploading evidence</h2>
      </div>
      <button
        type="button"
        className="drop-zone"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          handleFile(event.dataTransfer.files[0]);
        }}
      >
        <FileUp size={34} aria-hidden="true" />
        <span>Drop a file here or choose one</span>
        <small>SHA-256 runs locally through the browser Web Crypto API</small>
      </button>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(event) => handleFile(event.target.files[0])}
      />

      <div className="privacy-badge">
        <ShieldCheck size={16} aria-hidden="true" />
        File stays on your device
      </div>

      {busy && (
        <div className="progress-wrap">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
        </div>
      )}

      {hashResult && (
        <div className="hash-result">
          <dl className="detail-list compact">
            <div>
              <dt>File</dt>
              <dd>{hashResult.filename}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{formatFileSize(hashResult.filesize)}</dd>
            </div>
            <div>
              <dt>Computed in</dt>
              <dd>{hashResult.readTimeMs} ms</dd>
            </div>
          </dl>
          <pre>{truncate(hashResult.hash)}</pre>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional private context for the certificate"
            rows={3}
          />
          <button type="button" onClick={registerProof} disabled={busy}>
            Register Proof
          </button>
        </div>
      )}

      {error && <p className="error-banner">{error}</p>}
      {certificate && <CertificateCard certificate={certificate} />}
    </section>
  );
}
