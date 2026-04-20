import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import BillerOnboardingChat from "./BillerOnboardingChat";
import BbpsBillerIntake from "./BBPS_Biller_Intake_With_Onboarding_Journey";
import SetupStep from "./onboarding/SetupStep";
import "./ragStyles.css";

function SetupPage() {
  const params = new URLSearchParams(window.location.search);
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid #E5E7EB" }}>
        <span style={{ background: "#0F766E", color: "white", fontWeight: 800, fontSize: 13, padding: "4px 10px", borderRadius: 6 }}>BBPS</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#0F172A" }}>Deploy Your Biller Integrator</span>
      </div>
      <SetupStep
        bizName={params.get("bizName") || "Your Business"}
        industry={params.get("industry") || "General"}
        bouId={params.get("bouId") || "BOU001"}
        dataSource={params.get("dataSource") || "Database"}
        sessionId={params.get("sessionId") || "sess_demo"}
        onSuccess={(billerId) => {
          window.opener && window.opener.postMessage({ type: "BILLER_REGISTERED", billerId }, "*");
        }}
      />
    </div>
  );
}

function MainApp() {
  const [mode, setMode] = useState("wizard");
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB" }}>
      <div style={{ display: "flex", gap: 8, padding: "16px 24px", borderBottom: "1px solid #E5E7EB", background: "#fff" }}>
        <button
          onClick={() => setMode("wizard")}
          style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
            background: mode === "wizard" ? "#0F766E" : "#F3F4F6",
            color: mode === "wizard" ? "#fff" : "#374151", fontWeight: 600 }}
        >
          Onboarding Wizard
        </button>
        <button
          onClick={() => setMode("chat")}
          style={{ padding: "8px 20px", borderRadius: 8, border: "none", cursor: "pointer",
            background: mode === "chat" ? "#0F766E" : "#F3F4F6",
            color: mode === "chat" ? "#fff" : "#374151", fontWeight: 600 }}
        >
          AI Chat Guide
        </button>
      </div>
      {mode === "wizard" ? <BbpsBillerIntake /> : <BillerOnboardingChat />}
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/setup" element={<SetupPage />} />
      <Route path="*" element={<MainApp />} />
    </Routes>
  );
}
