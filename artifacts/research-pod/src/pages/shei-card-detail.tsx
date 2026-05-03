import { useRoute, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useListBenchmarks } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft, TrendingUp, Clock, DollarSign, Building2, MessageSquare,
  HelpCircle, Calendar, AlertTriangle, BarChart2, Layers, GitBranch, Bot, ChevronRight,
} from "lucide-react";

const functionLabels: Record<string, string> = {
  SUPPLY_CHAIN: "Supply Chain",
  PROCUREMENT: "Procurement",
  DISTRIBUTION_GTM: "Distribution & GTM",
  IT_TECHNOLOGY: "Technology",
  SALES_DISTRIBUTION: "Sales & Distribution",
  FINANCIAL: "Financial",
  ESG: "ESG",
  MANUFACTURING: "Manufacturing",
};

const FRAMEWORK = [
  { key: "signal", label: "S", title: "Signal", color: "text-blue-400", border: "border-l-blue-500", bg: "bg-blue-500/5" },
  { key: "hypothesis", label: "H", title: "Hypothesis", color: "text-amber-400", border: "border-l-amber-500", bg: "bg-amber-500/5" },
  { key: "evidence", label: "E", title: "Evidence", color: "text-emerald-400", border: "border-l-emerald-500", bg: "bg-emerald-500/5" },
  { key: "clientImplication", label: "I", title: "Implication", color: "text-primary", border: "border-l-primary", bg: "bg-primary/5" },
] as const;

export default function SheiCardDetail() {
  const [, params] = useRoute("/shei-cards/:id");
  const idParam = params?.id ?? "";
  const [, navigate] = useLocation();

  const { data: card, isLoading } = useQuery({
    queryKey: ["shei-card", idParam],
    queryFn: async () => {
      if (!idParam) return null;
      const res = await fetch(`/api/shei-cards/${encodeURIComponent(idParam)}`);
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!idParam,
  });

  const { data: allBenchmarks } = useListBenchmarks();

  const relatedCompanies = card?.relatedCompanies?.split(",").map((c: string) => c.trim()).filter(Boolean) ?? [];
  const kpiLinks = card?.kpiLinkage?.split(";").map((k: string) => k.trim()).filter(Boolean) ?? [];
  const signalItems = card?.signalCluster?.split(";").map((s: string) => s.trim()).filter(Boolean) ?? [];

  const linkedBenchmarks = (allBenchmarks ?? []).filter((b) =>
    kpiLinks.some((kpi) =>
      b.kpiName?.toLowerCase().includes(kpi.toLowerCase().split(":")[0].trim().toLowerCase()) ||
      kpi.toLowerCase().includes(b.kpiName?.toLowerCase() ?? "")
    )
  ).slice(0, 4);

  function handleAskAI() {
    if (!card) return;
    const prompt = `Deep-dive analysis of SHEI hypothesis: "${card.title}"

SHEI Framework:
- Signal (S): ${card.signal ?? "N/A"}
- Hypothesis (H): ${card.hypothesis ?? "N/A"}
- Evidence (E): ${card.evidence ?? "N/A"}
- Implication (I): ${card.clientImplication ?? "N/A"}

Financial Impact: ${card.financialImpact ?? "N/A"}
Why Now: ${card.whyNow ?? "N/A"}
Thoucentric Angle: ${card.thoucentriqAngle ?? "N/A"}
Contradictions: ${card.contradictions ?? "None noted"}

Please address:
1. How strong is the evidence base for this hypothesis?
2. Which companies are most exposed and why?
3. What are the 3 most compelling entry points for Thoucentric?
4. How should we handle the contradictions noted above?
5. How do we position this in a CXO conversation?`;

    sessionStorage.setItem("rp_ask_prefill", prompt);
    navigate("/ask");
  }

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    );

  if (!card)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">SHEI card not found</p>
        <Link href="/shei-cards" className="text-primary text-sm mt-2 hover:underline">
          ← Back to SHEI Cards
        </Link>
      </div>
    );

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      <Link href="/shei-cards">
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> SHEI Cards
        </button>
      </Link>

      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs font-mono text-muted-foreground">{card.cardId}</span>
              <Badge variant="outline" className="text-xs">
                {functionLabels[card.functionTag] || card.functionTag}
              </Badge>
              <Badge variant="outline" className="text-xs">{card.geographyTag}</Badge>
              {card.status && <Badge variant="outline" className="text-xs">{card.status}</Badge>}
              {card.urgency && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    card.urgency === "IMMEDIATE"
                      ? "text-red-400 border-red-500/30"
                      : card.urgency === "MEDIUM_TERM"
                      ? "text-amber-400 border-amber-500/30"
                      : ""
                  }`}
                >
                  {card.urgency?.replace(/_/g, " ")}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold font-mono tracking-tight leading-snug">{card.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              {card.version && <span>v{card.version}</span>}
              {card.nextReview && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Next review: {card.nextReview}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleAskAI}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/20 transition-all shrink-0"
          >
            <Bot className="h-3.5 w-3.5" /> Analyze with AI
          </button>
        </div>
      </div>

      {/* Financial Impact + Why Now */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {card.financialImpact && (
          <Card className="bg-emerald-500/5 border-emerald-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-emerald-400">
                <DollarSign className="h-4 w-4" /> Financial Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{card.financialImpact}</p>
            </CardContent>
          </Card>
        )}
        {card.whyNow && (
          <Card className="bg-amber-500/5 border-amber-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
                <Clock className="h-4 w-4" /> Why Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{card.whyNow}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Trajectory Context */}
      {card.trajectoryContext && (
        <Card className="bg-sky-500/5 border-sky-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-sky-400">
              <GitBranch className="h-4 w-4" /> Trajectory · Past → Current → Direction → Inflection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{card.trajectoryContext}</p>
          </CardContent>
        </Card>
      )}

      {/* SHEI Framework */}
      <div className="space-y-4">
        {FRAMEWORK.map(({ key, label, title, color, border, bg }) => {
          const value = (card as Record<string, unknown>)[key];
          return (
            <Card key={key} className={`border border-border border-l-4 ${border} ${bg}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className={`font-mono font-bold text-lg ${color}`}>{label}</span>
                  <span className="text-muted-foreground text-xs">— {title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{String(value ?? "—")}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contradictions */}
      {card.contradictions && (
        <Card className="bg-red-500/5 border-red-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-red-400">
              <AlertTriangle className="h-4 w-4" /> Contradictions & Data Mismatches
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{card.contradictions}</p>
          </CardContent>
        </Card>
      )}

      {/* KPI Linkage — cross-module links to Benchmarks */}
      {kpiLinks.length > 0 && (
        <Card className="bg-violet-500/5 border-violet-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-violet-400">
              <BarChart2 className="h-4 w-4" /> KPI Linkage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {kpiLinks.map((k, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-violet-400 shrink-0 font-mono">•</span>
                  <span className="leading-snug flex-1">{k}</span>
                </div>
              ))}
            </div>
            {linkedBenchmarks.length > 0 && (
              <div className="mt-3 pt-3 border-t border-violet-500/20">
                <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <ChevronRight className="h-3 w-3" /> Matched benchmarks:
                </div>
                <div className="flex flex-wrap gap-2">
                  {linkedBenchmarks.map((b) => (
                    <Link key={b.id} href="/benchmarks">
                      <Badge
                        variant="outline"
                        className="text-xs cursor-pointer hover:border-violet-400 hover:text-violet-400 transition-colors"
                      >
                        {b.kpiName}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Signal Cluster */}
      {signalItems.length > 0 && (
        <Card className="bg-muted/20 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
              <Layers className="h-4 w-4" /> Signal Cluster
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {signalItems.map((s, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Consulting/Sales Panels */}
      <div className="space-y-4">
        {card.thoucentriqAngle && (
          <Card className="bg-primary/5 border-primary/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-primary">
                <TrendingUp className="h-4 w-4" /> Thoucentric Consulting Angle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{card.thoucentriqAngle}</p>
            </CardContent>
          </Card>
        )}

        {card.pitchAnchor && (
          <Card className="bg-muted/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <MessageSquare className="h-4 w-4" /> Pitch Anchor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-sm italic leading-relaxed text-muted-foreground border-l-2 border-primary pl-3">
                "{card.pitchAnchor}"
              </blockquote>
            </CardContent>
          </Card>
        )}

        {card.provocQuestion && (
          <Card className="bg-muted/30 border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
                <HelpCircle className="h-4 w-4" /> Provocative Question
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium leading-relaxed">{card.provocQuestion}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Related Companies — clickable links */}
      {relatedCompanies.length > 0 && (
        <div>
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
            <Building2 className="h-3.5 w-3.5" /> Related Companies
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedCompanies.map((c: string) => (
              <Link key={c} href={`/companies/${c}`}>
                <Badge
                  variant="outline"
                  className="text-xs cursor-pointer hover:border-primary hover:text-primary transition-colors"
                >
                  {c}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
