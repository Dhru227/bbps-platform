import { useState, useMemo } from "react";
import { API_BASE_URL } from "../apiConfig";

const API_KEY = "POC-PLATFORM-KEY-001";

const c = {
  blue: "#2F5FB8", blueDark: "#254D98", blueLight: "#EBF0FB",
  orange: "#FF6A1A", orangeLight: "#FFF1E9",
  green: "#16A34A", greenLight: "#DCFCE7",
  red: "#DC2626", redLight: "#FEE2E2",
  gray100: "#F1F5F9", gray200: "#E2E8F0",
  gray400: "#94A3B8", gray600: "#475569", gray800: "#1E293B",
};

function CodeBlock({ code }) {
  const [copied, setCopied] = useState(false);
  return (
    <div style={{ background: c.gray800, borderRadius: 8, padding: "14px 16px", position: "relative", marginTop: 8 }}>
      <pre style={{ fontFamily: "monospace", fontSize: 12, color: "#E2E8F0", lineHeight: 1.7, whiteSpace: "pre-wrap", wordBreak: "break-all", margin: 0 }}>
        {code}
      </pre>
      <button
        onClick={() => navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); })}
        style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 4, color: c.gray400, fontSize: 11, padding: "3px 8px", cursor: "pointer" }}
      >
        {copied ? "✓ Copied" : "📋 Copy"}
      </button>
    </div>
  );
}

function StepRow({ num, title, desc, children }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: c.blueLight, color: c.blue, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, flexShrink: 0, marginTop: 2 }}>
        {num}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{title}</div>
        {desc && <div style={{ fontSize: 13, color: c.gray600, marginBottom: 10, lineHeight: 1.5 }}>{desc}</div>}
        {children}
      </div>
    </div>
  );
}

export default function SetupStep({
  bizName,
  industry,
  bouId,
  dataSource,
  sessionId,
  onSuccess,
}) {
  bizName = bizName || "Your Business";
  industry = industry || "General";
  bouId = bouId || "BOU001";
  dataSource = dataSource || "Database";

  const [endpointUrl, setEndpointUrl] = useState("");
  const [selectedBou, setSelectedBou] = useState(bouId);
  const [connStatus, setConnStatus] = useState(null);
  const [connVerified, setConnVerified] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(null);

  const providerType = dataSource === "Database" ? "postgres" : "csv";
  const platformIp = typeof window !== "undefined" ? window.location.hostname : "localhost";
  const ouId = "BBPS_" + bizName.toUpperCase().replace(/\s+/g, "_").substring(0, 8);

  const propsText = useMemo(() => {
    const postgresBlock = [
      "billing.provider.postgres.tables.bill-details=bill_details",
      "billing.provider.postgres.tables.payment-transactions=payment_transactions",
      "billing.provider.postgres.bill-columns.bill-id=bill_id",
      "billing.provider.postgres.bill-columns.customer-param-name=customer_param_name",
      "billing.provider.postgres.bill-columns.customer-param-value=customer_param_value",
      "billing.provider.postgres.bill-columns.bill-amount=bill_amount",
      "billing.provider.postgres.bill-columns.bill-date=bill_date",
      "billing.provider.postgres.bill-columns.due-date=due_date",
      "billing.provider.postgres.bill-columns.bill-number=bill_number",
      "billing.provider.postgres.bill-columns.bill-period=bill_period",
      "billing.provider.postgres.bill-columns.bill-status=bill_status",
    ].join("\n");

    const csvBlock = [
      "billing.provider.csv.path=./bills.csv",
      "billing.provider.csv.payment-log-path=./payments.csv",
      "billing.provider.csv.delimiter=,",
      "billing.provider.csv.columns.bill-id=bill_id",
      "billing.provider.csv.columns.customer-param-name=customer_param_name",
      "billing.provider.csv.columns.customer-param-value=customer_param_value",
      "billing.provider.csv.columns.bill-amount=bill_amount",
      "billing.provider.csv.columns.bill-date=bill_date",
      "billing.provider.csv.columns.due-date=due_date",
      "billing.provider.csv.columns.bill-number=bill_number",
      "billing.provider.csv.columns.bill-period=bill_period",
      "billing.provider.csv.columns.bill-status=bill_status",
    ].join("\n");

    return [
      "server.port=8111",
      "spring.datasource.url=jdbc:postgresql://localhost:5432/billerdb?currentSchema=billerdb",
      "spring.datasource.username=postgres",
      "spring.datasource.password=postgres",
      "spring.datasource.driver-class-name=org.postgresql.Driver",
      "spring.jpa.hibernate.ddl-auto=none",
      "spring.main.allow-bean-definition-overriding=true",
      "ou.id=" + ouId,
      "cu.domain=http://" + platformIp + ":8112",
      "bbps.ip=http://" + platformIp + ":8112",
      "cu.billfetchresponse.url=/bbps/BillFetchResponse/1.0/urn:referenceId:",
      "cu.billpaymentresponse.url=/bbps/BillPaymentResponse/1.0/urn:referenceId:",
      "bbps.billfetchresponse.url=/bbps/BillFetchResponse/1.0/urn:referenceId:",
      "bbps.billpaymentresponse.url=/bbps/BillPaymentResponse/1.0/urn:referenceId:",
      "billing.provider.type=" + providerType,
      "billing.provider.date-format=yyyy-MM-dd",
      providerType === "postgres" ? postgresBlock : csvBlock,
    ].join("\n");
  }, [ouId, platformIp, providerType]);

  const dbSeedCode = [
    "psql -U postgres -h localhost -d billerdb -c \"",
    "INSERT INTO billerdb.bill_details",
    "  (customer_param_name, customer_param_type, customer_param_value,",
    "   bill_amount, bill_date, due_date, bill_status, bill_number)",
    "VALUES",
    "  ('Consumer Number','Numeric','1001',1850.00,'2026-04-16','2026-05-01','UNPAID','DEMO-001'),",
    "  ('Consumer Number','Numeric','1002',3200.00,'2026-04-16','2026-05-01','UNPAID','DEMO-002'),",
    "  ('Consumer Number','Numeric','1003',750.00,'2026-04-16','2026-05-01','UNPAID','DEMO-003');\"",
  ].join("\n");

  const cloneCode = [
    "git clone https://github.com/Dhru227/bbps-biller-integrator.git",
    "cd bbps-biller-integrator",
  ].join("\n");

  const dbSetupCode = [
    "psql -U postgres -h localhost -c \"CREATE DATABASE billerdb;\"",
    "psql -U postgres -h localhost -d billerdb -c \"CREATE SCHEMA IF NOT EXISTS billerdb;\"",
    "cat src/main/resources/schema.sql | psql -U postgres -h localhost -d billerdb",
  ].join("\n");

  const csvSampleCode = [
    "bill_id,customer_param_name,customer_param_type,customer_param_value,bill_amount,bill_date,due_date,bill_number,bill_period,bill_status",
    "1,Consumer Number,Numeric,1001,1850.00,2026-04-16,2026-05-01,DEMO-001,APR-2026,UNPAID",
    "2,Consumer Number,Numeric,1002,3200.00,2026-04-16,2026-05-01,DEMO-002,APR-2026,UNPAID",
  ].join("\n");

  const curlCode = [
    "curl -X POST http://localhost:8111/mock-biller/test/fetch \\",
    "  -H \"Content-Type: application/json\" \\",
    "  -d '{\"Consumer Number\": \"1001\"}'",
  ].join("\n");

  const testConnection = () => {
    if (!endpointUrl.trim() || !endpointUrl.startsWith("http")) {
      setConnStatus("error");
      setConnVerified(false);
      return;
    }
    setConnStatus("ok");
    setConnVerified(true);
  };

  const submitEndpoint = async () => {
    if (!sessionId) { setError("No active session. Cannot register."); return; }
    setSubmitting(true);
    setError(null);
    try {
      const r = await fetch(API_BASE_URL + "/onboard/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
        body: JSON.stringify({
          session_id: sessionId,
          biller_endpoint: endpointUrl.trim(),
          bou_id: selectedBou,
          biller_name: bizName,
          category: industry,
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.detail || "Registration failed");
      setRegistered({ biller_id: data.biller_id });
      if (onSuccess) onSuccess(data.biller_id);
    } catch (e) {
      setError("Registration failed: " + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (registered) {
    return (
      <div style={{ background: c.greenLight, border: "1.5px solid #86EFAC", borderRadius: 14, padding: 32, textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: c.green, marginBottom: 6 }}>You are Live on BBPS!</div>
        <div style={{ fontSize: 13, color: c.green, marginBottom: 8 }}>Your Biller ID</div>
        <div style={{ fontFamily: "monospace", fontSize: 20, color: c.blueDark, background: "white", border: "1px solid #86EFAC", padding: "10px 20px", borderRadius: 8, display: "inline-block", margin: "8px 0 16px", letterSpacing: 2 }}>
          {registered.biller_id}
        </div>
        <div style={{ fontSize: 13, color: c.gray600 }}>Routing is active. Advancing to next step...</div>
      </div>
    );
  }

  return (
    <div style={{ color: c.gray800 }}>

      <div style={{ background: "white", border: "1px solid " + c.gray200, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{bizName}</div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: c.gray400, marginTop: 2 }}>
            {"Session: " + (sessionId ? sessionId.substring(0, 8) + "..." : "\u2014")}
          </div>
        </div>
        <span style={{ background: c.orangeLight, color: c.orange, fontSize: 11, padding: "3px 10px", borderRadius: 20 }}>
          Pending Activation
        </span>
      </div>

      {error && (
        <div style={{ background: c.redLight, border: "1px solid #FECACA", color: c.red, fontSize: 13, padding: "10px 14px", borderRadius: 8, marginBottom: 14 }}>
          {error}
        </div>
      )}

      <div style={{ background: "white", borderRadius: 14, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 20, alignItems: "start" }}>
          <div>
            <div style={{ width: 48, height: 48, background: c.orangeLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 12 }}>
              📥
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>BBPS Biller Integrator</div>
            <div style={{ fontSize: 13, color: c.gray600, lineHeight: 1.6, marginBottom: 10 }}>
              A pre-configured Spring Boot service that acts as your integration layer with the BBPS network. Fork it, configure it, and run it on your infrastructure.
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span style={{ background: c.gray100, color: c.gray600, fontSize: 11, fontFamily: "monospace", padding: "3px 8px", borderRadius: 6 }}>Java 17 · Spring Boot</span>
              <span style={{ background: c.gray100, color: c.gray600, fontSize: 11, fontFamily: "monospace", padding: "3px 8px", borderRadius: 6 }}>PostgreSQL</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 160 }}>
            <a href="https://github.com/Dhru227/bbps-biller-integrator/archive/refs/heads/main.zip"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", background: "linear-gradient(135deg," + c.blueDark + "," + c.blue + ")", color: "white", borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              📥 Download .zip
            </a>
            <a href="https://github.com/Dhru227/bbps-biller-integrator" target="_blank" rel="noreferrer"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px 16px", background: "white", color: c.blue, border: "1.5px solid " + c.blue, borderRadius: 8, fontSize: 13, fontWeight: 500, textDecoration: "none" }}>
              🔗 Fork on GitHub
            </a>
            <div style={{ textAlign: "center", fontSize: 10, color: c.gray400, fontFamily: "monospace" }}>v0.1.0 · POC Release</div>
          </div>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: 14, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", marginBottom: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Configure Your Instance</div>
        <div style={{ fontSize: 12, color: c.gray400, marginBottom: 20 }}>Follow these steps in order</div>

        <StepRow num="1" title="Clone the repository" desc="Download the integrator to your machine.">
          <CodeBlock code={cloneCode} />
        </StepRow>

        <StepRow num="2" title="Create your PostgreSQL database" desc="Create the database and schema for your bill data.">
          <CodeBlock code={dbSetupCode} />
        </StepRow>

        <StepRow num="3" title="Configure application.properties" desc="Pre-personalised for your setup — copy and paste directly.">
          <CodeBlock code={propsText} />
        </StepRow>

        {providerType === "csv" ? (
          <StepRow num="4" title="Add your bill data (CSV)" desc="Create bills.csv in the root of the cloned repository.">
            <CodeBlock code={csvSampleCode} />
          </StepRow>
        ) : (
          <StepRow num="4" title="Seed your bill data" desc="After starting the integrator (step 5), run this to insert sample bills.">
            <CodeBlock code={dbSeedCode} />
          </StepRow>
        )}

        <StepRow num="5" title="Start the integrator" desc="Run from inside the cloned repository folder.">
          <CodeBlock code="mvn spring-boot:run" />
          <div style={{ fontSize: 12, color: c.gray600, marginTop: 8 }}>
            {"Requires Java 17 and Maven — "}
            <a href="https://adoptium.net" target="_blank" rel="noreferrer" style={{ color: c.gray400 }}>Download Java 17</a>
            {" · "}
            <a href="https://maven.apache.org/download.cgi" target="_blank" rel="noreferrer" style={{ color: c.gray400 }}>Download Maven</a>
          </div>
        </StepRow>

        <StepRow num="6" title="Verify it is running" desc="Confirm your integrator is live before registering.">
          <CodeBlock code={curlCode} />
          <div style={{ display: "inline-block", background: c.greenLight, color: c.green, fontSize: 11, fontFamily: "monospace", padding: "3px 10px", borderRadius: 6, marginTop: 8 }}>
            Expected: bill_amount, due_date, status: SUCCESS
          </div>
        </StepRow>
      </div>

      <div style={{ background: "white", borderRadius: 14, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)", borderTop: "3px solid " + c.orange }}>
        <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Register Your Endpoint</div>
        <div style={{ fontSize: 13, color: c.gray600, marginBottom: 18, lineHeight: 1.5 }}>
          Once your integrator is running, submit its URL to generate your Biller ID and activate routing on the BBPS platform.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: c.gray600, marginBottom: 6 }}>
              Your Integrator Endpoint URL
            </label>
            <input
              type="text"
              value={endpointUrl}
              onChange={function(e) { setEndpointUrl(e.target.value); setConnVerified(false); setConnStatus(null); }}
              placeholder="http://your-server:8111"
              style={{ width: "100%", height: 44, padding: "0 14px", border: "1.5px solid " + (connStatus === "ok" ? "#86EFAC" : connStatus === "error" ? "#FCA5A5" : c.gray200), borderRadius: 8, fontSize: 14, color: c.gray800, outline: "none", boxSizing: "border-box" }}
            />
          </div>
          <button
            onClick={testConnection}
            style={{ height: 44, padding: "0 18px", border: "1.5px solid " + c.blue, background: "white", color: c.blue, borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap" }}
          >
            Test Connection
          </button>
        </div>

        {connStatus === "ok" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: c.greenLight, border: "1px solid #86EFAC", borderRadius: 8, fontSize: 13, color: c.green, marginTop: 10 }}>
            Endpoint format valid — ready to register
          </div>
        )}
        {connStatus === "error" && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: c.redLight, border: "1px solid #FECACA", borderRadius: 8, fontSize: 13, color: c.red, marginTop: 10 }}>
            Invalid URL — must start with http:// or https://
          </div>
        )}

        <div style={{ marginTop: 14 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: c.gray600, marginBottom: 6 }}>
            Assign to BOU
          </label>
          <select
            value={selectedBou}
            onChange={function(e) { setSelectedBou(e.target.value); }}
            style={{ width: "100%", height: 44, padding: "0 14px", border: "1.5px solid " + c.gray200, borderRadius: 8, fontSize: 14, color: c.gray800, background: "white", outline: "none" }}
          >
            <option value="BOU001">BOU001 — BBPS Platform BOU</option>
            <option value="BOU002">BOU002 — Razorpay BillDesk</option>
            <option value="BOU003">BOU003 — PayU BOU Services</option>
          </select>
        </div>

        <button
          onClick={submitEndpoint}
          disabled={!connVerified || submitting}
          style={{ width: "100%", height: 50, marginTop: 18, background: "linear-gradient(135deg," + c.blueDark + "," + c.blue + ")", color: "white", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: (connVerified && !submitting) ? "pointer" : "not-allowed", opacity: (connVerified && !submitting) ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          {submitting ? "Generating Biller ID..." : "Submit Endpoint & Activate"}
        </button>
        <div style={{ textAlign: "center", fontSize: 11, color: c.gray400, marginTop: 8 }}>
          Your Biller ID will be generated and routing activated within seconds.
        </div>
      </div>
    </div>
  );
}
