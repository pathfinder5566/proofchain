import { useRef, useState } from "react";
import { Files } from "lucide-react";
import hashFile from "../utils/hashFile";

export default function BulkVerify() {
  const inputRef = useRef(null);
  const [rows, setRows] = useState([]);
  const [busy, setBusy] = useState(false);

  async function handleFiles(fileList) {
    const files = [...fileList].slice(0, 10);
    if (files.length === 0) return;
    setBusy(true);
    const hashed = await Promise.all(files.map((file) => hashFile(file)));
    const response = await fetch("/api/bulk-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hashes: hashed.map((item) => item.hash) })
    });
    const payload = await response.json();
    setRows(
      hashed.map((item, index) => ({
        ...item,
        status: payload.results[index]?.status || "UNKNOWN"
      }))
    );
    setBusy(false);
  }

  return (
    <section className="tool-panel">
      <div className="section-heading">
        <p className="eyebrow">Bulk verification</p>
        <h2>Check up to 10 files at once</h2>
      </div>
      <button type="button" className="drop-zone compact-drop" onClick={() => inputRef.current?.click()}>
        <Files size={28} aria-hidden="true" />
        <span>Select files</span>
      </button>
      <input ref={inputRef} type="file" multiple hidden onChange={(event) => handleFiles(event.target.files)} />
      {busy && <p className="muted">Hashing and checking files...</p>}
      {rows.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>File</th>
              <th>Hash</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.hash}>
                <td>{row.filename}</td>
                <td className="mono">{row.hash.slice(0, 12)}...{row.hash.slice(-12)}</td>
                <td><span className={`status-pill ${row.status.toLowerCase()}`}>{row.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
