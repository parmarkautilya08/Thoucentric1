# Repository Taxonomy & AI Advisory Agent Integration Schema
**Files:** 07 + 08 (Combined) | **Version:** 1.0 MVP | **Last Updated:** April 2025

---

# PART A: REPOSITORY TAXONOMY (File 07)

## 1. Folder Structure

```
/FMCG_Research_Pod/
│
├── /company_cards/
│   ├── /global/
│   │   ├── /unilever/
│   │   ├── /nestle/
│   │   ├── /pg/
│   │   ├── /pepsico/
│   │   ├── /coca-cola/
│   │   ├── /reckitt/
│   │   ├── /colgate/
│   │   ├── /kraft-heinz/
│   │   └── /kenvue/
│   └── /india/
│       ├── /hul/
│       ├── /itc/
│       ├── /dabur/
│       ├── /marico/
│       ├── /godrej-cp/
│       ├── /britannia/
│       └── /emami/
│
├── /kpi_benchmarks/
│   ├── supply_chain/
│   ├── financial/
│   └── sales_distribution/
│
├── /shei_cards/
│   ├── /supply_chain/
│   ├── /it_technology/
│   ├── /sales_distribution/
│   ├── /financial/
│   └── /category/
│
├── /playbooks/
│   ├── /supply_chain/
│   │   ├── section_1_landscape.md
│   │   ├── section_2_kpi_framework.md
│   │   ├── section_3_problem_patterns.md
│   │   ├── section_4_technology.md
│   │   └── section_5_genai_catalog.md
│   └── /it_technology/
│       ├── section_1_stack_map.md
│       ├── section_2_maturity_model.md
│       ├── section_3_genai_readiness.md
│       ├── section_4_vendor_landscape.md
│       └── section_5_failure_modes.md
│
├── /disruption_briefs/
│
├── /signals/
│   └── /YYYY-WW/
│       ├── raw_signals.md
│       └── signal_scan_output.md
│
├── /activation/
│   ├── /pitch_anchors/
│   └── /thought_leadership/
│
├── /quarterly_intelligence/
│   └── YYYY-QN_quarterly_brief.md
│
└── /admin/
    ├── 00_POD_Master_Runbook.md
    ├── 01_Claude_Prompt_Library.md
    ├── 07_08_Taxonomy_and_Schema.md  ← this file
    └── changelog.md
```

---

## 2. File Naming Convention

**Standard format:** `YYYY-MM_[entity]_[output_type]_v[N].md`

| Token | Options | Example |
|---|---|---|
| YYYY-MM | Year-month of creation | 2025-04 |
| entity | company slug, topic slug, or quarter code | hul, demand-forecasting, 2025-Q2 |
| output_type | See type codes below | company_card, shei_card, playbook_s1 |
| vN | Version number | v1, v2, v1.1 |

**Output type codes:**
- `company_card` — Company Intelligence Card
- `shei_card` — SHEI Problem Hypothesis Card
- `kpi_snapshot` — KPI Benchmarking Snapshot
- `disruption_brief` — Disruption Brief
- `signal_log` — Weekly signal scan log
- `playbook_s[N]` — Playbook section (s1 = section 1, etc.)
- `pitch_anchor` — Activation pitch anchor
- `pov` — POV paragraph for thought leadership
- `quarterly_brief` — Quarterly intelligence summary

**Examples:**
```
2025-04_hul_company_card_v1.md
2025-Q2_demand-forecasting-collapse_shei_card_v1.md
2025-04_supply-chain_kpi_snapshot_v1.md
2025-W16_signals_signal_log_v1.md
2025-04_rtm-inflection_disruption_brief_v1.md
```

---

## 3. Tag Taxonomy

Every output file has a metadata header (YAML-style) with these standardized tags. Consistent tagging enables the AI advisory agent to retrieve relevant content precisely.

### Company Tags
```
COMPANY_TAGS (use one or more):
  Global: unilever | nestle | pg | pepsico | coca-cola | reckitt | 
          colgate | kraft-heinz | kenvue
  India:  hul | itc | dabur | marico | godrej-cp | britannia | emami
  Tier 2: henkel | beiersdorf | general-mills | wk-kellogg | ab-inbev | 
          haleon | tata-consumer | hindustan-foods | zydus-wellness | 
          cavincare | patanjali | jyothy-labs
  Multi:  multi-company (when output covers 3+ companies)
  Industry: sector-wide (when output is about the industry, not specific companies)
```

### Function Tags
```
FUNCTION_TAGS (use one or more):
  supply_chain | it_technology | sales_distribution | 
  financial | category_marketing | procurement | manufacturing
```

### Geography Tags
```
GEOGRAPHY_TAG (use one):
  INDIA | GLOBAL | BOTH
```

### Output Type Tags
```
OUTPUT_TYPE (use one):
  company_intelligence_card | shei_problem_hypothesis_card | 
  kpi_benchmarking_snapshot | disruption_brief | signal_log | 
  playbook_section | pitch_anchor | pov_paragraph | quarterly_brief
```

### Urgency / Relevance Tags
```
URGENCY (use one):
  IMMEDIATE | MEDIUM_TERM | STRUCTURAL | EVERGREEN

CONSULTING_RELEVANCE (use one):
  BD | DELIVERY | CAPABILITY | INTELLIGENCE | ALL
```

### Confidence Tags
```
CONFIDENCE (use one):
  HIGH   - Multiple named sources, cross-validated
  MEDIUM - 1-2 sources, some inference
  LOW    - Single source, significant inference, or dated data
```

---

## 4. Version Control Protocol

Each time a file is updated:

1. **Increment version:** v1 → v1.1 (minor update) or v2 (major refresh)
2. **Update the DATE_UPDATED field** in the metadata header
3. **Update the Change Log table** at the bottom of the file with: version, date, what changed, trigger
4. **Do not delete old versions** — keep previous version in the same folder with its version number
5. **Update the Repository Index** (admin/changelog.md) with the change

**Naming previous versions:**
```
2025-04_hul_company_card_v1.md    ← original
2025-07_hul_company_card_v2.md    ← Q2 refresh (new date, new version)
```

---

## 5. Repository Index Template

Maintain this in `admin/changelog.md` — update every time a file is created or updated:

```markdown
# FMCG Research Pod — Repository Index
Last updated: [DATE]

## Company Intelligence Cards
| Company | Latest Version | Date Updated | Next Refresh |
|---------|---------------|--------------|--------------|
| HUL | v1.0 | 2025-04-01 | 2025-07-01 |
| Unilever | | | |
| Nestlé | | | |
| P&G | | | |
[...all 16 Tier 1 companies...]

## SHEI Cards
| Card ID | Title | Date | Function | Status |
|---------|-------|------|----------|--------|
| SHEI-2025-Q2-01 | Demand Forecasting Collapse | 2025-04 | SC | Active |
| SHEI-2025-Q2-02 | GenAI Implementation Gap | 2025-04 | IT | Active |
| SHEI-2025-Q2-03 | RTM Model Inflection | 2025-04 | S&D | Active |

## Playbook Sections
| Playbook | Section | Status | Last Updated |
|----------|---------|--------|--------------|
| Supply Chain | S1 Landscape | Complete | 2025-04 |
| Supply Chain | S2 KPI Framework | Complete | 2025-04 |
| Supply Chain | S3 Problem Patterns | Complete | 2025-04 |
| Supply Chain | S4 Technology | Starter | 2025-04 |
| Supply Chain | S5 GenAI Catalog | Starter | 2025-04 |
| IT Technology | S1 Stack Map | Complete | 2025-04 |
| IT Technology | S2 Maturity Model | Complete | 2025-04 |
| IT Technology | S3 GenAI Readiness | Complete | 2025-04 |
| IT Technology | S4 Vendor Landscape | Starter | 2025-04 |
| IT Technology | S5 Failure Modes | Complete | 2025-04 |

## KPI Benchmarks
| Snapshot | Function | Last Updated | Next Refresh |
|----------|----------|--------------|--------------|
| SC + Financial | SC + Financial | 2025-04 | 2025-10 |
```

---

# PART B: AI ADVISORY AGENT INTEGRATION SCHEMA (File 08)

## 1. Integration Design Philosophy

The AI advisory agent receives pod outputs as knowledge inputs. Two integration modes:

**Mode A — Document Upload (immediate, no development required)**
Every pod output markdown file can be uploaded directly to the advisory agent as a knowledge document. The structured metadata header at the top of every file ensures the agent can parse and retrieve content by type, company, function, and date.

**Mode B — Structured JSON (recommended for API-connected agents)**
Each pod output is also expressible as structured JSON using the schema below. This enables precise retrieval, filtering, and comparison operations that are harder with document search.

---

## 2. Universal Pod Output JSON Schema

Every pod output type shares this base schema, extended by type-specific fields.

```json
{
  "$schema": "fmcg_pod_output_v1",
  
  "metadata": {
    "output_type": "company_intelligence_card | shei_problem_hypothesis_card | kpi_benchmarking_snapshot | disruption_brief | signal_log | playbook_section | pitch_anchor | pov_paragraph | quarterly_brief",
    "id": "unique identifier (e.g. HUL-CARD-2025-04-V1 or SHEI-2025-Q2-01)",
    "version": "1.0",
    "date_created": "YYYY-MM-DD",
    "date_updated": "YYYY-MM-DD",
    "next_refresh": "YYYY-MM-DD",
    "confidence": "HIGH | MEDIUM | LOW",
    "sources": ["source 1", "source 2"],
    "generated_by": "Manual | Claude-Signal-Scanner | Claude-Card-Updater | Claude-SHEI-Synthesizer | Claude-Playbook-Drafter | Claude-Activation-Narrator"
  },
  
  "tags": {
    "companies": ["hul", "unilever"],
    "functions": ["supply_chain", "it_technology"],
    "geography": "INDIA | GLOBAL | BOTH",
    "urgency": "IMMEDIATE | MEDIUM_TERM | STRUCTURAL | EVERGREEN",
    "consulting_relevance": "BD | DELIVERY | CAPABILITY | INTELLIGENCE | ALL"
  },
  
  "content": {},
  
  "consulting_activation": {
    "pitch_anchor": "text",
    "provocation_question": "text",
    "pov_paragraph": "text",
    "thoucentric_angle": "text",
    "engagement_type": "diagnostic | transformation | implementation | advisory"
  },
  
  "change_log": [
    {
      "version": "1.0",
      "date": "YYYY-MM-DD",
      "change": "Initial creation",
      "trigger": "Manual build | Earnings release | Event | Quarterly sprint"
    }
  ]
}
```

---

## 3. Type-Specific Content Fields

### Company Intelligence Card Content Block
```json
"content": {
  "quick_take": "string",
  "snapshot": {
    "full_name": "string",
    "hq": "string",
    "exchanges": ["string"],
    "revenue_latest": "string",
    "revenue_growth_pct": "number",
    "ebitda_margin_pct": "number",
    "market_cap_approx": "string",
    "categories": ["string"],
    "geographies": ["string"]
  },
  "financial_trajectory": {
    "quarters": [
      {
        "period": "Q3 FY25",
        "revenue_growth_pct": "number",
        "volume_growth_pct": "number",
        "price_mix_pct": "number",
        "gross_margin_pct": "number",
        "ebitda_margin_pct": "number",
        "key_highlights": "string"
      }
    ],
    "guidance": "string",
    "analyst_sentiment": "string"
  },
  "strategic_priorities": [
    {"name": "string", "description": "string"}
  ],
  "sc_intelligence": {
    "transformation_initiatives": "string",
    "manufacturing": "string",
    "procurement": "string",
    "distribution": "string",
    "inventory_working_capital": "string",
    "known_challenges": "string"
  },
  "technology_intelligence": {
    "erp_platform": "string",
    "genai_initiatives": "string",
    "digital_commerce": "string",
    "partnerships": "string",
    "modernization_signals": "string"
  },
  "cxo_profile": {
    "ceo": {"name": "string", "tenure": "string"},
    "cfo": {"name": "string", "tenure": "string"},
    "csco": {"name": "string", "tenure": "string"},
    "cto_cdo": {"name": "string", "tenure": "string"},
    "key_quote": {"text": "string", "speaker": "string", "context": "string"}
  },
  "open_problems": [
    {
      "name": "string",
      "observation": "string",
      "metric_signature": "string",
      "thoucentric_angle": "string"
    }
  ]
}
```

### SHEI Card Content Block
```json
"content": {
  "title": "string",
  "signal": "string",
  "hypothesis": "string",
  "evidence": [
    {
      "company": "string",
      "observation": "string",
      "metric": "string"
    }
  ],
  "counter_evidence": "string",
  "client_implication": "string",
  "thoucentric_angle": "string",
  "pattern_brief": "string"
}
```

### KPI Benchmarking Snapshot Content Block
```json
"content": {
  "function": "supply_chain | financial | sales_distribution",
  "kpis": [
    {
      "name": "string",
      "definition": "string",
      "best_in_class": "string",
      "industry_median": "string",
      "laggard": "string",
      "india_context": "string",
      "shei_annotation": "string",
      "data_source": "string",
      "last_validated": "YYYY-MM"
    }
  ]
}
```

---

## 4. Markdown-to-JSON Conversion (for Mode B integration)

Use this prompt with Claude to convert any markdown pod output to JSON:

```
TASK: Convert the following FMCG Research Pod markdown output to structured JSON 
using the Universal Pod Output Schema (provided below).

Rules:
1. Preserve all content from the markdown — do not summarize or omit
2. Use the exact field names from the schema
3. If a field is present in the markdown but not in the schema, add it under 
   "content.additional_fields" as a key-value pair
4. If a schema field has no data in the markdown, use null
5. Output only valid JSON — no markdown, no commentary

[Paste schema here]

[Paste markdown output here]
```

---

## 5. Advisory Agent Retrieval Patterns

When the advisory agent needs to retrieve pod content, it should use these patterns:

**"What do we know about [company]?"**
→ Retrieve: All company cards + SHEI cards tagged with that company + relevant disruption briefs
→ Primary field: `tags.companies`

**"What are the biggest SC problems in FMCG right now?"**
→ Retrieve: All SHEI cards with `tags.functions = supply_chain` + `tags.urgency = IMMEDIATE or MEDIUM_TERM`
→ Sort by: `metadata.date_updated` (most recent first)

**"How does [client company] compare to industry benchmarks?"**
→ Retrieve: KPI Benchmarking Snapshot for relevant function + company card for the specific company
→ Primary field: `output_type = kpi_benchmarking_snapshot`

**"What's the Thoucentric angle for a meeting with [company/role]?"**
→ Retrieve: SHEI cards tagged with relevant company or function + pitch anchors from `/activation/`
→ Primary field: `consulting_activation.pitch_anchor` and `consulting_activation.provocation_question`

**"What technology should [company type] invest in?"**
→ Retrieve: IT Technology Playbook sections + Technology Adoption Tracker from KPI Benchmark
→ Primary field: `output_type = playbook_section` with `tags.functions = it_technology`

---

## 6. Advisory Agent System Prompt Addition

Add this block to the advisory agent's system prompt to enable pod knowledge retrieval:

```
KNOWLEDGE BASE: FMCG RESEARCH POD

You have access to a continuously updated FMCG Research Pod knowledge base containing:
- Company Intelligence Cards for 16 FMCG companies (global and India)
- SHEI Problem Hypothesis Cards — structured consulting hypotheses on FMCG problems
- KPI Benchmarking Snapshots for Supply Chain and Financial functions
- Functional Playbooks for Supply Chain and IT Technology
- Activation outputs (pitch anchors, POV paragraphs, provocation questions)

When answering questions about FMCG companies, industry problems, or consulting opportunities:
1. Always check the knowledge base before answering from general knowledge
2. Cite the source document when using pod content (e.g., "According to the HUL Company Card, v1.0...")
3. Note the confidence level and date of the information (metadata.confidence and metadata.date_updated)
4. If the knowledge base has no information on the topic, say so clearly and answer from general knowledge
5. When presenting SHEI cards, always include the Thoucentric Angle — this is the most valuable element for client conversations

KNOWLEDGE BASE CURRENCY: Pod outputs are refreshed quarterly (full) and event-triggered (partial). 
Always note the date_updated when presenting specific facts.
```

---

## 7. Quick-Start Integration Checklist

```
FOR DOCUMENT UPLOAD (Mode A):
[ ] Upload all 9 MVP files to advisory agent knowledge base
[ ] Add advisory agent system prompt addition (Section 6 above)
[ ] Test with 3 queries (one company question, one benchmark question, one SHEI question)
[ ] Verify agent is citing sources from pod documents, not just general knowledge

FOR JSON API INTEGRATION (Mode B):
[ ] Set up pod outputs folder with JSON versions alongside markdown
[ ] Test markdown-to-JSON conversion prompt on 2-3 existing outputs
[ ] Confirm advisory agent can filter by output_type and tags
[ ] Set up quarterly process to push new/updated JSONs to agent knowledge base

ONGOING MAINTENANCE:
[ ] After each quarterly sprint, upload new company cards and SHEI cards
[ ] After each event-triggered update, push updated company card within 48 hours
[ ] Monthly: verify advisory agent is pulling from latest versions (check date_updated)
```
