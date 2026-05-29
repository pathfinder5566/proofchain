import { useEffect, useState } from "react";
import { CheckCircle2, Copy, Download } from "lucide-react";
import { generateQRDataURL } from "../utils/generateQR";
import { downloadCertificate } from "../utils/generatePDF";
import formatFileSize from "../utils/formatFileSize";

const truncate = (hash) => `${hash.slice(0, 16)}...${hash.slice(-16)}`;

export default function CertificateCard({ certificate }) {
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateQRDataURL(certificate.verify_url).then(setQr);
  }, [certificate.verify_url]);

  async function copyLink() {
    await navigator.clipboard.writeText(certificate.verify_url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="certificate-card">
      <div className="success-banner">
        <CheckCircle2 size={20} aria-hidden="true" />
        Proof registered successfully
      </div>
      <div className="certificate-grid">
        <div>
          <p className="eyebrow">Certificate ID</p>
          <h3>{certificate.cert_id}</h3>
          <dl className="detail-list">
            <div>
              <dt>File</dt>
              <dd>{certificate.filename}</dd>
            </div>
            <div>
              <dt>Size</dt>
              <dd>{formatFileSize(certificate.filesize)}</dd>
            </div>
            <div>
              <dt>Timestamp</dt>
              <dd>{new Date(certificate.registered_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt>SHA-256</dt>
              <dd className="mono">{truncate(certificate.hash)}</dd>
            </div>
          </dl>
          <p className="info-box">This certificate proves your file existed at this exact time.</p>
        </div>
        <div className="qr-box">{qr && <img src={qr} alt="Certificate verification QR code" />}</div>
      </div>
      <div className="button-row">
        <button type="button" onClick={() => downloadCertificate(certificate)}>
          <Download size={18} aria-hidden="true" />
          Download PDF Certificate
        </button>
        <button type="button" className="secondary" onClick={copyLink}>
          <Copy size={18} aria-hidden="true" />
          {copied ? "Copied" : "Copy Verify Link"}
        </button>
      </div>
    </section>
  );
}
