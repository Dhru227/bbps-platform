import { useMemo, useState } from "react";

const BOU_LIST = [
  {
    id: "SETU",
    name: "Setu (by Pine Labs)",
    type: "Payment Aggregator",
    onboardingTime: "2-4 days",
    fee: "INR 0 setup · 0.2% TDR",
    support: "24/7 Chat + Phone",
  },
  {
    id: "M2P",
    name: "M2P Fintech",
    type: "NBBL-Licensed Aggregator",
    onboardingTime: "2-3 days",
    fee: "INR 0 setup · 0.23% TDR",
    support: "24/7 Chat + Slack",
  },
  {
    id: "RAZORPAY",
    name: "Razorpay BBPS",
    type: "Payment Aggregator",
    onboardingTime: "3-5 days",
    fee: "INR 0 setup · 0.25% TDR",
    support: "24/7 Chat",
  },
];

const QUESTIONS = [
  {
    id: "entityType",
    question: "What best describes your organisation?",
    options: [
      { value: "proprietor", label: "Individual / Proprietor" },
      { value: "business", label: "Small Business / SME" },
      { value: "company", label: "Company / LLP" },
      { value: "govt", label: "Government / Utility" },
    ],
  },
  {
    id: "billingNature",
    question: "What kind of bills do you issue?",
    type: "text",
    placeholder: "e.g. monthly maintenance for residents",
  },
  {
    id: "billVolume",
    question: "How many bills do you issue every month?",
    options: [
      { value: "100", label: "< 500" },
      { value: "2500", label: "500-5K" },
      { value: "7500", label: "5K-10K" },
      { value: "50000", label: "10K-1L" },
      { value: "200000", label: "> 1 Lakh" },
    ],
  },
  {
    id: "operatingModel",
    question: "How do you want to connect to BBPS?",
    options: [
      { value: "offline", label: "Upload bills manually" },
      { value: "online", label: "Real-time API integration" },
    ],
  },
  {
    id: "techCapability",
    question: "What is your team's technical capability?",
    options: [
      { value: "none", label: "No tech team" },
      { value: "basic", label: "Basic IT support" },
      { value: "advanced", label: "Dedicated dev team" },
    ],
  },
];

function classifyBiller(answers) {
  const vol = Number(answers.billVolume || 0);
  if (vol < 500 && answers.operatingModel === "offline" && answers.techCapability === "none") {
    return { code: "S1", label: "Micro Offline Biller", steps: 7, time: "~50 mins", activation: "Within 24 hours" };
  }
  if (vol <= 5000 && answers.operatingModel === "offline") {
    return { code: "S2", label: "Small Offline Biller", steps: 9, time: "~5-10 days", activation: "Within 3-5 days" };
  }
  if (answers.operatingModel === "online" && vol <= 10000) {
    return { code: "S3", label: "Small Online Biller", steps: 18, time: "~2-4 weeks", activation: "Within 2-3 weeks" };
  }
  return { code: "S4/S5", label: "Advanced / Enterprise Biller", steps: 24, time: "~4-12 weeks", activation: "As per UAT readiness" };
}

function getJourneySteps(segmentCode) {
  const waivedApi = segmentCode === "S1" || segmentCode === "S2";
  return [
    "Verify Identity",
    "Share Business Details",
    "Link Settlement Account",
    "Configure Bill Fields",
    "Sign Biller Agreement",
    "Upload Initial Bills",
    waivedApi ? "API Integration (Waived for your segment)" : "API Integration",
    "Go Live",
  ];
}

export default function IntakeWithOnboardingJourney() {
  const [stage, setStage] = useState("intake");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedBou, setSelectedBou] = useState("");
  const [journeyIndex, setJourneyIndex] = useState(0);

  const question = QUESTIONS[qIndex];
  const segment = useMemo(() => classifyBiller(answers), [answers]);
  const steps = useMemo(() => getJourneySteps(segment.code), [segment.code]);
  const canNext = Boolean(String(answers[question?.id] || "").trim());

  return (
    <div style={{ minHeight: "100dvh", background: "#F8FAFC", padding: 16 }}>
      <div style={{ maxWidth: 860, margin: "0 auto", background: "white", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ background: "linear-gradient(90deg,#0F766E,#0EA5E9)", color: "white", padding: "12px 16px", fontWeight: 800 }}>
          BBPS Biller Intake & Onboarding Journey
        </div>
        <div style={{ padding: 16 }}>
          {stage === "intake" && (
            <>
              <div style={{ fontSize: 12, color: "#64748B", marginBottom: 6 }}>
                Question {qIndex + 1} of {QUESTIONS.length}
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", marginBottom: 12 }}>{question.question}</div>
              {question.type === "text" ? (
                <input
                  value={answers[question.id] || ""}
                  onChange={(e) => setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))}
                  placeholder={question.placeholder}
                  style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: 10, padding: "10px 12px" }}
                />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 8 }}>
                  {question.options.map((opt) => {
                    const active = answers[question.id] === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: opt.value }))}
                        style={{
                          border: active ? "2px solid #0F766E" : "1px solid #E2E8F0",
                          background: active ? "#F0FDFA" : "white",
                          borderRadius: 10,
                          padding: "10px 12px",
                          textAlign: "left",
                          cursor: "pointer",
                          fontWeight: 700,
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              )}
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button
                  onClick={() => setQIndex((v) => Math.max(0, v - 1))}
                  disabled={qIndex === 0}
                  style={{ border: "1px solid #CBD5E1", borderRadius: 8, background: "white", padding: "8px 10px" }}
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    if (qIndex < QUESTIONS.length - 1) {
                      setQIndex((v) => v + 1);
                      return;
                    }
                    setStage("segment");
                  }}
                  disabled={!canNext}
                  style={{ border: "none", borderRadius: 8, background: canNext ? "#0F766E" : "#93C5FD", color: "white", padding: "8px 12px", fontWeight: 700 }}
                >
                  {qIndex < QUESTIONS.length - 1 ? "Next" : "Show Segment"}
                </button>
              </div>
            </>
          )}

          {stage === "segment" && (
            <>
              <div style={{ fontSize: 12, color: "#64748B" }}>Classified segment</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{segment.code}</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{segment.label}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <span style={{ border: "1px solid #E2E8F0", borderRadius: 999, padding: "4px 10px" }}>Steps: {segment.steps}</span>
                <span style={{ border: "1px solid #E2E8F0", borderRadius: 999, padding: "4px 10px" }}>Total Time: {segment.time}</span>
                <span style={{ border: "1px solid #E2E8F0", borderRadius: 999, padding: "4px 10px" }}>Activation: {segment.activation}</span>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button onClick={() => setStage("intake")} style={{ border: "1px solid #CBD5E1", borderRadius: 8, background: "white", padding: "8px 10px" }}>
                  Change Answers
                </button>
                <button onClick={() => setStage("bou")} style={{ border: "none", borderRadius: 8, background: "#0F766E", color: "white", padding: "8px 12px", fontWeight: 700 }}>
                  Continue to BOU Selection
                </button>
              </div>
            </>
          )}

          {stage === "bou" && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Select Biller Operating Unit</div>
              <div style={{ display: "grid", gap: 10 }}>
                {BOU_LIST.map((bou) => {
                  const active = selectedBou === bou.id;
                  return (
                    <button
                      key={bou.id}
                      onClick={() => setSelectedBou(bou.id)}
                      style={{
                        border: active ? "2px solid #0F766E" : "1px solid #E2E8F0",
                        background: active ? "#F0FDFA" : "white",
                        borderRadius: 12,
                        padding: 12,
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ fontSize: 16, fontWeight: 800 }}>{bou.name}</div>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>{bou.type}</div>
                      <div style={{ fontSize: 12, marginTop: 6 }}>
                        {bou.onboardingTime} · {bou.fee} · {bou.support}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button onClick={() => setStage("segment")} style={{ border: "1px solid #CBD5E1", borderRadius: 8, background: "white", padding: "8px 10px" }}>
                  Back
                </button>
                <button
                  onClick={() => setStage("journey")}
                  disabled={!selectedBou}
                  style={{ border: "none", borderRadius: 8, background: selectedBou ? "#0F766E" : "#93C5FD", color: "white", padding: "8px 12px", fontWeight: 700 }}
                >
                  Start Onboarding Journey
                </button>
              </div>
            </>
          )}

          {stage === "journey" && (
            <>
              <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>Actual Onboarding Journey</div>
              <div style={{ fontSize: 12, color: "#64748B", marginBottom: 10 }}>
                BOU: {BOU_LIST.find((b) => b.id === selectedBou)?.name || "Not selected"} · Step {journeyIndex + 1} of {steps.length}
              </div>
              <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 12, background: "#F8FAFC" }}>
                <div style={{ fontSize: 17, fontWeight: 800 }}>{steps[journeyIndex]}</div>
                <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>
                  Complete this step to progress in your BBPS onboarding workflow.
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <button
                  onClick={() => setJourneyIndex((v) => Math.max(0, v - 1))}
                  disabled={journeyIndex === 0}
                  style={{ border: "1px solid #CBD5E1", borderRadius: 8, background: "white", padding: "8px 10px" }}
                >
                  Back
                </button>
                {journeyIndex < steps.length - 1 ? (
                  <button
                    onClick={() => setJourneyIndex((v) => Math.min(steps.length - 1, v + 1))}
                    style={{ border: "none", borderRadius: 8, background: "#0F766E", color: "white", padding: "8px 12px", fontWeight: 700 }}
                  >
                    Continue
                  </button>
                ) : (
                  <button style={{ border: "none", borderRadius: 8, background: "#166534", color: "white", padding: "8px 12px", fontWeight: 700 }}>
                    Onboarding Complete
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
