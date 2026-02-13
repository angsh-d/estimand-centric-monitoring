# Architecture & Data Platform
## Reasoning Over Data In Place: A Differentiated Approach for Clinical Trial Monitoring Intelligence

---

# Executive Summary

This document defines the architecture for a platform that delivers estimand-driven monitoring intelligence for clinical trials. The platform reasons across heterogeneous clinical trial data — structured exports from EDC, IRT, Labs, and Safety databases alongside unstructured monitoring visit reports, imaging vendor narratives, and clinical source documents — to detect, investigate, and act on what matters most to the trial's integrity.

The platform operates through five features, each with human-in-the-loop by design:

**Feature 0: Critical Data Element Identification.** The platform ingests the digitized protocol and SAP and produces a draft criticality model — identifying which data elements are critical to the trial, why they are critical (traceable derivation chains from estimand through analysis specification to CRF field), and how critical they are (tiered classification). **Human-in-the-loop:** The study statistician walks the full derivation tree and the medical monitor validates safety process coverage before the model is approved. This is the most consequential human review in the platform — an error here propagates through every downstream feature.

**Feature 1: Proactive Signal Detection.** The platform continuously monitors all available data sources to detect signals on the critical data elements identified in Feature 0: missing endpoint assessments approaching non-recoverable windows, cross-system discrepancies, reconciliation gaps, unreported clinical events in narrative documents. Detection is focused on elements with traceable analytical dependency to the trial's estimands. **Human-in-the-loop:** Safety-critical signals (potential unreported SAEs, eligibility concerns, endpoint impacts) require mandatory human review before action. CRAs and data managers verify signals against site reality.

**Feature 2: Root Cause Investigation.** A conversational interface allows clinical teams to interrogate any detected signal — querying structured data, retrieving unstructured documents, and reasoning across both — to understand *why* a signal exists and what it means for the trial. **Human-in-the-loop:** Investigation is human-driven. The platform provides the tools and analytical context; the clinical professional asks the questions, evaluates the answers, and forms the judgment about what the signal means and what to do about it.

**Feature 3: Site Dossier Generation.** The platform aggregates all detected signals for a site — with their root cause analysis, analytical consequences, cross-system evidence, and recommended actions — into a point-in-time Site Dossier for CRA visit preparation. Every finding is focused on critical data elements, grounded in the trial's estimand framework, and accompanied by actionable context. **Human-in-the-loop:** The dossier is a preparation tool, not a directive. The CRA reviews, applies clinical judgment, and decides which actions to take. Post-visit feedback on signal dispositions improves subsequent cycles.

**Feature 4: MVR Creation CoPilot.** After the monitoring visit, the platform assists the CRA in creating the Monitoring Visit Report by pre-assembling structured content from the visit: which signals were addressed, what actions were taken, which findings remain open, what was observed at the site. The CoPilot drafts narrative sections grounded in the dossier's findings and the CRA's recorded dispositions, closing the loop between pre-visit intelligence and post-visit documentation. **Human-in-the-loop:** The CRA authors the MVR. The CoPilot drafts sections for review; the CRA edits, adds observations that only on-site presence could produce, applies clinical judgment, and approves the final document. The completed MVR feeds back into the platform's unstructured document corpus, enriching signal detection for subsequent cycles.

All platform outputs are explicitly framed as decision support produced by an AI system, reviewed and acted upon by qualified clinical personnel. The platform does not make monitoring decisions, classify deviations, determine SAE reportability, or adjudicate endpoint events. Human expertise is not a checkpoint at the end of an automated pipeline — it is woven into every feature.

---

# The Architectural Question

The foundational question is: **how does the platform access and reason across diverse clinical trial data sources?**

The traditional answer is to centralize: extract data from every source, transform it into a common schema, load it into a unified data store, and build analytics on top of that normalized layer.

This document argues that the traditional approach is the wrong starting point for this platform. Not wrong in principle — centralized data models have clear advantages — but wrong in practice for this specific problem, at this stage of maturity, given the data landscape of clinical trials and the capabilities of modern LLMs.

We propose an alternative: **reasoning over data in place**, where structured data is queried and computed on directly, unstructured data is retrieved and interpreted by LLMs in its natural form, and the analytical framework (the criticality model) serves as reasoning context rather than a data annotation layer.

---

# Why the Traditional Approach Fails Here

## The Clinical Data Integration Problem Is Notoriously Hard

The clinical trial industry has been attempting clinical data centralization for over two decades. The results are instructive.

**CDISC standards (SDTM, ADaM, ODM)** were designed precisely to create a common data model for clinical trial data. After 20+ years of development and regulatory mandate, CDISC adoption is universal for *submission* — but operational data during study conduct remains fragmented across vendor-specific formats. EDC systems store data in proprietary schemas. IRT systems have their own data models. Safety databases use MedDRA-coded structures that don't map one-to-one with EDC adverse event forms. Central labs deliver data in varying file specifications. The existence of CDISC standards has not solved the operational data integration problem because the standards apply to the end-state (submission datasets), not to the live operational data that monitoring depends on.

**The OHDSI/OMOP Common Data Model** in observational research is the most ambitious attempt at clinical data harmonization. OMOP maps diverse healthcare data sources into a single relational schema. It has been enormously valuable for large-scale observational studies. But it also illustrates the cost: OMOP ETL implementations typically require 6-18 months per data source, dedicated vocabulary mapping teams, and ongoing maintenance as source systems evolve. The OHDSI community openly acknowledges that ETL quality varies significantly across sites, that unmapped data is silently lost, and that the model struggles with unstructured clinical narratives — which are excluded or reduced to coded concepts, losing the rich clinical context that a CRA or medical monitor actually needs.

**Sponsor-level clinical data warehouses** have been attempted by several large pharmaceutical companies. These projects typically take years to build, cost tens of millions of dollars, require dedicated data engineering teams for ongoing ETL maintenance, and are specific to one sponsor's system landscape. They cannot be readily deployed across the heterogeneous vendor environments that characterize the industry at large.

The lesson is consistent: **clinical data centralization works, but it is slow, expensive, fragile, and specific to the systems it integrates with.** It is a viable long-term infrastructure investment for large organizations with stable technology landscapes. It is not a viable starting architecture for a platform that needs to demonstrate value across diverse sponsor environments with minimal integration overhead.

## Unstructured Data Cannot Be Meaningfully Normalized

Even if the structured data integration problem were solved, a significant portion of the information this platform needs to reason about is unstructured and cannot be meaningfully normalized into a relational schema.

**Monitoring visit reports** are semi-structured documents — they follow templates with section headers, but the substantive content within sections is narrative prose containing operational intelligence about site-level process issues that no structured data model captures.

**Imaging vendor narrative reports** combine structured assessment data with narrative interpretation that may carry different — even contradictory — information. The clinical nuance in the narrative is essential for monitoring intelligence and cannot be reduced to coded values without loss.

**Clinical source documents** — where available — include physician notes and discharge summaries written in clinical shorthand with abbreviations, institution-specific conventions, and implicit clinical reasoning that compress multiple clinical data points into a few words.

**Forced structuring of clinical narratives destroys the contextual intelligence that makes them valuable.** However, refusing all upfront extraction is equally misguided. The right approach is to extract lightweight structural metadata and evidence anchors at ingestion while preserving the full narrative for LLM reasoning.

## LLMs Change the Architecture Equation

The traditional logic for data centralization rested on a constraint that no longer fully applies: analytical systems could only operate on structured, normalized data.

LLMs break this constraint for operations involving interpretation, contextual reasoning, and cross-format synthesis. An LLM can read a structured EDC row and a narrative imaging report and recognize discrepancies between them without both being in the same database. It can read a monitoring visit report and connect a finding about scheduling delays to a quantitative pattern of out-of-window visits. It can assess whether a detected data quality issue threatens the trial's primary estimand by reasoning over the criticality model in the context of the specific finding.

This doesn't mean LLMs replace structured computation — they don't. Counting missing CRF fields, comparing dates, and matching lab values are operations where deterministic code is faster, cheaper, more reliable, and auditable. The architecture separates these two modes of processing explicitly.

---

# Feature 0: Critical Data Element Identification

## Why Everything Starts Here

The four subsequent features — signal detection, root cause investigation, dossier generation, and MVR creation — all depend on a single analytical question: **what matters in this trial?**

Without an answer to this question, the platform produces undifferentiated findings: 180 items of equal apparent importance, indistinguishable from what a CRA already gets from their EDC listing. With it, the platform focuses detection on critical data elements, guides investigation toward analytical consequences, and generates dossiers that prioritize what genuinely threatens the trial's integrity.

Feature 0 answers this question by extracting and combining insights from the digitized protocol and digitized SAP to identify, classify, and trace every critical data element. The output — the criticality model — is the platform's first deliverable and provides standalone value even before any trial data is loaded.

## Extracting Insights from Digitized Protocol and SAP

The criticality model is built by combining structured insights extracted from two foundational trial documents:

**From the digitized protocol:** The LLM extracts the trial's objectives and endpoints (primary, key secondary, secondary, exploratory), the Schedule of Assessments (which assessments at which visits with which windows), inclusion/exclusion criteria, intercurrent event definitions and handling strategies, safety reporting requirements, and critical process definitions (drug accountability, endpoint adjudication, eligibility verification). These define *what data the trial collects and why*.

**From the digitized SAP:** The LLM extracts the estimand framework (per ICH E9(R1)), the analysis models for each estimand, the derived variable specifications (ADaM dataset and variable definitions), the SDTM source variable dependencies for each derivation, population definitions (ITT, mITT, per-protocol, safety), sensitivity analysis specifications, and censoring rules. These define *how collected data flows into the regulatory analysis* — the analytical dependency chain that determines which data elements are critical.

**Combining these insights** produces the derivation chain: estimand → analysis model → ADaM derived variables → SDTM source domains and variables → CRF forms and fields. If an annotated CRF (aCRF) is available, the platform uses it to complete the SDTM-to-CRF mapping directly. If not, the LLM generates a draft mapping using the blank CRF, protocol, and SDTM standards knowledge — a reasonable approximation that the study team refines.

This extraction is the LLM's primary contribution in Feature 0: it reads complex, lengthy clinical documents and produces a structured, traceable analytical model that would take a human team days to build manually. But extraction is not validation — the LLM's draft is a starting point that requires substantive human review before it becomes the authoritative model.

## What the Criticality Model Contains

The criticality model is a structured, versioned document that captures:

**Estimand-to-CRF derivation chains.** For each estimand defined in the SAP, the model traces: the treatment, population, endpoint, intercurrent event handling strategy, and population-level summary measure → the analysis model and derived variables → the SDTM/ADaM datasets and variables that support the derivation → the CRF forms and fields where the source data is collected. This chain makes explicit *why* a specific CRF field matters — not because someone labeled it "critical" in a spreadsheet, but because there is a traceable analytical dependency from that field to a regulatory endpoint.

**Tiered data element classification.** Every CRF form and field is classified into one of three tiers based on its position in the derivation chains:

- **Tier 1 (Critical):** Data elements that directly feed primary or key secondary estimand derivations, or that support critical safety processes (SAE reporting, eligibility verification). Issues with Tier 1 data can affect the trial's ability to answer its primary question or meet its safety obligations.
- **Tier 2 (Important):** Data elements that feed supportive analyses, sensitivity analyses, or secondary endpoints. Issues are operationally significant but do not directly threaten the primary analysis.
- **Tier 3 (Standard):** Data elements collected per protocol but not linked to any specific estimand derivation. Issues are data quality matters handled through standard data management workflows.

**Critical process identification.** Beyond data elements, the model identifies critical processes — SAE reporting, eligibility determination, drug accountability, endpoint adjudication — and maps them to the data elements and cross-system workflows they depend on.

## Human-in-the-Loop: SME Validation

The LLM-generated draft is a structured starting point, not a finished model. Feature 0 is designed around a human validation workflow, not a human approval checkbox.

**Derivation completeness is the critical risk.** The LLM will reliably trace direct dependencies — primary endpoint assessment fields, key safety variables, randomization dates. It will be less reliable on indirect dependencies that are only visible deep in the derivation tree: censoring rules that reference "last known alive date" across multiple SDTM domains (AE, VS, CM, DS), intercurrent event operationalization fields scattered across exposure, disposition, and concomitant medication domains, and supplemental qualifier variables carrying data that feeds sensitivity analyses. Without an annotated CRF, the CRF-to-SDTM mapping is the weakest link. The dangerous error is not misclassification (calling Tier 2 "Tier 1" is low-consequence) but omission — a Tier 1 element classified as Tier 3 means the platform under-monitors something that matters, and no downstream feature catches it.

**The validation workflow:**

1. **Statistician review.** The study statistician walks the full derivation tree for each primary and key secondary estimand — from endpoint definition through analysis model, ADaM specification, SDTM source variables, and CRF fields — and confirms that every branch is represented. The LLM-generated draft flags its own confidence level for each derivation chain (direct dependency vs. inferred dependency) to focus reviewer attention on the weakest links.
2. **Medical monitor review.** The medical monitor confirms that critical process identification is complete and safety-relevant classifications are appropriate.
3. **Study team approval.** The validated model is approved and version-controlled. It becomes the authoritative analytical framework for all downstream features.

For studies without an aCRF, the study team should expect significant corrections to the CRF-to-SDTM mapping; the aCRF should be treated as a strongly recommended input, not optional. This validation is the most consequential human review in the entire platform — an error here propagates through every feature downstream.

The criticality model is version-controlled. When the protocol is amended or the SAP is updated, the model is regenerated against the new documents, changes are highlighted, and the study team reviews and approves the updated version. The platform applies the correct model version based on subject enrollment timing relative to amendments.

## RBQM Governance Package

The criticality model naturally extends into a draft RBQM governance package:

**Critical to Quality (CtQ) factors** derived from the Tier 1 data elements and critical processes — the factors that, if compromised, would most directly threaten the trial's integrity.

**Key Risk Indicator (KRI) definitions** — proposed metrics that operationalize each CtQ factor into a measurable indicator. For example, if Tier 1 tumor assessment completeness is a CtQ factor, the corresponding KRI might be "percentage of expected Tier 1 tumor assessments completed within window, by site, per cycle."

**Quality Tolerance Limit (QTL) structures** — the framework for setting thresholds on KRIs that trigger escalation. The LLM proposes which KRIs warrant QTLs and suggests threshold structures (e.g., site-level rate vs. study-level rate comparison, absolute threshold, trend-based trigger). It does not set the actual threshold values — these require historical benchmarks, sponsor risk appetite, and regulatory context that the LLM cannot infer. The study team sets the values.

This governance package is a draft requiring expert review, but it provides significant study startup acceleration by generating the structural framework that teams would otherwise build from scratch.

---

# Feature 1: Proactive Signal Detection

The platform's first operational capability is the continuous, automated detection of signals on the critical data elements identified in Feature 0. A "signal" is any finding — a missing assessment, a cross-system discrepancy, a clinical event buried in a narrative document, a reconciliation gap, a pattern of related issues — that has traceable analytical consequence to the trial's estimands or critical processes.

Signal detection is scoped by the criticality model. The platform detects issues at all tiers, but its proactive intelligence — the cross-system reasoning, the unstructured document analysis, the pattern recognition — is focused on Tier 1 and selectively on Tier 2 elements. Tier 3 issues are detected through standard structured checks and reported without interpretive enrichment.

**Human-in-the-loop in Feature 1:** Signal detection is automated, but signal verification is not. Safety-critical signals (potential unreported SAEs, eligibility violations, endpoint classification impacts) are routed to mandatory human review and are never presented as confirmed issues. All signals are presented with evidence, confidence levels, and source references so that CRAs and data managers can verify against site reality. The platform surfaces signals; humans confirm them.

---

## Data Ingestion and the Study Data Store

Before any signal detection can run, raw data exports must be received, validated, transformed, and loaded into a queryable intermediate store. This ingestion layer is invisible in the platform's user-facing outputs, but it is the foundation on which every signal depends. A corrupted export silently accepted, a partial file mistaken for a complete one, or a transformation error that misaligns visit labels will produce false signals — and a single bad dossier built on bad data destroys CRA trust faster than any amount of analytical sophistication can build it.

**Receipt and format detection.** The platform receives structured data as file exports — CSV, delimited text, Excel, or structured XML. Each file is matched to its expected source type (EDC, IRT, central lab, safety database, CTMS, imaging vendor) and its format profile from the study configuration.

**Completeness validation.** Before processing, each export is validated against expected parameters: row count within plausible range relative to prior exports (a 50% drop in row count likely indicates a partial export, not mass data deletion), expected columns present, expected sites and subjects represented. Exports that fail validation are flagged and held — the platform does not silently process incomplete data. Validation failures generate alerts to the study configuration team; they do not generate clinical findings.

**Transformation.** Using the study-specific transformation logic (configured during onboarding, potentially LLM-assisted in initial drafting), raw exports are transformed into the platform's internal representation — a subject-visit-form-field structure with criticality tier annotations from the criticality model. The transformation code is deterministic, version-controlled, and tested.

**Loading into the Study Data Store.** Transformed structured data is loaded into an intermediate relational data store — a lightweight database (e.g., PostgreSQL, DuckDB, or equivalent) that serves as the queryable substrate for both signal detection and the root cause investigation interface. This store is study-specific and rebuilt from exports each processing cycle. It is not a persistent data warehouse; it is a cycle-specific analytical workspace.

**Unstructured document ingestion** follows a lightweight metadata extraction process — document classification, entity anchor extraction, timeline indexing, clinical signal flagging, and full narrative preservation into the document index. Details below.

**Export provenance tracking.** Every ingested export is logged with its source, receipt timestamp, file hash, row/column counts, and validation status. Every signal in every dossier is traceable to the specific exports that produced it.

---

## Cross-Cutting: Identity and Event Resolution Layer

### Why This Exists

Reasoning across data sources requires knowing that "Subject 042" in the EDC is the same person as "Patient SCR-042-001" in the IRT and "Subject 42" in the central lab file. This sounds trivial. In practice, it is one of the hardest operational problems in clinical data integration and the single most important prerequisite for cross-system signal detection.

### The Problem in Detail

**Subject identifier mismatches.** Clinical trial subjects carry different identifiers in different systems. The EDC uses a randomization number assigned by the IRT. The IRT uses both a screening ID and a randomization number. The central lab uses a specimen-linked subject ID that may include a site prefix. The safety database may use a different coding convention.

**Date and timepoint mismatches.** The "same" event may carry different dates across systems. A lab sample has a collection date (EDC), a receipt date (central lab), and a result date (lab report). A tumor assessment has a scan date (imaging vendor), an assessment date (EDC CRF), and a report date (vendor narrative). An adverse event has an onset date (EDC), a report date (safety database), and potentially a different onset date as assessed in the safety narrative.

**Event granularity mismatches.** The same clinical event may be represented differently across systems. The EDC might capture "nausea" and "vomiting" as two separate adverse events. The safety database might capture them as a single SAE. MedDRA preferred terms won't string-match against verbatim terms without vocabulary mapping.

### How the Platform Handles This

The platform builds a **study-specific identity and event resolution layer** during study onboarding, maintained throughout the study:

**Canonical subject key mapping.** A lookup table linking each subject's identifier across all systems. This mapping is constructed during onboarding (with LLM-assisted draft generation where identifier patterns are recognizable), validated against known subject counts and demographic cross-references, and maintained as subjects are added. Every cross-system operation passes through this mapping. No match is assumed; every linkage is explicit and auditable.

**Domain-specific date alignment rules.** Configurable rules specifying, for each cross-system comparison domain, which date fields to match and what tolerance to apply. For lab reconciliation: match EDC collection date against central lab collection date (not receipt date), tolerance ±1 day. For imaging: match EDC assessment date against imaging vendor scan date, tolerance ±2 days. For AE/SAE: match onset dates, tolerance ±3 days. These rules are defined per study based on the data sources involved and the operational conventions of the sponsor/CRO.

**Event matching with confidence scoring.** Matching rules combining deterministic criteria (canonical subject ID, date within tolerance, event category) with semantic criteria (MedDRA term similarity, clinical description matching). Each match is assigned a confidence level:

- **High confidence:** Canonical subject ID matches, dates within tolerance, terms identical or direct synonyms. Auto-linked but logged for audit.
- **Medium confidence:** Canonical subject ID matches, dates within tolerance, terms related but not identical. Flagged for human verification. LLM reasoning can assist by assessing semantic similarity with clinical context.
- **Low confidence / Unmatched:** No clear correspondence found. Surfaced as reconciliation gaps — which are themselves signals.

**The platform never auto-resolves ambiguous matches.** Medium and low confidence matches are presented with evidence from both sources and routed to human review.

---

## Structured Signal Detection (Tier 1 Processing)

Data that is already structured — EDC exports, IRT data, central lab files, safety database listings, CTMS extracts, imaging vendor structured assessments — is processed using deterministic, programmatic operations against the study data store.

**Data completeness signals.** Using the protocol's Schedule of Assessments as the reference, the platform determines which forms should have been completed for each subject at each visit and which are missing. The expected-forms logic accounts for visit windows, treatment arm, study status (ongoing, discontinued, completed), and protocol amendments. For subjects enrolled before an amendment, pre-amendment expectations apply; for subjects enrolled after, post-amendment expectations apply. Missing Tier 1 assessments are flagged with temporal urgency: how many days remain in the window, and whether the window is non-recoverable.

**Window compliance signals.** For each subject and visit, the platform computes whether the assessment was within the protocol-specified window, how many days out of window if not, and (for upcoming visits) how many days remain. This computation is critical for distinguishing signals that require immediate action (closing window) from those that require investigation but not urgency (window already closed).

**Cross-system reconciliation signals.** Using the identity resolution layer, the platform matches records across structured sources — AE records in the EDC against SAE records in the safety database, dosing records against IRT dispensing records, EDC lab entries against central lab results, investigator response assessments against central reader assessments. Discrepancies are signals, categorized by type and criticality.

**Statistical signals.** Site-level metric anomalies (completion rates, query rates, protocol deviation rates), trend deviations, and distributional outliers.

**Criticality tagging.** Every detected signal is tagged with its criticality tier from the criticality model — a programmatic lookup, deterministic and auditable.

### Why Structured Detection Is Not LLM-Based at Runtime

Using an LLM to count missing CRF fields, compare dates, or match lab values would be slower, more expensive, less reliable, and non-deterministic. LLMs may assist at configuration time — helping generate the transformation code, completeness logic, and reconciliation rules. But once that logic is reviewed, tested, and approved, structured signal detection is fully deterministic.

---

## Unstructured Signal Detection (Tier 2 Processing)

Unstructured and semi-structured data is stored, indexed with structural metadata, and accessed by the LLM reasoning layer on demand. Unlike structured detection, unstructured signal detection **requires LLM reasoning at runtime** because the task — interpreting clinical narratives, synthesizing cross-format findings, assessing clinical significance — is inherently interpretive.

### Data Sources: Core vs. Opportunistic

**Core unstructured sources (routinely available in most trial contexts):**

- **Monitoring visit reports (MVRs).** Generated by CRAs after every monitoring visit, stored in the eTMF or CTMS. The most reliable and consistently available unstructured source. MVRs contain site-level operational intelligence — process issues, training gaps, staffing concerns, enrollment challenges — that is not captured in any structured system.
- **Imaging vendor narrative reports.** For trials with central imaging review. Combine structured assessment data with narrative interpretation.
- **Site correspondence.** Follow-up letters, training documentation, email summaries captured in the eTMF.

**Opportunistic unstructured sources (high value when available, not assumed):**

- **EHR clinical notes.** Direct EHR access is uncommon in most sponsor/CRO monitoring contexts. The platform can process EHR notes when available (decentralized trials, eSource integrations, redacted uploads for remote monitoring), but the architecture does not depend on them.
- **Local lab reports, pathology reports, discharge summaries.** Available in some trial designs, not in others. Processed when provided; never required.

The platform operates on whatever unstructured data is available. Value degrades gracefully; it never fails structurally.

### Ingestion: Lightweight Metadata Extraction + Full Narrative Preservation

When unstructured documents enter the platform, they undergo lightweight structural processing — not full normalization, but extraction of metadata and evidence anchors that improve downstream retrieval:

**Document-level classification.** What type of document is this? Classification determines which retrieval pipelines the document participates in and what metadata to extract.

**Key entity anchors with source text pointers.** Dates, subject identifiers, drug names, site identifiers — extracted and stored as metadata linked back to their location in the source text. This is critical for retrieval quality: without entity anchors, retrieval depends entirely on embedding similarity, which misses clinically relevant documents that don't share vocabulary with the query.

**Document timeline indexing.** Each document is placed on the subject's or site's timeline based on date metadata.

**Clinical signal flags.** Lightweight classification identifying whether the document contains language suggesting hospitalizations, AE-suggestive events, progression-suggestive language, or treatment modifications. These are retrieval hints — triage markers that improve recall and prioritize documents for reasoning — not clinical determinations.

**Full narrative preservation.** The complete document text is stored and indexed. No information is discarded.

### How Unstructured Signals Are Detected

**Triggered enrichment.** A structured signal triggers retrieval of relevant unstructured documents to provide clinical context. Example: a structured cross-system signal shows Subject 058 has a discrepancy between EDC tumor response and imaging vendor assessment. The system retrieves the imaging vendor's narrative report. The LLM reads it and synthesizes the full clinical picture — connecting what appeared as a data discrepancy to a clinical event (progression, hospitalization, treatment discontinuation) partially captured across multiple systems.

**Continuity mining from prior MVRs.** The system retrieves prior monitoring visit reports for the site and extracts findings and action items. When structured detection identifies that three subjects have out-of-window assessments, the LLM retrieves the prior MVR and identifies that scheduling delays were discussed at the last visit — connecting the current structured signal to prior narrative context and recognizing this as a recurring pattern.

**Proactive unstructured scanning.** The LLM scans available unstructured documents for clinically significant information not captured in structured systems — unreported AEs, medication changes, hospitalizations without corresponding SAE records. Each finding is assessed against the criticality model. This scanning is focused on Tier 1 concerns: safety-relevant events and endpoint-relevant clinical changes.

**Honest boundary:** Proactive scanning is the most powerful and least reliable detection mode. With well-structured documents (MVRs, vendor reports with standard templates), reliability is high. With abbreviated or poor-quality source documents, confidence is lower. The platform communicates confidence levels with every signal and presents low-confidence signals as requiring verification, never as confirmed issues.

---

## Cross-System Contradiction Handling

When data sources disagree, the platform detects and classifies the discrepancy but **never auto-resolves contradictions to a single "truth."**

**Contradiction policy:** The platform classifies the mismatch type (data entry discrepancy, timing mismatch, clinical interpretation mismatch, or missing counterpart), presents evidence from all sources (quoting specific data with document references), generates recommended verification steps matched to the mismatch type and criticality tier, and never asserts which source is correct. Resolution is always a human responsibility.

This policy is non-negotiable. An LLM that "picks a side" in a clinical data contradiction is a liability.

---

## Signal Prioritization

Detected signals are prioritized through a two-stage process that ensures priority levels are stable and reproducible while capturing clinical nuance.

### Pre-Processing: Deterministic Pattern Detection

Before individual signals are scored, the signals inventory undergoes a deterministic clustering step. The clustering logic groups signals by site + type + timeframe. If three or more subjects at the same site have out-of-window assessments for the same visit type, the cluster is flagged as a candidate systemic pattern. Clustering thresholds are configured per study. The clustering is deterministic — the same signals produce the same candidate patterns every time. Individual signals remain in the inventory; the candidate pattern is added as an additional signal with its own scope classification.

### Stage 1: Deterministic Priority Scoring

Each signal is assessed on four deterministic dimensions:

**Criticality tier.** From the criticality model. Tier 1 signals have higher base priority than Tier 2, which have higher base priority than Tier 3.

**Temporal urgency.** Computed from window compliance data. Signals with closing windows receive higher urgency; signals with already-closed windows (non-recoverable data loss) receive the highest urgency.

**Scope.** Single-system signals receive lower scope weighting than cross-system signals or multi-subject patterns.

**Signal density per subject.** Subjects with multiple concurrent signals receive an aggregated attention flag.

These factors are combined using a deterministic scoring function to produce a **base priority level** (Priority 1, Priority 2, or Priority 3). Once configured, this produces identical results for identical inputs.

### Stage 2: LLM Consequence Assessment

For Priority 1 and Priority 2 signals, the LLM adds interpretive assessment — but this assessment enriches the signal for investigation and dossier generation; it does not change the deterministic priority level.

**Analytical consequence articulation.** The LLM traces the signal through the criticality model's derivation chain and articulates what it means: "This missing Week 24 tumor assessment feeds the RECIST-based response variable, a direct component of the PFS derivation. If not recovered within the remaining 5-day window, Subject 042 will lack the primary endpoint assessment at a protocol-specified timepoint."

**Cross-signal connection.** The LLM identifies when separate signals are facets of a single clinical event — a tumor response discrepancy, an unmatched SAE, and a treatment discontinuation may be three views of one event (disease progression → hospitalization → treatment stop).

**Pattern interpretation.** Building on the deterministic clustering, the LLM connects clustered signals to unstructured context — linking three out-of-window assessments to a prior MVR noting scheduling delays, articulating the systemic nature of the issue.

### Why This Two-Stage Design

Letting the LLM assign priorities directly is tempting but dangerous: LLM priority assignments are non-deterministic (eroding trust), opaque (undermining auditability), and uncalibratable. The two-stage design preserves interpretive strengths while grounding priority levels in stable, auditable, configurable logic.

---

# Feature 2: Root Cause Investigation

## Why Detection Is Not Enough

Signal detection tells you *what* the problem is. Root cause investigation tells you *why* the problem exists and *what it means*. This distinction is the difference between "Subject 042 is missing a Week 24 tumor assessment" (a data point) and "Subject 042 was hospitalized for disease progression, treatment was discontinued, and the tumor assessment window is closing in 3 days — if not recovered, this subject's primary endpoint is non-evaluable" (an understood situation with actionable context).

Feature 2 provides a conversational interface where clinical teams drive the investigation — querying structured data, retrieving unstructured documents, and reasoning across both — to get to the root cause of any detected signal.

**Human-in-the-loop in Feature 2:** This feature is inherently human-driven. The platform provides the analytical tools and cross-system reasoning; the clinical professional asks the questions, evaluates the answers, judges the relevance of retrieved evidence, and decides what the signal means and what to do about it. The LLM synthesizes and presents information — the human forms the clinical judgment.

## How It Works

The LLM has access to a set of tools that it orchestrates based on the question:

**Structured query tool.** Translates natural language questions into queries against the study data store. "Show me all missing Tier 1 assessments at Site 1042" becomes a structured query executed against the ingested data. "How does Subject 042's visit compliance compare to other subjects at this site?" becomes a comparative query across subjects.

**Document retrieval tool.** Searches and retrieves indexed unstructured documents by subject, site, date, document type, or content. "What did the CRA observe about coordinator issues at the last visit?" retrieves the relevant MVR sections and synthesizes an answer. "Were there any clinical notes suggesting hospitalization for Subject 058?" retrieves and interprets available clinical documents.

**Signal context tool.** Retrieves the full context of a detected signal — its priority scoring, analytical consequence, derivation chain, cross-signal connections, and source evidence — so the investigation builds on what the platform has already identified.

**Criticality model and protocol context.** Maintained as persistent context so every answer is informed by the trial's analytical framework. When the user asks about a subject's data, the response is always grounded in what matters to the estimand.

The LLM decides which tools to use based on the question — structured queries for data questions, document retrieval for narrative questions, both for cross-cutting questions. It presents results with analytical context rather than raw data tables.

## The Investigation Workflow

The typical investigation follows a signal → context → consequence → action pattern:

1. **Signal identification.** The CRA or CTL identifies a signal from the dossier or from their own observations that warrants deeper understanding.
2. **Contextual exploration.** They ask the platform for context: what else is happening with this subject? Has this issue been discussed at prior visits? Are other subjects affected? What do the source documents show?
3. **Consequence tracing.** The platform traces the signal through the criticality model: which estimand is affected, through which derivation chain, with what analytical consequence if unresolved?
4. **Action formation.** The investigation yields an understood problem with specific recommended actions — what to verify at the site, who to contact, what data to request, and how urgent the resolution is.

This workflow can be driven entirely by the user's questions (open-ended investigation), or it can be initiated from a signal in the dossier (structured investigation). The dossier's prioritized issue register provides natural entry points for investigation.

## Honest Boundaries

**Tool selection is imperfect.** The LLM's decision about which tool to invoke for a given question is a judgment call, and it will sometimes choose the wrong approach. Mitigation: the interface shows the user which tools were invoked and what data was accessed, so the user can judge whether the answer is based on the right sources. Over time, query patterns can be codified into reliable pre-built queries for common investigation patterns.

**Latency varies.** Simple structured queries return in seconds. Cross-cutting questions that require both structured queries and document retrieval may take 15-30 seconds.

**Answers are non-deterministic.** The same question asked twice may produce differently worded answers (though the underlying data accessed is the same). The interface presents source data alongside synthesized answers so users can verify.

**Investigation depth depends on data availability.** The platform can only investigate what it can see. If the root cause of a signal lies in a system the platform doesn't have access to (e.g., the site's internal scheduling system), the investigation will identify the knowledge gap and recommend what the CRA should investigate on-site.

---

# Feature 3: The Site Dossier

## What the Dossier Is

The Site Dossier is the platform's primary deliverable to the CRA — a point-in-time aggregation of all detected signals for a site, enriched with root cause analysis, analytical consequences, cross-system evidence, and recommended actions. It is generated before each monitoring visit and replaces the CRA's current preparation workflow: manually cross-referencing EDC listings, safety database exports, CTMS action items, prior visit reports, and protocol documents.

The dossier is the place where Features 1 and 2 converge into a single, actionable document focused on critical data elements. Everything in the dossier is traceable to the criticality model established in Feature 0 and grounded in the trial's estimand framework.

**Human-in-the-loop in Feature 3:** The dossier is a preparation tool, not a directive. The CRA reviews the dossier, applies their clinical judgment and site knowledge, and decides which actions to take. A CRA who disagrees with the platform's prioritization should follow their judgment — the platform surfaces intelligence; the human decides. After the visit, the CRA records dispositions for each signal (addressed, deferred, not applicable), and this feedback informs subsequent dossier cycles.

## Dossier Structure

### Site Health Context

A narrative summary of the site's current state, drawing on structured metrics (enrollment pace, Tier 1 completion rates, query aging by criticality tier, deviation rates) and unstructured context (key themes from prior MVRs, open action items, staffing changes or site concerns noted in correspondence).

The narrative interprets metrics in context. If Tier 1 query aging has increased over recent cycles, and the prior MVR noted a coordinator change, the dossier connects these: the new coordinator may need targeted support on complex endpoint-related queries.

**Honest boundary:** This narrative is LLM-generated and non-deterministic. The dossier presents the source metrics alongside the narrative so users can verify the interpretation.

### Prioritized Signal Register

All detected signals for the site, presented with each signal's:

- **Signal description** — what was detected, in which system(s), for which subject(s)
- **Priority level** — Priority 1, 2, or 3, with the deterministic factors that drove the assignment
- **Root cause analysis** — the platform's articulation of why this signal exists, drawing on cross-system evidence and unstructured context (for Priority 1 and 2 signals)
- **Analytical consequence** — what this signal means for the trial, traced through the derivation chain to the affected estimand
- **Recommended action** — specific verification steps or interventions, matched to the signal type
- **Temporal urgency** — remaining window, key dates, recovery feasibility
- **Cycle status** — new, continuing, escalated, resolved, or de-escalated relative to the prior cycle
- **Traceability** — reference to the criticality model tier, the estimand derivation chain, and the source data

Priority 1 signals appear first, then Priority 2, then Priority 3. Within each priority level, signals are ordered by temporal urgency.

### Subject Evaluability Summary

For each active subject at the site, a brief assessment of their current Tier 1 data completeness and evaluability status. This is primarily computed from structured data (which Tier 1 assessments are complete, which are missing, which are within window) with LLM-generated interpretive context for subjects with complex situations.

Subjects are flagged green (Tier 1 data on track), amber (one or more Tier 1 issues requiring attention but recoverable), or red (evaluability at risk if issues are not resolved). The flag is accompanied by a specific explanation traceable to the criticality model.

### Cross-System Reconciliation Summary

Outstanding discrepancies between data sources, categorized by mismatch type and criticality tier. Each discrepancy is presented with evidence from both sources, the analytical consequence, and recommended resolution steps. This section surfaces signals that no single-system review would catch.

### Recommended Visit Focus

A synthesized visit agenda derived from the prioritized signals — what the CRA should address first, second, and third during their visit, with a clear statement of what can be deferred to standard workflows if visit time is constrained. This section translates signal analysis into operational actions: "Address Subject 042's missing Week 24 tumor assessment first — the window closes in 3 days and this is non-recoverable for the primary endpoint. Then investigate the Subject 058 multi-system discrepancy with the coordinator. The Tier 3 demographics queries can be resolved through standard DM workflow and do not require on-site intervention."

## Dossier Generation Pipeline

The dossier is assembled through a defined pipeline:

1. **Data ingestion and validation** loads and validates the current cycle's exports into the study data store.
2. **Structured signal detection** produces the structured signals inventory — fully deterministic.
3. **Unstructured signal detection** enriches selected signals with narrative context and produces signals from proactive scanning — LLM-based, evidence-quoted.
4. **Pattern detection** clusters related signals deterministically.
5. **Priority scoring** applies the deterministic scoring function to all signals.
6. **Root cause analysis** adds LLM consequence assessment and cross-signal connection for Priority 1 and 2 signals.
7. **Continuity matching** compares current signals against the prior cycle's inventory, classifying each as new, continuing, escalated, resolved, or de-escalated.
8. **Synthesis** assembles the prioritized signals (with root cause analysis and continuity status), subject evaluability assessments, reconciliation summary, and site health context into the dossier structure.
9. **Timestamping** tags the dossier with all source data export dates, criticality model version, and processing metadata.

Dossiers are generated in batch before monitoring cycles. This allows processing to run during off-peak hours, enables quality review of outputs before CRA use, and amortizes LLM costs.

## Dossier Lifecycle: Inter-Cycle Continuity

### Why Continuity Matters

Monitoring is longitudinal. A CRA visiting a site monthly needs to know how current signals relate to what was flagged last cycle. A signal that was Priority 2 last month and is now Priority 1 because the window is closing tells a different story than a new Priority 1 signal. Without cycle-over-cycle tracking, every dossier is a disconnected snapshot.

### How the Platform Handles This

**Signal persistence and tracking.** Each signal is assigned a stable identifier based on its deterministic attributes (subject, visit, data element, signal type, source system). Each signal in the current dossier is classified as new, continuing, escalated, resolved, or de-escalated relative to the prior cycle.

**Cycle-over-cycle trend indicators.** The site health context section includes directional indicators: is the site's Tier 1 completeness improving or deteriorating? Is the reconciliation gap count growing or shrinking? Are the same signal types recurring?

**CRA feedback integration.** After a monitoring visit, the CRA can record disposition for each signal: addressed, deferred (with reason), not applicable (with reason), or escalated. This feedback is stored and referenced in the next dossier. A signal marked "deferred — awaiting site response" that reappears is presented with that context. A signal repeatedly marked "not applicable" may indicate a configuration issue and is surfaced to the study configuration team.

**Honest boundary:** CRA feedback integration depends on CRA compliance. The platform falls back to purely data-driven continuity (signal matching and trend computation) when feedback is not provided.

---

# Feature 4: MVR Creation CoPilot

## Why This Closes the Loop

Features 0 through 3 prepare the CRA for a monitoring visit. Feature 4 helps them document what happened during it. The Monitoring Visit Report is a regulatory-required deliverable — the official record of what was reviewed, what was found, what actions were taken, and what remains outstanding. Writing it is time-consuming, repetitive, and largely synthesizes information the platform already has.

More importantly, the completed MVR feeds back into the platform's unstructured document corpus. The next time Feature 1 runs signal detection and Feature 2 enables root cause investigation, the MVR is available as a source document — connecting what was planned (dossier) to what was observed (MVR) to what changed (next cycle's data). Feature 4 creates a virtuous cycle: better MVRs produce richer unstructured context, which produces more insightful signal detection and root cause analysis.

## What the CoPilot Does

**Pre-assembled visit context.** Before the CRA begins writing, the CoPilot assembles the structured framework for the MVR: which signals from the dossier were addressed during the visit, the CRA's recorded dispositions for each signal (addressed, deferred, escalated, not applicable), open action items carried forward from the prior visit, and site-level metrics current as of the visit.

**Draft narrative sections.** For standard MVR sections — data review summary, safety review summary, site process observations, action items — the CoPilot generates draft narratives grounded in the dossier's findings and the CRA's disposition records. For example, if the CRA marked Subject 042's missing tumor assessment as "addressed — source document verified, data entry requested," the CoPilot drafts a data review narrative that references the specific finding, the verification performed, and the corrective action initiated, using language consistent with the sponsor's MVR template.

**Action item tracking.** The CoPilot generates a structured action item register from the visit: new actions arising from the visit, prior actions closed, and prior actions still open with updated status. This register feeds directly into the CTMS action item workflow and into the next cycle's dossier generation, ensuring continuity.

**Signal-to-MVR traceability.** Every statement in the CoPilot's draft references the dossier signal or data source it was derived from. The CRA can verify that the draft accurately reflects what they observed and correct it where it doesn't.

## Human-in-the-Loop: The CRA Authors the MVR

The CoPilot drafts; the CRA authors. This distinction is essential:

**The CRA adds what only on-site presence produces.** Site staff interactions, environmental observations, coordinator competency assessments, investigator engagement — these cannot be pre-assembled from data. The most valuable sections of an MVR are the ones that capture what the CRA saw, heard, and judged during the visit. The CoPilot handles the data-derived sections so the CRA can focus their writing effort on these irreplaceable observations.

**The CRA edits and corrects.** The CoPilot's draft may mischaracterize a finding (the structured data said "missing" but the CRA verified the assessment was performed and not yet entered), omit relevant context, or use language inconsistent with the sponsor's expectations. The CRA reviews every section, edits as needed, and approves the final document.

**The CRA owns the final document.** The MVR is a regulatory document attributed to the CRA. The CoPilot is an authoring tool, not a co-author. The CRA is responsible for the accuracy and completeness of the final report.

## Honest Boundaries

**Template dependency.** The CoPilot's draft quality depends on having the sponsor's MVR template as a structural reference. With a well-defined template, the CoPilot maps content to the right sections reliably. Without a template, it produces a generic structure that the CRA must reorganize.

**Coverage is partial.** The CoPilot can draft data-derived sections (data review, safety reconciliation, action items) with high reliability. Sections that depend on on-site observation (site process assessment, personnel evaluation, facility observations) are left as prompts for the CRA to complete — the CoPilot does not fabricate observations.

**Narrative quality varies.** LLM-generated narrative prose may not match the CRA's personal writing style or the sponsor's preferred tone. Some CRAs will use the draft as-is with minor edits; others will rewrite substantially. The value is in the structured assembly of content, not in producing publication-ready prose.

---

# User Workflows and Personas

The five features map to specific clinical operations workflows:

## CRA Visit Preparation

**Primary persona.** The CRA assigned to a site, preparing for a monitoring visit.

**Current workflow (without platform).** Manually reviews EDC listings, cross-references safety database exports, checks CTMS for prior action items, re-reads prior MVR, consults the protocol. Hours of unstructured preparation with no analytical prioritization.

**Platform workflow.** The CRA opens the pre-generated Site Dossier (Feature 3). The prioritized signal register tells them what matters most and why. If a signal needs deeper understanding, they use the root cause investigation interface (Feature 2) to explore context. Signal detection (Feature 1) has already done the cross-system reasoning that would have taken hours of manual work. Every finding is grounded in the critical data elements identified in Feature 0. After the visit, the MVR Creation CoPilot (Feature 4) pre-assembles the visit documentation from the dossier findings and the CRA's disposition records, freeing the CRA to focus their writing on the irreplaceable on-site observations. The completed MVR feeds back into the platform for the next cycle.

## Clinical Team Lead (CTL) Oversight

**Primary persona.** The CTL responsible for a set of sites across a study.

**Platform workflow.** Study-level dashboards showing site-level KRI trends, Tier 1 completion rates, and reconciliation gap summaries derived from signal detection. The CTL drills into any site's dossier for detail, and uses the investigation interface to explore cross-site patterns or escalating trends.

## Medical Monitor Safety Surveillance

**Primary persona.** The medical monitor responsible for ongoing safety assessment.

**Platform workflow.** Cross-study views of safety-relevant signals — potential unreported SAEs from proactive scanning, AE/SAE reconciliation gaps, eligibility concerns. All safety-critical signals are routed to the medical monitor with evidence, confidence assessment, and recommended verification steps.

## Study-Level Quality Monitoring

**Primary persona.** The quality lead or RBQM specialist.

**Platform workflow.** Aggregate KRI dashboards with QTL monitoring, trend analysis, and cross-site comparisons populated by signal detection. The RBQM governance package provides the framework; signal detection populates it with current data each cycle.

---

# LLM-Assisted Study Onboarding

Deploying the platform for a new study requires configuring it to understand the study's specific data landscape: which columns in the EDC export represent which clinical concepts, how subject identifiers map across systems, what the protocol's visit structure and assessment schedule look like, and what reconciliation rules apply.

LLM capabilities accelerate this configuration. An LLM that inspects an EDC export's headers and sample rows, with the protocol synopsis as context, can generate a reasonable first draft of a semantic model. Similarly, an LLM can draft transformation code, propose identity resolution mappings, and generate visit structure logic.

These drafts are starting points, not finished configurations. **Human-in-the-loop:** The clinical data manager reviews, corrects, and approves them — applying institutional knowledge, sponsor-specific conventions, and operational judgment that the LLM cannot infer. Reconciliation rules in particular encode negotiated operational decisions that vary by sponsor, study, and therapeutic area. The LLM proposes; the human decides.

Generated configuration artifacts are inspectable, testable, and version-controlled. Once approved, they execute deterministically at runtime.

---

# Protocol Amendment Handling

Clinical trials change mid-study. Protocols are amended, SAPs are updated, Schedules of Assessments are modified.

**What changes when a protocol is amended.** The criticality model may change (new secondary endpoint, revised primary endpoint definition). The expected-forms logic changes (new assessments, removed assessments). Reconciliation rules may change. The RBQM governance package may change.

**How the platform handles this.** The platform maintains version history for all configuration artifacts and the criticality model. When an amendment occurs, the study team triggers a re-derivation of Feature 0: the LLM reads the amended documents, generates updated drafts, and the study team reviews and approves — the same human validation workflow that produced the original model. The platform applies the correct version based on the amendment's effective date and each subject's enrollment timing.

Prior dossiers and signals generated under the pre-amendment model are not retroactively modified — they remain as-generated, tagged with the model version that produced them.

---

# Regulatory Defensibility and Controls

## Decision Support, Not Automated Determination

All platform outputs are decision support. The platform identifies signals, presents evidence, traces analytical consequences, and recommends actions. It does not make monitoring decisions, classify protocol deviations, determine SAE reportability, or adjudicate endpoints.

## Versioning and Auditability

Every output is traceable to the exact criticality model version, protocol/SAP version, data export timestamps, LLM model version, prompt templates, configuration code versions, and priority scoring configuration that produced it.

## Repeatability Controls

Structured signal detection and base priority scoring are fully deterministic. LLM reasoning (root cause narratives, consequence articulations, dossier narratives) is non-deterministic, mitigated by low-temperature settings, structured prompts, evidence-quoting requirements, and complete prompt logging.

## Human Review Gates

Mandatory human review for potential unreported SAEs, eligibility violations, endpoint classification impacts, and findings below confidence thresholds.

## Platform Validation

Auditability (knowing what produced an output) is necessary but not sufficient. The platform is also validated — demonstrated to produce correct outputs reliably.

**Criticality model validation.** LLM-generated draft compared against a manually built model for a reference study.

**Structured signal detection validation.** Reference dataset with known, pre-determined signals used as a regression test.

**Unstructured reasoning validation.** Test documents with seeded clinical content evaluated by human reviewers against a rubric.

**Prioritization validation.** Scoring function behavior verified at boundary conditions against expected priority levels.

**End-to-end dossier validation.** Complete dossier reviewed by a clinical operations SME.

**Ongoing monitoring.** CRA "not applicable" rates (false positive indicator), signal stability across cycles, and safety signal confirmation rates provide continuous output quality signal.

---

# Data Processing Environment and Security

## Data Residency

The platform operates within the sponsor's approved data environment: sponsor's own cloud tenancy, validated SaaS with appropriate certifications (SOC 2 Type II, ISO 27001, HIPAA BAA), or on-premises deployment. The deployment model is a gating decision made before any data is processed.

## PHI Handling in LLM Calls

Enterprise LLM agreements with zero-data-retention guarantees; private model deployments within the sponsor's cloud tenancy; or pseudonymization of identifiers before LLM processing. For the demo, synthetic data avoids PHI concerns. For production, the PHI handling framework must be established before any real data is processed. **This is a non-negotiable gating requirement.**

## Access Controls

Role-based access controls: CRAs see their assigned sites only, CTLs see study-level data, Medical Monitors see safety-relevant data across the study, blinding is maintained where applicable.

---

# Cost and Scale Management

## Criticality-Gated Processing

The criticality model gates LLM usage: Tier 1 signals trigger full unstructured enrichment and root cause analysis; Tier 2 signals trigger selective enrichment; Tier 3 signals are handled entirely by deterministic detection with no LLM reasoning.

## Caching and Incremental Processing

Document summaries, entity extractions, and reasoning outputs for stable signals are cached across cycles. Only new signals or new documents trigger new LLM calls.

## Batch Generation

Site dossiers are generated in batch before monitoring cycles — not on-demand during visits.

## Rough Cost Envelope

A typical site dossier — 15-25 subjects, 5-10 signals requiring unstructured enrichment, 10-20 document segments retrieved, plus root cause analysis and narrative synthesis — involves approximately 15-30 LLM reasoning calls. At current LLM pricing, this is single-digit dollars per dossier.

For a 100-site study with monthly monitoring cycles, platform LLM costs are in the hundreds to low thousands of dollars per month — minor relative to the monitoring costs the platform optimizes (a single CRA site visit costs $2,000-5,000 in direct costs alone).

The root cause investigation interface adds incremental cost per ad-hoc question (1-5 LLM calls per query).

---

# Data Freshness

The platform ingests data exports — snapshots at a point in time. All outputs are timestamped with source data dates. For monitoring visit preparation, the operational requirement is generating the dossier 1-2 days before the visit using the most recent exports. This is operationally adequate — CRAs need current intelligence, not real-time data.

---

# Architecture Summary

| Component | What It Does | Human-in-the-Loop | Criticality Focus |
|---|---|---|---|
| **Feature 0: Critical Data Element Identification** | Extracts insights from digitized protocol and SAP; builds criticality model and RBQM governance package | Statistician validates derivation tree; medical monitor validates safety processes; study team approves | Defines the critical data elements that gate all downstream features |
| **Feature 1: Proactive Signal Detection** | Detects signals on critical elements across structured and unstructured sources | Safety-critical signals require mandatory human review; CRAs verify signals against site reality | Proactive intelligence focused on Tier 1 and selective Tier 2 |
| **Feature 2: Root Cause Investigation** | Conversational interface for interrogating signals across all data to understand why they exist | Entirely human-driven — clinical professionals ask questions, evaluate answers, form judgments | Every answer grounded in criticality model context |
| **Feature 3: Site Dossier** | Point-in-time aggregation of signals + root cause analysis for CRA visit preparation | CRA reviews, applies clinical judgment, decides actions; post-visit feedback improves next cycle | Organized around critical data elements and estimand impact |
| **Feature 4: MVR Creation CoPilot** | Pre-assembles visit documentation from dossier findings and CRA dispositions; drafts data-derived MVR sections | CRA authors the MVR — edits, adds on-site observations, approves the final regulatory document | Links dossier signals to visit outcomes; completed MVR feeds back into signal detection |
| **Supporting: Identity Resolution** | Links subjects and events across systems | Human review for ambiguous matches; resolution decisions always human-made | Prerequisite for cross-system signal detection |
| **Supporting: Data Ingestion** | Validates, transforms, loads raw exports | Validation failures alert study configuration team; no silent processing of bad data | Ensures signal detection operates on valid data |

The criticality model established in Feature 0 flows through every subsequent feature — defining what Feature 1 detects, informing how Feature 2 traces consequences, determining what Feature 3 emphasizes, and grounding what Feature 4 documents. Human expertise flows through every feature as well — validating the analytical foundation, verifying detected signals, driving root cause investigation, applying clinical judgment to the dossier, and authoring the final monitoring report. The completed MVR from Feature 4 feeds back into Feature 1's document corpus, creating a virtuous cycle where each monitoring visit enriches the platform's intelligence for the next. The platform amplifies human capability; it does not replace it.

---

# Limitations and Honest Constraints

## LLM Reasoning Is Non-Deterministic

Root cause narratives, consequence articulations, and dossier narrative sections can vary between runs. The architecture mitigates this by grounding signal detection and priority scoring in deterministic computation, confining non-determinism to interpretive layers where variation is tolerable.

## Unstructured Data Quality and Availability Varies

MVRs and vendor reports are generally well-structured. EHR notes are rarely available. The platform operates on whatever is available and communicates confidence levels accordingly.

## Criticality Model Quality Depends on SAP Quality and Expert Validation

The LLM reliably traces direct dependencies but may miss indirect ones. The statistician's validation of the derivation tree is essential and non-negotiable.

## Configuration Complexity for Non-Standard Studies

Studies with highly unusual designs require more manual configuration regardless of LLM assistance.

## Output Quality Depends on Input Quality

Partial or corrupted exports can produce incorrect signals. The ingestion layer validates exports, but CRA domain knowledge remains a necessary check.

## Investigation Depth Depends on Data Availability

The platform can only investigate what it can see. Root causes that lie in systems the platform doesn't access will be identified as knowledge gaps.

## The Platform Does Not Replace Clinical Judgment

It accelerates monitoring by surfacing the right information with analytical context. A CRA who disagrees with the platform's prioritization should follow their clinical judgment. The human-in-the-loop design across all five features is not a regulatory concession — it is the architecture's core design principle. The platform is built around the recognition that clinical monitoring requires human expertise at every stage, and that the platform's role is to make that expertise more effective, not to substitute for it.

## Sponsor and Regulatory Acceptance

The platform operates in a conservative industry. Acceptance will be built incrementally through demonstrated value, not assumed.
