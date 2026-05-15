import { useState, useRef } from "react";
import { useListCompanies, useListSheiCards, useListSignals } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, Building2, Bot, Loader2, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";

const FOCUS_AREAS = [
  { value: "full", label: "Full Pre-Read" },
  { value: "supply_chain", label: "Supply Chain" },
  { value: "procurement", label: "Procurement" },
  { value: "digital", label: "Digital & Technology" },
  { value: "distribution", label: "Distribution & GTM" },
  { value: "financial", label: "Financial Transformation" },
];

export default function MeetingPrep() {
  const [company, setCompany] = useState<string>("");
  const [role, setRole] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [focusArea, setFocusArea] = useState("full");
  const [brief, setBrief] = useState("");
  const [generating, setGenerating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const { data: companiesData } = useListCompanies();
  const { data: sheiCardsData } = useListSheiCards();
  const { data: signalsData } = useListSignals();

  const companies = Array.isArray(companiesData) ? companiesData : [];
  const sheiCards = Array.isArray(sheiCardsData) ? sheiCardsData : [];
  const signals = Array.isArray(signalsData) ? signalsData : [];

  const selectedCompany = companies.find((c) => c.name === company);

  const linkedShei = sheiCards.filter(
    (s) =>
      selectedCompany &&
      s.relatedCompanies?.toLowerCase()?.includes(selectedCompany.name.toLowerCase())
  );

  const linkedSignals = signals.filter(
    (s) =>
      selectedCompany &&
      (s.companyName?.toLowerCase()?.includes(selectedCompany.name.toLowerCase()) ||
        s.companyName === "All FMCG")
  );

  async function generateBrief() {
    if (!selectedCompany) return;
    setBrief("");
    setGenerating(true);

    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const focusLabel = FOCUS_AREAS.find((f) => f.value === focusArea)?.label ?? "Full Pre-Read";
    const roleStr = role.trim() ? role.trim() : "Senior Executive";
    const dateStr = meetingDate
      ? ` on ${new Date(meetingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`
      : "";
    const focusStr =
      focusArea !== "full" ? ` Focus this brief on the ${focusLabel} domain.` : "";

    const companyContext = [
      `Full name: ${selectedCompany.fullName}`,
      `Geography: ${selectedCompany.geography} | Tier: ${selectedCompany.tier}`,
      selectedCompany.revenue ? `Revenue: ${selectedCompany.revenue}` : null,
      selectedCompany.revenueGrowth ? `Revenue Growth: ${selectedCompany.revenueGrowth}` : null,
      selectedCompany.ebitdaMargin ? `EBITDA Margin: ${selectedCompany.ebitdaMargin}` : null,
      selectedCompany.strategicPriorities
        ? `Strategic Priorities: ${selectedCompany.strategicPriorities}`
        : null,
      selectedCompany.scIntelligence ? `SC Intelligence: ${selectedCompany.scIntelligence}` : null,
      selectedCompany.techIntelligence
        ? `Tech Intelligence: ${selectedCompany.techIntelligence}`
        : null,
      selectedCompany.openProblems
        ? `Open Problems / Consulting Entry: ${selectedCompany.openProblems}`
        : null,
    ]
      .filter(Boolean)
      .join("\n");

    const sheiContext =
      linkedShei.length > 0
        ? linkedShei
            .map(
              (s) =>
                `- [${s.urgency}] ${s.title}\n  Hypothesis: ${s.hypothesis ?? "N/A"}\n  Financial Impact: ${s.financialImpact ?? "N/A"}\n  Thoucentric Angle: ${s.thoucentriqAngle ?? "N/A"}`
            )
            .join("\n")
        : "No active SHEI hypotheses tracked for this company.";

    const signalContext =
      linkedSignals.length > 0
        ? linkedSignals
            .slice(0, 8)
            .map((s) => `- [${s.strength}/${s.category?.replace(/_/g, " ")}] ${s.summary}`)
            .join("\n")
        : "No company-specific signals tracked.";

    const prompt = `I am a Thoucentric consultant preparing to meet ${selectedCompany.fullName}'s ${roleStr}${dateStr}.${focusStr}

COMPANY INTELLIGENCE:
${companyContext}

ACTIVE SHEI HYPOTHESES (${linkedShei.length} tracked):
${sheiContext}

RECENT SIGNALS (${linkedSignals.length} tracked):
${signalContext}

Generate a structured, consulting-grade pre-meeting brief with these exact sections:

**1. COMPANY SNAPSHOT**
Current state, key financial metrics, recent strategic narrative — 3-4 concise sentences.

**2. TOP 3 THEMES FOR THIS MEETING**
The most pressing issues to probe with ${roleStr}, grounded in the intelligence above.

**3. SHEI INTELLIGENCE BRIEF**
Active hypotheses relevant to ${roleStr}'s domain — with supporting evidence and financial stakes.

**4. BENCHMARK GAPS**
Where this company is likely lagging industry peers — reference specific KPIs and estimated gap size.

**5. THOUCENTRIC ENTRY POINTS**
2-3 specific consulting opportunities with a brief SOW framing and estimated engagement size.

**6. CXO QUESTIONS**
3 sharp, evidence-backed questions designed to surface pain and create urgency with ${roleStr}.

**7. WATCH-OUTS**
Key sensitivities, competitive risks, or things to avoid in this conversation.

Be specific, concise, and use the intelligence data above. Avoid generic statements. Make it ready to use in 15 minutes.`;

    try {
      const resp = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ messages: [{ role: "user", content: prompt }] }),
      });

      if (!resp.ok || !resp.body) throw new Error("Failed to generate brief");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;
            try {
              const json = JSON.parse(data);
              const token = json.content ?? "";
              if (token) setBrief((prev) => prev + token);
            } catch {}
          }
        }
      }
    } catch (e: unknown) {
      if ((e as Error).name !== "AbortError") {
        setBrief("Failed to generate brief. Please check your connection and try again.");
      }
    } finally {
      setGenerating(false);
    }
  }

  function handleReset() {
    abortRef.current?.abort();
    setGenerating(false);
    setBrief("");
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">Meeting Prep</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered pre-meeting brief synthesised from company intelligence, SHEI hypotheses &amp;
          live signals
        </p>
      </div>

      {/* Config Card */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <CalendarCheck className="h-3.5 w-3.5 text-primary" /> Meeting Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Company *</label>
              <Select value={company} onValueChange={setCompany}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue placeholder="Select company..." />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  {companies.map((c) => (
                    <SelectItem key={c.name} value={c.name}>
                      {c.name} — {c.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Executive Role</label>
              <Input
                placeholder="e.g. CSCO, CPO, VP Supply Chain..."
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Meeting Date</label>
              <Input
                type="date"
                value={meetingDate}
                onChange={(e) => setMeetingDate(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-medium">Focus Area</label>
              <Select value={focusArea} onValueChange={setFocusArea}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FOCUS_AREAS.map((f) => (
                    <SelectItem key={f.value} value={f.value}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Context preview */}
          {selectedCompany && (
            <div className="bg-muted/20 border border-border rounded-lg p-3 flex items-start gap-3">
              <Building2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div className="text-xs space-y-0.5">
                <div className="font-semibold text-foreground">{selectedCompany.fullName}</div>
                <div className="text-muted-foreground">
                  Tier {selectedCompany.tier} · {selectedCompany.geography}
                  {selectedCompany.revenue ? ` · ${selectedCompany.revenue}` : ""}
                  {selectedCompany.ebitdaMargin ? ` · EBITDA ${selectedCompany.ebitdaMargin}` : ""}
                </div>
                <div className="flex gap-4 mt-1.5">
                  <span className="text-primary font-medium">
                    {linkedShei.length} SHEI hypotheses
                  </span>
                  <span className="text-amber-400 font-medium">
                    {linkedSignals.length} signals tracked
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={generateBrief}
              disabled={!company || generating}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Generating brief...
                </>
              ) : (
                <>
                  <Bot className="h-4 w-4" /> Generate Pre-Meeting Brief
                </>
              )}
            </button>
            {(brief || generating) && (
              <button
                onClick={handleReset}
                className="px-3 py-2.5 rounded-lg bg-muted text-muted-foreground hover:text-foreground border border-border text-sm transition-all"
                title="Clear and reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generated Brief */}
      {(brief || generating) && (
        <Card className="bg-card border-primary/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="text-sm font-mono font-semibold text-primary uppercase tracking-widest flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5" /> Pre-Meeting Brief
                {selectedCompany && (
                  <span className="text-muted-foreground font-normal normal-case ml-1">
                    — {selectedCompany.name}
                    {role ? ` · ${role}` : ""}
                    {meetingDate
                      ? ` · ${new Date(meetingDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}`
                      : ""}
                  </span>
                )}
              </CardTitle>
              {generating && (
                <Badge
                  variant="outline"
                  className="text-xs animate-pulse bg-primary/10 text-primary border-primary/30"
                >
                  Generating...
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {brief ? (
              <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed">
                <ReactMarkdown>{brief}</ReactMarkdown>
              </div>
            ) : (
              <div className="space-y-2 py-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton
                    key={i}
                    className="h-4 rounded"
                    style={{ width: `${90 - i * 7}%` }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
