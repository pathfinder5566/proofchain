import { jsPDF } from "jspdf";
import { generateQRDataURL } from "./generateQR";
import formatFileSize from "./formatFileSize";

export async function downloadCertificate(certData) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();
  const margin = 44;
  const qr = await generateQRDataURL(certData.verify_url);

  doc.setDrawColor("#0f766e");
  doc.setLineWidth(2);
  doc.rect(24, 24, width - 48, height - 48);

  doc.setTextColor("#07111f");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("PROOF OF EXISTENCE CERTIFICATE", margin, 88);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text("ProofChain Cryptographic Timestamp Registry", margin, 112);

  const rows = [
    ["Certificate ID", certData.cert_id],
    ["File Name", certData.filename],
    ["File Size", formatFileSize(certData.filesize)],
    ["Registered At", new Date(certData.registered_at).toLocaleString()],
    ["Verify URL", certData.verify_url]
  ];

  let y = 168;
  rows.forEach(([label, value]) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value || "-"), 180, y, { maxWidth: width - 230 });
    y += 32;
  });

  doc.setFont("courier", "normal");
  doc.setFontSize(10);
  doc.text("SHA-256 Hash:", margin, y);
  doc.text(doc.splitTextToSize(certData.hash, width - margin * 2), margin, y + 22);

  doc.addImage(qr, "PNG", width - 166, height - 188, 104, 104);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text("Scan to verify", width - 150, height - 72);

  doc.setFontSize(11);
  doc.text(
    "This certificate proves the above file existed at the registered timestamp.",
    margin,
    height - 112
  );
  doc.text(`Verify at: ${certData.verify_url}`, margin, height - 92, { maxWidth: width - 230 });

  doc.save(`proofchain-${certData.cert_id}.pdf`);
}
