import { useMemo, useState } from "react";

const QUESTIONS = [
  {
    id: "entityType",
    question: "What best describes your organisation?",
    hint: "This helps us match the right onboarding journey.",
    type: "cards",
    options: [
      { value: "proprietor", label: "Individual / Proprietor", icon: "👤", eg: "Freelancer, shop owner" },
      { value: "business", label: "Small Business / SME", icon: "🏪", eg: "School, clinic, society" },
      { value: "company", label: "Company / LLP", icon: "🏢", eg: "Pvt Ltd, fintech, NBFC" },
      { value: "govt", label: "Government / Utility", icon: "🏛️", eg: "Municipal body, DISCOM" },
    ],
  },
  {
    id: "billingNature",
    question: "What kind of bills do you issue?",
    hint: "Describe in plain words. This maps your biller category.",
    type: "text",
    placeholder: "e.g. Monthly maintenance charges for residents",
  },
  {
    id: "billVolume",
    question: "How many bills do you issue every month?",
    hint: "Approximate bill volume is fine.",
    type: "volume_cards",
    options: [
      { value: "lt_500", label: "< 500", sublabel: "Micro volume", icon: "🏡" },
      { value: "500_5k", label: "500 - 5K", sublabel: "Small volume", icon: "🏘️" },
      { value: "5k_10k", label: "5K - 10K", sublabel: "Medium volume", icon: "🏙️" },
      { value: "10k_1l", label: "10K - 1L", sublabel: "Large volume", icon: "🌆" },
      { value: "gt_1l", label: "> 1 Lakh", sublabel: "Enterprise", icon: "🌐" },
    ],
  },
  {
    id: "operatingModel",
    question: "How do you want to connect to BBPS?",
    hint: "This decides your integration path and billing model.",
    type: "cards",
    options: [
      { value: "offline", label: "Upload bills manually", icon: "📤", eg: "App/CSV upload, no coding" },
      { value: "online", label: "Real-time API integration", icon: "⚡", eg: "Live bill fetch via API" },
      { value: "qr_itemised", label: "QR-based itemised billing", icon: "📲", eg: "Track item-level transactions, generate bill later" },
    ],
  },
  {
    id: "techCapability",
    question: "What is your team's technical capability?",
    hint: "Use the closest option.",
    type: "cards",
    options: [
      { value: "none", label: "No tech team", icon: "🙅", eg: "Need no-code setup" },
      { value: "basic", label: "Basic IT support", icon: "💻", eg: "Can follow integration guide" },
      { value: "advanced", label: "Dedicated dev team", icon: "👨‍💻", eg: "Can build/host APIs" },
    ],
    skipIf: (answers) => answers.operatingModel === "qr_itemised",
  },
  {
    id: "coverage",
    question: "Where do you issue bills?",
    hint: "Coverage helps map implementation complexity.",
    type: "cards",
    options: [
      { value: "single", label: "Single State / City", icon: "📍", eg: "Local operations" },
      { value: "multi", label: "Multiple States", icon: "🗺️", eg: "Regional / National" },
    ],
  },
];

function classifySegment(answers) {
  const volume = String(answers.billVolume || "");
  const mode = String(answers.operatingModel || "");
  const tech = String(answers.techCapability || "");
  if (mode === "qr_itemised") {
    return { code: "S7", label: "QR-Itemised Biller", steps: 8, time: "~90 mins", waived: 5 };
  }
  if (volume === "lt_500" && mode === "offline" && tech === "none") {
    return { code: "S1", label: "Micro Offline Biller", steps: 7, time: "~50 mins", waived: 6 };
  }
  if (volume === "500_5k" && mode === "offline") {
    return { code: "S2", label: "Small Offline Biller", steps: 9, time: "~5-10 days", waived: 4 };
  }
  if (mode === "online" && (volume === "500_5k" || volume === "5k_10k")) {
    return { code: "S3", label: "Small Online Biller", steps: 18, time: "~2-4 weeks", waived: 2 };
  }
  if (mode === "offline" && (volume === "10k_1l" || volume === "gt_1l")) {
    return { code: "S6", label: "Enterprise Offline Biller", steps: 24, time: "~4-8 weeks", waived: 2 };
  }
  if (mode === "online" && volume === "gt_1l") {
    return { code: "S5", label: "Enterprise Online Biller", steps: 40, time: "~8-12 weeks", waived: 0 };
  }
  return { code: "S4", label: "Mid-Size Online Biller", steps: 32, time: "~4-6 weeks", waived: 0 };
}

function toOnboardingProfile(answers) {
  const entityMap = {
    proprietor: "proprietorship",
    business: "business",
    company: "pvt_ltd",
    govt: "government",
  };
  const billerSizeMap = {
    lt_500: "micro",
    "500_5k": "small",
    "5k_10k": "small",
    "10k_1l": "medium",
    gt_1l: "large",
  };
  const monthlyBandMap = {
    lt_500: "lt_10000",
    "500_5k": "10000_50000",
    "5k_10k": "50000_200000",
    "10k_1l": "200000_1000000",
    gt_1l: "gt_1000000",
  };
  const tpsMap = {
    lt_500: "lt_10",
    "500_5k": "lt_10",
    "5k_10k": "10_20",
    "10k_1l": "20_50",
    gt_1l: "50_plus",
  };
  const techMap = { none: "no_api", basic: "bou_hosted", advanced: "own_api" };
  const coverageMap = { single: "single_state", multi: "all_india" };
  return {
    legal_entity_type: entityMap[answers.entityType] || "business",
    industry_category: String(answers.billingNature || "general").slice(0, 120),
    biller_size: billerSizeMap[answers.billVolume] || "small",
    biller_mode: answers.operatingModel || "offline",
    operating_coverage: coverageMap[answers.coverage] || "single_state",
    monthly_bill_volume_band: monthlyBandMap[answers.billVolume] || "10000_50000",
    tech_maturity: answers.operatingModel === "qr_itemised" ? "no_api" : techMap[answers.techCapability] || "no_api",
    expected_tps_band: tpsMap[answers.billVolume] || "lt_10",
  };
}

function CardOptions({ q, value, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {q.options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            border:
              value === opt.value
                ? "2px solid #0F766E"
                : opt.value === "qr_itemised"
                ? "1.5px solid #0D9488"
                : "1px solid #E2E8F0",
            background:
              value === opt.value
                ? "#F0FDFA"
                : opt.value === "qr_itemised"
                ? "linear-gradient(135deg,#F0FDFA,#ECFEFF)"
                : "white",
            borderRadius: 10,
            padding: "10px 10px",
            textAlign: "left",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 20 }}>{opt.icon}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginTop: 4 }}>
            {opt.label}
            {opt.value === "qr_itemised" && (
              <span style={{ marginLeft: 6, fontSize: 9, fontWeight: 800, background: "#0D6E6E", color: "white", borderRadius: 4, padding: "2px 4px" }}>
                NEW
              </span>
            )}
          </div>
          <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>{opt.eg}</div>
        </button>
      ))}
    </div>
  );
}

function VolumeOptions({ q, value, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 6 }}>
      {q.options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          style={{
            border: value === opt.value ? "2px solid #D97706" : "1px solid #E2E8F0",
            background: value === opt.value ? "#FFFBEB" : "white",
            borderRadius: 10,
            padding: "8px 4px",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          <div style={{ fontSize: 18 }}>{opt.icon}</div>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#0F172A" }}>{opt.label}</div>
          <div style={{ fontSize: 9, color: "#64748B" }}>{opt.sublabel}</div>
        </button>
      ))}
    </div>
  );
}

export default function IntakeJourneyView({ disabled, onComplete }) {
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [stage, setStage] = useState("questions"); // questions | result
  const visibleQuestions = useMemo(
    () => QUESTIONS.filter((item) => !item.skipIf || !item.skipIf(answers)),
    [answers]
  );
  const q = visibleQuestions[qIndex];
  const val = answers[q.id] || "";
  const canProceed = Boolean(String(val).trim());
  const segment = useMemo(() => classifySegment(answers), [answers]);

  const handleNext = () => {
    if (qIndex < visibleQuestions.length - 1) {
      setQIndex((v) => v + 1);
      return;
    }
    setStage("result");
  };

  const handleStart = () => {
    if (disabled) return;
    const profile = toOnboardingProfile(answers);
    onComplete?.(profile);
  };

  if (stage === "result") {
    return (
      <div style={{ marginTop: 10, border: "1px solid #DBEAFE", borderRadius: 12, background: "white", padding: 12 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#D97706", fontWeight: 700 }}>YOUR SEGMENT</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#0F172A", marginTop: 4 }}>{segment.code}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginTop: 2 }}>{segment.label}</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 10px", fontSize: 12 }}>
            Steps: <b>{segment.steps}</b>
          </div>
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 10px", fontSize: 12 }}>
            Time: <b>{segment.time}</b>
          </div>
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "8px 10px", fontSize: 12 }}>
            Waived: <b>{segment.waived}</b>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            onClick={() => setStage("questions")}
            style={{ border: "1px solid #CBD5E1", borderRadius: 8, padding: "8px 10px", background: "white", fontWeight: 700, cursor: "pointer" }}
          >
            Change Answers
          </button>
          <button
            disabled={disabled}
            onClick={handleStart}
            style={{
              border: "none",
              borderRadius: 8,
              padding: "8px 10px",
              background: disabled ? "#93C5FD" : "#0F766E",
              color: "white",
              fontWeight: 700,
              cursor: disabled ? "not-allowed" : "pointer",
            }}
          >
            Generate Advisory Plan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 10, border: "1px solid #DBEAFE", borderRadius: 12, background: "white", padding: 12 }}>
      <div style={{ fontSize: 11, letterSpacing: "0.08em", color: "#D97706", fontWeight: 700 }}>
        QUESTION {qIndex + 1} OF {visibleQuestions.length}
      </div>
      <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A", marginTop: 6 }}>{q.question}</div>
      <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, marginBottom: 10 }}>{q.hint}</div>

      {q.type === "cards" && <CardOptions q={q} value={val} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />}
      {q.type === "volume_cards" && <VolumeOptions q={q} value={val} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />}
      {q.type === "text" && (
        <input
          value={val}
          onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
          placeholder={q.placeholder}
          style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: 10, padding: "10px 12px", fontSize: 13 }}
        />
      )}
      {q.id === "operatingModel" && val === "qr_itemised" && (
        <div style={{ marginTop: 10, border: "1px solid #5ECECE", background: "linear-gradient(135deg,#D0F0EE,#CFFAFE)", borderRadius: 10, padding: "10px 12px" }}>
          <div style={{ fontSize: 11, color: "#0D6E6E", fontWeight: 800, letterSpacing: "0.04em", marginBottom: 6 }}>QR-ITEMISED FLOW</div>
          <div style={{ fontSize: 12, color: "#164E63" }}>Customers scan your QR, items accumulate in ledger, then you approve and generate consolidated bills.</div>
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {qIndex > 0 && (
          <button
            onClick={() => setQIndex((v) => Math.max(0, v - 1))}
            style={{ border: "1px solid #CBD5E1", borderRadius: 8, padding: "8px 10px", background: "white", fontWeight: 700, cursor: "pointer" }}
          >
            Back
          </button>
        )}
        <button
          disabled={!canProceed}
          onClick={handleNext}
          style={{
            border: "none",
            borderRadius: 8,
            padding: "8px 10px",
            background: canProceed ? "#0F766E" : "#93C5FD",
            color: "white",
            fontWeight: 700,
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          {qIndex === visibleQuestions.length - 1 ? "Show My Segment" : "Next"}
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
        {visibleQuestions.map((_, idx) => (
          <div
            key={idx}
            style={{
              width: idx === qIndex ? 20 : 7,
              height: 7,
              borderRadius: 4,
              background: idx < qIndex ? "#0F766E" : idx === qIndex ? "#D97706" : "#E5E7EB",
              transition: "all 0.2s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
