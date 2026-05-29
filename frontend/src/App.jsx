import { Link, Route, Routes } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import Home from "./pages/Home.jsx";
import Verify from "./pages/Verify.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand" aria-label="ProofChain home">
          <ShieldCheck size={28} aria-hidden="true" />
          <span>ProofChain</span>
        </Link>
        <nav>
          <Link to="/">Register</Link>
          <Link to="/verify">Verify</Link>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:certId" element={<Verify />} />
      </Routes>
    </div>
  );
}
