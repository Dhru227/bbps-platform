import { useMemo, useState } from "react";

function Pill({ text, color = "#0F766E", bg = "#CCFBF1" }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        color,
        background: bg,
      }}
    >
      {text}
    </span>
  );
}

function ProgressBar({ currentStep, total, color = "#0F766E" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {Array.from({ length: total }).map((_, idx) => {
        const done = idx < currentStep - 1;
        const active = idx === currentStep - 1;
        return (
          <div
            key={idx}
            style={{
              height: active ? 6 : 4,
              flex: active ? 2 : 1,
              borderRadius: 8,
              background: done ? color : active ? "#D97706" : "#E5E7EB",
              transition: "all 0.2s ease",
            }}
          />
        );
      })}
    </div>
  );
}

export default function S1JourneyView({
  advisoryPlan,
  onboardingHref,
  onboardingCtaLabel = "Continue to actual onboarding",
  color = "#0F766E",
  summaryBg = "#EEF2FF",
}) {
  const steps = useMemo(() => advisoryPlan?.journey_steps || [], [advisoryPlan]);
  const [current, setCurrent] = useState(1);
  if (!Array.isArray(steps) || steps.length === 0) return null;

  const clampedCurrent = Math.max(1, Math.min(current, steps.length));
  const step = steps[clampedCurrent - 1];
  const summary = advisoryPlan?.journey_summary || {};
  const segmentLabel = advisoryPlan?.segment_label || "S1: Micro Offline";

  return (
    <div style={{ marginTop: 10, border: "1px solid #DBEAFE", borderRadius: 14, background: "white", padding: 12 }}>
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>Guided Journey</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#0F172A" }}>{segmentLabel}</div>
        <div style={{ marginTop: 6 }}>
          <ProgressBar currentStep={clampedCurrent} total={steps.length} color={color} />
        </div>
      </div>

      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>{step.title}</div>
          {step.duration && (
            <div style={{ fontSize: 11, fontWeight: 700, color: "#D97706", whiteSpace: "nowrap" }}>{step.duration}</div>
          )}
        </div>
        {step.subtitle && <div style={{ fontSize: 12, color: "#475569", marginBottom: 8 }}>{step.subtitle}</div>}
        {step.description && <div style={{ fontSize: 13, color: "#334155", marginBottom: 10 }}>{step.description}</div>}

        {Array.isArray(step.highlights) && step.highlights.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            {step.highlights.map((h, idx) => (
              <div key={idx} style={{ background: h.ok ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${h.ok ? "#86EFAC" : "#FCA5A5"}`, borderRadius: 8, padding: 8 }}>
                <div style={{ fontSize: 11, color: "#64748B" }}>{h.label}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: h.ok ? "#166534" : "#991B1B" }}>{h.value}</div>
              </div>
            ))}
          </div>
        )}

        {Array.isArray(step.steps) && step.steps.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6 }}>Step actions</div>
            <ol style={{ margin: 0, paddingLeft: 18 }}>
              {step.steps.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 4, fontSize: 13, color: "#334155" }}>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        )}

        {step.code !== "SEGMENT" && Array.isArray(step.waived_steps) && step.waived_steps.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 6 }}>
              Waived for this segment
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {step.waived_steps.map((item, idx) => (
                <Pill key={idx} text={item} color="#166534" bg="#DCFCE7" />
              ))}
            </div>
          </div>
        )}

        {step.tip && (
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 10px", fontSize: 12, color: "#92400E" }}>
            {step.tip}
          </div>
        )}
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button
          onClick={() => setCurrent((v) => Math.max(1, v - 1))}
          disabled={clampedCurrent === 1}
          style={{
            border: "1px solid #CBD5E1",
            borderRadius: 8,
            padding: "7px 10px",
            background: "white",
            cursor: clampedCurrent === 1 ? "not-allowed" : "pointer",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Back
        </button>
        <button
          onClick={() => setCurrent((v) => Math.min(steps.length, v + 1))}
          disabled={clampedCurrent === steps.length}
          style={{
            border: "none",
            borderRadius: 8,
            padding: "7px 10px",
            background: "#0F766E",
            color: "white",
            cursor: clampedCurrent === steps.length ? "not-allowed" : "pointer",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          Next
        </button>
      </div>

      {Object.keys(summary).length > 0 && (
        <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 6 }}>
          {Object.entries(summary)
            .filter(([key]) => key !== "steps_waived")
            .map(([key, value]) => {
              const labelMap = {
                total_time: "Total Time",
                steps_completed: "Steps",
                activation_time: "Activation Time",
              };
              const label = labelMap[key] || key.replace(/_/g, " ");
              return <Pill key={key} text={`${label}: ${value}`} color="#3730A3" bg={summaryBg} />;
            })}
        </div>
      )}

      {onboardingHref && (
        <a
          href={onboardingHref}
          target="_blank"
          rel="noreferrer"
          style={{
            marginTop: 12,
            display: "inline-block",
            textDecoration: "none",
            borderRadius: 8,
            padding: "8px 12px",
            fontSize: 12,
            fontWeight: 700,
            color: "white",
            background: color,
          }}
        >
          {onboardingCtaLabel}
        </a>
      )}
    </div>
  );
}
