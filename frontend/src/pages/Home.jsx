import { LockKeyhole, ScanSearch, ShieldCheck } from "lucide-react";
import FileHasher from "../components/FileHasher";
import TamperDemo from "../components/TamperDemo";

const features = [
  {
    icon: LockKeyhole,
    title: "Zero Upload",
    text: "Your file never leaves your device. Only its SHA-256 fingerprint reaches the registry."
  },
  {
    icon: ShieldCheck,
    title: "Cryptographic Proof",
    text: "One byte changes the fingerprint completely, making tampering immediately visible."
  },
  {
    icon: ScanSearch,
    title: "Public Verification",
    text: "Anyone can verify a certificate or file hash later without an account."
  }
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          {/* <p className="eyebrow">Whistleblower proof-of-existence</p> */}
          <h1>Prove your evidence exists. Without exposing it.</h1>
          {/* <p>
            ProofChain timestamps evidence through browser-native cryptography, storing only a
            one-way SHA-256 hash and a server-side timestamp.
          </p> */}
        </div>
      </section>

      <section className="feature-grid" aria-label="Core features">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <article className="feature-card" key={feature.title}>
              <Icon size={24} aria-hidden="true" />
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
            </article>
          );
        })}
      </section>

      <FileHasher />
      <TamperDemo />
    </main>
  );
}
