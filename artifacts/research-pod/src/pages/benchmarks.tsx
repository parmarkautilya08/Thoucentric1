import { useState } from "react";
import { useListBenchmarks } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { BarChart2, TrendingUp, TrendingDown, Minus, ChevronRight, X, Building2, Lightbulb, Target, AlertCircle, ArrowRight, Bot } from "lucide-react";
import { Link, useLocation } from "wouter";

const FUNCTION_LABELS: Record<string, string> = {
  SUPPLY_CHAIN_PLANNING: "Supply Chain Planning",
  PROCUREMENT: "Procurement",
  DISTRIBUTION_GTM: "Distribution & GTM",
  MANUFACTURING: "Manufacturing",
  FINANCIAL: "Financial",
  SUSTAINABILITY: "Sustainability",
};

const trendIcon = (t?: string | null) => {
  if (t === "IMPROVING") return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (t === "DECLINING") return <TrendingDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const functionColor: Record<string, string> = {
  SUPPLY_CHAIN_PLANNING: "border-l-blue-500",
  PROCUREMENT: "border-l-amber-500",
  DISTRIBUTION_GTM: "border-l-emerald-500",
  MANUFACTURING: "border-l-purple-500",
  FINANCIAL: "border-l-cyan-500",
  SUSTAINABILITY: "border-l-lime-500",
};

function BenchmarkDrillDown({ benchmark, onClose }: { benchmark: any; onClose: () => void }) {
  const [, navigate] = useLocation();
  if (!benchmark) return null;

  const companyLines = benchmark.companyExamples?.split("\n").filter(Boolean) ?? [];

  function handleAskAI() {
    const prompt = `Deep-dive analysis of FMCG benchmark KPI: ${benchmark.kpiName}

Definition: ${benchmark.definition ?? "N/A"}
Function: ${benchmark.functionTag?.replace(/_/g, " ")}

Performance Tiers:
- Best-in-Class: ${benchmark.bestInClass} ${benchmark.unit ?? ""}
- Industry Median: ${benchmark.industryMedian} ${benchmark.unit ?? ""}
- Laggard: ${benchmark.laggard} ${benchmark.unit ?? ""}
Source Period: ${benchmark.sourcePeriod ?? "N/A"}

India Context: ${benchmark.indiaContext ?? "N/A"}
Why It Matters: ${benchmark.whyItMatters ?? "N/A"}
Consulting Angle: ${benchmark.consultingAngle ?? "N/A"}
Improvement Levers: ${benchmark.improvementLevers ?? "N/A"}

Company Examples:
${benchmark.companyExamples ?? "N/A"}

Please:
1. Which India FMCG companies are most exposed to this performance gap?
2. What is the consulting opportunity size for Thoucentric in this space?
3. What are the most effective improvement levers ranked by ROI?
4. How does this KPI connect to financial outcomes (revenue, EBITDA, working capital)?
5. Write a one-paragraph pitch to a CSCO about this benchmark gap.`;

    sessionStorage.setItem("rp_ask_prefill", prompt);
    navigate("/ask");
  }

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border">
      <DialogHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <Badge variant="outline" className="text-xs mb-2">
              {FUNCTION_LABELS[benchmark.functionTag] || benchmark.functionTag}
            </Badge>
            <DialogTitle className="text-xl font-bold font-mono leading-tight">
              {benchmark.kpiName}
            </DialogTitle>
            {benchmark.sourcePeriod && (
              <DialogDescription className="mt-1 text-muted-foreground text-xs">
                Source Period: {benchmark.sourcePeriod}
              </DialogDescription>
            )}
          </div>
        </div>
      </DialogHeader>

      <div className="space-y-5 mt-2">
        {/* Definition */}
        <div className="bg-muted/20 rounded-lg p-4 border border-border">
          <p className="text-sm leading-relaxed text-muted-foreground">{benchmark.definition}</p>
        </div>

        {/* Performance Tiers */}
        <div>
          <h4 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wide mb-3">Performance Tiers</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3 text-center">
              <div className="text-xs text-emerald-400 mb-1 font-medium">Best-in-Class</div>
              <div className="text-lg font-bold font-mono text-emerald-400">{benchmark.bestInClass}</div>
              {benchmark.unit && <div className="text-xs text-muted-foreground">{benchmark.unit}</div>}
            </div>
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-3 text-center">
              <div className="text-xs text-primary mb-1 font-medium">Industry Median</div>
              <div className="text-lg font-bold font-mono text-primary">{benchmark.industryMedian}</div>
              {benchmark.unit && <div className="text-xs text-muted-foreground">{benchmark.unit}</div>}
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
              <div className="text-xs text-red-400 mb-1 font-medium">Laggard</div>
              <div className="text-lg font-bold font-mono text-red-400">{benchmark.laggard}</div>
              {benchmark.unit && <div className="text-xs text-muted-foreground">{benchmark.unit}</div>}
            </div>
          </div>
        </div>

        {/* Company Examples */}
        {companyLines.length > 0 && (
          <div>
            <h4 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Company Benchmarks
            </h4>
            <div className="space-y-1.5">
              {companyLines.map((line: string, i: number) => (
                <div key={i} className="text-sm bg-muted/20 rounded px-3 py-2 border border-border/50 flex items-start gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm leading-snug">{line}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* India Context */}
        {benchmark.indiaContext && (
          <div>
            <h4 className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Target className="h-3.5 w-3.5" /> India Context
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
              {benchmark.indiaContext}
            </p>
          </div>
        )}

        {/* Why It Matters */}
        {benchmark.whyItMatters && (
          <div>
            <h4 className="text-xs font-mono font-semibold text-primary uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5" /> Why It Matters
            </h4>
            <p className="text-sm leading-relaxed bg-primary/5 border border-primary/20 rounded-lg p-3">
              {benchmark.whyItMatters}
            </p>
          </div>
        )}

        {/* Consulting Angle */}
        {benchmark.consultingAngle && (
          <div>
            <h4 className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> Consulting Entry Point
            </h4>
            <p className="text-sm leading-relaxed bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
              {benchmark.consultingAngle}
            </p>
          </div>
        )}

        {/* Improvement Levers */}
        {benchmark.improvementLevers && (
          <div>
            <h4 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <ArrowRight className="h-3.5 w-3.5" /> Improvement Levers
            </h4>
            <div className="flex flex-wrap gap-2">
              {benchmark.improvementLevers.split(";").map((lever: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs bg-muted/30">{lever.trim()}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Ask AI button */}
        <div className="border-t border-border pt-3">
          <button
            onClick={handleAskAI}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 text-xs font-medium hover:bg-primary/20 transition-all"
          >
            <Bot className="h-3.5 w-3.5" /> Analyze This KPI with AI
          </button>
        </div>

        {/* SHEI Link */}
        {benchmark.sheiAnnotation && (
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <AlertCircle className="h-3 w-3 text-amber-400" />
              Linked SHEI hypothesis:{" "}
              <Link href={`/shei-cards/${benchmark.sheiAnnotation}`}>
                <span className="font-mono text-primary hover:underline cursor-pointer">
                  {benchmark.sheiAnnotation}
                </span>
              </Link>
            </p>
          </div>
        )}
      </div>
    </DialogContent>
  );
}

export default function Benchmarks() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<any>(null);
  const { data: benchmarks, isLoading } = useListBenchmarks();

  const categories = [...new Set((benchmarks ?? []).map((b) => b.functionTag).filter(Boolean))];

  const filtered = (benchmarks ?? []).filter((b) =>
    categoryFilter === "all" || b.functionTag === categoryFilter
  );

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, b) => {
    const key = b.functionTag || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">KPI Benchmarks</h1>
        <p className="text-muted-foreground mt-1">
          FMCG supply chain & procurement benchmarks · {filtered.length} KPIs · Click any card for drill-down
        </p>
      </div>

      <div className="flex gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-56 bg-card border-border">
            <SelectValue placeholder="Function" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Functions</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c!}>{FUNCTION_LABELS[c!] || c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className={`text-sm font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2`}>
                <BarChart2 className="h-3.5 w-3.5" /> {FUNCTION_LABELS[category] || category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {items.map((b) => (
                  <Card
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className={`bg-card border border-border border-l-4 ${functionColor[b.functionTag] || "border-l-border"} hover:border-border/80 hover:shadow-md cursor-pointer transition-all group`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-medium leading-tight group-hover:text-primary transition-colors">
                          {b.kpiName}
                        </CardTitle>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                      </div>
                      {b.unit && <p className="text-xs text-muted-foreground">Unit: {b.unit}</p>}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-emerald-500/10 rounded p-2">
                          <div className="text-xs text-muted-foreground mb-0.5">Best</div>
                          <div className="text-sm font-bold font-mono text-emerald-400 leading-tight">{b.bestInClass}</div>
                        </div>
                        <div className="bg-primary/10 rounded p-2 ring-1 ring-primary/30">
                          <div className="text-xs text-muted-foreground mb-0.5">Median</div>
                          <div className="text-sm font-bold font-mono text-primary leading-tight">{b.industryMedian}</div>
                        </div>
                        <div className="bg-red-500/10 rounded p-2">
                          <div className="text-xs text-muted-foreground mb-0.5">Laggard</div>
                          <div className="text-sm font-bold font-mono text-red-400 leading-tight">{b.laggard}</div>
                        </div>
                      </div>
                      {b.definition && (
                        <p className="text-xs text-muted-foreground line-clamp-2 border-t border-border pt-2">
                          {b.definition}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{b.sourcePeriod}</span>
                        <span className="text-xs text-primary font-medium flex items-center gap-1">
                          View details <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BarChart2 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">No benchmarks found</p>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <BenchmarkDrillDown benchmark={selected} onClose={() => setSelected(null)} />
      </Dialog>
    </div>
  );
}
