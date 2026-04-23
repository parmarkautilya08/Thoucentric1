# FMCG Research Pod — Master Runbook
**Version:** 1.0 MVP | **Owner:** Pod Lead | **Last Updated:** April 2025
**Classification:** Internal — Thoucentric COE

---

## 1. What This Pod Is (And Is Not)

This is a **continuously refreshed intelligence engine** for the FMCG sector. It exists to give Thoucentric consultants hypothesis-led, evidence-backed insight they can use in client conversations, BD pitches, and delivery engagements — without having to start from scratch each time.

It is **not** a one-time research project. It is not a static report. It is not a data dump.

The test for every output: *Can a consultant walk into a CPO or CSCO conversation tomorrow and anchor a 15-minute discussion using only this artifact?* If yes, it's a pod output. If no, it's raw material.

---

## 2. Design Principles (Non-Negotiable)

| Principle | What It Means in Practice |
|---|---|
| **Insight-first** | Every output must contain a hypothesis, not just data |
| **SHEI-structured** | Signal → Hypothesis → Evidence → Implication on every synthesis output |
| **Consulting-ready** | Written as if a partner will read it before a client meeting |
| **Refresh-aware** | Every artifact has a version date and a next-refresh date |
| **Agent-compatible** | Every output follows the structured schema (File 08) so the AI advisory agent can ingest it |
| **Lean** | One person runs this. If it can't be done solo, it doesn't belong in the MVP |

---

## 3. Company Universe

### Tier 1 — Deep Coverage (Company Intelligence Cards)
Full cards, quarterly refresh + event-triggered updates.

**Global (9 companies):**
| # | Company | IR Page | Earnings Cadence |
|---|---|---|---|
| 1 | Unilever | investors.unilever.com | Quarterly |
| 2 | Nestlé | nestle.com/investors | Quarterly |
| 3 | P&G | pginvestor.com | Quarterly |
| 4 | PepsiCo | pepsico.com/investors | Quarterly |
| 5 | Coca-Cola | investors.coca-colacompany.com | Quarterly |
| 6 | Reckitt | reckitt.com/investors | Half-yearly |
| 7 | Colgate-Palmolive | colgatepalmolive.com/investors | Quarterly |
| 8 | Kraft Heinz | ir.kraftheinzcompany.com | Quarterly |
| 9 | Kenvue | kenvue.com/investors | Quarterly |

**India (7 companies):**
| # | Company | Exchange | Earnings Cadence |
|---|---|---|---|
| 1 | HUL | BSE/NSE | Quarterly |
| 2 | ITC | BSE/NSE | Quarterly |
| 3 | Dabur | BSE/NSE | Quarterly |
| 4 | Marico | BSE/NSE | Quarterly |
| 5 | Godrej Consumer Products | BSE/NSE | Quarterly |
| 6 | Britannia | BSE/NSE | Quarterly |
| 7 | Emami | BSE/NSE | Quarterly |

### Tier 2 — Signal Tracking Only
No full cards. Monitor for events, promote to Tier 1 when needed.

**Global:** Henkel, Beiersdorf, General Mills, WK Kellogg, AB InBev, Haleon
**India:** Tata Consumer Products, Hindustan Foods, Zydus Wellness, CavinKare, Patanjali, Jyothy Labs

**Tier 2 → Tier 1 Promotion Triggers:**
- Thoucentric wins a project with the company, OR
- 3+ high-signal events in a single quarter, OR
- Company enters a new strategic territory relevant to SC/IT

---

## 4. Operating Calendar (Solo Operator)

### Weekly Ritual (45–60 min every Monday)
```
[ ] Run Signal Scanner (Claude Prompt 1)
    - Sources: Google Alerts, LinkedIn company pages, BSE/NSE filings
    - Input: Copy-paste 15–25 news items from the past week
    - Output: Structured signal table saved to /signals/YYYY-WW/
[ ] Triage outputs:
    - High-signal → queue for Company Card update (this week or next)
    - Pattern cluster (3+ companies, same signal type) → queue for SHEI synthesis
    - Low-signal → log in weekly signal archive, no action
[ ] Update Weekly Signal Log (see Repository section)
```

### Monthly Ritual (Half-day, first week of month)
```
[ ] Pull earnings releases for all Tier 1 companies that reported this month
[ ] Run Company Card Updater (Claude Prompt 2) for each
[ ] Save updated cards to /company_cards/[company_name]/v[N]/
[ ] Review KPI Benchmarking Snapshot — are any benchmarks materially outdated?
[ ] Check Tier 2 tracking list — any promotions needed?
[ ] Update Repository Index (File 07)
```

### Quarterly Sprint (Full day, end of quarter)
```
[ ] Compile all SHEI Synthesis inputs from the quarter's signals
[ ] Run SHEI Synthesizer (Claude Prompt 3) — generate 4–6 Problem Hypothesis Cards
[ ] Review and update Supply Chain Playbook sections that need refreshing
[ ] Review and update IT Playbook sections
[ ] Run Activation Narrator (Claude Prompt 5) on top 2–3 SHEI cards → pitch anchors
[ ] Update Benchmarking Snapshots with latest data
[ ] Distribute quarterly intelligence brief to Thoucentric leadership
[ ] Archive the quarter's signal log
```

### Annual Reset (One day, January)
```
[ ] Full review of all Company Intelligence Cards — accuracy check
[ ] Taxonomy review — are tags still relevant? New categories needed?
[ ] Playbook quality audit — what's stale?
[ ] Universe review — Tier 2 promotions/demotions
[ ] Update this Runbook with lessons learned
```

---

## 5. Event Trigger Protocol

Not everything waits for the calendar. When these events occur, act within the specified window:

| Event Type | Response Window | Action | Owner |
|---|---|---|---|
| Major earnings release (>5% revenue surprise) | 48 hours | Update Company Card + SHEI scan | Pod Lead |
| Leadership change (CEO/CFO/CSO) | 48 hours | Update Company Card CXO section | Pod Lead |
| M&A announcement | 72 hours | Disruption Brief draft via Claude Prompt 4 | Pod Lead |
| Major regulatory change (FSSAI, GST, FDI) | 72 hours | Disruption Brief | Pod Lead |
| Competitor tech announcement (major ERP/AI deployment) | 1 week | IT Playbook update trigger | Pod Lead |
| Thoucentric project closed in FMCG | 2 weeks | Case extract filed to repository | Delivery lead (request) |

**Triage Rule:** If you're unsure whether something is high-signal, ask: *Would a CPO or CSCO bring this up in a meeting next week?* If yes, it's high-signal.

---

## 6. Claude Project Setup Guide

You will run **5 Claude Projects**, each permanently configured with a system prompt from File 01. This is your automation layer.

### How to Set Up a Claude Project
1. Go to claude.ai → Projects → New Project
2. Name it exactly as specified below
3. Paste the system prompt from File 01 into the "Instructions" field
4. Save. The project remembers its role permanently.

### Project Names and Primary Files to Upload
| Project | Name in Claude | Always Upload Before Using |
|---|---|---|
| Signal Scanner | `POD: Signal Scanner` | Nothing — paste signals directly |
| Company Card Updater | `POD: Company Card Updater` | Company Intelligence Card Template (File 02) |
| SHEI Synthesizer | `POD: SHEI Synthesizer` | SHEI Card Template (File 04) |
| Playbook Drafter | `POD: Playbook Drafter` | Relevant playbook section being updated |
| Activation Narrator | `POD: Activation Narrator` | SHEI card or benchmarking snapshot to activate |

### Input Best Practices
- **Always paste text, never upload PDFs** — Claude extracts cleaner from pasted text
- For earnings transcripts: paste the MD&A section + Q&A highlights (not the full document)
- For news signals: 2–3 sentences per item is sufficient — don't paste full articles
- For annual reports: paste Chairman's Letter, MD&A, and Risk Factors sections only

---

## 7. Output Quality Standards

Every pod output must pass this check before being saved to the repository:

**The 5-point quality gate:**
1. **Dated and versioned** — header shows creation date, version, next refresh date
2. **Source-tagged** — at least one named source per key data point
3. **SHEI-compliant** — synthesis outputs have all four SHEI elements populated
4. **Consulting-activated** — at least one pitch anchor or provocation question
5. **Agent-formatted** — structured metadata block at top (see File 08)

If an output fails any check, it goes back to the relevant Claude project for refinement before saving.

---

## 8. Repository Structure

```
/FMCG_Research_Pod/
│
├── /company_cards/
│   ├── /global/
│   │   ├── /unilever/          ← v1.0, v1.1, v2.0...
│   │   ├── /nestle/
│   │   └── ... (9 global companies)
│   └── /india/
│       ├── /hul/
│       └── ... (7 India companies)
│
├── /kpi_benchmarks/
│   ├── supply_chain_benchmarks_v[N].md
│   ├── financial_benchmarks_v[N].md
│   └── sd_benchmarks_v[N].md
│
├── /shei_cards/
│   ├── /supply_chain/
│   ├── /it_technology/
│   ├── /sales_distribution/
│   └── /financial/
│
├── /playbooks/
│   ├── /supply_chain/          ← sections as separate files
│   └── /it_technology/         ← sections as separate files
│
├── /disruption_briefs/
│   └── YYYY-MM_[topic]_brief.md
│
├── /signals/
│   └── /YYYY-WW/               ← weekly signal logs
│
├── /activation/
│   ├── /pitch_anchors/
│   └── /thought_leadership/
│
└── /admin/
    ├── 00_POD_Master_Runbook.md    ← this file
    ├── 01_Claude_Prompt_Library.md
    ├── 07_Repository_Taxonomy.md
    └── changelog.md
```

**File Naming Convention:**
`[YYYY-MM]_[company/topic]_[output_type]_v[N].[ext]`

Examples:
- `2025-04_hul_company_card_v1.md`
- `2025-Q1_sc_demand_forecasting_shei_card_v1.md`
- `2025-04_unilever_disruption_brief_v1.md`

---

## 9. AI Advisory Agent Integration

All pod outputs are structured to feed directly into the AI advisory agent. Two modes:

**Mode 1 — Upload:** Any pod output markdown file can be uploaded directly to the advisory agent as a knowledge document. The metadata block at the top of each file (see File 08) ensures the agent can parse it correctly.

**Mode 2 — API/Integration:** If the advisory agent supports API ingestion, use the JSON schema in File 08 to convert pod outputs to structured JSON before pushing. A simple Python script for this conversion is included in File 08.

**What the agent gets from each output type:**
- Company Cards → company context, financials, strategic direction, open problems
- SHEI Cards → problem hypotheses the agent can surface in advisory conversations
- Benchmarks → comparison data the agent can use when clients ask "how do we stack up"
- Playbooks → methodology the agent can reference when recommending approaches

---

## 10. Launch Checklist

Before going live with the pod:

```
INFRASTRUCTURE
[ ] 5 Claude Projects created and system prompts loaded
[ ] Repository folder structure created (Drive/SharePoint/Notion)
[ ] Repository Taxonomy file uploaded to each Claude project
[ ] Google Alerts set up for all 28 companies + 10 FMCG keywords

CONTENT — MINIMUM VIABLE
[ ] 4 Company Intelligence Cards built (HUL, Unilever, Nestlé, P&G)
[ ] Supply Chain KPI Benchmarking Snapshot populated
[ ] 3 SHEI Problem Hypothesis Cards generated
[ ] Supply Chain Playbook Sections 1–2 complete
[ ] IT Playbook Section 1 (Tech Stack Map) complete

ACTIVATION
[ ] 3 pitch anchors generated from SHEI cards
[ ] Advisory agent integration tested with at least 1 company card

PROCESS
[ ] First weekly signal scan completed
[ ] Operating calendar blocked in calendar
[ ] Changelog started
```

---

## 11. Maintenance Log Template

At the top of every quarterly update, log:

```
## Quarterly Update — Q[N] [YEAR]
Date: 
Updated by: 
Companies updated: 
SHEI cards generated: 
Playbook sections refreshed: 
Tier changes (promotions/demotions): 
Key intelligence themes this quarter: 
Issues / gaps identified: 
Next quarter priorities: 
```

---

*This runbook is a living document. Update it when processes change, not after.*
