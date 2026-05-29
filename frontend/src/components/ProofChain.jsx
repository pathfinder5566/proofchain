import { GitBranch } from "lucide-react";

export default function ProofChain({ chain = [] }) {
  if (!chain.length) return null;

  return (
    <section className="chain-list">
      <GitBranch size={20} aria-hidden="true" />
      {chain.map((cert) => (
        <article key={cert.cert_id}>
          <strong>{cert.filename}</strong>
          <span>{new Date(cert.registered_at).toLocaleString()}</span>
          <code>{cert.cert_id}</code>
        </article>
      ))}
    </section>
  );
}
