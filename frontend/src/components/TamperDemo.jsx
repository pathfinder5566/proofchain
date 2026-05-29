import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const encoder = new TextEncoder();
const starter = "Meeting notes: procurement officer requested a cash payment on 2026-05-29.";

async function hashText(text) {
  const digest = await window.crypto.subtle.digest("SHA-256", encoder.encode(text));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export default function TamperDemo() {
  const [text, setText] = useState(starter);
  const [registeredHash, setRegisteredHash] = useState("");
  const [currentHash, setCurrentHash] = useState("");

  const changed = registeredHash && currentHash && registeredHash !== currentHash;
  const diff = useMemo(() => {
    if (!registeredHash || !currentHash) return null;
    return currentHash.split("").map((char, index) => ({
      char,
      changed: char !== registeredHash[index]
    }));
  }, [registeredHash, currentHash]);

  async function register() {
    const hash = await hashText(text);
    setRegisteredHash(hash);
    setCurrentHash(hash);
  }

  async function verify() {
    setCurrentHash(await hashText(text));
  }

  return (
    <section className="tool-panel demo-panel">
      <div className="section-heading">
        <p className="eyebrow">Live demo</p>
        <h2>Change any character to see tamper detection</h2>
      </div>
      <textarea value={text} onChange={(event) => setText(event.target.value)} rows={4} />
      <div className="button-row">
        <button type="button" onClick={register}>
          <CheckCircle2 size={18} aria-hidden="true" />
          Register this file
        </button>
        <button type="button" className="secondary" onClick={verify}>
          <AlertTriangle size={18} aria-hidden="true" />
          Verify modified file
        </button>
      </div>
      {registeredHash && (
        <div className="demo-hashes">
          <p><strong>Registered:</strong> <code>{registeredHash}</code></p>
          <p><strong>Current:</strong> <code>{currentHash}</code></p>
          {diff && (
            <div className="hash-diff" aria-label="Hash difference">
              {diff.map((item, index) => (
                <span key={`${item.char}-${index}`} className={item.changed ? "changed" : ""}>
                  {item.char}
                </span>
              ))}
            </div>
          )}
          <div className={changed ? "result-banner invalid" : "result-banner valid"}>
            <strong>{changed ? "TAMPERED" : "MATCH"}</strong>
            <span>{changed ? "The hash changed after editing." : "The current content matches the registered proof."}</span>
          </div>
        </div>
      )}
    </section>
  );
}
