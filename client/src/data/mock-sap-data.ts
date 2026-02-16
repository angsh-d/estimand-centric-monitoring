// Source Data Hints from source_data_hint_registry.json
export const SOURCE_DATA_HINTS = [
  {
    "source_hint_id": "SH_RNDDT",
    "description": "Date of Randomization",
    "measurement_context": {
      "instrument_name": "IVRS/IWRS",
      "item_identifier": "Randomization Date",
      "data_collection_method": "IVRS Integration",
      "value_type": "Date",
      "collection_timepoints": [
        "Randomization"
      ]
    },
    "sdtm_domain_hint": "DS",
    "sdtm_variable_hint": "DSSTDTC",
    "mapping_confidence": "STANDARD_CDISC",
    "lineage_roles": [
      {
        "variable_id": "V1",
        "role": "Baseline Reference for Survival",
        "estimands_impacted": [
          "E1",
          "E2",
          "E5"
        ],
        "criticality_tier_at_primary_timepoint": 1,
        "criticality_tier_at_other_timepoints": 1
      }
    ],
    "risk_if_erroneous": "Global shift in all TTE endpoints."
  },
  {
    "source_hint_id": "SH_LAB_NEUT",
    "description": "Neutrophils Absolute Count",
    "measurement_context": {
      "instrument_name": "Central Lab",
      "item_identifier": "Neutrophils",
      "data_collection_method": "Lab Test",
      "value_type": "Numeric",
      "collection_timepoints": [
        "Baseline"
      ]
    },
    "sdtm_domain_hint": "LB",
    "sdtm_variable_hint": "LBORRES",
    "mapping_confidence": "STANDARD_CDISC",
    "lineage_roles": [
      {
        "variable_id": "V16",
        "role": "Component of Risk Score (POP2 Definition)",
        "estimands_impacted": [
          "E2"
        ],
        "criticality_tier_at_primary_timepoint": 1,
        "criticality_tier_at_other_timepoints": 3
      }
    ],
    "risk_if_erroneous": "Exclusion from Co-Primary Population."
  },
  {
    "source_hint_id": "SH_QLQ_C30_ITEMS",
    "description": "EORTC QLQ-C30 Items 1-5 (Physical Function)",
    "measurement_context": {
      "instrument_name": "EORTC QLQ-C30",
      "item_identifier": "Items 1-5",
      "data_collection_method": "PRO",
      "value_type": "Integer 1-4",
      "collection_timepoints": [
        "Baseline",
        "During Treatment"
      ]
    },
    "sdtm_domain_hint": "QS",
    "sdtm_variable_hint": "QSORRES",
    "mapping_confidence": "STANDARD_CDISC",
    "lineage_roles": [
      {
        "variable_id": "V25",
        "role": "Component of Physical Function Score",
        "estimands_impacted": [
          "E8"
        ],
        "criticality_tier_at_primary_timepoint": 2,
        "criticality_tier_at_other_timepoints": 2
      }
    ],
    "risk_if_erroneous": "Secondary endpoint error."
  }
];

// Lineage Graph from lineage_graph.json
export const LINEAGE_GRAPH = {
  "nodes": [
    {
      "id": "E1",
      "type": "ESTIMAND",
      "label": "Primary OS Estimand (ITT)",
      "attributes": {
        "objective_type": "PRIMARY",
        "population": "FAS"
      }
    },
    {
      "id": "E2",
      "type": "ESTIMAND",
      "label": "Primary OS Estimand (Low Risk)",
      "attributes": {
        "objective_type": "PRIMARY",
        "population": "FAS_LOW_RISK"
      }
    },
    {
      "id": "E5",
      "type": "ESTIMAND",
      "label": "Secondary PFS Estimand (ITT)",
      "attributes": {
        "objective_type": "SECONDARY"
      }
    },
    {
      "id": "E9",
      "type": "ESTIMAND",
      "label": "Sensitivity OS Estimand (COVID-19)",
      "attributes": {
        "objective_type": "SENSITIVITY"
      }
    },
    {
      "id": "M1",
      "type": "METHOD",
      "label": "Primary Analysis of OS (ITT)",
      "attributes": {
        "method_role": "PRIMARY",
        "test_statistic": "Log-rank"
      }
    },
    {
      "id": "M2",
      "type": "METHOD",
      "label": "Primary Analysis of OS (Low Risk)",
      "attributes": {
        "method_role": "PRIMARY"
      }
    },
    {
      "id": "M9",
      "type": "METHOD",
      "label": "Analysis of PFS",
      "attributes": {
        "method_role": "PRIMARY_FOR_SECONDARY_ESTIMAND"
      }
    },
    {
      "id": "POP1",
      "type": "POPULATION",
      "label": "Full Analysis Set (ITT)",
      "attributes": {
        "abbreviation": "FAS"
      }
    },
    {
      "id": "POP2",
      "type": "POPULATION",
      "label": "Low Risk Analysis Set",
      "attributes": {
        "abbreviation": "FAS_LOW_RISK"
      }
    },
    {
      "id": "V1",
      "type": "VARIABLE",
      "label": "Date of Randomization",
      "attributes": {
        "variable_role": "BASELINE"
      }
    },
    {
      "id": "V4",
      "type": "VARIABLE",
      "label": "Overall Survival Time",
      "attributes": {
        "variable_role": "TIME_TO_EVENT"
      }
    },
    {
      "id": "V23",
      "type": "VARIABLE",
      "label": "Early Mortality Risk Score",
      "attributes": {
        "variable_role": "DERIVED_INTERMEDIATE"
      }
    },
    {
      "id": "V16",
      "type": "VARIABLE",
      "label": "Neutrophils (Baseline)",
      "attributes": {
        "variable_role": "COMPONENT"
      }
    },
    {
      "id": "V17",
      "type": "VARIABLE",
      "label": "Lymphocytes (Baseline)",
      "attributes": {
        "variable_role": "COMPONENT"
      }
    },
    {
      "id": "V18",
      "type": "VARIABLE",
      "label": "Albumin (Baseline)",
      "attributes": {
        "variable_role": "COMPONENT"
      }
    },
    {
      "id": "V19",
      "type": "VARIABLE",
      "label": "LDH (Baseline)",
      "attributes": {
        "variable_role": "COMPONENT"
      }
    },
    {
      "id": "V20",
      "type": "VARIABLE",
      "label": "GGT (Baseline)",
      "attributes": {
        "variable_role": "COMPONENT"
      }
    },
    {
      "id": "V21",
      "type": "VARIABLE",
      "label": "AST (Baseline)",
      "attributes": {
        "variable_role": "COMPONENT"
      }
    },
    {
      "id": "V13",
      "type": "VARIABLE",
      "label": "PD-L1 Expression (IVRS)",
      "attributes": {
        "variable_role": "STRATIFICATION"
      }
    },
    {
      "id": "ICE1",
      "type": "ICE",
      "label": "Discontinuation of study treatment",
      "attributes": {
        "strategy": "TREATMENT_POLICY"
      }
    },
    {
      "id": "ICE3",
      "type": "ICE",
      "label": "Death due to COVID-19",
      "attributes": {
        "strategy": "HYPOTHETICAL"
      }
    },
    {
      "id": "DEV7",
      "type": "DEVIATION",
      "label": "COVID-19 Death",
      "attributes": {
        "consequence": "DATA_MODIFICATION"
      }
    },
    {
      "id": "MT4",
      "type": "MISSINGNESS_TOLERANCE",
      "label": "Primary Power Assumption",
      "attributes": {
        "power_target": "86%"
      }
    }
  ],
  "edges": [
    {
      "from": "E1",
      "to": "M1",
      "relationship": "targeted_by"
    },
    {
      "from": "E2",
      "to": "M2",
      "relationship": "targeted_by"
    },
    {
      "from": "M1",
      "to": "V4",
      "relationship": "uses_as_response"
    },
    {
      "from": "M1",
      "to": "POP1",
      "relationship": "analyzed_on"
    },
    {
      "from": "M1",
      "to": "V13",
      "relationship": "uses_as_covariate"
    },
    {
      "from": "M2",
      "to": "POP2",
      "relationship": "analyzed_on"
    },
    {
      "from": "V4",
      "to": "V1",
      "relationship": "derived_from_start_date"
    },
    {
      "from": "V4",
      "to": "V2",
      "relationship": "derived_from_event_date"
    },
    {
      "from": "V4",
      "to": "V3",
      "relationship": "derived_from_censor_date"
    },
    {
      "from": "POP2",
      "to": "V23",
      "relationship": "defined_by_score"
    },
    {
      "from": "V23",
      "to": "V16",
      "relationship": "derived_from"
    },
    {
      "from": "V23",
      "to": "V17",
      "relationship": "derived_from"
    },
    {
      "from": "V23",
      "to": "V18",
      "relationship": "derived_from"
    },
    {
      "from": "V23",
      "to": "V19",
      "relationship": "derived_from"
    },
    {
      "from": "V23",
      "to": "V20",
      "relationship": "derived_from"
    },
    {
      "from": "V23",
      "to": "V21",
      "relationship": "derived_from"
    },
    {
      "from": "E9",
      "to": "ICE3",
      "relationship": "handles"
    },
    {
      "from": "ICE3",
      "to": "DEV7",
      "relationship": "triggered_by"
    },
    {
      "from": "E1",
      "to": "MT4",
      "relationship": "monitored_by"
    }
  ]
};

// Criticality Assignments from criticality_assignments.json
export const CRITICALITY_ASSIGNMENTS = [
  {
    "source_hint_id": "SH_RNDDT",
    "description": "Date of Randomization (IVRS)",
    "criticality_tier_primary_timepoint": 1,
    "criticality_tier_other_timepoints": 1,
    "tier_justification": "Baseline reference date for ALL Time-to-Event endpoints (Primary E1, Co-Primary E2, Sec E5). Errors here shift all survival times.",
    "lineage_path": [
      "V1 (RNDDT)",
      "→ V4 (AVAL_OS = DTHDT - RNDDT)",
      "→ M1 (Log-rank)",
      "→ E1 (Primary OS)"
    ],
    "estimands_impacted": [
      "E1",
      "E2",
      "E3",
      "E4",
      "E5"
    ],
    "methods_impacted": [
      "M1",
      "M2",
      "M9"
    ],
    "deviation_relevance": [
      "DEV1"
    ],
    "query_trigger": false,
    "missingness_sensitivity": "HIGH",
    "missingness_rationale": "Missing randomization date invalidates ITT membership confirmation and survival calculation.",
    "risk_if_erroneous": "Incorrect start time invalidates calculated survival duration."
  },
  {
    "source_hint_id": "SH_DTHDT",
    "description": "Date of Death (from DM/DS/AE)",
    "criticality_tier_primary_timepoint": 1,
    "criticality_tier_other_timepoints": 1,
    "tier_justification": "Determines the event time for the Primary Endpoint (OS). Direct component of analysis variable.",
    "lineage_path": [
      "V2 (DTHDT)",
      "→ V4 (AVAL_OS)",
      "→ M1 (Log-rank)",
      "→ E1 (Primary OS)"
    ],
    "estimands_impacted": [
      "E1",
      "E2",
      "E3"
    ],
    "methods_impacted": [
      "M1",
      "M2"
    ],
    "deviation_relevance": [
      "DEV7"
    ],
    "query_trigger": true,
    "missingness_sensitivity": "HIGH",
    "missingness_rationale": "Missing death date when death occurred turns an Event into a Censor (or missing data), biasing the Hazard Ratio.",
    "risk_if_erroneous": "Primary endpoint status changes from Event to Censor, or time is incorrect."
  },
  {
    "source_hint_id": "SH_LAB_NEUT",
    "description": "Baseline Neutrophil Count (Central Lab)",
    "criticality_tier_primary_timepoint": 1,
    "criticality_tier_other_timepoints": 3,
    "tier_justification": "Although a lab value, it is a direct component of V23 (Risk Score), which defines POP2. POP2 is the analysis set for E2 (Co-Primary Estimand). Missing/wrong neutrophil count excludes subject from Co-Primary analysis.",
    "lineage_path": [
      "V16 (Neutrophils)",
      "→ V22 (NLR)",
      "→ V23 (Risk Score)",
      "→ V24 (Risk Flag)",
      "→ POP2 (Low Risk Analysis Set)",
      "→ M2 (Primary Analysis Low Risk)",
      "→ E2 (Co-Primary OS)"
    ],
    "estimands_impacted": [
      "E2",
      "E4"
    ],
    "methods_impacted": [
      "M2"
    ],
    "deviation_relevance": [],
    "query_trigger": false,
    "missingness_sensitivity": "HIGH",
    "missingness_rationale": "MT rules imply high sensitivity for population-defining variables. If missing, subject is excluded from Primary Analysis (POP2).",
    "risk_if_erroneous": "Subject erroneously included/excluded from Co-Primary analysis population."
  },
  {
    "source_hint_id": "SH_LAB_ALB",
    "description": "Baseline Albumin (Central Lab)",
    "criticality_tier_primary_timepoint": 1,
    "criticality_tier_other_timepoints": 3,
    "tier_justification": "Direct component of V23 (Risk Score) -> POP2 (Co-Primary Population).",
    "lineage_path": [
      "V18 (Albumin)",
      "→ V23 (Risk Score)",
      "→ POP2",
      "→ E2"
    ],
    "estimands_impacted": [
      "E2"
    ],
    "methods_impacted": [
      "M2"
    ],
    "deviation_relevance": [],
    "query_trigger": false,
    "missingness_sensitivity": "HIGH",
    "missingness_rationale": "Missing value leads to exclusion from Co-Primary population.",
    "risk_if_erroneous": "Population assignment error."
  },
  {
    "source_hint_id": "SH_PDL1_IVRS",
    "description": "PD-L1 Stratification Factor (IVRS)",
    "criticality_tier_primary_timepoint": 1,
    "criticality_tier_other_timepoints": 1,
    "tier_justification": "Used in Randomization AND as a covariate in the Primary Analysis Model (M1). Error affects treatment allocation and model adjustment.",
    "lineage_path": [
      "V13 (PDL1 IVRS)",
      "→ M1 (Stratified Log-rank)",
      "→ E1 (Primary OS)"
    ],
    "estimands_impacted": [
      "E1",
      "E2",
      "E5"
    ],
    "methods_impacted": [
      "M1",
      "M2",
      "M9"
    ],
    "deviation_relevance": [],
    "query_trigger": false,
    "missingness_sensitivity": "MODERATE",
    "missingness_rationale": "Usually mandatory for randomization, so missingness is rare, but impact is high.",
    "risk_if_erroneous": "Incorrect stratification stratum in primary model."
  },
  {
    "source_hint_id": "SH_RECIST_DATE",
    "description": "Tumor Assessment Date (Scan Date)",
    "criticality_tier_primary_timepoint": 2,
    "criticality_tier_other_timepoints": 2,
    "tier_justification": "Timing variable for Secondary Endpoint (PFS). Determines event date and censoring date. Not Tier 1 because PFS is Secondary (E5).",
    "lineage_path": [
      "V6/V7 (Scan Dates)",
      "→ V9 (AVAL_PFS)",
      "→ M9 (PFS Analysis)",
      "→ E5 (Secondary PFS)"
    ],
    "estimands_impacted": [
      "E5",
      "E3",
      "E4"
    ],
    "methods_impacted": [
      "M9",
      "M3"
    ],
    "deviation_relevance": [
      "DEV3",
      "DEV4"
    ],
    "query_trigger": false,
    "missingness_sensitivity": "MODERATE",
    "missingness_rationale": "Missing visits affect PFS censoring logic (2+ missed visits rule).",
    "risk_if_erroneous": "Incorrect PFS event time or censoring."
  }
];
