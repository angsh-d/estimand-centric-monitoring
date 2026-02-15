import { useState, useEffect } from "react";

// ─── Design tokens ───
const T = {
  bg: "#FAFAFA", surface: "#FFFFFF", text: "#1D1D1F",
  sec: "#86868B", tert: "#AEAEB2", border: "#E5E5EA",
  accent: "#0071E3", accentBg: "#EBF5FF",
  ok: "#34C759", okBg: "#F0FFF4",
  warn: "#FF9F0A", warnBg: "#FFFBEB",
  t1: "#1D1D1F", t2: "#636366", t3: "#AEAEB2",
  r: "12px", rL: "16px",
  sh: "0 1px 3px rgba(0,0,0,0.06)",
  shL: "0 4px 16px rgba(0,0,0,0.08)",
};

// ─── SOA Data ───
const SOA = {
  id: "XYZ-301",
  title: "Phase III, Randomized, Double-Blind, Placebo-Controlled Study of Drug X in MDD",
  visits: [
    { id: "V1", label: "Screening", week: -2, win: "Day -14 to -1" },
    { id: "V2", label: "Baseline", week: 0, win: "Day 1" },
    { id: "V3", label: "Week 1", week: 1, win: "±2d" },
    { id: "V4", label: "Week 2", week: 2, win: "±3d" },
    { id: "V5", label: "Week 4", week: 4, win: "±3d" },
    { id: "V6", label: "Week 6", week: 6, win: "±3d" },
    { id: "V7", label: "Week 8", week: 8, win: "±3d", primary: true },
    { id: "V8", label: "Follow-up", week: 10, win: "±5d" },
  ],
  rows: [
    { name: "Informed Consent", v: [1,0,0,0,0,0,0,0] },
    { name: "Inclusion/Exclusion", v: [1,0,0,0,0,0,0,0] },
    { name: "Demographics", v: [1,0,0,0,0,0,0,0] },
    { name: "Medical History", v: [1,0,0,0,0,0,0,0] },
    { name: "MADRS", v: [1,1,1,1,1,1,1,0], highlight: true },
    { name: "CGI-S / CGI-I", v: [1,1,0,1,1,1,1,0] },
    { name: "Vital Signs", v: [1,1,1,1,1,1,1,1] },
    { name: "Laboratory Panel", v: [1,1,0,0,1,0,1,1] },
    { name: "12-Lead ECG", v: [1,1,0,0,0,0,1,0] },
    { name: "Adverse Events", v: [0,1,1,1,1,1,1,1] },
    { name: "Concomitant Meds", v: [1,1,1,1,1,1,1,1] },
    { name: "Study Drug Dispensing", v: [0,1,0,1,1,1,0,0] },
    { name: "Drug Accountability", v: [0,0,1,1,1,1,1,0] },
    { name: "Disposition", v: [0,0,0,0,0,0,0,1] },
  ],
};

// ─── aCRF Domains ───
const ACRF = [
  { dom: "DM", label: "Demographics", std: "CDASH DM v2.2", fields: [
    { var: "SUBJID", lbl: "Subject Identifier", type: "Char", cdash: "SUBJID", ct: null },
    { var: "BRTHDTC", lbl: "Date of Birth", type: "Date", cdash: "BRTHDTC", ct: null },
    { var: "SEX", lbl: "Sex", type: "Char", cdash: "SEX", ct: "M, F" },
    { var: "RACE", lbl: "Race", type: "Char", cdash: "RACE", ct: "CDISC Race CT" },
    { var: "ETHNIC", lbl: "Ethnicity", type: "Char", cdash: "ETHNIC", ct: "CDISC Ethnicity CT" },
  ]},
  { dom: "IE", label: "Inclusion/Exclusion", std: "CDASH IE v2.2", fields: [
    { var: "IETEST", lbl: "I/E Criterion", type: "Char", cdash: "IETEST", ct: null },
    { var: "IEORRES", lbl: "I/E Result", type: "Char", cdash: "IEORRES", ct: "Y, N" },
    { var: "IEDTC", lbl: "Date Assessed", type: "Date", cdash: "IEDTC", ct: null },
  ]},
  { dom: "QS", label: "Questionnaires — MADRS", std: "CDASH QS v2.2", note: "10 items per assessment (Q1 Apparent Sadness → Q10 Suicidal Thoughts). Total score derived.", fields: [
    { var: "QSCAT", lbl: "Category", type: "Char", cdash: "QSCAT", ct: "MADRS" },
    { var: "QSTEST", lbl: "MADRS Item", type: "Char", cdash: "QSTEST", ct: "MADRS item CT" },
    { var: "QSORRES", lbl: "Item Score (0–6)", type: "Num", cdash: "QSORRES", ct: "0,1,2,3,4,5,6" },
    { var: "QSDTC", lbl: "Assessment Date", type: "Date", cdash: "QSDTC", ct: null },
    { var: "VISITNUM", lbl: "Visit Number", type: "Num", cdash: "VISITNUM", ct: null },
    { var: "QSEVAL", lbl: "Evaluator", type: "Char", cdash: "QSEVAL", ct: "CLINICIAN" },
  ]},
  { dom: "QS-CGI", label: "Questionnaires — CGI", std: "CDASH QS v2.2", fields: [
    { var: "QSTEST", lbl: "CGI Assessment", type: "Char", cdash: "QSTEST", ct: "CGI-S, CGI-I" },
    { var: "QSORRES", lbl: "Score (1–7)", type: "Num", cdash: "QSORRES", ct: "1–7" },
    { var: "QSDTC", lbl: "Assessment Date", type: "Date", cdash: "QSDTC", ct: null },
  ]},
  { dom: "VS", label: "Vital Signs", std: "CDASH VS v2.2", fields: [
    { var: "VSTEST", lbl: "Test Name", type: "Char", cdash: "VSTEST", ct: "SYSBP, DIABP, HR, TEMP, WEIGHT" },
    { var: "VSORRES", lbl: "Result", type: "Num", cdash: "VSORRES", ct: null },
    { var: "VSORRESU", lbl: "Unit", type: "Char", cdash: "VSORRESU", ct: "CDISC Unit CT" },
    { var: "VSDTC", lbl: "Date", type: "Date", cdash: "VSDTC", ct: null },
  ]},
  { dom: "LB", label: "Laboratory", std: "CDASH LB v2.2", fields: [
    { var: "LBTEST", lbl: "Lab Test", type: "Char", cdash: "LBTEST", ct: "CDISC Lab CT" },
    { var: "LBORRES", lbl: "Result", type: "Char", cdash: "LBORRES", ct: null },
    { var: "LBORNRLO", lbl: "Normal Low", type: "Num", cdash: "LBORNRLO", ct: null },
    { var: "LBORNRHI", lbl: "Normal High", type: "Num", cdash: "LBORNRHI", ct: null },
    { var: "LBDTC", lbl: "Collection Date", type: "Date", cdash: "LBDTC", ct: null },
  ]},
  { dom: "EG", label: "ECG", std: "CDASH EG v2.2", fields: [
    { var: "EGTEST", lbl: "ECG Test", type: "Char", cdash: "EGTEST", ct: "CDISC ECG CT" },
    { var: "EGORRES", lbl: "Result", type: "Char", cdash: "EGORRES", ct: null },
    { var: "EGDTC", lbl: "Date", type: "Date", cdash: "EGDTC", ct: null },
  ]},
  { dom: "AE", label: "Adverse Events", std: "CDASH AE v2.2", fields: [
    { var: "AETERM", lbl: "AE Term (verbatim)", type: "Char", cdash: "AETERM", ct: null },
    { var: "AESTDTC", lbl: "Start Date", type: "Date", cdash: "AESTDTC", ct: null },
    { var: "AEENDTC", lbl: "End Date", type: "Date", cdash: "AEENDTC", ct: null },
    { var: "AESER", lbl: "Serious?", type: "Char", cdash: "AESER", ct: "Y, N" },
    { var: "AEREL", lbl: "Causality", type: "Char", cdash: "AEREL", ct: "CDISC Causality CT" },
    { var: "AEACN", lbl: "Action Taken", type: "Char", cdash: "AEACN", ct: "CDISC Action CT" },
    { var: "AEOUT", lbl: "Outcome", type: "Char", cdash: "AEOUT", ct: "CDISC Outcome CT" },
  ]},
  { dom: "CM", label: "Concomitant Meds", std: "CDASH CM v2.2", fields: [
    { var: "CMTRT", lbl: "Medication Name", type: "Char", cdash: "CMTRT", ct: null },
    { var: "CMSTDTC", lbl: "Start Date", type: "Date", cdash: "CMSTDTC", ct: null },
    { var: "CMENDTC", lbl: "End Date", type: "Date", cdash: "CMENDTC", ct: null },
    { var: "CMINDC", lbl: "Indication", type: "Char", cdash: "CMINDC", ct: null },
  ]},
  { dom: "EX", label: "Exposure", std: "CDASH EX v2.2", fields: [
    { var: "EXTRT", lbl: "Treatment", type: "Char", cdash: "EXTRT", ct: null },
    { var: "EXDOSE", lbl: "Dose", type: "Num", cdash: "EXDOSE", ct: null },
    { var: "EXSTDTC", lbl: "Start Date", type: "Date", cdash: "EXSTDTC", ct: null },
    { var: "EXENDTC", lbl: "End Date", type: "Date", cdash: "EXENDTC", ct: null },
  ]},
  { dom: "DS", label: "Disposition", std: "CDASH DS v2.2", fields: [
    { var: "DSSCAT", lbl: "Subcategory", type: "Char", cdash: "DSSCAT", ct: "COMPLETED, EARLY TERM" },
    { var: "DSTERM", lbl: "Reason", type: "Char", cdash: "DSTERM", ct: null },
    { var: "DSDTC", lbl: "Date", type: "Date", cdash: "DSDTC", ct: null },
  ]},
];

// ─── Derivation mapping aCRF → SAP ───
const DMAP = [
  { dom: "QS", field: "QSORRES (MADRS Q1–Q10)", sap: "AVAL = Σ(Q1..Q10)", deriv: "MADRS total = sum of 10 items", link: "Direct component of primary endpoint", tier: 1 },
  { dom: "QS", field: "QSORRES (MADRS, Visit 2)", sap: "BASE = AVAL at Visit 2", deriv: "Baseline MADRS total score", link: "Baseline for CHG computation", tier: 1 },
  { dom: "QS", field: "QSDTC (Visit 7 / Week 8)", sap: "ADT", deriv: "Assessment date at primary timepoint", link: "Window compliance — primary", tier: 1 },
  { dom: "QS", field: "VISITNUM", sap: "AVISIT / AVISITN", deriv: "Visit mapping for MMRM model", link: "Repeated measures structure", tier: 1 },
  { dom: "CM", field: "CMTRT (rescue medications)", sap: "CRIT1FL (rescue flag)", deriv: "If rescue → composite failure", link: "Intercurrent event — changes endpoint", tier: 1 },
  { dom: "EX", field: "EXSTDTC, EXENDTC", sap: "TRTSDT, TRTEDT", deriv: "Treatment start/end dates", link: "mITT definition (≥1 dose)", tier: 1 },
  { dom: "DM", field: "SUBJID, RFSTDTC", sap: "USUBJID, RFSTDTC", deriv: "Subject ID and reference start", link: "Population and windowing anchor", tier: 1 },
  { dom: "DS", field: "DSSCAT, DSDTC", sap: "EOSSTT, EOSDT", deriv: "Discontinuation flag + date", link: "Intercurrent event — treatment policy", tier: 2 },
  { dom: "QS", field: "QSORRES (MADRS, Visits 3–6)", sap: "AVAL at intermediate visits", deriv: "Intermediate MADRS scores", link: "MMRM — repeated measures", tier: 2 },
  { dom: "IE", field: "IEORRES", sap: "RANDFL", deriv: "I/E met → randomized", link: "Eligibility verification", tier: 2 },
  { dom: "QS-CGI", field: "QSORRES (CGI-S, CGI-I)", sap: "CGI analysis variables", deriv: "Key secondary endpoint", link: "Secondary analysis", tier: 2 },
  { dom: "AE", field: "AETERM, AESER, AEREL", sap: "Safety analysis variables", deriv: "AE characterization", link: "Safety — not primary estimand", tier: 3 },
  { dom: "DM", field: "SEX, RACE, AGE", sap: "Covariates in MMRM", deriv: "Stratification factors", link: "Model covariates — not derivation-critical", tier: 3 },
  { dom: "VS", field: "VSORRES (all)", sap: "Safety VS analysis", deriv: "Vital sign monitoring", link: "Safety analysis only", tier: 3 },
  { dom: "LB", field: "LBORRES (all)", sap: "Safety LB analysis", deriv: "Lab shift / toxicity grading", link: "Safety analysis only", tier: 3 },
  { dom: "EG", field: "EGORRES (all)", sap: "Safety ECG analysis", deriv: "QTc analysis", link: "Safety analysis only", tier: 3 },
];

// ─── Estimands ───
const ESTS = [
  { id: "E1", label: "Primary Estimand", var: "Change from baseline in MADRS total score at Week 8", pop: "mITT (≥1 dose)", trt: "Drug X 200mg vs Placebo", ic: [{ ev: "Treatment discontinuation", st: "Treatment policy" }, { ev: "Rescue medication use", st: "Composite (failure)" }], sum: "Difference in means of change from baseline MADRS at Week 8, regardless of discontinuation, rescue = failure.", conf: 0.96 },
  { id: "E2", label: "Key Secondary", var: "MADRS response (≥50% reduction) at Week 8", pop: "mITT", trt: "Drug X 200mg vs Placebo", ic: [{ ev: "Treatment discontinuation", st: "Treatment policy" }], sum: "Proportion achieving ≥50% MADRS reduction at Week 8.", conf: 0.91 },
];

// ─── Reusable components ───
const Fade = ({ show, children, delay = 0 }) => <div style={{ opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(10px)", transition: `all 0.45s ease ${delay}ms` }}>{children}</div>;
const Badge = ({ tier, onClick }) => { const m = { 1: { bg: T.t1, l: "Tier 1 · Critical" }, 2: { bg: T.t2, l: "Tier 2 · Important" }, 3: { bg: T.t3, l: "Tier 3 · Supportive" } }[tier]; return <span onClick={onClick} style={{ display: "inline-block", padding: "2px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: m.bg, color: "#FFF", cursor: onClick ? "pointer" : "default", letterSpacing: 0.2, whiteSpace: "nowrap" }}>{m.l}</span>; };
const Btn = ({ children, onClick, disabled, alt }) => <button onClick={onClick} disabled={disabled} style={{ width: "100%", padding: 15, borderRadius: T.r, border: alt ? `1px solid ${T.border}` : "none", background: disabled ? T.border : alt ? T.surface : T.text, color: alt ? T.text : "#FFF", fontSize: 15, fontWeight: 600, cursor: disabled ? "default" : "pointer", transition: "all 0.3s", letterSpacing: -0.2 }}>{children}</button>;
const Head = ({ step, total, title, desc }) => <div style={{ marginBottom: 28 }}>{step && <div style={{ fontSize: 11, fontWeight: 600, color: T.sec, letterSpacing: 1, marginBottom: 4 }}>STEP {step} OF {total}</div>}<h2 style={{ fontSize: 24, fontWeight: 700, color: T.text, margin: "0 0 6px", letterSpacing: -0.3 }}>{title}</h2>{desc && <p style={{ fontSize: 14, color: T.sec, margin: 0, lineHeight: 1.5 }}>{desc}</p>}</div>;

const Proc = ({ steps, label, sub, onDone }) => {
  const [cur, setCur] = useState(-1);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    setTimeout(() => setVis(true), 80);
    let i = 0, t;
    const go = () => { if (i < steps.length) { setCur(i); t = setTimeout(() => { i++; go(); }, steps[i].ms); } else setTimeout(onDone, 600); };
    t = setTimeout(go, 400);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{ maxWidth: 460, margin: "0 auto", padding: "52px 24px" }}>
      <Fade show={vis}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: T.text, margin: 0 }}>{label}</h2>
          <p style={{ fontSize: 13, color: T.sec, marginTop: 4 }}>{sub}</p>
        </div>
        {steps.map((s, i) => { const done = i < cur, act = i === cur, pend = i > cur; return (
          <Fade key={i} show={!pend}><div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 14px", borderRadius: 10, background: act ? T.accentBg : "transparent", transition: "all 0.3s" }}>
            <div style={{ width: 21, height: 21, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", background: done ? T.ok : act ? T.accent : T.border, transition: "all 0.3s", flexShrink: 0 }}>
              {done ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : act ? <div style={{ width: 7, height: 7, borderRadius: 4, background: "#FFF", animation: "p 1s ease infinite" }}/> : null}
            </div>
            <span style={{ fontSize: 13, fontWeight: act ? 600 : 400, color: done ? T.ok : act ? T.accent : T.tert }}>{s.label}</span>
          </div></Fade>
        ); })}
      </Fade>
      <style>{`@keyframes p{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
    </div>
  );
};

// ═══════════ STEP 0: Upload Protocol ═══════════
const S0 = ({ onNext }) => {
  const [f, setF] = useState(null);
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "52px 24px" }}>
      <Fade show={vis}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.text}, #48484A)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: 0, letterSpacing: -0.4 }}>Criticality Model Builder</h1>
          <p style={{ fontSize: 14, color: T.sec, marginTop: 8, lineHeight: 1.5 }}>Upload the study protocol to begin. The platform will extract the<br/>Schedule of Assessments and generate a CDASH-annotated CRF.</p>
        </div>
      </Fade>
      <Fade show={vis} delay={200}>
        <div onClick={() => setF({ name: "STUDY-XYZ-301-Protocol-v3.2.pdf" })} style={{ padding: "28px 24px", borderRadius: T.rL, cursor: "pointer", border: f ? `2px solid ${T.ok}` : `2px dashed ${T.border}`, background: f ? T.okBg : T.surface, transition: "all 0.3s", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: f ? T.ok : T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {f ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.sec} strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Study Protocol</div>
          {f && <div style={{ fontSize: 11, color: T.ok, fontWeight: 500, padding: "3px 10px", background: "rgba(52,199,89,0.1)", borderRadius: 100 }}>{f.name}</div>}
        </div>
      </Fade>
      <Fade show={!!f}><Btn onClick={onNext} disabled={!f}>Extract Schedule of Assessments</Btn></Fade>
    </div>
  );
};

// ═══════════ STEP 1: Processing Protocol ═══════════
const S1 = ({ onNext }) => <Proc steps={[{ label: "Parsing protocol structure", ms: 1200 }, { label: "Identifying Schedule of Assessments", ms: 1400 }, { label: "Extracting visits and timepoints", ms: 1000 }, { label: "Mapping assessments to visit matrix", ms: 1600 }, { label: "Validating window definitions", ms: 800 }]} label="Reading protocol" sub="Extracting study design, visits, and assessments" onDone={onNext} />;

// ═══════════ STEP 2: SOA Review ═══════════
const S2 = ({ onNext }) => {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "36px 24px" }}>
      <Fade show={vis}><Head step="1" total="6" title="Confirm the Schedule of Assessments" desc="Extracted from the protocol. This drives the aCRF generation." /></Fade>
      <Fade show={vis} delay={100}>
        <div style={{ padding: "12px 16px", borderRadius: T.r, background: T.accentBg, border: `1px solid ${T.accent}20`, marginBottom: 16, fontSize: 12, color: T.accent, fontWeight: 500 }}>{SOA.id} — {SOA.title}</div>
      </Fade>
      <Fade show={vis} delay={200}>
        <div style={{ borderRadius: T.rL, border: `1px solid ${T.border}`, background: T.surface, overflow: "auto", boxShadow: T.sh }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
            <thead><tr style={{ background: T.bg }}>
              <th style={{ padding: "9px 12px", textAlign: "left", fontWeight: 600, color: T.sec, letterSpacing: 0.3, borderBottom: `1px solid ${T.border}`, position: "sticky", left: 0, background: T.bg, minWidth: 155, zIndex: 2 }}>ASSESSMENT</th>
              {SOA.visits.map(v => <th key={v.id} style={{ padding: "9px 6px", textAlign: "center", fontWeight: 600, color: T.text, borderBottom: `1px solid ${T.border}`, minWidth: 68 }}>
                <div style={{ fontSize: 11 }}>{v.label}</div>
                <div style={{ fontSize: 9.5, fontWeight: 400, color: T.tert, marginTop: 1 }}>{v.win}</div>
                {v.primary && <div style={{ fontSize: 8, fontWeight: 700, color: T.accent, marginTop: 2, letterSpacing: 0.5 }}>PRIMARY</div>}
              </th>)}
            </tr></thead>
            <tbody>{SOA.rows.map((r, ri) => <tr key={ri} style={{ background: r.highlight ? "rgba(0,113,227,0.03)" : "transparent" }}>
              <td style={{ padding: "8px 12px", fontWeight: r.highlight ? 600 : 400, color: T.text, borderBottom: `1px solid ${T.border}`, position: "sticky", left: 0, background: r.highlight ? "rgba(0,113,227,0.03)" : T.surface, zIndex: 1 }}>{r.name}</td>
              {r.v.map((x, ci) => <td key={ci} style={{ padding: "8px 6px", textAlign: "center", borderBottom: `1px solid ${T.border}` }}>
                {x ? <div style={{ width: 16, height: 16, borderRadius: 4, background: r.highlight ? T.accent : T.t1, display: "inline-flex", alignItems: "center", justifyContent: "center" }}><svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div> : <span style={{ color: T.tert }}>—</span>}
              </td>)}
            </tr>)}</tbody>
          </table>
        </div>
      </Fade>
      <Fade show={vis} delay={350}><div style={{ marginTop: 20 }}><Btn onClick={onNext}>Generate Annotated CRF (CDASH)</Btn></div></Fade>
    </div>
  );
};

// ═══════════ STEP 3: Processing aCRF ═══════════
const S3 = ({ onNext }) => <Proc steps={[{ label: "Applying CDASH Implementation Guide v2.2", ms: 1400 }, { label: "Mapping assessments to CDISC domains", ms: 1800 }, { label: "Generating variable-level annotations", ms: 1600 }, { label: "Applying controlled terminology", ms: 1200 }, { label: "Cross-referencing SOA completeness", ms: 1000 }]} label="Generating annotated CRF" sub="Applying CDISC CDASH Implementation Guide v2.2" onDone={onNext} />;

// ═══════════ STEP 4: aCRF Review ═══════════
const S4 = ({ onNext }) => {
  const [vis, setVis] = useState(false);
  const [sel, setSel] = useState("QS");
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const totalFields = ACRF.reduce((s, d) => s + d.fields.length, 0);
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "36px 24px" }}>
      <Fade show={vis}><Head step="2" total="6" title="Review the annotated CRF" desc={`Generated from SOA using CDISC CDASH v2.2 — ${ACRF.length} domains, ${totalFields} variables.`} /></Fade>
      <Fade show={vis} delay={100}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 18 }}>
          {ACRF.map(d => <button key={d.dom} onClick={() => setSel(d.dom)} style={{ padding: "5px 12px", borderRadius: 100, border: `1px solid ${sel === d.dom ? T.accent : T.border}`, background: sel === d.dom ? T.accentBg : T.surface, color: sel === d.dom ? T.accent : T.sec, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}>{d.dom}{d.dom === "QS-CGI" ? "" : ""} {d.label.replace("Questionnaires — ","")}</button>)}
        </div>
      </Fade>
      {ACRF.filter(d => d.dom === sel).map(d => (
        <Fade key={d.dom} show={vis} delay={200}>
          <div style={{ borderRadius: T.rL, border: `1px solid ${T.border}`, background: T.surface, overflow: "hidden", boxShadow: T.sh, marginBottom: 14 }}>
            <div style={{ padding: "14px 18px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div><div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>{d.dom} — {d.label}</div><div style={{ fontSize: 11, color: T.sec, marginTop: 2 }}>{d.std}</div></div>
              <div style={{ fontSize: 11, color: T.tert }}>{d.fields.length} variables</div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
              <thead><tr style={{ background: T.bg }}>
                {["VARIABLE", "LABEL", "TYPE", "CDASH VAR", "CONTROLLED TERMINOLOGY"].map(h => <th key={h} style={{ padding: "7px 12px", textAlign: "left", fontWeight: 600, color: T.sec, letterSpacing: 0.3, borderBottom: `1px solid ${T.border}`, fontSize: 9.5 }}>{h}</th>)}
              </tr></thead>
              <tbody>{d.fields.map((f, i) => <tr key={i}>
                <td style={{ padding: "9px 12px", fontFamily: "monospace", fontWeight: 600, color: T.text, borderBottom: `1px solid ${T.border}`, fontSize: 11.5 }}>{f.var}</td>
                <td style={{ padding: "9px 12px", color: T.text, borderBottom: `1px solid ${T.border}` }}>{f.lbl}</td>
                <td style={{ padding: "9px 12px", borderBottom: `1px solid ${T.border}` }}><span style={{ padding: "1px 7px", borderRadius: 4, background: T.bg, color: T.sec, fontSize: 10, fontWeight: 600 }}>{f.type}</span></td>
                <td style={{ padding: "9px 12px", fontFamily: "monospace", color: T.sec, borderBottom: `1px solid ${T.border}`, fontSize: 10.5 }}>{f.cdash}</td>
                <td style={{ padding: "9px 12px", color: f.ct ? T.text : T.tert, borderBottom: `1px solid ${T.border}`, fontSize: 10.5 }}>{f.ct || "—"}</td>
              </tr>)}</tbody>
            </table>
            {d.note && <div style={{ padding: "10px 18px", background: T.bg, fontSize: 11, color: T.sec, fontStyle: "italic", borderTop: `1px solid ${T.border}` }}>{d.note}</div>}
          </div>
        </Fade>
      ))}
      <Fade show={vis} delay={350}><div style={{ marginTop: 18 }}><Btn onClick={onNext}>Continue — Upload SAP</Btn></div></Fade>
    </div>
  );
};

// ═══════════ STEP 5: Upload SAP ═══════════
const S5 = ({ onNext }) => {
  const [f, setF] = useState(null);
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const totalFields = ACRF.reduce((s, d) => s + d.fields.length, 0);
  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: "52px 24px" }}>
      <Fade show={vis}>
        <div style={{ textAlign: "center", marginBottom: 8 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: T.okBg, marginBottom: 14 }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={T.ok} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span style={{ fontSize: 11, fontWeight: 600, color: T.ok }}>aCRF generated — {ACRF.length} domains, {totalFields} variables</span>
          </div>
          <h2 style={{ fontSize: 23, fontWeight: 700, color: T.text, margin: "0 0 6px" }}>Now upload the SAP</h2>
          <p style={{ fontSize: 13, color: T.sec, margin: 0, lineHeight: 1.5 }}>The platform will extract estimands and map them<br/>to aCRF fields through derivation chains.</p>
        </div>
      </Fade>
      <Fade show={vis} delay={200}>
        <div onClick={() => setF({ name: "STUDY-XYZ-301-SAP-v2.1.pdf" })} style={{ padding: "28px 24px", borderRadius: T.rL, cursor: "pointer", border: f ? `2px solid ${T.ok}` : `2px dashed ${T.border}`, background: f ? T.okBg : T.surface, transition: "all 0.3s", display: "flex", flexDirection: "column", alignItems: "center", gap: 10, marginTop: 24, marginBottom: 24 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: f ? T.ok : T.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {f ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.sec} strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Statistical Analysis Plan</div>
          {f && <div style={{ fontSize: 11, color: T.ok, fontWeight: 500, padding: "3px 10px", background: "rgba(52,199,89,0.1)", borderRadius: 100 }}>{f.name}</div>}
        </div>
      </Fade>
      <Fade show={!!f}><Btn onClick={onNext} disabled={!f}>Extract Estimands & Map to aCRF</Btn></Fade>
    </div>
  );
};

// ═══════════ STEP 6: Processing SAP + Mapping ═══════════
const S6 = ({ onNext }) => <Proc steps={[{ label: "Reading statistical analysis plan", ms: 1200 }, { label: "Extracting estimand framework", ms: 1800 }, { label: "Identifying analysis populations", ms: 1000 }, { label: "Parsing analysis variable definitions", ms: 1400 }, { label: "Mapping intercurrent event strategies", ms: 1200 }, { label: "Tracing aCRF fields to SAP variables", ms: 1600 }, { label: "Building derivation chains", ms: 2000 }, { label: "Classifying criticality tiers", ms: 1400 }, { label: "Cross-validating completeness", ms: 1000 }]} label="Reading SAP & building derivations" sub="Mapping estimand framework to annotated CRF" onDone={onNext} />;

// ═══════════ STEP 7: Estimand Review ═══════════
const S7 = ({ onNext }) => {
  const [vis, setVis] = useState(false);
  const [exp, setExp] = useState("E1");
  const [ok, setOk] = useState({});
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const allOk = ESTS.every(e => ok[e.id]);
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "36px 24px" }}>
      <Fade show={vis}><Head step="3" total="6" title="Confirm the estimands" desc="Extracted from the SAP. Everything downstream depends on this being correct." /></Fade>
      {ESTS.map((e, idx) => { const open = exp === e.id, confirmed = ok[e.id]; return (
        <Fade key={e.id} show={vis} delay={120 + idx * 100}>
          <div style={{ borderRadius: T.rL, border: `1px solid ${confirmed ? T.ok : T.border}`, background: T.surface, marginBottom: 12, overflow: "hidden", boxShadow: open ? T.shL : T.sh }}>
            <div onClick={() => setExp(open ? null : e.id)} style={{ padding: "16px 20px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {confirmed && <div style={{ width: 20, height: 20, borderRadius: 10, background: T.ok, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg></div>}
                <div><div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{e.label}</div><div style={{ fontSize: 12, color: T.sec, marginTop: 1 }}>{e.var}</div></div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.tert} strokeWidth="2" style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s" }}><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {open && <div style={{ padding: "0 20px 18px", borderTop: `1px solid ${T.border}` }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, paddingTop: 16 }}>
                {[["POPULATION", e.pop], ["TREATMENT", e.trt], ["VARIABLE", e.var]].map(([l, v]) => <div key={l}><div style={{ fontSize: 10, fontWeight: 600, color: T.sec, letterSpacing: 0.5, marginBottom: 3 }}>{l}</div><div style={{ fontSize: 12, color: T.text, lineHeight: 1.4 }}>{v}</div></div>)}
              </div>
              <div style={{ marginTop: 12 }}><div style={{ fontSize: 10, fontWeight: 600, color: T.sec, letterSpacing: 0.5, marginBottom: 6 }}>INTERCURRENT EVENTS</div>
                {e.ic.map((ic, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 10px", borderRadius: 7, background: T.bg, marginBottom: 3, fontSize: 12 }}><span style={{ color: T.text }}>{ic.ev}</span><span style={{ padding: "2px 7px", borderRadius: 100, background: T.surface, border: `1px solid ${T.border}`, fontSize: 10, fontWeight: 600, color: T.sec }}>{ic.st}</span></div>)}
              </div>
              <div style={{ marginTop: 12, padding: "9px 12px", borderRadius: 8, background: T.bg, fontSize: 12, color: T.text, lineHeight: 1.5, fontStyle: "italic" }}>{e.sum}</div>
              <button onClick={ev => { ev.stopPropagation(); setOk(p => ({ ...p, [e.id]: !p[e.id] })); }} style={{ marginTop: 12, padding: "8px 16px", borderRadius: 9, border: confirmed ? `1px solid ${T.ok}` : `1px solid ${T.border}`, background: confirmed ? T.okBg : T.surface, color: confirmed ? T.ok : T.text, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{confirmed ? "✓ Confirmed" : "Confirm this estimand"}</button>
            </div>}
          </div>
        </Fade>
      ); })}
      <Fade show={allOk}><div style={{ marginTop: 14 }}><Btn onClick={onNext}>Continue to aCRF → Estimand Mapping</Btn></div></Fade>
    </div>
  );
};

// ═══════════ STEP 8: Derivation Map ═══════════
const S8 = ({ onNext }) => {
  const [vis, setVis] = useState(false);
  const [flt, setFlt] = useState("all");
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const ct = { 1: 0, 2: 0, 3: 0 }; DMAP.forEach(d => ct[d.tier]++);
  const rows = flt === "all" ? DMAP : DMAP.filter(d => d.tier === parseInt(flt));
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "36px 24px" }}>
      <Fade show={vis}><Head step="4" total="6" title="aCRF → Estimand derivation mapping" desc="Each aCRF field traced to its role in the estimand analysis." /></Fade>
      <Fade show={vis} delay={100}>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[{ k: "all", l: `All (${DMAP.length})` }, { k: "1", l: `Tier 1 (${ct[1]})` }, { k: "2", l: `Tier 2 (${ct[2]})` }, { k: "3", l: `Tier 3 (${ct[3]})` }].map(x => <button key={x.k} onClick={() => setFlt(x.k)} style={{ padding: "5px 13px", borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: "pointer", border: `1px solid ${flt === x.k ? T.accent : T.border}`, background: flt === x.k ? T.accentBg : T.surface, color: flt === x.k ? T.accent : T.sec }}>{x.l}</button>)}
        </div>
      </Fade>
      <Fade show={vis} delay={200}>
        <div style={{ borderRadius: T.rL, border: `1px solid ${T.border}`, background: T.surface, overflow: "hidden", boxShadow: T.sh }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead><tr style={{ background: T.bg }}>
              {["aCRF", "aCRF FIELD", "SAP VARIABLE", "DERIVATION", "ESTIMAND LINK", "TIER"].map(h => <th key={h} style={{ padding: "9px 10px", textAlign: "left", fontWeight: 600, color: T.sec, letterSpacing: 0.3, borderBottom: `1px solid ${T.border}`, fontSize: 9.5 }}>{h}</th>)}
            </tr></thead>
            <tbody>{rows.map((d, i) => <tr key={i} style={{ background: d.tier === 1 ? "rgba(0,113,227,0.02)" : "transparent" }}>
              <td style={{ padding: "9px 10px", fontFamily: "monospace", fontWeight: 600, color: T.accent, borderBottom: `1px solid ${T.border}`, fontSize: 11 }}>{d.dom}</td>
              <td style={{ padding: "9px 10px", color: T.text, borderBottom: `1px solid ${T.border}`, fontWeight: d.tier === 1 ? 600 : 400 }}>{d.field}</td>
              <td style={{ padding: "9px 10px", fontFamily: "monospace", color: T.t2, borderBottom: `1px solid ${T.border}`, fontSize: 10 }}>{d.sap}</td>
              <td style={{ padding: "9px 10px", color: T.sec, borderBottom: `1px solid ${T.border}` }}>{d.deriv}</td>
              <td style={{ padding: "9px 10px", color: T.text, borderBottom: `1px solid ${T.border}`, fontSize: 10.5 }}>{d.link}</td>
              <td style={{ padding: "9px 10px", borderBottom: `1px solid ${T.border}` }}><Badge tier={d.tier} /></td>
            </tr>)}</tbody>
          </table>
        </div>
      </Fade>
      <Fade show={vis} delay={350}><div style={{ marginTop: 22 }}><Btn onClick={onNext}>Continue to Criticality Review</Btn></div></Fade>
    </div>
  );
};

// ═══════════ STEP 9: Criticality (editable) ═══════════
const S9 = ({ onNext }) => {
  const [vis, setVis] = useState(false);
  const [fields, setFields] = useState(DMAP.map(d => ({ ...d })));
  const [editIdx, setEditIdx] = useState(null);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const ct = { 1: 0, 2: 0, 3: 0 }; fields.forEach(f => ct[f.tier]++);
  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "36px 24px" }}>
      <Fade show={vis}><Head step="5" total="6" title="Finalize criticality classification" desc="Click any tier badge to adjust. Your domain expertise overrides the AI." /></Fade>
      <Fade show={vis} delay={100}>
        <div style={{ display: "flex", gap: 10, marginBottom: 22 }}>
          {[{ t: 1, l: "Critical", d: "Direct estimand impact", c: T.t1 }, { t: 2, l: "Important", d: "Supports primary analysis", c: T.t2 }, { t: 3, l: "Supportive", d: "Characterization only", c: T.t3 }].map(x => <div key={x.t} style={{ flex: 1, padding: "12px 16px", borderRadius: T.r, background: T.surface, border: `1px solid ${T.border}`, boxShadow: T.sh }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 7 }}><span style={{ fontSize: 24, fontWeight: 700, color: x.c }}>{ct[x.t]}</span><span style={{ fontSize: 11, fontWeight: 600, color: x.c }}>Tier {x.t}</span></div>
            <div style={{ fontSize: 10, color: T.sec, marginTop: 2 }}>{x.d}</div>
          </div>)}
        </div>
      </Fade>
      <Fade show={vis} delay={200}>
        <div style={{ borderRadius: T.rL, border: `1px solid ${T.border}`, background: T.surface, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "70px 1fr 130px auto", padding: "8px 14px", borderBottom: `1px solid ${T.border}`, background: T.bg, gap: 8 }}>
            {["DOMAIN", "FIELD", "TIER", "ESTIMAND LINK"].map(h => <span key={h} style={{ fontSize: 9.5, fontWeight: 600, color: T.sec, letterSpacing: 0.3 }}>{h}</span>)}
          </div>
          {fields.map((f, i) => <div key={i} style={{ display: "grid", gridTemplateColumns: "70px 1fr 130px auto", padding: "10px 14px", borderBottom: i < fields.length - 1 ? `1px solid ${T.border}` : "none", alignItems: "center", gap: 8, background: editIdx === i ? T.accentBg : "transparent", transition: "background 0.2s" }}>
            <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 600, color: T.accent }}>{f.dom}</span>
            <span style={{ fontSize: 11.5, fontWeight: f.tier === 1 ? 600 : 400, color: T.text }}>{f.field}</span>
            <div style={{ position: "relative" }}>
              <Badge tier={f.tier} onClick={() => setEditIdx(editIdx === i ? null : i)} />
              {editIdx === i && <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, background: T.surface, borderRadius: 10, padding: 4, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", border: `1px solid ${T.border}`, zIndex: 10 }}>
                {[1, 2, 3].map(t => <div key={t} onClick={() => { setFields(p => p.map((x, j) => j === i ? { ...x, tier: t } : x)); setEditIdx(null); }} style={{ padding: "5px 8px", borderRadius: 7, cursor: "pointer", background: f.tier === t ? T.bg : "transparent" }}><Badge tier={t} /></div>)}
              </div>}
            </div>
            <span style={{ fontSize: 10.5, color: T.sec }}>{f.link}</span>
          </div>)}
        </div>
      </Fade>
      <Fade show={vis} delay={400}><div style={{ marginTop: 22 }}><Btn onClick={onNext}>Finalize Criticality Model</Btn></div></Fade>
    </div>
  );
};

// ═══════════ STEP 10: Complete ═══════════
const S10 = () => {
  const [vis, setVis] = useState(false);
  useEffect(() => { setTimeout(() => setVis(true), 80); }, []);
  const ct = { 1: 0, 2: 0, 3: 0 }; DMAP.forEach(d => ct[d.tier]++);
  const totalFields = ACRF.reduce((s, d) => s + d.fields.length, 0);
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "64px 24px", textAlign: "center" }}>
      <Fade show={vis}>
        <div style={{ width: 64, height: 64, borderRadius: 32, background: T.ok, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 4px 16px rgba(52,199,89,0.3)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: T.text, margin: "0 0 8px", letterSpacing: -0.4 }}>Criticality model ready</h2>
        <p style={{ fontSize: 14, color: T.sec, margin: "0 0 32px", lineHeight: 1.5 }}>Protocol SOA → CDASH aCRF → SAP estimands → criticality tiers.<br/>Full traceability from CRF field to estimand.</p>
      </Fade>
      <Fade show={vis} delay={200}>
        <div style={{ padding: "18px", borderRadius: T.rL, background: T.surface, border: `1px solid ${T.border}`, boxShadow: T.sh, textAlign: "left", marginBottom: 18 }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: T.sec, letterSpacing: 1, marginBottom: 12 }}>MODEL SUMMARY</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 12, marginBottom: 14 }}>
            {[{ l: "aCRF Domains", v: ACRF.length }, { l: "Variables", v: totalFields }, { l: "Estimands", v: 2 }, { l: "Derivation Chains", v: DMAP.length }].map(x => <div key={x.l}><div style={{ fontSize: 20, fontWeight: 700, color: T.text }}>{x.v}</div><div style={{ fontSize: 10, color: T.sec, marginTop: 1 }}>{x.l}</div></div>)}
          </div>
          <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {[{ t: 1, l: "Tier 1 · Critical", c: T.t1 }, { t: 2, l: "Tier 2 · Important", c: T.t2 }, { t: 3, l: "Tier 3 · Supportive", c: T.t3 }].map(x => <div key={x.t}><div style={{ fontSize: 18, fontWeight: 700, color: x.c }}>{ct[x.t]}</div><div style={{ fontSize: 10, color: T.sec, marginTop: 1 }}>{x.l}</div></div>)}
          </div>
        </div>
      </Fade>
      <Fade show={vis} delay={350}>
        <div style={{ padding: "14px 16px", borderRadius: T.r, background: T.warnBg, border: `1px solid ${T.warn}30`, textAlign: "left", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={T.warn} strokeWidth="2" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <div><div style={{ fontSize: 12, fontWeight: 600, color: T.text, marginBottom: 3 }}>Requires SME validation</div><div style={{ fontSize: 11, color: T.sec, lineHeight: 1.4 }}>This model must be reviewed by the study statistician and medical monitor before driving monitoring recommendations.</div></div>
          </div>
        </div>
      </Fade>
      <Fade show={vis} delay={500}>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn>Export Model</Btn>
          <Btn alt>Generate RBQM Package</Btn>
        </div>
      </Fade>
    </div>
  );
};

// ═══════════ MAIN ═══════════
const ALL = [S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
const LABELS = ["Upload", "Reading", "SOA", "Generating", "aCRF", "SAP Upload", "Mapping", "Estimands", "Derivations", "Tiers", "Complete"];

export default function App() {
  const [step, setStep] = useState(0);
  const Step = ALL[step];
  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,250,0.85)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 920, margin: "0 auto", padding: "11px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: T.text, display: "flex", alignItems: "center", justifyContent: "center" }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text, letterSpacing: -0.2 }}>Criticality Model Builder</span>
          </div>
          <div style={{ fontSize: 11, color: T.sec }}>{LABELS[step]}</div>
        </div>
        <div style={{ display: "flex", gap: 2, padding: "0 24px", maxWidth: 920, margin: "0 auto" }}>
          {ALL.map((_, i) => <div key={i} style={{ height: 2, flex: 1, borderRadius: 1, background: i <= step ? T.text : T.border, transition: "background 0.4s" }} />)}
        </div>
      </div>
      <div key={step}><Step onNext={() => setStep(s => Math.min(s + 1, ALL.length - 1))} /></div>
    </div>
  );
}
