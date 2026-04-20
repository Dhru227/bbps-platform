import { useEffect, useState } from "react";
import SetupStep from "./onboarding/SetupStep";

// ─── BOU DATA (NBBL-approved Biller Operating Units) ─────────────────────────
const BOU_LIST = [
  {
    id: "SETU",
    name: "Setu (by Pine Labs)",
    type: "Payment Aggregator",
    typeIcon: "🔗",
    logo: "SE",
    logoColor: "#6366F1",
    logoBg: "#EEF2FF",
    rating: 4.8,
    reviews: 1240,
    onboardingTime: "2–4 days",
    fee: "₹0 setup · 0.2% TDR",
    supportLevel: "24/7 Chat + Phone",
    languages: ["English", "Hindi", "Tamil"],
    bestFor: ["Micro", "Small", "Fintech"],
    qrSupport: true,
    recommended: true,
    recommendReason: "Best for S1 segment — dedicated micro-biller portal",
    features: ["App-based bill upload", "Auto-KYC via Aadhaar", "Instant penny-drop", "e-Sign support", "Real-time dashboard"],
    sla: "99.98% uptime",
    settlementCycle: "T+1",
    states: "Pan-India",
    minBillers: null,
    contact: "support@setu.co",
  },
  {
    id: "M2P",
    name: "M2P Fintech",
    type: "NBBL-Licensed Aggregator",
    typeIcon: "🚀",
    logo: "M2P",
    logoColor: "#7C3AED",
    logoBg: "#F5F3FF",
    rating: 4.5,
    reviews: 620,
    onboardingTime: "2–3 days",
    fee: "₹0 setup · 0.23% TDR",
    supportLevel: "24/7 Chat + Slack",
    languages: ["English"],
    bestFor: ["Micro", "Small", "Fintech", "Startup"],
    qrSupport: true,
    recommended: false,
    recommendReason: null,
    features: ["No-code onboarding", "Sandbox in 60 seconds", "Webhook-first", "Auto UAT runner", "API documentation"],
    sla: "99.99% uptime",
    settlementCycle: "T+0 / T+1",
    states: "Pan-India",
    minBillers: null,
    contact: "hello@m2pfintech.com",
  },
  {
    id: "RAZORPAY",
    name: "Razorpay BBPS",
    type: "Payment Aggregator",
    typeIcon: "⚡",
    logo: "RZ",
    logoColor: "#2563EB",
    logoBg: "#EFF6FF",
    rating: 4.6,
    reviews: 3100,
    onboardingTime: "3–5 days",
    fee: "₹0 setup · 0.25% TDR",
    supportLevel: "24/7 Chat",
    languages: ["English", "Hindi"],
    bestFor: ["Small", "Mid", "Fintech"],
    qrSupport: false,
    recommended: false,
    recommendReason: null,
    features: ["Bulk CSV upload", "Webhook notifications", "Auto-reconciliation", "Developer APIs", "Dashboard analytics"],
    sla: "99.95% uptime",
    settlementCycle: "T+1",
    states: "Pan-India",
    minBillers: null,
    contact: "bbps@razorpay.com",
  },
  {
    id: "BILLDESK",
    name: "BillDesk (by PayU)",
    type: "Payment Aggregator",
    typeIcon: "🧾",
    logo: "BD",
    logoColor: "#0891B2",
    logoBg: "#ECFEFF",
    rating: 4.4,
    reviews: 5600,
    onboardingTime: "5–7 days",
    fee: "₹999 setup · 0.18% TDR",
    supportLevel: "Business hours",
    languages: ["English", "Hindi", "Marathi", "Telugu"],
    bestFor: ["Small", "Mid", "Enterprise"],
    qrSupport: false,
    recommended: false,
    recommendReason: null,
    features: ["Bulk file processing", "Multi-state support", "Legacy system adapters", "Audit reports", "Dedicated RM"],
    sla: "99.9% uptime",
    settlementCycle: "T+1 / T+2",
    states: "Pan-India",
    minBillers: 100,
    contact: "onboarding@billdesk.com",
  },
  {
    id: "PAYU",
    name: "PayU India",
    type: "Payment Aggregator",
    typeIcon: "💳",
    logo: "PU",
    logoColor: "#D97706",
    logoBg: "#FFFBEB",
    rating: 4.3,
    reviews: 2800,
    onboardingTime: "4–6 days",
    fee: "₹0 setup · 0.22% TDR",
    supportLevel: "Email + Chat",
    languages: ["English", "Hindi"],
    bestFor: ["Small", "Mid"],
    qrSupport: false,
    recommended: false,
    features: ["CSV + API upload", "Payment links", "Recurring billing", "Custom reports", "Mobile app"],
    sla: "99.9% uptime",
    settlementCycle: "T+1",
    states: "Pan-India",
    minBillers: null,
    contact: "bbps@payu.in",
  },
  {
    id: "SBI",
    name: "State Bank of India",
    type: "Scheduled Bank",
    typeIcon: "🏦",
    logo: "SBI",
    logoColor: "#166534",
    logoBg: "#F0FDF4",
    rating: 4.1,
    reviews: 8900,
    onboardingTime: "4–8 weeks",
    fee: "₹5,000 setup · 0.15% TDR",
    supportLevel: "Branch + Phone",
    languages: ["English", "Hindi", "All regional"],
    bestFor: ["Mid", "Enterprise", "Govt"],
    qrSupport: false,
    recommended: false,
    features: ["Full NBBL compliance", "H2H integration", "Dedicated RM", "Physical signing", "Govt billing specialist"],
    sla: "99.95% uptime",
    settlementCycle: "T+1",
    states: "Pan-India",
    minBillers: 1000,
    contact: "Visit nearest branch",
  },
  {
    id: "HDFC",
    name: "HDFC Bank",
    type: "Scheduled Bank",
    typeIcon: "🏦",
    logo: "HDF",
    logoColor: "#1D4ED8",
    logoBg: "#EFF6FF",
    rating: 4.2,
    reviews: 7200,
    onboardingTime: "3–6 weeks",
    fee: "₹3,000 setup · 0.18% TDR",
    supportLevel: "Dedicated RM",
    languages: ["English", "Hindi"],
    bestFor: ["Mid", "Enterprise"],
    qrSupport: false,
    recommended: false,
    features: ["API integration suite", "Dedicated BBPS RM", "Escrow account", "Custom SLA", "Priority NBBL routing"],
    sla: "99.97% uptime",
    settlementCycle: "T+1",
    states: "Pan-India",
    minBillers: 500,
    contact: "corporate@hdfc.com",
  },
  {
    id: "ICICI",
    name: "ICICI Bank",
    type: "Scheduled Bank",
    typeIcon: "🏦",
    logo: "ICI",
    logoColor: "#B91C1C",
    logoBg: "#FEF2F2",
    rating: 4.2,
    reviews: 6400,
    onboardingTime: "3–5 weeks",
    fee: "₹2,500 setup · 0.20% TDR",
    supportLevel: "Dedicated RM",
    languages: ["English", "Hindi"],
    bestFor: ["Mid", "Enterprise", "NBFC"],
    qrSupport: false,
    recommended: false,
    features: ["Full API suite", "Loan biller specialist", "Insurance expert", "Co-branded BBPS", "Analytics dashboard"],
    sla: "99.96% uptime",
    settlementCycle: "T+1",
    states: "Pan-India",
    minBillers: 200,
    contact: "bbps@icicibank.com",
  },
];

// ─── CLASSIFICATION ENGINE ────────────────────────────────────────────────────
function classifyBiller({ billVolume, techCapability, operatingModel, entityType, coverage }) {
  const vol = parseInt(billVolume) || 0;
  if (operatingModel === "qr_itemised")
    return { code: "S7", label: "QR-Itemised Biller", color: "#0D6E6E", light: "#D0F0EE", border: "#5ECECE", badge: "QR Ledger Path", badgeColor: "#0D6E6E", badgeBg: "#D0F0EE", steps: 8, time: "~90 mins", description: "Itemised transactions via QR code - accumulate charges and generate consolidated bills at chosen intervals.", waivedCount: 5, isQR: true, reasons: [{ label: "Billing Model", value: "Itemised / Tab-based", rule: "QR scan per transaction" }, { label: "Bill Generation", value: "Configurable periodicity", rule: "Daily / Weekly / Monthly" }, { label: "Tech Required", value: "None", rule: "BOU-hosted ledger" }] };
  if (vol < 500 && operatingModel === "offline" && techCapability === "none")
    return { code: "S1", label: "Micro Offline Biller", color: "#0F766E", light: "#F0FDFA", border: "#99F6E4", badge: "Simplest Path", badgeColor: "#065F46", badgeBg: "#CCFBF1", steps: 7, time: "~50 mins", description: "App-based bill upload - zero API development needed. Live within 24 hours.", waivedCount: 6, isQR: false, reasons: [{ label: "Bill Volume", value: `${billVolume} bills/month`, rule: "< 500/month" }, { label: "Operating Model", value: "Offline / Upload-based", rule: "No API integration" }, { label: "Tech Capability", value: "No tech team needed", rule: "App-only" }] };
  if (vol <= 5000 && operatingModel === "offline")
    return { code: "S2", label: "Small Offline Biller", color: "#0369A1", light: "#EFF6FF", border: "#BAE6FD", badge: "Simple Path", badgeColor: "#075985", badgeBg: "#DBEAFE", steps: 9, time: "~5-10 days", description: "Web portal + bulk CSV upload. BOU-assisted onboarding with minimal paperwork.", waivedCount: 4, isQR: false, reasons: [{ label: "Bill Volume", value: `${billVolume} bills/month`, rule: "500-5,000/month" }, { label: "Operating Model", value: "Offline / Portal-based", rule: "No real-time API" }, { label: "Coverage", value: coverage === "single" ? "Single State" : "Multi-State", rule: "Batch upload" }] };
  if (vol <= 10000 && operatingModel === "online" && techCapability === "basic")
    return { code: "S3", label: "Small Online Biller", color: "#7C3AED", light: "#F5F3FF", border: "#C4B5FD", badge: "Standard Path", badgeColor: "#5B21B6", badgeBg: "#EDE9FE", steps: 18, time: "~2-4 weeks", description: "Lightweight REST API (or BOU-hosted). Simplified UAT with 30 test cases.", waivedCount: 2, isQR: false, reasons: [{ label: "Bill Volume", value: `${billVolume} bills/month`, rule: "Up to 10,000/month" }, { label: "Operating Model", value: "Online / API-based", rule: "Bill Fetch API" }, { label: "Tech Capability", value: "Basic tech team", rule: "API dev required" }] };
  if (vol > 10000 && operatingModel === "offline")
    return { code: "S6", label: "Enterprise Offline Biller", color: "#B45309", light: "#FFFBEB", border: "#FDE68A", badge: "Batch Path", badgeColor: "#92400E", badgeBg: "#FEF3C7", steps: 24, time: "~4-8 weeks", description: "SFTP batch file gateway. Scheduled bulk upload with automated reconciliation.", waivedCount: 2, isQR: false, reasons: [{ label: "Bill Volume", value: `${billVolume} bills/month`, rule: "> 10,000/month" }, { label: "Operating Model", value: "Offline / Batch SFTP", rule: "Scheduled uploads" }, { label: "Entity Type", value: entityType === "govt" ? "Government / Utility" : entityType, rule: "Legacy systems" }] };
  if (vol <= 100000 && operatingModel === "online")
    return { code: "S4", label: "Mid-Size Online Biller", color: "#DC2626", light: "#FFF1F2", border: "#FCA5A5", badge: "Full API Path", badgeColor: "#991B1B", badgeBg: "#FEE2E2", steps: 32, time: "~4-6 weeks", description: "Full REST API integration with own hosting, mTLS security and complete UAT certification.", waivedCount: 0, isQR: false, reasons: [{ label: "Bill Volume", value: `${billVolume} bills/month`, rule: "10K-1L/month" }, { label: "Operating Model", value: "Online / Real-time API", rule: "Full Bill Fetch API" }, { label: "Tech Capability", value: "Full engineering team", rule: "mTLS + HMAC required" }] };
  return { code: "S5", label: "Enterprise Online Biller", color: "#1F4E79", light: "#EFF6FF", border: "#93C5FD", badge: "Enterprise Path", badgeColor: "#1E3A5F", badgeBg: "#DBEAFE", steps: 40, time: "~8-12 weeks", description: "Full API + H2H integration, CERT-In audit, dedicated BOU relationship and 60-case UAT.", waivedCount: 0, isQR: false, reasons: [{ label: "Bill Volume", value: `${billVolume} bills/month`, rule: "> 1 Lakh/month" }, { label: "Operating Model", value: "Online + Batch H2H", rule: "Redundant systems" }, { label: "Coverage", value: "National / Pan-India", rule: "Enterprise SLA" }] };
}

function getJourneySteps(segment) {
  if (segment.isQR) {
    return [
      { id: "identity", icon: "🪪", title: "Verify Identity", sub: "Aadhaar eKYC + OTP", time: "5 min", need: ["Aadhaar-linked mobile", "Aadhaar number"], tip: "Verified instantly via UIDAI. Details are never stored.", fields: [{ label: "Mobile Number", note: "Aadhaar-linked", ph: "+91 98765 43210" }, { label: "Aadhaar Number", note: "12 digits", ph: "XXXX XXXX XXXX" }], waived: false },
      { id: "business", icon: "🏪", title: "Business Details", sub: "Name, category, state", time: "10 min", need: ["Business name", "Type of transactions"], tip: "For QR-itemised billers, we suggest category options best suited for itemised billing.", fields: [{ label: "Business / Entity Name", ph: "e.g. Green Leaf Cafeteria" }, { label: "Describe your billing", note: "plain words", ph: "e.g. daily meals and snacks for office staff" }, { label: "State", ph: "", type: "select", options: ["Tamil Nadu", "Maharashtra", "Karnataka", "Delhi", "Gujarat", "Others"] }], waived: false },
      { id: "bank", icon: "🏦", title: "Link Bank Account", sub: "Penny-drop verification", time: "5 min", need: ["Account number", "IFSC code"], tip: "INR1 penny-drop verifies instantly. Reversed within 24 hours.", fields: [{ label: "Account Number", note: "Current / Savings", ph: "Enter account number" }, { label: "IFSC Code", note: "11 characters", ph: "e.g. HDFC0001234" }], waived: false },
      { id: "fields", icon: "🗂️", title: "Configure Consumer ID", sub: "How customers are linked to their ledger", time: "5 min", need: ["How you identify customers"], tip: "This links each QR scan to the right consumer ledger.", fields: [], template: true, waived: false },
      { id: "ledger", icon: "📊", title: "Configure Ledger & Billing", sub: "Periodicity, approval, visibility", time: "10 min", need: ["Billing cycle preference"], tip: "You can change these settings anytime from the app.", fields: [], ledger: true, waived: false },
      { id: "agreement", icon: "✍️", title: "Sign Agreement", sub: "Aadhaar OTP e-sign", time: "5 min", need: ["5 minutes to read", "Aadhaar OTP"], tip: "Micro-biller template + QR-itemised addendum.", fields: [], agreement: true, waived: false },
      { id: "qr", icon: "📲", title: "Your Biller QR Code", sub: "Download, print, start scanning", time: "2 min", need: [], tip: "Your QR is unique to your biller ID. Keep a digital backup.", fields: [], qrIssue: true, waived: false },
      { id: "golive", icon: "🚀", title: "You're Live!", sub: "BOU auto-certification", time: "Instant", need: [], tip: "Customers can view their running tab and pay from any BBPS app.", fields: [], golive: true, waived: false }
    ];
  }
  return [
    { icon: "🪪", title: "Verify Identity", sub: "Aadhaar eKYC + OTP", time: "5 min", need: ["Aadhaar-linked mobile", "Aadhaar number"], tip: "Verified instantly via UIDAI. Details are never stored.", fields: [{ label: "Mobile Number", note: "Aadhaar-linked", ph: "+91 98765 43210" }, { label: "Aadhaar Number", note: "12 digits", ph: "XXXX XXXX XXXX" }], waived: false },
    { icon: "🏪", title: "Business Details", sub: "Name, category, state", time: "10 min", need: ["Business name", "Nature of billing"], tip: "Our AI auto-classifies your BBPS category.", fields: [{ label: "Business / Entity Name", ph: "e.g. Green Valley Housing Society" }, { label: "Describe your billing", note: "plain words", ph: "e.g. monthly maintenance for residents" }, { label: "State", ph: "", type: "select", options: ["Tamil Nadu", "Maharashtra", "Karnataka", "Delhi", "Gujarat", "Others"] }], waived: false },
    { icon: "🏦", title: "Link Bank Account", sub: "Penny-drop verification", time: "5 min", need: ["Account number", "IFSC code"], tip: "₹1 penny-drop verifies instantly. Reversed within 24 hours.", fields: [{ label: "Account Number", note: "Current / Savings", ph: "Enter account number" }, { label: "IFSC Code", note: "11 characters", ph: "e.g. HDFC0001234" }], waived: false },
    { icon: "🗂️", title: "Configure Bill Fields", sub: "Customer identifier setup", time: "10 min", need: ["How you identify customers"], tip: "This is what your customers will see in PhonePe, GPay, and bank apps.", fields: [], template: true, waived: false },
    { icon: "✍️", title: "Sign Agreement", sub: "Aadhaar OTP e-sign", time: "5 min", need: ["5 minutes to read", "Aadhaar OTP"], tip: "Pre-approved NBBL standard micro-biller template. No legal fees.", fields: [], agreement: true, waived: false },
    { icon: "📤", title: "Upload Your Bills", sub: "Photo / CSV / Manual", time: "15 min", need: ["Your consumer list with amounts"], tip: "Upload any time — before or after go-live.", fields: [], upload: true, waived: false },
    { icon: "⚙️", title: "API Integration", sub: "Deploy Your Biller Integrator", time: "~30 min", need: ["Your server URL"], tip: "Fork the pre-built Spring Boot integrator, configure it, and register your endpoint.", fields: [], waived: false, isSetupStep: true },
    { icon: "🔒", title: "Security Setup", sub: "mTLS + HMAC + IP whitelist", time: "3–5 days", need: ["TLS 1.2+", "Signed certificates"], tip: "Certificate wizard handles mTLS step by step.", fields: [], waived: segment.code === "S1" || segment.code === "S2" },
    { icon: "🧪", title: "UAT Certification", sub: "60 NBBL test cases", time: "1–2 weeks", need: ["Sandbox API", "Test accounts"], tip: "Automated test runner — pass/fail with AI root-cause analysis.", fields: [], waived: segment.code === "S1" || segment.code === "S2" },
    { icon: "🚀", title: "Go Live!", sub: "BOU auto-certification", time: "24 hrs", need: [], tip: "Share your biller name — customers pay from any app.", fields: [], golive: true, waived: false },
  ];
}

const QUESTIONS = [
  { id: "entityType", question: "What best describes your organisation?", hint: "Helps us match the right BBPS biller category", type: "cards", options: [{ value: "proprietor", label: "Individual / Proprietor", icon: "👤", eg: "Freelancer, shop owner" }, { value: "business", label: "Small Business / SME", icon: "🏪", eg: "School, clinic, society" }, { value: "company", label: "Company / LLP", icon: "🏢", eg: "Pvt Ltd, fintech, NBFC" }, { value: "govt", label: "Government / Utility", icon: "🏛️", eg: "Municipal body, DISCOM" }] },
  { id: "billingNature", question: "What kind of bills do you issue?", hint: "We'll auto-match your BBPS category", type: "text_with_chips", placeholder: "e.g. monthly maintenance fees for apartment residents", chips: ["Water charges", "Loan EMI", "School fees", "Society maintenance", "Electricity bill", "Insurance premium", "Property tax", "Meals / Canteen", "Shop purchases"] },
  { id: "billVolume", question: "How many bills do you issue every month?", hint: "Approximate unique customers you bill", type: "slider_cards", options: [{ value: "100", label: "< 500", sublabel: "Up to 500", icon: "🏡" }, { value: "2500", label: "500–5K", sublabel: "Small volume", icon: "🏘️" }, { value: "7500", label: "5K–10K", sublabel: "Medium", icon: "🏙️" }, { value: "50000", label: "10K–1L", sublabel: "Large", icon: "🌆" }, { value: "200000", label: "> 1 Lakh", sublabel: "Enterprise", icon: "🌐" }] },
  { id: "operatingModel", question: "How do you want to connect to BBPS?", hint: "Determines your integration path and billing model", type: "cards3", options: [{ value: "offline", label: "Upload bills manually", icon: "📤", eg: "Upload via app or CSV - no coding" }, { value: "online", label: "Real-time API integration", icon: "⚡", eg: "Your system connects live to BBPS" }, { value: "qr_itemised", label: "QR-based itemised billing", icon: "📲", eg: "Track per-transaction items and generate consolidated bills", isNew: true }, { value: "database", label: "PostgreSQL Database", icon: "🗄️", eg: "I already have bills in a database" }] },
  { id: "techCapability", question: "What's your team's technical capability?", hint: "Honest answer helps us recommend the right path", type: "cards", options: [{ value: "none", label: "No tech team", icon: "🙅", eg: "I need a no-code solution" }, { value: "basic", label: "Basic IT support", icon: "💻", eg: "Can follow technical guides" }, { value: "advanced", label: "Dedicated dev team", icon: "👨‍💻", eg: "Can build and host APIs" }], skipIf: (answers) => answers.operatingModel === "qr_itemised" },
  { id: "coverage", question: "Where do you issue bills?", hint: "Geographic coverage of billing operations", type: "cards", options: [{ value: "single", label: "Single State / City", icon: "📍", eg: "Local operations only" }, { value: "multi", label: "Multiple States", icon: "🗺️", eg: "Regional or national reach" }] },
];

function decodeLaunchPayload(encoded) {
  if (!encoded) return null;
  try {
    const normalized = String(encoded).replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const json = decodeURIComponent(escape(atob(padded)));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function mapOnboardingProfileToAnswers(profile) {
  if (!profile || typeof profile !== "object") return null;

  const entity = String(profile.legal_entity_type || "").toLowerCase();
  const volumeBand = String(profile.monthly_bill_volume_band || "").toLowerCase();
  const mode = String(profile.biller_mode || "").toLowerCase();
  const tech = String(profile.tech_maturity || "").toLowerCase();
  const coverage = String(profile.operating_coverage || "").toLowerCase();

  const entityMap = {
    proprietorship: "proprietor",
    proprietor: "proprietor",
    business: "business",
    pvt_ltd: "company",
    company: "company",
    llp: "company",
    government: "govt",
    govt: "govt",
  };
  const volumeMap = {
    lt_10000: "100",
    "10000_50000": "2500",
    "50000_200000": "7500",
    "200000_1000000": "50000",
    gt_1000000: "200000",
  };
  const techMap = {
    no_api: "none",
    bou_hosted: "basic",
    own_api: "advanced",
  };
  const coverageMap = {
    single_state: "single",
    all_india: "multi",
    multi_state: "multi",
  };

  // Avoid silently defaulting to S2/offline when launch payload is partial.
  if (!volumeBand || !mode) return null;
  if (!volumeMap[volumeBand]) return null;
  if (!["offline", "online", "qr_itemised"].includes(mode)) return null;

  return {
    entityType: entityMap[entity] || "business",
    billingNature: String(profile.industry_category || "general"),
    billVolume: volumeMap[volumeBand],
    operatingModel: mode,
    techCapability: techMap[tech] || "none",
    coverage: coverageMap[coverage] || "single",
  };
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  .app{min-height:100vh;background:#FAFAF8;font-family:'DM Sans',sans-serif;position:relative;overflow:hidden}
  .bg-grid{position:fixed;inset:0;pointer-events:none;z-index:0;background-image:radial-gradient(circle at 20% 20%,rgba(15,118,110,.06) 0%,transparent 50%),radial-gradient(circle at 80% 80%,rgba(217,119,6,.06) 0%,transparent 50%),linear-gradient(135deg,#FAFAF8 0%,#F5F0E8 100%)}
  .container{position:relative;z-index:1;max-width:520px;margin:0 auto;padding:32px 20px 48px;min-height:100vh}
  .header{display:flex;align-items:center;gap:12px;margin-bottom:28px}
  .bbps-pill{background:#0F766E;color:white;padding:5px 12px;border-radius:20px;font-size:13px;font-weight:700;letter-spacing:.05em}
  .header-title{font-family:'Playfair Display',serif;font-size:15px;color:#374151;font-weight:700}
  .progress-track{height:3px;background:#E5E7EB;border-radius:4px;margin-bottom:32px;overflow:hidden}
  .progress-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#0F766E,#D97706);transition:width .5s cubic-bezier(.4,0,.2,1)}
  .q-card{background:white;border-radius:20px;padding:28px 24px;box-shadow:0 2px 20px rgba(0,0,0,.06);margin-bottom:16px;animation:slideUp .4s ease both}
  @keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  .step-label{font-size:11px;font-weight:700;letter-spacing:.08em;color:#D97706;text-transform:uppercase;margin-bottom:8px}
  .question-text{font-family:'Playfair Display',serif;font-size:20px;color:#111827;line-height:1.3;margin-bottom:6px;font-weight:700}
  .question-hint{font-size:13px;color:#9CA3AF;margin-bottom:20px}
  .option-cards{display:grid;gap:10px;grid-template-columns:1fr 1fr}
  .option-cards3{display:flex;flex-direction:column;gap:10px}
  .option-card{border:2px solid #F3F4F6;border-radius:14px;padding:14px 16px;cursor:pointer;transition:all .2s ease;background:white;text-align:left}
  .option-card:hover{border-color:#D1D5DB;transform:translateY(-1px)}
  .option-card.selected{border-color:#0F766E;background:#F0FDFA;box-shadow:0 0 0 3px rgba(15,118,110,.12)}
  .option-card3{border:2px solid #F3F4F6;border-radius:14px;padding:14px 16px;cursor:pointer;transition:all .2s ease;background:white;display:flex;align-items:center;gap:12px}
  .option-card3:hover{border-color:#D1D5DB;transform:translateY(-1px)}
  .option-card3.selected{border-color:#0F766E;background:#F0FDFA;box-shadow:0 0 0 3px rgba(15,118,110,.12)}
  .option-card3.qr-card{border-color:#0D9488;background:linear-gradient(135deg,#F0FDFA 0%,#ECFEFF 100%)}
  .option-card3.qr-card.selected{border-color:#0D6E6E;background:linear-gradient(135deg,#CCFBF1 0%,#CFFAFE 100%);box-shadow:0 0 0 3px rgba(13,110,110,.2)}
  .option-icon{font-size:24px;margin-bottom:8px;display:block}
  .option-label{font-size:14px;font-weight:600;color:#111827}
  .option-eg{font-size:12px;color:#9CA3AF;margin-top:3px}
  .new-badge{display:inline-block;background:#0D6E6E;color:white;font-size:9px;font-weight:800;letter-spacing:.06em;padding:2px 6px;border-radius:4px;text-transform:uppercase;margin-left:6px;vertical-align:middle}
  .text-input{width:100%;padding:12px 16px;border:2px solid #E5E7EB;border-radius:12px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s;color:#111827;background:white}
  .text-input:focus{border-color:#0F766E}
  .chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
  .chip{padding:5px 12px;border-radius:20px;border:1.5px solid #E5E7EB;background:white;font-size:12px;font-weight:500;color:#374151;cursor:pointer;transition:all .15s}
  .chip:hover{border-color:#0F766E;color:#0F766E}
  .chip.active{border-color:#0F766E;background:#F0FDFA;color:#065F46;font-weight:600}
  .volume-cards{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}
  .vol-card{border:2px solid #F3F4F6;border-radius:12px;padding:10px 6px;cursor:pointer;transition:all .2s;text-align:center;background:white}
  .vol-card:hover{border-color:#D1D5DB}
  .vol-card.selected{border-color:#D97706;background:#FFFBEB;box-shadow:0 0 0 3px rgba(217,119,6,.12)}
  .v-icon{font-size:20px;margin-bottom:4px}
  .v-label{font-size:11px;font-weight:700;color:#111827}
  .v-sub{font-size:10px;color:#9CA3AF}
  .nav-row{display:flex;gap:10px;margin-top:8px}
  .btn-back{flex:1;padding:13px;border:2px solid #E5E7EB;border-radius:12px;background:white;color:#374151;font-size:14px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
  .btn-back:hover{border-color:#9CA3AF}
  .btn-next{flex:2;padding:13px;background:linear-gradient(135deg,#0F766E,#0D9488);border:none;border-radius:12px;color:white;font-size:14px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s;box-shadow:0 4px 12px rgba(15,118,110,.25)}
  .btn-next:hover{transform:translateY(-1px);box-shadow:0 6px 16px rgba(15,118,110,.3)}
  .btn-next:disabled{background:#D1D5DB;box-shadow:none;transform:none;cursor:not-allowed}
  .result-screen{animation:slideUp .5s ease both}
  .bou-screen{animation:slideUp .45s ease both}
  .journey-screen{animation:slideUp .4s ease both}
  .segment-hero{border-radius:20px;padding:24px;margin-bottom:16px}
  .segment-badge{display:inline-block;padding:3px 12px;border-radius:20px;font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px}
  .segment-code{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;opacity:.7;margin-bottom:4px}
  .segment-name{font-family:'Playfair Display',serif;font-size:24px;font-weight:800;margin-bottom:8px}
  .segment-desc{font-size:13px;opacity:.85;line-height:1.5}
  .stat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px}
  .stat-box{background:white;border-radius:14px;padding:14px 12px;text-align:center;box-shadow:0 1px 8px rgba(0,0,0,.05)}
  .stat-icon{font-size:20px;margin-bottom:4px}
  .stat-val{font-size:16px;font-weight:800;color:#111827}
  .stat-key{font-size:11px;color:#9CA3AF;margin-top:2px}
  .reasons-card{background:white;border-radius:16px;padding:18px 20px;margin-bottom:16px;box-shadow:0 1px 8px rgba(0,0,0,.05)}
  .reasons-title{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9CA3AF;margin-bottom:12px}
  .reason-row{display:flex;justify-content:space-between;align-items:flex-start;padding:8px 0}
  .reason-row+.reason-row{border-top:1px solid #F3F4F6}
  .reason-label{font-size:13px;color:#6B7280}
  .reason-val{font-size:13px;font-weight:600;color:#111827;text-align:right}
  .reason-rule{font-size:11px;color:#9CA3AF;text-align:right}
  .journey-preview{background:white;border-radius:16px;padding:18px 20px;margin-bottom:16px;box-shadow:0 1px 8px rgba(0,0,0,.05)}
  .journey-title{font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#9CA3AF;margin-bottom:14px}
  .journey-step-row{display:flex;align-items:flex-start;gap:12px;padding:8px 0}
  .journey-step-row+.journey-step-row{border-top:1px solid #F3F4F6}
  .step-dot{width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;margin-top:1px}
  .step-row-label{font-size:13px;font-weight:600;color:#111827}
  .step-row-time{font-size:12px;color:#D97706;font-weight:600;margin-left:auto;flex-shrink:0}
  .waived-note{text-decoration:line-through;opacity:.4}
  .btn-start{width:100%;padding:16px;border:none;border-radius:14px;color:white;font-size:16px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 6px 20px rgba(15,118,110,.3);transition:all .2s;margin-top:4px}
  .btn-start:hover{transform:translateY(-2px)}
  .btn-redo{width:100%;padding:12px;border:2px solid #E5E7EB;border-radius:14px;background:white;color:#374151;font-size:14px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;margin-top:10px;transition:all .2s}
  .j-progress{display:flex;gap:4px;margin-bottom:28px}
  .j-seg{height:5px;border-radius:4px;flex:1;transition:all .4s ease}
  .j-card{background:white;border-radius:20px;padding:24px;box-shadow:0 2px 20px rgba(0,0,0,.06);margin-bottom:14px;animation:slideUp .35s ease both}
  .j-step-meta{display:flex;align-items:center;gap:8px;margin-bottom:14px}
  .j-num{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:white;flex-shrink:0}
  .j-step-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#111827}
  .j-step-sub{font-size:12px;color:#9CA3AF;margin-top:1px}
  .j-time{font-size:12px;color:#D97706;font-weight:600;margin-left:auto}
  .need-row{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px}
  .need-chip{padding:4px 10px;border-radius:20px;background:#F3F4F6;color:#374151;font-size:12px;font-weight:500;display:flex;align-items:center;gap:4px}
  .input-field{margin-bottom:12px}
  .input-label{font-size:12px;font-weight:600;color:#374151;margin-bottom:5px;display:block}
  .input-note{font-size:11px;color:#9CA3AF;margin-left:6px;font-weight:400}
  .field-input{width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;color:#111827;background:white;transition:border-color .2s}
  .field-input:focus{border-color:#0F766E}
  .field-select{width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;color:#111827;background:white;cursor:pointer}
  .tip-box{background:#FFFBEB;border:1px solid #FDE68A;border-radius:10px;padding:10px 14px;font-size:12px;color:#92400E;display:flex;gap:8px;align-items:flex-start;margin-top:12px}
  .waived-banner{background:#F0FDF4;border:1px solid #86EFAC;border-radius:12px;padding:14px 16px;margin-bottom:14px}
  .waived-banner-title{font-size:11px;font-weight:700;color:#166534;letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px}
  .golive-hero{background:linear-gradient(135deg,#065F46,#0F766E);border-radius:20px;padding:28px 24px;text-align:center;color:white;margin-bottom:14px}
  .app-pill{display:inline-block;padding:3px 10px;background:rgba(255,255,255,.15);border-radius:20px;font-size:12px;margin:3px;color:white}
  /* BOU */
  .bou-intro{background:white;border-radius:20px;padding:22px 22px 18px;box-shadow:0 2px 20px rgba(0,0,0,.06);margin-bottom:16px}
  .bou-filter-row{display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap}
  .bou-filter-chip{padding:6px 14px;border-radius:20px;border:1.5px solid #E5E7EB;background:white;font-size:12px;font-weight:600;color:#374151;cursor:pointer;transition:all .15s;white-space:nowrap}
  .bou-filter-chip:hover{border-color:#0F766E;color:#0F766E}
  .bou-filter-chip.active{border-color:#0F766E;background:#F0FDFA;color:#065F46}
  .bou-card{background:white;border-radius:18px;padding:20px;margin-bottom:12px;border:2px solid #F3F4F6;cursor:pointer;transition:all .22s ease;box-shadow:0 1px 6px rgba(0,0,0,.04);position:relative}
  .bou-card:hover{border-color:#D1D5DB;transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.08)}
  .bou-card.selected{border-color:#0F766E;box-shadow:0 0 0 4px rgba(15,118,110,.1),0 6px 20px rgba(0,0,0,.08)}
  .bou-card.recommended{border-color:#D97706}
  .bou-card.recommended.selected{border-color:#0F766E}
  .rec-ribbon{position:absolute;top:-1px;right:18px;background:#D97706;color:white;font-size:10px;font-weight:800;letter-spacing:.06em;padding:3px 10px;border-radius:0 0 8px 8px;text-transform:uppercase}
  .qr-ribbon{position:absolute;top:-1px;left:18px;background:#0D6E6E;color:white;font-size:10px;font-weight:800;padding:3px 10px;border-radius:0 0 8px 8px;text-transform:uppercase}
  .bou-header{display:flex;align-items:center;gap:12px;margin-bottom:14px}
  .bou-logo-box{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0}
  .bou-name{font-size:15px;font-weight:700;color:#111827}
  .bou-type{font-size:11px;color:#9CA3AF;margin-top:1px}
  .bou-rating{display:flex;align-items:center;gap:4px;font-size:13px;font-weight:700;color:#D97706;margin-left:auto}
  .bou-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:12px}
  .bou-stat{background:#F9FAFB;border-radius:10px;padding:8px 10px}
  .bou-stat-key{font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em;margin-bottom:2px}
  .bou-stat-val{font-size:12px;font-weight:700;color:#111827}
  .bou-features{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}
  .bou-feature-tag{padding:3px 9px;border-radius:6px;font-size:11px;font-weight:500;background:#F3F4F6;color:#374151}
  .bou-expand{font-size:12px;color:#0F766E;font-weight:600;cursor:pointer;margin-top:4px;display:inline-block}
  .bou-detail-row{display:flex;justify-content:space-between;padding:6px 0;border-top:1px solid #F3F4F6;font-size:12px}
  .bou-detail-key{color:#6B7280}
  .bou-detail-val{color:#111827;font-weight:600;text-align:right}
  .bou-selected-bar{background:#F0FDFA;border:1.5px solid #99F6E4;border-radius:14px;padding:14px 18px;margin-bottom:16px;display:flex;align-items:center;gap:12px;animation:fadeIn .3s ease}
  .compare-toggle{display:flex;align-items:center;gap:6px;font-size:12px;color:#6B7280;cursor:pointer;padding:6px 0;margin-bottom:8px}
  .compare-panel{background:white;border-radius:16px;padding:16px;margin-bottom:16px;box-shadow:0 2px 12px rgba(0,0,0,.06);animation:slideUp .3s ease;overflow-x:auto}
  .cmp-table{width:100%;border-collapse:collapse;min-width:460px}
  .cmp-table th{font-size:11px;font-weight:700;color:#9CA3AF;text-transform:uppercase;letter-spacing:.04em;padding:6px 8px;text-align:left;border-bottom:2px solid #F3F4F6}
  .cmp-table td{font-size:12px;padding:8px;border-bottom:1px solid #F9FAFB;color:#374151;vertical-align:top}
  .cmp-table tr:last-child td{border-bottom:none}
  .cmp-key{font-weight:600;color:#6B7280;white-space:nowrap}
  .bou-context-bar{background:white;border-radius:14px;padding:10px 16px;margin-bottom:16px;display:flex;align-items:center;gap:10px;box-shadow:0 1px 6px rgba(0,0,0,.05)}
  .ledger-row{display:flex;flex-direction:column;gap:10px}
  .ledger-opt-row{display:flex;gap:8px;flex-wrap:wrap}
  .ledger-opt{padding:6px 14px;border-radius:20px;border:1.5px solid #E5E7EB;background:white;font-size:12px;font-weight:600;color:#374151;cursor:pointer;transition:all .15s}
  .ledger-opt:hover{border-color:#0D6E6E;color:#0D6E6E}
  .ledger-opt.sel{border-color:#0D6E6E;background:#D0F0EE;color:#0D6E6E}
  .ledger-section{font-size:11px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#9CA3AF;margin-bottom:8px;margin-top:4px}
  .qr-screen-wrap{display:flex;flex-direction:column;align-items:center;gap:16px}
  .qr-actions{display:flex;gap:8px;width:100%;flex-wrap:wrap}
  .qr-action-btn{flex:1;min-width:120px;padding:10px;border:1.5px solid #E5E7EB;border-radius:10px;background:white;font-size:12px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;transition:all .2s}
  .qr-action-btn:hover{border-color:#0D6E6E;color:#0D6E6E;background:#F0FDFA}
  .scan-confirm{background:#F0FDF4;border:1px solid #86EFAC;border-radius:12px;padding:14px 16px;text-align:center;cursor:pointer;transition:all .2s}
  .scan-confirm:hover{background:#DCFCE7}
`;

// ─── QUESTION COMPONENTS ──────────────────────────────────────────────────────
function CardQuestion({ q, value, onChange }) {
  return (
    <div className="option-cards">
      {q.options.map(o => (
        <div key={o.value} className={`option-card ${value === o.value ? "selected" : ""}`} onClick={() => onChange(o.value)}>
          <span className="option-icon">{o.icon}</span>
          <div className="option-label">{o.label}</div>
          <div className="option-eg">{o.eg}</div>
        </div>
      ))}
    </div>
  );
}

function Cards3Question({ q, value, onChange }) {
  return (
    <div className="option-cards3">
      {q.options.map((o) => (
        <div key={o.value} className={`option-card3 ${o.value === "qr_itemised" ? "qr-card" : ""} ${value === o.value ? "selected" : ""}`} onClick={() => onChange(o.value)}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>{o.icon}</span>
          <div style={{ flex: 1 }}>
            <div className="option-label">
              {o.label}
              {o.isNew && <span className="new-badge">NEW</span>}
            </div>
            <div className="option-eg">{o.eg}</div>
          </div>
          {o.value === "qr_itemised" && (
            <div style={{ flexShrink: 0, background: "#0D6E6E", color: "white", borderRadius: 8, padding: "4px 8px", fontSize: 10, fontWeight: 700, textAlign: "center", lineHeight: 1.3 }}>
              No
              <br />
              API
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TextChipsQuestion({ q, value, onChange }) {
  const [active, setActive] = useState([]);
  return (
    <div>
      <input className="text-input" placeholder={q.placeholder} value={value} onChange={e => onChange(e.target.value)} />
      <div className="chips">
        {q.chips.map(c => (
          <div key={c} className={`chip ${active.includes(c) ? "active" : ""}`} onClick={() => { const n = active.includes(c) ? active.filter(x => x !== c) : [...active, c]; setActive(n); if (!value) onChange(n.join(", ")); }}>
            {c}
          </div>
        ))}
      </div>
    </div>
  );
}

function VolumeQuestion({ q, value, onChange }) {
  return (
    <div className="volume-cards">
      {q.options.map(o => (
        <div key={o.value} className={`vol-card ${value === o.value ? "selected" : ""}`} onClick={() => onChange(o.value)}>
          <div className="v-icon">{o.icon}</div>
          <div className="v-label">{o.label}</div>
          <div className="v-sub">{o.sublabel}</div>
        </div>
      ))}
    </div>
  );
}

function QRDisplay({ billerName, billerCode, color }) {
  const qrSize = 252;
  const safeBillerName = String(billerName || "Your Business").trim();
  const safeBillerCode = String(billerCode || "BLR00000").trim();
  const qrPayload = `https://bharatconnect.example/bbps/ledger?biller_code=${encodeURIComponent(
    safeBillerCode
  )}&biller_name=${encodeURIComponent(safeBillerName)}&mode=qr_itemised`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&ecc=H&margin=10&data=${encodeURIComponent(
    qrPayload
  )}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ background: "white", borderRadius: 16, padding: 16, boxShadow: `0 8px 32px ${color}44, 0 2px 8px rgba(0,0,0,0.1)`, border: `2px solid ${color}33` }}>
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: "0.06em", marginBottom: 2 }}>BBPS · BharatQR v2.0</div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#111827" }}>{billerName || "Your Business Name"}</div>
        </div>
        <div style={{ position: "relative", width: qrSize, height: qrSize }}>
          <img
            src={qrImageUrl}
            alt="Bharat Connect biller QR"
            style={{ width: qrSize, height: qrSize, borderRadius: 10, display: "block" }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 42,
              height: 42,
              borderRadius: 10,
              background: "white",
              border: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            }}
          >
            <img
              src="/bharat-connect-logo.png"
              alt="Bharat Connect logo"
              style={{ width: 30, height: 30, objectFit: "contain" }}
            />
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 10, borderTop: `1px dashed ${color}44`, paddingTop: 8 }}>
          <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2 }}>Scan to add to your tab</div>
          <div style={{ fontSize: 10, fontWeight: 700, color, fontFamily: "monospace" }}>BBPS/{billerCode || "BLR00000"}</div>
        </div>
      </div>
    </div>
  );
}

function LedgerConfig() {
  const [periodicity, setPeriodicity] = useState("monthly");
  const [approval, setApproval] = useState("yes");
  const [visibility, setVisibility] = useState("full");
  const [partial, setPartial] = useState("yes");

  const row = (label, opts, val, setter) => (
    <div style={{ marginBottom: 12 }}>
      <div className="ledger-section">{label}</div>
      <div className="ledger-opt-row">
        {opts.map(([v, l]) => (
          <div key={v} className={`ledger-opt ${val === v ? "sel" : ""}`} onClick={() => setter(v)}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="ledger-row">
      {row("Bill generation cycle", [["daily", "Daily"], ["weekly", "Weekly"], ["fortnightly", "Fortnightly"], ["monthly", "Monthly"], ["ondemand", "On-demand"]], periodicity, setPeriodicity)}
      {row("Biller approval before billing", [["yes", "Required"], ["no", "Auto-generate"]], approval, setApproval)}
      {row("Consumer ledger visibility", [["full", "Show all items"], ["amount", "Amount only"], ["hidden", "Hidden till bill"]], visibility, setVisibility)}
      {row("Allow partial payment", [["yes", "Yes"], ["no", "No"]], partial, setPartial)}
      <div style={{ background: "#D0F0EE", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#0D6E6E", fontWeight: 600, marginTop: 4 }}>Config saved — editable anytime in the app</div>
    </div>
  );
}

function QRIssueStep({ segment, bou, businessName }) {
  const [scanDone, setScanDone] = useState(false);
  const billerCode = "BLR" + Math.floor(10000 + Math.random() * 90000);
  return (
    <div className="qr-screen-wrap">
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 4 }}>Your BBPS BharatQR - Issued by {bou.name}</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Print this and place it at your point of service</div>
      </div>
      <QRDisplay billerName={businessName || "Your Business"} billerCode={billerCode} color={segment.color} />
      <div className="qr-actions">
        {[["⬇️", "Download PDF", "A4 Standee"], ["📇", "Card Size", "8-up PDF"], ["💬", "Share", "WhatsApp / Email"]].map(([ic, l, sub]) => (
          <div key={l} className="qr-action-btn">
            <span style={{ fontSize: 16 }}>{ic}</span>
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{l}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF" }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="scan-confirm" style={{ width: "100%", borderColor: scanDone ? "#86EFAC" : "#E5E7EB", background: scanDone ? "#F0FDF4" : "white" }} onClick={() => setScanDone(true)}>
        {scanDone ? <div style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>Test scan successful - QR is active and ready.</div> : <div style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Tap to confirm test scan</div>}
      </div>
    </div>
  );
}

// ─── BOU SELECTION ────────────────────────────────────────────────────────────
function BOUScreen({ segment, onNext, onBack }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("recommended");
  const [expandedId, setExpandedId] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const [compareIds, setCompareIds] = useState(["SETU", "M2P", "RAZORPAY"]);

  const segMap = { S1: "Micro", S2: "Small", S3: "Small", S4: "Mid", S5: "Enterprise", S6: "Enterprise", S7: "Micro" };
  const segLabel = segMap[segment.code] || "Small";

  const filtered = BOU_LIST.filter(b => {
    if (filter === "qrsupport") return b.qrSupport;
    if (filter === "aggregator") return b.type.toLowerCase().includes("aggregator");
    if (filter === "bank") return b.type.toLowerCase().includes("bank");
    if (filter === "recommended") return b.bestFor.includes(segLabel) || (segment.isQR && b.qrSupport) || b.recommended;
    return true;
  });

  const selectedBOU = BOU_LIST.find(b => b.id === selected);
  const compareBOUs = BOU_LIST.filter(b => compareIds.includes(b.id));

  const toggleCompare = (id, e) => {
    e.stopPropagation();
    setCompareIds(p => p.includes(id) ? p.filter(x => x !== id) : p.length < 3 ? [...p, id] : p);
  };

  return (
    <div className="bou-screen">
      {/* Intro */}
      <div className="bou-intro">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: segment.light, border: `1.5px solid ${segment.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🏛️</div>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 800, color: "#111827" }}>Select Your Biller Operating Unit</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>Step 0 of {segment.isQR ? 8 : 7} · Your BBPS sponsor & settlement partner</div>
          </div>
        </div>
        <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.65, marginBottom: 12 }}>
          A <strong>BOU</strong> is your official NBBL-approved sponsor on the BBPS network. They register you with NBBL, act as your settlement bank, and support you through the onboarding journey. <span style={{ color: "#0F766E", fontWeight: 600 }}>Showing BOUs best matched for your {segment.code} segment.</span>
          {segment.isQR && <span style={{ color: "#0D6E6E", fontWeight: 600 }}> Only QR-capable BOUs can proceed with S7.</span>}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[["🏦", "8 NBBL-approved BOUs"], ["⭐", "Segment-matched"], ["🔄", "Switch anytime"]].map(([ic, t]) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 5, background: "#F3F4F6", borderRadius: 20, padding: "4px 10px", fontSize: 11, color: "#374151", fontWeight: 500 }}>
              <span>{ic}</span><span>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bou-filter-row">
        {[{ id: "recommended", label: `⭐ Best for ${segment.code}` }, ...(segment.isQR ? [{ id: "qrsupport", label: "📲 QR-capable" }] : []), { id: "all", label: "All BOUs" }, { id: "aggregator", label: "Aggregators only" }, { id: "bank", label: "Banks only" }].map(f => (
          <div key={f.id} className={`bou-filter-chip ${filter === f.id ? "active" : ""}`} onClick={() => setFilter(f.id)}>{f.label}</div>
        ))}
      </div>

      {/* Compare toggle */}
      <div className="compare-toggle" onClick={() => setShowCompare(s => !s)}>
        <span style={{ fontSize: 15 }}>{showCompare ? "▲" : "▼"}</span>
        <span style={{ fontWeight: 600 }}>Compare side by side</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          {compareIds.map(id => { const b = BOU_LIST.find(x => x.id === id); return b ? <div key={id} style={{ width: 22, height: 22, borderRadius: 6, background: b.logoBg, color: b.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800 }}>{b.logo}</div> : null; })}
        </div>
      </div>

      {showCompare && (
        <div className="compare-panel">
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.06em", marginBottom: 12 }}>SIDE-BY-SIDE COMPARISON (select up to 3)</div>
          <div style={{ overflowX: "auto" }}>
            <table className="cmp-table">
              <thead>
                <tr>
                  <th style={{ width: 100 }}>Feature</th>
                  {compareBOUs.map(b => <th key={b.id} style={{ color: b.logoColor }}>{b.name.split(" ")[0]}</th>)}
                </tr>
              </thead>
              <tbody>
                {[["Type", b => b.type.replace("Payment Aggregator", "Aggregator").replace("Scheduled Bank", "Bank").replace("NBBL-Licensed Aggregator", "Licensed")], ["Onboarding", b => b.onboardingTime], ["Fee", b => b.fee.split("·")[1]?.trim() || "—"], ["Settlement", b => b.settlementCycle], ["Support", b => b.supportLevel], ["Uptime", b => b.sla], ["Min Billers", b => b.minBillers ? `${b.minBillers}+` : "None"], ["Rating", b => `⭐ ${b.rating}`]].map(([key, fn]) => (
                  <tr key={key}>
                    <td className="cmp-key">{key}</td>
                    {compareBOUs.map(b => <td key={b.id}>{fn(b)}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BOU cards */}
      {filtered.length === 0 && <div style={{ textAlign: "center", padding: "24px", color: "#9CA3AF", fontSize: 14 }}>No BOUs match this filter.</div>}
      {filtered.map(bou => {
        const isSel = selected === bou.id;
        const isExp = expandedId === bou.id;
        const isMatch = bou.bestFor.includes(segLabel);
        return (
          <div key={bou.id} className={`bou-card ${isSel ? "selected" : ""} ${bou.recommended ? "recommended" : ""}`} onClick={() => setSelected(bou.id)}>
            {bou.recommended && <div className="rec-ribbon">✨ Top pick for {segment.code}</div>}
            {bou.qrSupport && segment.isQR && <div className="qr-ribbon" style={{ top: bou.recommended ? 20 : -1 }}>📲 QR-ready</div>}
            <div className="bou-header" style={{ marginTop: bou.recommended || (segment.isQR && bou.qrSupport) ? 12 : 0 }}>
              <div className="bou-logo-box" style={{ background: bou.logoBg, color: bou.logoColor }}>{bou.logo}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="bou-name">{bou.name}</div>
                <div className="bou-type">{bou.typeIcon} {bou.type}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div className="bou-rating">⭐ {bou.rating} <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400 }}>({bou.reviews.toLocaleString()})</span></div>
                {isMatch && <div style={{ fontSize: 10, color: "#0F766E", fontWeight: 700, marginTop: 2 }}>✓ {segment.code} match</div>}
                {!bou.qrSupport && segment.isQR && <div style={{ fontSize: 10, color: "#EF4444", fontWeight: 700, marginTop: 2 }}>✗ No QR support</div>}
              </div>
            </div>
            <div className="bou-stats">
              <div className="bou-stat"><div className="bou-stat-key">Onboarding</div><div className="bou-stat-val">{bou.onboardingTime}</div></div>
              <div className="bou-stat"><div className="bou-stat-key">Setup Fee</div><div className="bou-stat-val">{bou.fee.split("·")[0].trim()}</div></div>
              <div className="bou-stat"><div className="bou-stat-key">Settlement</div><div className="bou-stat-val">{bou.settlementCycle}</div></div>
            </div>
            <div className="bou-features">
              {bou.features.slice(0, isExp ? bou.features.length : 3).map((f, i) => <div key={i} className="bou-feature-tag">✓ {f}</div>)}
            </div>
            {isExp && (
              <div style={{ marginTop: 6 }}>
                {[["TDR / Transaction Fee", bou.fee.split("·")[1]?.trim() || "—"], ["Support Level", bou.supportLevel], ["Languages", bou.languages.join(", ")], ["Uptime SLA", bou.sla], ["Coverage", bou.states], ["Min. Billers", bou.minBillers ? `${bou.minBillers}+` : "No minimum"], ["Contact", bou.contact]].map(([k, v]) => (
                  <div key={k} className="bou-detail-row"><span className="bou-detail-key">{k}</span><span className="bou-detail-val">{v}</span></div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <span className="bou-expand" onClick={e => { e.stopPropagation(); setExpandedId(isExp ? null : bou.id); }}>{isExp ? "Show less ↑" : "Full details ↓"}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }} onClick={e => toggleCompare(bou.id, e)}>
                <div style={{ width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${compareIds.includes(bou.id) ? "#0F766E" : "#D1D5DB"}`, background: compareIds.includes(bou.id) ? "#0F766E" : "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {compareIds.includes(bou.id) && <span style={{ color: "white", fontSize: 10, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 11, color: "#6B7280" }}>Compare</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Selected bar */}
      {selectedBOU && (
        <div className="bou-selected-bar">
          <div style={{ width: 36, height: 36, borderRadius: 9, background: selectedBOU.logoBg, color: selectedBOU.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{selectedBOU.logo}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#065F46" }}>✓ {selectedBOU.name} selected</div>
            <div style={{ fontSize: 11, color: "#6B7280" }}>{selectedBOU.onboardingTime} · {selectedBOU.fee}</div>
          </div>
          <div style={{ fontSize: 12, color: "#0F766E", cursor: "pointer", fontWeight: 600, flexShrink: 0 }} onClick={() => setSelected(null)}>Change</div>
        </div>
      )}

      <div className="nav-row">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <button className="btn-next" disabled={!selected || (segment.isQR && selectedBOU && !selectedBOU.qrSupport)} onClick={() => onNext(selectedBOU)}
          style={{ background: selected ? `linear-gradient(135deg,${segment.color},${segment.color}CC)` : undefined }}>
          {selected ? `Proceed with ${selectedBOU.name.split(" ")[0]} →` : "Select a BOU to continue"}
        </button>
      </div>
      <div style={{ textAlign: "center", marginTop: 12, fontSize: 12, color: "#9CA3AF" }}>
        {segment.isQR ? "Only QR-capable BOUs can support S7 itemised billing" : "You can request to switch your BOU before your application is submitted to NBBL"}
      </div>
    </div>
  );
}

// ─── RESULT SCREEN ────────────────────────────────────────────────────────────
function ResultScreen({ segment, onStartJourney, onRedo }) {
  const steps = getJourneySteps(segment);
  const active = steps.filter(s => !s.waived);
  const waived = steps.filter(s => s.waived);
  const qrPreview = [
    { label: "Choose Biller Operating Unit", time: "5 min", waived: false, isNew: false },
    { label: "Verify Identity", time: "5 min", waived: false },
    { label: "Business Details", time: "10 min", waived: false },
    { label: "Link Bank Account", time: "5 min", waived: false },
    { label: "Configure Consumer ID", time: "5 min", waived: false },
    { label: "Configure Ledger & Billing", time: "10 min", waived: false, isNew: true },
    { label: "Sign Agreement + QR Addendum", time: "5 min", waived: false },
    { label: "QR Code Issuance", time: "2 min", waived: false, isNew: true },
    { label: "Go Live", time: "Instant", waived: false }
  ];
  const standardPreview = [
    { label: "Choose Biller Operating Unit", time: "5 min", waived: false, isNew: true },
    { label: "Verify Identity", time: "5 min", waived: false },
    { label: "Business Details", time: "10 min", waived: false },
    { label: "Link Bank Account", time: "5 min", waived: false },
    { label: "Configure Bill Fields", time: "10 min", waived: false },
    { label: "Sign Agreement", time: "5 min", waived: false },
    { label: "Upload Bills", time: "15 min", waived: false },
    { label: "API Integration", time: "~30 min", waived: false },
    { label: "Security Setup (mTLS)", time: "3–5 days", waived: ["S1", "S2"].includes(segment.code) },
    { label: "UAT / Certification", time: "1–2 weeks", waived: ["S1", "S2"].includes(segment.code) },
    { label: "Go Live", time: "24 hrs", waived: false },
  ];
  const preview = segment.isQR ? qrPreview : standardPreview;

  return (
    <div className="result-screen">
      {segment.isQR && (
        <div style={{ background: "linear-gradient(135deg,#0D6E6E,#0D9488)", borderRadius: 16, padding: "14px 18px", marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 28 }}>📲</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "white" }}>QR-Itemised Billing Model Selected</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 2 }}>You will receive a BBPS QR code at the end of onboarding</div>
          </div>
        </div>
      )}
      <div className="segment-hero" style={{ background: `linear-gradient(135deg,${segment.color} 0%,${segment.color}CC 100%)`, color: "white" }}>
        <div className="segment-badge" style={{ color: segment.badgeColor, background: segment.badgeBg }}>{segment.badge}</div>
        <div className="segment-code">{segment.code}</div>
        <div className="segment-name">{segment.label}</div>
        <div className="segment-desc">{segment.description}</div>
      </div>
      <div className="stat-grid">
        <div className="stat-box"><div className="stat-icon">📋</div><div className="stat-val">{active.length + 1}</div><div className="stat-key">Steps Required</div></div>
        <div className="stat-box"><div className="stat-icon">⏱</div><div className="stat-val">{segment.time}</div><div className="stat-key">To Complete</div></div>
        <div className="stat-box"><div className="stat-icon">{segment.isQR ? "📲" : "✅"}</div><div className="stat-val">{segment.isQR ? "QR Issued" : waived.length}</div><div className="stat-key">{segment.isQR ? "At go-live" : "Steps Waived"}</div></div>
      </div>
      <div className="reasons-card">
        <div className="reasons-title">Why you're classified as {segment.code}</div>
        {segment.reasons.map((r, i) => (
          <div key={i} className="reason-row">
            <div className="reason-label">{r.label}</div>
            <div><div className="reason-val">{r.value}</div><div className="reason-rule">{r.rule}</div></div>
          </div>
        ))}
        <div style={{ marginTop: 10, padding: "8px 0 0", borderTop: "1px solid #F3F4F6" }}>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>Not the right fit? </span>
          <span style={{ fontSize: 12, color: "#0F766E", fontWeight: 600, cursor: "pointer" }} onClick={onRedo}>Re-answer →</span>
        </div>
      </div>
      <div className="journey-preview">
        <div className="journey-title">Your complete onboarding journey</div>
        {preview.map((s, i) => (
          <div key={i} className="journey-step-row">
            <div className="step-dot" style={{ background: s.waived ? "#F3F4F6" : s.isNew ? "#D97706" : segment.color, color: s.waived ? "#D1D5DB" : "white" }}>
              {s.waived ? "—" : i + 1}
            </div>
            <div style={{ flex: 1 }}>
              <div className={`step-row-label ${s.waived ? "waived-note" : ""}`} style={{ color: s.isNew ? "#D97706" : undefined }}>{s.label}</div>
              {s.isNew && <div style={{ fontSize: 10, color: "#D97706", fontWeight: 700 }}>NEW STEP</div>}
            </div>
            <div className="step-row-time" style={{ color: s.waived ? "#D1D5DB" : "#D97706" }}>{s.waived ? "waived" : s.time}</div>
          </div>
        ))}
      </div>
      <button className="btn-start" onClick={onStartJourney} style={{ background: `linear-gradient(135deg,${segment.color},${segment.color}CC)` }}>
        Begin My Onboarding Journey →
      </button>
      <button className="btn-redo" onClick={onRedo}>← Change My Answers</button>
    </div>
  );
}

// ─── JOURNEY SCREEN ───────────────────────────────────────────────────────────
function JourneyScreen({ segment, bou, onBack }) {
  const steps = getJourneySteps(segment);
  const [jStep, setJStep] = useState(0);
  const [verified, setVerified] = useState(false);
  const [selTemplate, setSelTemplate] = useState(0);
  const [agreed, setAgreed] = useState(false);
  const [uploadMethod, setUploadMethod] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [sessionId] = useState(() => "sess_" + Math.random().toString(36).substring(2, 10));
  const [registeredBillerId, setRegisteredBillerId] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === "BILLER_REGISTERED") {
        setRegisteredBillerId(e.data.billerId);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  const current = steps[jStep];

  const templates = segment.isQR
    ? [
      { name: "Member / Consumer Number", fields: ["Member No. (Mandatory)", "Mobile No. (Optional)"], usedBy: "Societies, clubs, cafeterias" },
      { name: "Mobile Number Only", fields: ["Mobile No. (Mandatory)"], usedBy: "Walk-in customers, kirana stores" },
      { name: "Employee / Student ID", fields: ["Staff / Roll No. (Mandatory)"], usedBy: "Offices, schools, campuses" }
    ]
    : [
      { name: "Consumer / Member Number", fields: ["Consumer No. (Mandatory)", "Mobile No. (Optional)"], usedBy: "Housing societies, utilities" },
      { name: "Mobile Number Only", fields: ["Mobile No. (Mandatory)"], usedBy: "Small shops, informal billers" },
      { name: "Roll / Registration Number", fields: ["Roll No. (Mandatory)", "Date of Birth (Optional)"], usedBy: "Schools, coaching centres" },
      { name: "Loan Account Number", fields: ["Loan Account No. (Mandatory)", "PAN (Optional)"], usedBy: "Microfinance, chit funds" }
    ];

  return (
    <div className="journey-screen">
      {/* BOU context */}
      <div className="bou-context-bar" style={{ border: `1.5px solid ${segment.border}` }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: bou.logoBg, color: bou.logoColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{bou.logo}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#111827" }}>Onboarding via {bou.name}</div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{bou.onboardingTime} · {bou.settlementCycle} · {segment.isQR ? "QR-Itemised model" : "Standard model"}</div>
        </div>
        <div style={{ fontSize: 11, color: "#0F766E", fontWeight: 700, background: "#F0FDFA", padding: "3px 8px", borderRadius: 6, flexShrink: 0 }}>Active BOU</div>
      </div>
      <div
        style={{
          marginBottom: 12,
          background: "#FFFBEB",
          border: "1px solid #FDE68A",
          borderRadius: 10,
          padding: "8px 10px",
          fontSize: 12,
          color: "#92400E",
          fontWeight: 600,
        }}
      >
        Demo mode: after BOU selection, this journey will later redirect to the respective BOU hosted onboarding page.
      </div>

      {/* Progress bar */}
      <div className="j-progress">
        {steps.map((s, i) => <div key={i} className="j-seg" style={{ background: i < jStep ? segment.color : i === jStep ? "#D97706" : "#E5E7EB", opacity: s.waived ? 0.3 : 1 }} />)}
      </div>

      <div className="j-card" key={jStep}>
        <div className="j-step-meta">
          <div className="j-num" style={{ background: current.waived ? "#D1D5DB" : segment.color }}>{current.icon}</div>
          <div style={{ flex: 1 }}>
            <div className="j-step-title">{current.title}</div>
            <div className="j-step-sub">{current.sub}</div>
          </div>
          <div className="j-time">⏱ {current.time}</div>
        </div>

        {current.isSetupStep ? (
          <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 13, color: "#475569", marginBottom: 16, lineHeight: 1.6 }}>
              Deploy the pre-built Spring Boot integrator, configure it with your bill data, and register your endpoint to activate BBPS routing.
            </div>
            <button
              onClick={() => {
                const params = new URLSearchParams({
                  bizName: businessName || "Your Business",
                  industry: "General",
                  bouId: bou?.id || "BOU001",
                  dataSource: uploadMethod === 3 ? "Database" : uploadMethod === 1 ? "CSV" : "Database",
                  sessionId: sessionId,
                });
                window.open("/setup?" + params.toString(), "_blank");
              }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "linear-gradient(135deg,#254D98,#2F5FB8)", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
            >
              ⚙️ Open Integrator Setup →
            </button>
            {registeredBillerId && (
              <div style={{ marginTop: 12, background: "#DCFCE7", border: "1px solid #86EFAC", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#166534", fontWeight: 600 }}>
                ✅ Registered — Biller ID: {registeredBillerId}
              </div>
            )}
          </div>
        ) : current.waived ? (
          <div className="waived-banner">
            <div className="waived-banner-title">✅ Waived for {segment.label}</div>
            <div style={{ fontSize: 13, color: "#166534" }}>{bou.name} handles this on your behalf — no action needed.</div>
          </div>
        ) : (
          <>
            {current.need.length > 0 && <div className="need-row">{current.need.map((n, i) => <div key={i} className="need-chip">📌 {n}</div>)}</div>}

            {current.fields && current.fields.length > 0 && (
              <div>
                {current.fields.map((f, i) => (
                  <div key={i} className="input-field">
                    <label className="input-label">{f.label}{f.note && <span className="input-note">{f.note}</span>}</label>
                    {f.type === "select" ? <select className="field-select"><option value="">Select...</option>{f.options.map(o => <option key={o}>{o}</option>)}</select> : <input className="field-input" placeholder={f.ph} onChange={(e) => { if (f.label.includes("Entity Name") || f.label.includes("Business")) setBusinessName(e.target.value); }} />}
                  </div>
                ))}
                {jStep === 0 && <button onClick={() => setVerified(true)} style={{ padding: "9px 18px", background: segment.color, color: "white", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>Verify via OTP</button>}
                {verified && jStep === 0 && <div style={{ marginTop: 10, background: "#F0FDF4", border: "1px solid #86EFAC", borderRadius: 10, padding: 12, fontSize: 13, color: "#166534", fontWeight: 600 }}>✅ Identity verified — Name, DOB & Address auto-filled</div>}
              </div>
            )}

            {current.template && (
              <div>
                <div style={{ fontSize: 13, color: "#4B5563", marginBottom: 12 }}>{segment.isQR ? "Choose how customers are linked to their ledger:" : "Choose how customers identify themselves when paying:"}</div>
                {templates.map((t, i) => (
                  <div key={i} onClick={() => setSelTemplate(i)} style={{ border: `2px solid ${selTemplate === i ? segment.color : "#E5E7EB"}`, borderRadius: 12, padding: "10px 14px", marginBottom: 8, cursor: "pointer", background: selTemplate === i ? segment.light : "white", transition: "all 0.2s" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{t.usedBy}</div>
                    {selTemplate === i && <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>{t.fields.map((f, j) => <span key={j} style={{ background: segment.light, color: segment.color, border: `1px solid ${segment.border}`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{f}</span>)}</div>}
                  </div>
                ))}
              </div>
            )}

            {current.ledger && <LedgerConfig />}

            {current.agreement && (
              <div>
                <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 14, marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#92400E", marginBottom: 8 }}>AGREEMENT TERMS — {bou.name.toUpperCase()}{segment.isQR ? " + QR-ITEMISED ADDENDUM" : ""}</div>
                  {[["Settlement Cycle", bou.settlementCycle], ["TDR Fee", bou.fee.split("·")[1]?.trim() || "0.2% TDR"], ["Dispute SLA", "7 business days"], ["Validity", "1 year, auto-renewal"], ...(segment.isQR ? [["QR Re-issuance", "On-request, INR 0"], ["Ledger data retention", "90 days post settlement"]] : [])].map(([k, v], i, arr) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < arr.length - 1 ? "1px solid #FDE68A" : "none", fontSize: 13 }}>
                      <span style={{ color: "#92400E", fontWeight: 600 }}>{k}</span><span>{v}</span>
                    </div>
                  ))}
                </div>
                <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 2, accentColor: segment.color }} />
                  <span style={{ fontSize: 13, color: "#374151" }}>I agree to the Micro Biller Agreement{segment.isQR ? " and QR-Itemised Addendum" : ""} with {bou.name}</span>
                </label>
              </div>
            )}

            {current.upload && (
              <div>
                {[["📷 Photo Capture", "Take a photo of your bill register — AI extracts data", "Printed records"], ["📊 CSV Upload", "Fill our template and upload — instant processing", "Digital records"], ["✏️ Manual Entry", "Enter bills one by one via a simple form", "< 50 bills"], ["🗄️ Database", "Connect your existing PostgreSQL database directly", "Existing DB"]].map(([m, d, b], i) => (
                  <div key={i} onClick={() => setUploadMethod(i)} style={{ border: `2px solid ${uploadMethod === i ? "#D97706" : "#E5E7EB"}`, borderRadius: 12, padding: "10px 14px", marginBottom: 8, cursor: "pointer", background: uploadMethod === i ? "#FFFBEB" : "white", transition: "all 0.2s" }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{m}</div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>{d}</div>
                    <div style={{ marginTop: 4 }}><span style={{ background: "#FEF3C7", color: "#92400E", fontSize: 11, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>Best for: {b}</span></div>
                  </div>
                ))}
              </div>
            )}

            {current.qrIssue && <QRIssueStep segment={segment} bou={bou} businessName={businessName} />}

            {current.golive && (
              <div>
                <div className="golive-hero" style={{ background: segment.isQR ? "linear-gradient(135deg,#0D6E6E,#0D9488)" : "linear-gradient(135deg,#065F46,#0F766E)" }}>
                  <div style={{ fontSize: 44, marginBottom: 8 }}>🎉</div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{segment.isQR ? "QR is Live & Active!" : "You're Live on BBPS!"}</div>
                  <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 4 }}>Onboarded via {bou.name}</div>
                  <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 16 }}>{segment.isQR ? "Customers can scan your QR to start a tab and pay from any BBPS app" : "Customers can pay from any app within 24 hours"}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4 }}>
                    {["PhonePe", "Google Pay", "Amazon Pay", "BHIM", "All Bank Apps", "BBPS Kiosks"].map(a => <span key={a} className="app-pill">{a}</span>)}
                  </div>
                </div>
                <div style={{ background: "#F0FDF4", borderRadius: 14, padding: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#166534", letterSpacing: "0.06em", marginBottom: 10 }}>WHAT HAPPENS NEXT</div>
                  {(segment.isQR ? [["📲", "Customers scan your QR", "Opens their running tab"], ["➕", "Items accumulate", "Each scan adds to ledger"], ["✅", "You approve & generate bill", "On your chosen schedule"], ["💰", `Settlement via ${bou.name.split(" ")[0]}`, `${bou.settlementCycle} every working day`], ["⚖️", "Dispute resolution", "Self-serve within 7 days"]] : [["📤", "Upload bills each cycle", "Monthly / as due"], ["🔔", "Payment notifications", "Real-time in app"], ["💰", `Settlement via ${bou.name.split(" ")[0]}`, `${bou.settlementCycle} every working day`], ["⚖️", "Dispute resolution", "Self-serve within 7 days"]]).map(([ic, a, f]) => (
                    <div key={a} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid #D1FAE5", alignItems: "center" }}>
                      <span style={{ fontSize: 18 }}>{ic}</span>
                      <div><div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{a}</div><div style={{ fontSize: 11, color: "#6B7280" }}>{f}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {current.tip && <div className="tip-box"><span>💡</span><span>{current.tip}</span></div>}
          </>
        )}
      </div>

      <div className="nav-row">
        <button className="btn-back" onClick={jStep === 0 ? onBack : () => setJStep(j => j - 1)}>← Back</button>
        {jStep < steps.length - 1 ? (
          <button className="btn-next" onClick={() => setJStep(j => j + 1)} style={{ background: `linear-gradient(135deg,${segment.color},${segment.color}CC)` }}>
            {current.waived ? "Skip →" : "Continue →"}
          </button>
        ) : (
          <button className="btn-next" style={{ background: "linear-gradient(135deg,#065F46,#0F766E)" }}>🎉 All Done!</button>
        )}
      </div>
      <div style={{ textAlign: "center", marginTop: 14, fontSize: 12, color: "#9CA3AF" }}>
        Step {jStep + 1} of {steps.length}
        {current.waived && <span style={{ color: "#D97706", marginLeft: 6, fontWeight: 600 }}>• Waived for your segment</span>}
      </div>
    </div>
  );
}

// ─── INTAKE SCREEN ────────────────────────────────────────────────────────────
function IntakeScreen({ initialAnswers, onComplete }) {
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState(() => initialAnswers || {});
  const visibleQs = QUESTIONS.filter((item) => !item.skipIf || !item.skipIf(answers));
  const q = visibleQs[qi];
  const val = answers[q.id] || "";

  return (
    <>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${((qi + 1) / visibleQs.length) * 100}%` }} />
      </div>
      <div className="q-card" key={qi}>
        <div className="step-label">Question {qi + 1} of {visibleQs.length}</div>
        <div className="question-text">{q.question}</div>
        <div className="question-hint">{q.hint}</div>
        {q.type === "cards" && <CardQuestion q={q} value={val} onChange={v => setAnswers(a => ({ ...a, [q.id]: v }))} />}
        {q.type === "cards3" && <Cards3Question q={q} value={val} onChange={v => setAnswers(a => ({ ...a, [q.id]: v, operatingModel: v }))} />}
        {q.type === "text_with_chips" && <TextChipsQuestion q={q} value={val} onChange={v => setAnswers(a => ({ ...a, [q.id]: v }))} />}
        {q.type === "slider_cards" && <VolumeQuestion q={q} value={val} onChange={v => setAnswers(a => ({ ...a, [q.id]: v }))} />}
        {q.id === "operatingModel" && val === "qr_itemised" && (
          <div style={{ marginTop: 14, background: "linear-gradient(135deg,#D0F0EE,#CFFAFE)", border: "1px solid #5ECECE", borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#0D6E6E", marginBottom: 10, letterSpacing: ".04em" }}>📲 HOW QR-ITEMISED BILLING WORKS</div>
            {[["📲", "You get a BBPS QR code", "Place it at your counter or share digitally"], ["🛍️", "Customer scans per transaction", "Each item/service gets added to their open ledger"], ["✅", "You review & approve", "Edit or remove items before generating the bill"], ["🧾", "Generate bill on schedule", "Daily, weekly, monthly or on-demand"], ["💳", "Customer pays via any BBPS app", "Full BBPS payment network, T+1 settlement"]].map(([ic, t, d]) => (
              <div key={t} style={{ display: "flex", gap: 10, padding: "6px 0", borderBottom: "1px dashed rgba(13,110,110,.2)", alignItems: "flex-start" }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{ic}</span>
                <div><div style={{ fontSize: 12, fontWeight: 700, color: "#0D6E6E" }}>{t}</div><div style={{ fontSize: 11, color: "#374151" }}>{d}</div></div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="nav-row">
        {qi > 0 && <button className="btn-back" onClick={() => setQi(i => i - 1)}>← Back</button>}
        <button className="btn-next" disabled={!val} onClick={() => qi < visibleQs.length - 1 ? setQi(i => i + 1) : onComplete(answers)}
          style={{ background: val === "qr_itemised" ? "linear-gradient(135deg,#0D6E6E,#0D9488)" : undefined }}>
          {qi === visibleQs.length - 1 ? "Show My Segment →" : "Next →"}
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
        {visibleQs.map((_, i) => <div key={i} style={{ width: i === qi ? 20 : 7, height: 7, borderRadius: 4, background: i < qi ? "#0F766E" : i === qi ? "#D97706" : "#E5E7EB", transition: "all 0.3s" }} />)}
      </div>
    </>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("intake");
  const [segment, setSegment] = useState(null);
  const [bou, setBou] = useState(null);
  const [seedAnswers, setSeedAnswers] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const launch = decodeLaunchPayload(params.get("launch"));
    const onboardingProfile = launch?.onboarding_profile;
    const mappedAnswers = mapOnboardingProfileToAnswers(onboardingProfile);
    if (!mappedAnswers) return;
    setSeedAnswers(mappedAnswers);
    setSegment(classifyBiller(mappedAnswers));
    setScreen("result");
  }, []);

  const titles = { intake: "Biller Registration", result: "Your Onboarding Path", bou: "Select Biller Operating Unit", journey: segment ? `${segment.label} Journey` : "" };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="bg-grid" />
        <div className="container">
          <div className="header">
            <div className="bbps-pill">BBPS</div>
            <div className="header-title">{titles[screen]}</div>
          </div>
          {screen === "intake" && (
            <IntakeScreen
              initialAnswers={seedAnswers}
              onComplete={ans => {
                setSegment(classifyBiller(ans));
                setScreen("result");
              }}
            />
          )}
          {screen === "result" && segment && <ResultScreen segment={segment} onStartJourney={() => setScreen("bou")} onRedo={() => setScreen("intake")} />}
          {screen === "bou" && segment && <BOUScreen segment={segment} onNext={b => { setBou(b); setScreen("journey"); }} onBack={() => setScreen("result")} />}
          {screen === "journey" && segment && bou && <JourneyScreen segment={segment} bou={bou} onBack={() => setScreen("bou")} />}
        </div>
      </div>
    </>
  );
}
