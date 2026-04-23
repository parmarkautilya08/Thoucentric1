# FMCG Supply Chain Playbook — MVP
**File:** 05 | **Version:** 1.0 MVP | **Last Updated:** April 2025
**Scope:** FMCG Supply Chain | **Primary Use:** Consultant reference for diagnostics, client conversations, and engagement design

---

```
---
OUTPUT_TYPE: functional_playbook
FUNCTION: SUPPLY_CHAIN
GEOGRAPHY: BOTH
VERSION: 1.0
DATE_CREATED: 2025-04-01
NEXT_REFRESH: 2026-01-01
SECTIONS_COMPLETE: 1, 2, 3 (Sections 4-5 in progress)
CONFIDENCE: MEDIUM-HIGH
---
```

---

## Playbook Navigation

| Section | Title | Status | Use Case |
|---|---|---|---|
| 1 | Why SC is the FMCG Competitive Battlefield | Complete | Framing conversations, proposal openings |
| 2 | KPI Framework & Benchmarks | Complete | Diagnostics, gap assessments |
| 3 | Problem Pattern Library (SHEI Cards) | Complete (3 cards) | Client conversations, BD |
| 4 | Technology Landscape | Starter — expand quarterly | Tech assessments, vendor selection |
| 5 | GenAI Use Case Catalog | Starter — expand quarterly | Innovation conversations, CTO engagement |

---

## Section 1: Why Supply Chain is the FMCG Competitive Battlefield

### Why This Matters
Supply chain is where FMCG companies win or lose — but most executives still treat it as a cost function rather than a competitive weapon. P&G's supply chain has been ranked #1 globally by Gartner for nine of the past twelve years. This is not coincidence: P&G's SC capability allows it to launch a new SKU in 40 countries simultaneously, respond to a demand spike within 72 hours, and run forecast accuracy above 85% in categories where competitors struggle to reach 65%. The FMCG companies gaining market share in 2024–2025 — P&G in developed markets, HUL defending its India position — share one characteristic: their supply chain is a capability, not just an operation.

### Industry Landscape
FMCG supply chains are structurally harder than most manufacturing sectors for three compounding reasons. First, the SKU complexity is extreme — a company like HUL manages 2,000+ SKUs across dozens of categories, geographies, and price points. Each SKU has a different demand pattern, shelf life, production constraint, and distribution requirement. No single planning system handles this well without deliberate design.

Second, demand in FMCG is structurally promotional — between 15–25% of FMCG revenue flows through trade promotions in any given year, and promotions create artificial demand spikes that statistical forecasting models treat as signal rather than noise. The result is a consistent pattern of over-forecasting promo periods and under-preparing for non-promo demand, creating an inventory distortion cycle that costs the average FMCG company 2–4% of revenue annually.

Third, the distribution model in emerging markets — particularly India — creates a unique last-mile complexity that has no equivalent in developed market SC textbooks. Serving 12 million kirana stores through a chain of distributors, stockists, and field sales requires a planning and execution infrastructure that is fundamentally different from serving 50,000 supermarkets.

The maturity distribution is wide: global leaders (P&G, Unilever, Nestlé) operate SC at a level that Indian mid-tier players will take a decade to reach. But within the India FMCG universe, the gap between HUL and the mid-tier is already large and widening — HUL's SC investment over the past five years (S/4HANA, demand planning transformation, DTR pilot) is creating a moat that is harder to cross with each passing year.

### What Good Looks Like (Best-in-Class Reference)
P&G's supply chain is the global benchmark. Key characteristics: demand-driven replenishment (pull, not push) across 180 markets; forecast accuracy above 85% at the category level; OTIF above 95% to retail customers; SC cost as a percentage of revenue below 8%. The enablers: 25 years of SAP investment, a proprietary demand sensing platform integrating POS data, social signals, and weather, and a SC organization that is treated as a strategic capability rather than a support function.

For India context, HUL is the domestic benchmark. Its RTM infrastructure (3,500+ redistribution stockists, DMS across the network, field sales app for real-time order capture) represents the current state of the art for India-scale FMCG distribution. The question for any Indian FMCG company is not whether to replicate HUL's model — it is which elements of that model remain relevant as channels shift.

---

## Section 2: KPI Framework & Benchmarks

*Full benchmarks in File 03. This section provides the consulting interpretation layer — how to use benchmarks in client conversations.*

### The 9 Supply Chain KPIs That Matter Most

**For a diagnostic workshop, focus on these nine in this order:**

**1. Forecast Accuracy** *(Lead indicator — everything downstream depends on this)*
If forecast accuracy is below 65%, every other SC metric will be compromised. Poor forecasting drives excess inventory, OTIF failures, and working capital deterioration simultaneously. Start here.
- Ask: "What is your current MAPE at the 4-week horizon, by category?"
- Benchmark: World-class >85%; India average 60–70%
- Red flag: "We don't track MAPE at the category level" = no demand planning discipline

**2. OTIF (On-Time In-Full)**
The single metric that captures both planning effectiveness (right quantities) and execution capability (right timing). Low OTIF is lost revenue — retailers de-list poorly performing suppliers.
- Ask: "What is your OTIF to distributors? To modern trade? To e-commerce?"
- Benchmark: World-class >93%; India GT average 78–85%
- Red flag: Company tracks OTIF to distributor but not distributor-to-retailer = visibility gap

**3. On-Shelf Availability (OSA)**
Where SC performance becomes revenue performance. A product that isn't on the shelf isn't sold, regardless of how efficient the upstream SC is. OSA is where the consumer experiences your supply chain.
- Ask: "What is your OSA as measured by third-party audit or syndicated data?"
- Benchmark: World-class >95%; India GT average 80–87%
- Red flag: No OSA measurement = company is flying blind on retail execution

**4. Inventory Days**
The capital efficiency metric. High inventory days with low OSA is the worst combination — you have inventory, but not in the right place at the right time.
- Ask: "What are your inventory days by category and by stage (RM, WIP, FG, channel)?"
- Benchmark: World-class <40 days; India average 55–70 days
- Red flag: Inventory days rising while OSA declining = distribution/forecasting failure

**5. SC Cost as % of Revenue**
The efficiency metric. Compare across the cost components: transportation, warehousing, distribution (stockist margins), and planning/execution overhead.
- Ask: "What is your all-in supply chain cost as a percentage of revenue? How has it trended over 3 years?"
- Benchmark: World-class 7–9%; India average 12–15%
- Red flag: SC cost unknown at granular level = no cost discipline

**6. Perfect Order Rate**
The composite reliability metric. Combines OTIF + correct documentation + undamaged goods. A single number that captures total SC execution quality.
- Benchmark: World-class 93–97%; India average 82–90%

**7. Return Rate**
A lagging indicator of upstream problems (over-forecasting, product quality, damage in transit). Rising returns absorb significant operational cost.
- Benchmark: World-class <1%; India average 1.5–3%; alert level >5%

**8. Supplier OTIF**
The upstream dependency metric. A company's SC is only as reliable as its worst supplier. Supplier OTIF variability is the leading cause of production plan disruptions.
- Benchmark: World-class 88–95%; India significant variability

**9. Demand Forecast Bias**
Often overlooked in favor of accuracy alone. Systematically over-forecasting is as damaging as under-forecasting. Bias reveals whether the planning process has systematic errors.
- Ideal: Near-zero bias (slight positive bias acceptable); consistent negative bias = stockouts; consistent positive bias = excess inventory

### Using the Benchmark Conversation

The most effective diagnostic opening is not a questionnaire — it is a benchmark conversation. Present the industry ranges, ask where the client sits, and watch the reaction. If the client does not know where they sit on more than 3 of these 9 metrics, that is itself a finding: the company lacks the measurement infrastructure for SC performance management. If they know the numbers but they are all in the laggard range, that is a transformation conversation. If they are near world-class, the conversation pivots to the emerging threats (channel complexity, GenAI opportunity).

---

## Section 3: Problem Pattern Library

*Three production-ready problem patterns. Each is a SHEI card from File 04, summarized here for quick reference. Use full cards for BD and pitches.*

### Pattern 1: Demand Forecasting Collapse
**The problem in one sentence:** FMCG demand planning architectures built for general trade weekly cycles are structurally incompatible with quick-commerce's 4-hour fulfillment rhythms.
**Metric signature:** Forecast accuracy declining despite technology investment; aging inventory building in modern-channel-heavy categories.
**Who is affected:** Any India FMCG company where digital + modern trade channels exceed 10% of revenue.
**Consulting entry:** Demand Sensing Diagnostic → S&OP Redesign → Sensing Layer Implementation.
**Full SHEI card:** File 04, Card SHEI-2025-Q2-01

### Pattern 2: RTM Model Inflection
**The problem in one sentence:** The traditional India FMCG distributor/stockist model is economically non-viable for urban geographies as quick-commerce and D2C erode the high-value outlet base.
**Metric signature:** Flat or declining general trade revenue; distributor throughput declining; cost-per-outlet rising.
**Who is affected:** All India FMCG players with >30% urban revenue mix and traditional GT-heavy models.
**Consulting entry:** Coverage Model Diagnostic → RTM Architecture Design → Implementation.
**Full SHEI card:** File 04, Card SHEI-2025-Q2-03

### Pattern 3: SC Technology Debt
**The problem in one sentence:** Mid-tier Indian FMCG companies are running SC operations on fragmented ERP landscapes that prevent the data integration required for advanced planning, demand sensing, or GenAI deployment.
**Metric signature:** Multiple ERPs across geographies/divisions; manual S&OP processes; no integrated data lake; forecast and OTIF metrics managed in Excel.
**Who is affected:** Indian FMCG players below HUL/ITC scale; companies formed through acquisition with legacy IT landscapes.
**Consulting entry:** Technology Landscape Assessment → Data Architecture Design → ERP Harmonization Roadmap.
**Full SHEI card:** Linked to SHEI-2025-Q2-02 (IT playbook, File 06)

---

## Section 4: Technology Landscape (Starter)

*Expand this section quarterly as vendor intelligence accumulates.*

### Planning Technologies

**Demand Planning / S&OP:**
- **SAP IBP (Integrated Business Planning):** Most common in large FMCG; strong if you are already SAP-heavy. Implementation complexity high; requires significant master data quality. P&G, Unilever, HUL investing.
- **o9 Solutions:** Strong in FMCG; modern interface; better external signal integration than SAP IBP. Growing in India (Tata Consumer, some Unilever entities). Mid-to-large implementation.
- **Kinaxis RapidResponse:** Best-in-class for scenario planning and concurrent planning across long/short horizon. Stronger in complex global SC; less common in India FMCG as yet.
- **Blue Yonder (JDA):** Strong in demand and fulfillment; being acquired/integrated into Blue Yonder post-Panasonic ownership. Some India FMCG deployments.

**Assessment principle:** Technology selection should follow process design, not precede it. The most common failure mode is buying a world-class planning tool and running a 1990s S&OP process on top of it. Define the target operating model first.

### Distribution Technology (India-Specific)

**DMS (Distributor Management Systems):**
- **Beatroute:** Leading Indian DMS; strong in general trade; mobile-first; widely used in India FMCG mid-tier (Marico, Godrej CP among users). Good for companies transitioning to direct distributor engagement.
- **Bizom:** Strong DMS + trade promotion management; data analytics layer is a differentiator. Used by several India FMCG companies.
- **Shotgun:** Emerging player; strong mobile UX; suited for mid-size FMCG with 500–2,000 distributor networks.
- **SAP ERP/SD module:** Used by large companies for distributor management but not purpose-built for India GT nuances; typically supplemented by a mobile DMS.

**WMS (Warehouse Management Systems):**
- **SAP EWM:** Enterprise grade; complex implementation; suited for large centralized DCs.
- **Manhattan Associates:** Strong in FMCG; good for high-velocity ambient goods.
- **Infor WMS:** Mid-market option; faster implementation; common in Indian FMCG mid-tier.
- **Home-grown / local vendors:** Many India FMCG companies still running custom WMS; significant modernization opportunity.

---

## Section 5: GenAI Use Case Catalog (Starter)

*12 deployable use cases. Expand with client examples and implementation notes quarterly.*

### Tier A — High Value, Lower Implementation Complexity (Start Here)

| Use Case | What It Does | Data Required | Expected Outcome | Maturity Required |
|---|---|---|---|---|
| **Demand Signal Enrichment** | Integrates weather, events, social trends into forecast models | Historical sales + external API feeds | +8–12pp forecast accuracy | Medium — needs data lake |
| **Expiry & Aging Inventory Optimizer** | Flags at-risk inventory and recommends markdown/rerouting actions | Inventory age data + outlet velocity data | 30–50% reduction in write-offs | Low — can start with ERP data |
| **Route Optimization** | Dynamic daily route planning for field sales | Outlet locations + visit history + order patterns | 15–20% field productivity improvement | Low — mobile-ready |
| **WhatsApp/Voice Order Capture** | Distributors/retailers place orders via WhatsApp in regional languages | DMS integration | Reduces order errors 40–60%; improves small retailer coverage | Low — builds on existing DMS |

### Tier B — High Value, Medium Implementation Complexity

| Use Case | What It Does | Data Required | Expected Outcome | Maturity Required |
|---|---|---|---|---|
| **Trade Promotion Effectiveness Prediction** | Predicts volume lift before promotion launches; recommends optimal promo architecture | 3+ years of promo history + sell-in/sell-out data | 20–30% improvement in trade ROI | Medium — needs clean promo data |
| **Outlet Visit Prioritization** | Scores which outlets a sales rep should visit daily based on sales opportunity | Sales data + visit history + OSA data | 10–15% revenue uplift from same field force | Medium — needs DMS + analytics |
| **Automatic Replenishment Generation** | Generates distributor replenishment orders without manual intervention | Distributor POS + inventory feeds | 40–60% reduction in manual order processing; OTIF improvement | Medium — needs DMS integration |
| **Supplier Risk Monitoring** | Monitors supplier news, financial signals for early disruption warning | Supplier database + news API | Earlier procurement response; reduced production disruptions | Medium |

### Tier C — High Value, Higher Complexity (Build Toward)

| Use Case | What It Does | Data Required | Expected Outcome | Maturity Required |
|---|---|---|---|---|
| **S&OP Copilot** | AI assistant for S&OP meetings: auto-prepares numbers, flags exceptions, drafts consensus plan | All planning system data | 50–60% reduction in S&OP prep time | High — needs integrated planning data |
| **On-Shelf Availability Monitoring** | Computer vision analysis of store images to detect stockouts and shelf compliance | Store image data (rep photos or camera feeds) | 5–8pp OSA improvement | High — needs image capture infrastructure |
| **Demand-Driven Production Scheduling** | Auto-schedules production based on real-time demand signals | Demand plan + production capacity + inventory | 10–15% OEE improvement; reduced batch size waste | High |
| **Cold Chain Compliance Monitor** | IoT + AI detects cold chain deviations and predicts product at risk | IoT temperature sensors + product specs | 30–50% reduction in cold chain losses | High — needs IoT infrastructure |

---

## Maintenance Notes

**Sections to expand next quarter:**
- Section 4: Add case examples from Tier 1 company technology disclosures
- Section 5: Add 4 new use cases from Sales & Distribution and Category Management

**Data gaps:**
- Supplier OTIF benchmarks for India (no public data — needs primary research)
- DMS vendor market share data in India (no public data)
- Cold chain infrastructure investment data by company

**Companies to watch for this playbook:**
P&G (Section 4 and 5 updates), HUL (RTM and GenAI progress), Marico (DMS deployment progress), Tata Consumer Products (o9 deployment learnings)
