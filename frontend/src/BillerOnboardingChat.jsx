import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ONBOARDING_API_BASE_URL, ONBOARDING_JOURNEY_URL } from "./apiConfig";
import { BRAND_THEME } from "./theme";
import S1JourneyView from "./onboarding/S1JourneyView";
import S2JourneyView from "./onboarding/S2JourneyView";
import S3JourneyView from "./onboarding/S3JourneyView";
import S4JourneyView from "./onboarding/S4JourneyView";
import S5JourneyView from "./onboarding/S5JourneyView";
import S6JourneyView from "./onboarding/S6JourneyView";
import S7JourneyView from "./onboarding/S7JourneyView";
import IntakeJourneyView from "./onboarding/IntakeJourneyView";

const API_KEY = "app-dev-key";
const CHAT_LANGUAGE_KEY = "bharat-connect-language-v1";
const ONBOARDING_STORAGE_KEY = "bharat-connect-onboarding-chat-v1";

const headers = (languagePreference) => ({
  "X-API-Key": API_KEY,
  "X-User-Language": languagePreference || "en-IN",
  "Content-Type": "application/json",
});

const inferInitialLanguage = () => {
  const saved = localStorage.getItem(CHAT_LANGUAGE_KEY);
  if (saved) return saved;
  if (typeof navigator !== "undefined" && navigator.language) return navigator.language;
  return "en-IN";
};

const defaultWelcomeMessage = {
  role: "assistant",
  content:
    "Welcome to BBPS Biller Onboarding Guidance. Share your profile and I will generate an advisory plan (segment, timeline, documents, and BOU options).",
  uiDirectiveResolved: false,
};

const UI_TEXT = {
  "en-IN": {
    header: "Biller Onboarding Guidance Chat",
    clearChat: "Clear Chat",
    placeholder: "Ask onboarding questions...",
    send: "Send",
    status: "Working on onboarding guidance...",
    cta: "Continue to actual onboarding",
  },
  "hi-IN": {
    header: "बिलर ऑनबोर्डिंग मार्गदर्शन चैट",
    clearChat: "चैट साफ करें",
    placeholder: "ऑनबोर्डिंग प्रश्न पूछें...",
    send: "भेजें",
    status: "ऑनबोर्डिंग मार्गदर्शन तैयार किया जा रहा है...",
    cta: "वास्तविक ऑनबोर्डिंग पर जाएं",
  },
  "bn-IN": {
    header: "বিলার অনবোর্ডিং নির্দেশনা চ্যাট",
    clearChat: "চ্যাট পরিষ্কার করুন",
    placeholder: "অনবোর্ডিং প্রশ্ন করুন...",
    send: "পাঠান",
    status: "অনবোর্ডিং নির্দেশনা প্রস্তুত করা হচ্ছে...",
    cta: "আসল অনবোর্ডিং-এ যান",
  },
  "or-IN": {
    header: "ବିଲର୍ ଅନବୋର୍ଡିଂ ମାର୍ଗଦର୍ଶନ ଚାଟ୍",
    clearChat: "ଚାଟ୍ ସଫା କରନ୍ତୁ",
    placeholder: "ଅନବୋର୍ଡିଂ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...",
    send: "ପଠାନ୍ତୁ",
    status: "ଅନବୋର୍ଡିଂ ମାର୍ଗଦର୍ଶନ ପ୍ରସ୍ତୁତ ହେଉଛି...",
    cta: "ଆସଲ ଅନବୋର୍ଡିଂକୁ ଯାଆନ୍ତୁ",
  },
  "ta-IN": {
    header: "பில்லர் Onboarding வழிகாட்டல் அரட்டை",
    clearChat: "அரட்டை அழி",
    placeholder: "Onboarding கேள்விகளை கேளுங்கள்...",
    send: "அனுப்பு",
    status: "Onboarding வழிகாட்டல் தயார் செய்யப்படுகிறது...",
    cta: "உண்மையான onboarding-க்கு செல்லவும்",
  },
  "te-IN": {
    header: "బిల్లర్ ఆన్‌బోర్డింగ్ మార్గదర్శక చాట్",
    clearChat: "చాట్ క్లియర్ చేయండి",
    placeholder: "ఆన్‌బోర్డింగ్ ప్రశ్నలు అడగండి...",
    send: "పంపండి",
    status: "ఆన్‌బోర్డింగ్ మార్గదర్శకం సిద్ధమవుతోంది...",
    cta: "అసలు ఆన్‌బోర్డింగ్‌కి వెళ్లండి",
  },
};

const getUiText = (locale) => UI_TEXT[locale] || UI_TEXT["en-IN"];

function encodeLaunchPayload(payload) {
  try {
    const json = JSON.stringify(payload || {});
    const b64 = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  } catch {
    return "";
  }
}

function buildOnboardingLaunchUrl(baseUrl, payload) {
  try {
    const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
    const url = new URL(baseUrl, origin);
    const encoded = encodeLaunchPayload(payload);
    if (encoded) url.searchParams.set("launch", encoded);
    return url.toString();
  } catch {
    return baseUrl;
  }
}

function formatOnboardingNetworkError(err) {
  const msg = String(err?.message || "");
  const isNetwork =
    !msg ||
    /failed to fetch/i.test(msg) ||
    /load failed/i.test(msg) ||
    /networkerror/i.test(msg);

  if (!isNetwork) return msg || "Onboarding request failed";

  return [
    `Could not reach onboarding API at ${ONBOARDING_API_BASE_URL}.`,
    "For access from other devices, start onboarding API with:",
    "uvicorn onboarding_api_server.main:app --reload --host 0.0.0.0 --port 8100",
    "Then verify from your phone/laptop browser: http://<your-lan-ip>:8100/health",
  ].join(" ");
}

function renderInline(text) {
  const parts = String(text || "").split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} style={{ background: "#E2E8F0", borderRadius: 6, padding: "1px 6px", fontSize: "0.92em" }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} style={{ fontWeight: 700 }}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <Fragment key={idx}>{part}</Fragment>;
  });
}

function MarkdownText({ content }) {
  const lines = String(content || "").split("\n");
  const blocks = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i += 1;
      continue;
    }
    if (/^#{1,3}\s+/.test(line)) {
      blocks.push(
        <div key={`h-${i}`} style={{ fontWeight: 800, marginTop: 8, marginBottom: 4, fontSize: 18 }}>
          {renderInline(line.replace(/^#{1,3}\s+/, ""))}
        </div>
      );
      i += 1;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ul key={`u-${i}`} style={{ margin: "6px 0 10px", paddingLeft: 18 }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 3 }}>
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i += 1;
      }
      blocks.push(
        <ol key={`o-${i}`} style={{ margin: "6px 0 10px", paddingLeft: 18 }}>
          {items.map((item, idx) => (
            <li key={idx} style={{ marginBottom: 3 }}>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }
    const paragraph = [];
    while (i < lines.length && lines[i].trim() && !/^[-*]\s+/.test(lines[i]) && !/^\d+\.\s+/.test(lines[i]) && !/^#{1,3}\s+/.test(lines[i])) {
      paragraph.push(lines[i]);
      i += 1;
    }
    blocks.push(
      <p key={`p-${i}`} style={{ margin: "0 0 8px", lineHeight: 1.5 }}>
        {renderInline(paragraph.join(" "))}
      </p>
    );
  }
  return <div>{blocks}</div>;
}

function SelectionCard({ directive, disabled, onSelect }) {
  if (!directive || directive.type !== "single_select") return null;
  return (
    <div style={{ marginTop: 10, border: "1px solid #DBEAFE", borderRadius: 12, background: "white", padding: 8 }}>
      {(directive.options || []).map((option, idx) => (
        <button
          key={option.id || `${option.value}-${idx}`}
          disabled={disabled}
          onClick={() => onSelect(option)}
          style={{
            width: "100%",
            textAlign: "left",
            marginBottom: 6,
            border: "1px solid #CBD5E1",
            borderRadius: 8,
            background: "#F8FAFC",
            padding: "8px 10px",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function FormCard({ directive, disabled, onSubmit }) {
  const initialValues = Object.fromEntries((directive?.fields || []).map((f) => [f.name, ""]));
  const [values, setValues] = useState(initialValues);
  if (!directive || directive.type !== "form") return null;
  return (
    <div style={{ marginTop: 10, border: "1px solid #DBEAFE", borderRadius: 12, background: "white", padding: 10 }}>
      {(directive.fields || []).map((field) => (
        <div key={field.name} style={{ marginBottom: 8 }}>
          <label style={{ display: "block", fontSize: 12, marginBottom: 4 }}>{field.label}</label>
          {field.type === "select" && Array.isArray(field.options) && field.options.length > 0 ? (
            <select
              value={values[field.name] || ""}
              disabled={disabled}
              onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
              style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}
            >
              <option value="">Select...</option>
              {field.options.map((option) => (
                <option key={option.id || option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              value={values[field.name] || ""}
              disabled={disabled}
              onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
              style={{ width: "100%", border: "1px solid #CBD5E1", borderRadius: 8, padding: "8px 10px", fontSize: 13 }}
            />
          )}
        </div>
      ))}
      <button
        disabled={disabled}
        onClick={() => onSubmit(values)}
        style={{
          border: "none",
          borderRadius: 8,
          padding: "8px 12px",
          background: BRAND_THEME.headerGradient,
          color: "white",
          fontWeight: 700,
          cursor: disabled ? "not-allowed" : "pointer",
        }}
      >
        {directive.submit_label || "Submit"}
      </button>
    </div>
  );
}

function isOnboardingProfileDirective(directive) {
  if (!directive || directive.type !== "form") return false;
  const names = new Set((directive.fields || []).map((f) => f?.name));
  return names.has("legal_entity_type") || names.has("biller_size") || names.has("biller_mode");
}

function JourneyCard({ advisoryPlan, onboardingHref, onboardingCtaLabel }) {
  const segment = String(advisoryPlan?.segment || "");
  if (segment === "S1_MICRO_OFFLINE") {
    return (
      <S1JourneyView
        advisoryPlan={advisoryPlan}
        onboardingHref={onboardingHref}
        onboardingCtaLabel={onboardingCtaLabel}
      />
    );
  }
  if (segment === "S2") {
    return (
      <S2JourneyView
        advisoryPlan={advisoryPlan}
        onboardingHref={onboardingHref}
        onboardingCtaLabel={onboardingCtaLabel}
      />
    );
  }
  if (segment === "S3") {
    return (
      <S3JourneyView
        advisoryPlan={advisoryPlan}
        onboardingHref={onboardingHref}
        onboardingCtaLabel={onboardingCtaLabel}
      />
    );
  }
  if (segment === "S4") {
    return (
      <S4JourneyView
        advisoryPlan={advisoryPlan}
        onboardingHref={onboardingHref}
        onboardingCtaLabel={onboardingCtaLabel}
      />
    );
  }
  if (segment === "S5") {
    return (
      <S5JourneyView
        advisoryPlan={advisoryPlan}
        onboardingHref={onboardingHref}
        onboardingCtaLabel={onboardingCtaLabel}
      />
    );
  }
  if (segment === "S6") {
    return (
      <S6JourneyView
        advisoryPlan={advisoryPlan}
        onboardingHref={onboardingHref}
        onboardingCtaLabel={onboardingCtaLabel}
      />
    );
  }
  if (segment === "S7") {
    return (
      <S7JourneyView
        advisoryPlan={advisoryPlan}
        onboardingHref={onboardingHref}
        onboardingCtaLabel={onboardingCtaLabel}
      />
    );
  }
  return (
    <S1JourneyView
      advisoryPlan={advisoryPlan}
      onboardingHref={onboardingHref}
      onboardingCtaLabel={onboardingCtaLabel}
    />
  );
}

export default function BillerOnboardingChat() {
  const [languagePreference, setLanguagePreference] = useState(inferInitialLanguage);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return [defaultWelcomeMessage];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [onboardingProfile, setOnboardingProfile] = useState({});
  const listRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(messages));
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(CHAT_LANGUAGE_KEY, languagePreference);
  }, [languagePreference]);

  const uiText = useMemo(() => getUiText(languagePreference), [languagePreference]);
  const statusText = useMemo(() => (loading ? uiText.status : ""), [loading, uiText]);

  const requestAssistant = async (conversation, profile = onboardingProfile) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${ONBOARDING_API_BASE_URL}/onboarding/chat/completions`, {
        method: "POST",
        headers: headers(languagePreference),
        body: JSON.stringify({
          messages: conversation.map((m) => ({ role: m.role, content: m.backendContent || m.content })),
          language_preference: languagePreference,
          onboarding_profile: Object.keys(profile || {}).length ? profile : undefined,
          context: { onboarding_profile: profile },
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.detail?.message || "Onboarding chat failed");
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: body.message || "No response",
          advisoryPlan: body.advisory_plan || null,
          uiDirective: body.ui_directive || null,
          uiDirectiveResolved: false,
          onboardingProfileSnapshot: Object.keys(profile || {}).length ? profile : null,
        },
      ]);
    } catch (e) {
      setError(formatOnboardingNetworkError(e));
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    await requestAssistant(next);
  };

  const handleDirectiveSelect = async (messageIndex, option) => {
    const updated = messages.map((m, i) => (i === messageIndex ? { ...m, uiDirectiveResolved: true } : m));
    const next = [...updated, { role: "user", content: option.label || option.value || "" }];
    setMessages(next);
    await requestAssistant(next);
  };

  const handleDirectiveFormSubmit = async (messageIndex, formValues) => {
    const profile = { ...onboardingProfile, ...formValues };
    setOnboardingProfile(profile);
    const updated = messages.map((m, i) => (i === messageIndex ? { ...m, uiDirectiveResolved: true } : m));
    const backendContent = `Please continue onboarding using onboarding_profile ${JSON.stringify(profile)}.`;
    const next = [...updated, { role: "user", content: "Submitted onboarding profile", backendContent }];
    setMessages(next);
    await requestAssistant(next, profile);
  };

  const clearChat = () => {
    setMessages([defaultWelcomeMessage]);
    setOnboardingProfile({});
    setInput("");
    setError("");
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify([defaultWelcomeMessage]));
  };

  return (
    <div style={{ height: "100%", display: "flex", justifyContent: "center", padding: "18px 0", minHeight: 0 }}>
      <div
        style={{
          width: "min(96vw, 960px)",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 28px 70px rgba(2,8,23,0.22)",
          border: "1px solid #DCE7FF",
          background: "#F8FAFC",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div
          style={{
            padding: "9px 12px",
            borderBottom: `1px solid ${BRAND_THEME.headerBorder}`,
            background: BRAND_THEME.headerGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            color: "white",
            fontWeight: 800,
          }}
        >
          <span>{uiText.header}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <select value={languagePreference} onChange={(e) => setLanguagePreference(e.target.value)} style={{ padding: 6, borderRadius: 8 }}>
              <option value="en-IN">English</option>
              <option value="hi-IN">Hindi</option>
              <option value="bn-IN">Bengali</option>
              <option value="or-IN">Odia</option>
              <option value="ta-IN">Tamil</option>
              <option value="te-IN">Telugu</option>
            </select>
            <button
              onClick={clearChat}
              style={{
                border: "1px solid rgba(255,255,255,0.55)",
                borderRadius: 10,
                padding: "7px 11px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                background: "rgba(255,255,255,0.16)",
                color: "white",
              }}
            >
              {uiText.clearChat}
            </button>
          </div>
        </div>

        <div ref={listRef} style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "16px", background: "linear-gradient(180deg, #EEF2FF, #EFF6FF)" }}>
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
              <div style={{ maxWidth: "80%", padding: "10px 12px", borderRadius: 14, background: m.role === "user" ? BRAND_THEME.headerGradient : "white", color: m.role === "user" ? "white" : "#0F172A", border: m.role === "user" ? "none" : "1px solid #DBEAFE" }}>
                {m.role === "assistant" ? (
                  <>
                    {Array.isArray(m.advisoryPlan?.journey_steps) && m.advisoryPlan.journey_steps.length > 0 ? (
                      <JourneyCard
                        advisoryPlan={m.advisoryPlan}
                        onboardingHref={buildOnboardingLaunchUrl(ONBOARDING_JOURNEY_URL, {
                          onboarding_profile: m.onboardingProfileSnapshot || undefined,
                          language: languagePreference,
                        })}
                        onboardingCtaLabel={uiText.cta}
                      />
                    ) : (
                      <MarkdownText content={m.content} />
                    )}
                  </>
                ) : (
                  <div style={{ whiteSpace: "pre-wrap" }}>{m.content}</div>
                )}
                {m.role !== "user" && m.uiDirective && !m.uiDirectiveResolved && m.uiDirective.type === "single_select" && (
                  <SelectionCard directive={m.uiDirective} disabled={loading} onSelect={(option) => handleDirectiveSelect(i, option)} />
                )}
                {m.role !== "user" && m.uiDirective && !m.uiDirectiveResolved && m.uiDirective.type === "form" && (
                  isOnboardingProfileDirective(m.uiDirective) ? (
                    <IntakeJourneyView
                      disabled={loading}
                      onComplete={(profile) => handleDirectiveFormSubmit(i, profile)}
                    />
                  ) : (
                    <FormCard directive={m.uiDirective} disabled={loading} onSubmit={(values) => handleDirectiveFormSubmit(i, values)} />
                  )
                )}
              </div>
            </div>
          ))}
          {loading && <div style={{ fontSize: 13, color: "#334155" }}>{statusText}</div>}
        </div>

        {error && <div style={{ color: "#B91C1C", background: "#FEF2F2", borderTop: "1px solid #FECACA", padding: "8px 12px", fontSize: 13 }}>{error}</div>}

        <div style={{ padding: 12, borderTop: "1px solid #E2E8F0", background: "white", display: "flex", gap: 8 }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={2}
            placeholder={uiText.placeholder}
            style={{ flex: 1, resize: "none", border: "1px solid #BFDBFE", borderRadius: 12, padding: "10px 12px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ border: "none", borderRadius: 12, padding: "11px 18px", fontWeight: 700, background: loading ? "#93C5FD" : BRAND_THEME.headerGradient, color: "white" }}
          >
            {uiText.send}
          </button>
        </div>
      </div>
    </div>
  );
}
