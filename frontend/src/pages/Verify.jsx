import { useParams } from "react-router-dom";
import BulkVerify from "../components/BulkVerify";
import VerifyPanel from "../components/VerifyPanel";

export default function Verify() {
  const { certId } = useParams();

  return (
    <main className="page-stack">
      <section className="page-heading">
        <p className="eyebrow">Public verification</p>
        <h1>Verify a certificate, file, or hash</h1>
      </section>
      <VerifyPanel initialCertId={certId} />
      <BulkVerify />
    </main>
  );
}
