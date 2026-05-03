import { Link } from "wouter";
import { useListSheiCards, useListSignals, useListBenchmarks } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Zap, TrendingUp, MessageSquare, HelpCircle, DollarSign, Target, ArrowRight, AlertCircle, BarChart2 } from "lucide-react";

const THOUCENTRIC_CAPABILITIES = [
  "Supply Chain Transformation",
  "Demand Forecasting & S&OP",
  "Sales & Distribution Optimization",
  "Finance Transformation",
  "Digital & AI Transformation",
  "Procurement Transformation",
  "Manufacturing Excellence",
];

const urgencyRank: Record<string, number> = {
  IMMEDIATE: 0,
  MEDIUM_TERM: 1,
  STRUCTURAL: 2,
};

const urgencyColor: Record<string, string> = {
  IMMEDIATE: "bg-red-500/20 text-red-400 border-red-500/30",
  MEDIUM_TERM: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  STRUCTURAL: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const functionMap: Record<string, string> = {
  SUPPLY_CHAIN: "Supply Chain Transformation",
  PROCUREMENT: "Procurement Transformation",
  IT_TECHNOLOGY: "Digital & AI Transformation",
  SALES_DISTRIBUTION: "Sales & Distribution Optimization",
  FINANCIAL: "Finance Transformation",
};

export default function Actions() {
  const { data: sheiCards, isLoading: sheiLoading } = useListSheiCards();
  const { data: signals, isLoading: signalsLoading } = useListSignals();
  const { data: benchmarks } = useListBenchmarks();

  const isLoading = sheiLoading || signalsLoading;

  const sortedCards = [...(sheiCards ?? [])].sort(
    (a, b) => (urgencyRank[a.urgency ?? ""] ?? 99) - (urgencyRank[b.urgency ?? ""] ?? 99)
  );

  const highSignals = (signals ?? []).filter((s) => s.strength === "HIGH" && (s.action === "ACT_NOW" || s.action === "INVESTIGATE"));

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">Actions & Activation</h1>
        <p className="text-muted-foreground mt-1">
          Consulting opportunity dashboard · CXO pitch starters · Prioritised by urgency
        </p>
      </div>

      {/* Thoucentric Capability Alignment */}
      <div>
        <h2 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
          <Target className="h-3.5 w-3.5" /> Thoucentric Service Alignment
        </h2>
        <div className="flex flex-wrap gap-2">
          {THOUCENTRIC_CAPABILITIES.map((cap) => (
            <Badge key={cap} variant="outline" className="bg-primary/10 text-primary border-primary/30 text-xs">
              {cap}
            </Badge>
          ))}
        </div>
      </div>

      {/* Priority Consulting Opportunities */}
      <div>
        <h2 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-amber-400" /> Priority Consulting Opportunities
        </h2>
        {isLoading ? (
          <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-64 rounded-xl" />)}</div>
        ) : (
          <div className="space-y-5">
            {sortedCards.map((card, idx) => (
              <Card key={card.id} className="border border-border hover:border-primary/50 transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-mono font-bold text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Badge variant="outline" className={`text-xs ${urgencyColor[card.urgency ?? ""]}`}>
                          {card.urgency?.replace(/_/g, " ")}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {functionMap[card.functionTag] || card.functionTag}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                        {card.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Financial Impact */}
                  {card.financialImpact && (
                    <div className="flex items-start gap-2.5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                      <DollarSign className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-emerald-400 mb-1">Financial Opportunity</div>
                        <p className="text-sm text-emerald-300 leading-snug">{card.financialImpact}</p>
                      </div>
                    </div>
                  )}

                  {/* Thoucentric Angle */}
                  {card.thoucentriqAngle && (
                    <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-semibold text-primary mb-1">Engagement Hypothesis</div>
                        <p className="text-sm leading-snug">{card.thoucentriqAngle}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Pitch Anchor */}
                    {card.pitchAnchor && (
                      <div className="bg-muted/20 border border-border rounded-lg p-3">
                        <div className="text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" /> Pitch Anchor
                        </div>
                        <blockquote className="text-xs italic leading-relaxed text-muted-foreground border-l-2 border-primary pl-2">
                          "{card.pitchAnchor}"
                        </blockquote>
                      </div>
                    )}

                    {/* Provoking Question */}
                    {card.provocQuestion && (
                      <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-3">
                        <div className="text-xs font-semibold text-amber-400 mb-1.5 flex items-center gap-1">
                          <HelpCircle className="h-3 w-3" /> CXO Provocation
                        </div>
                        <p className="text-xs font-medium leading-relaxed">{card.provocQuestion}</p>
                      </div>
                    )}
                  </div>

                  {/* Related Companies */}
                  {card.relatedCompanies && (
                    <div className="flex items-center gap-2 pt-1 border-t border-border">
                      <span className="text-xs text-muted-foreground">Target accounts:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {card.relatedCompanies.split(",").map((c) => (
                          <Badge key={c.trim()} variant="outline" className="text-xs">{c.trim()}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <Link href={`/shei-cards/${card.cardId}`}>
                    <div className="flex items-center gap-1.5 text-xs text-primary hover:underline cursor-pointer">
                      Full SHEI analysis <ArrowRight className="h-3 w-3" />
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Emerging SHEI Candidates from Signals */}
      {highSignals.length > 0 && (
        <div>
          <h2 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-red-400" /> Emerging Opportunities (Signal → SHEI Candidates)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highSignals.map((signal) => (
              <Card key={signal.id} className="border border-border bg-red-500/5 border-red-500/20">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">HIGH</Badge>
                    <Badge variant="outline" className="text-xs">{signal.category?.replace(/_/g, " ")}</Badge>
                    <span className="text-xs text-muted-foreground ml-auto">{signal.companyName}</span>
                  </div>
                  <p className="text-sm leading-snug line-clamp-3">{signal.summary}</p>
                  {signal.financialImpact && (
                    <p className="text-xs text-emerald-400 leading-snug">{signal.financialImpact?.slice(0, 120)}...</p>
                  )}
                  <div className="text-xs text-amber-400">⚡ SHEI hypothesis candidate — convert to engagement</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* KPI Gap Opportunities */}
      <div>
        <h2 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <BarChart2 className="h-3.5 w-3.5 text-blue-400" /> KPI Gap → Entry Points
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(benchmarks ?? []).map((b) => (
            <Card key={b.id} className="border border-border hover:border-primary/40 transition-all cursor-pointer group">
              <CardContent className="pt-4 space-y-2">
                <div className="text-xs font-mono text-muted-foreground">{b.functionTag?.replace(/_/g, " ")}</div>
                <div className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors">{b.kpiName}</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-emerald-400 font-mono">↑ {b.bestInClass}</span>
                  <span className="text-xs text-muted-foreground">vs</span>
                  <span className="text-xs text-red-400 font-mono">↓ {b.laggard}</span>
                </div>
                {b.consultingAngle && (
                  <p className="text-xs text-muted-foreground line-clamp-2">{b.consultingAngle}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <Link href="/benchmarks">
          <div className="mt-3 text-xs text-primary hover:underline cursor-pointer flex items-center gap-1">
            Full benchmark detail view <ArrowRight className="h-3 w-3" />
          </div>
        </Link>
      </div>
    </div>
  );
}
