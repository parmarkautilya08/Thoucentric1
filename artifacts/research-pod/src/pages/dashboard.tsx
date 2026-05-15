import { useGetDashboardSummary, useListSignals, useListSheiCards } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2, Layers, Activity, BarChart2, BookOpen, ChevronRight,
  TrendingUp, AlertTriangle, Presentation, Target, Zap
} from "lucide-react";
import { Link } from "wouter";
import { usePresentationStore } from "@/lib/presentation-store";

const urgencyColor = (u?: string) => {
  if (u === "IMMEDIATE") return "bg-red-500/20 text-red-400 border-red-500/30";
  if (u === "MEDIUM_TERM") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
};

const strengthColor = (s?: string) => {
  if (s === "HIGH") return "bg-red-500/20 text-red-400 border-red-500/30";
  if (s === "MEDIUM") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
};

export default function Dashboard() {
  const isExecutive = usePresentationStore(s => s.isExecutiveView);
  const { data: summary, isLoading } = useGetDashboardSummary();
  const { data: signalsData } = useListSignals();
  const { data: sheiCardsData } = useListSheiCards();

  const signals = Array.isArray(signalsData) ? signalsData : [];
  const sheiCards = Array.isArray(sheiCardsData) ? sheiCardsData : [];

  const recentSignals = signals.slice(0, 8);
  const urgentCards = sheiCards.filter((c) => c.urgency === "IMMEDIATE" || c.status === "ACTIVE");

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold font-mono tracking-tight">System Status</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isExecutive) {
    return (
      <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 max-w-5xl mx-auto">
        <div className="text-center py-6">
          <Badge variant="outline" className="mb-4 border-primary text-primary px-3 py-1 font-mono uppercase tracking-widest text-xs">
            Executive Strategy Briefing
          </Badge>
          <h1 className="text-5xl font-black tracking-tight mb-4">FMCG Industry Intelligence</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto italic">
            "Signal-to-Insight engine for Thoucentric Senior Leadership & Partners"
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary/5 border-primary/20 p-6 flex flex-col items-center text-center space-y-4">
             <Target className="h-10 w-10 text-primary" />
             <div>
                <h3 className="text-xl font-bold uppercase tracking-tight">Market Outlook</h3>
                <p className="text-sm text-muted-foreground">High-growth premiumization & Shrinkflation dynamics</p>
             </div>
             <Link href="/signals" className="mt-auto">
                <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  MARKET SIGNALS <ChevronRight className="h-3 w-3" />
                </button>
             </Link>
          </Card>

          <Card className="bg-amber-500/5 border-amber-500/20 p-6 flex flex-col items-center text-center space-y-4">
             <Zap className="h-10 w-10 text-amber-400" />
             <div>
                <h3 className="text-xl font-bold uppercase tracking-tight">Active Hypotheses</h3>
                <p className="text-sm text-muted-foreground">{summary?.totalSheiCards || 0} Strategic SHEI cards active</p>
             </div>
             <Link href="/shei-cards" className="mt-auto">
                <button className="text-xs font-bold text-amber-400 flex items-center gap-1 hover:underline">
                  STRATEGY CARDS <ChevronRight className="h-3 w-3" />
                </button>
             </Link>
          </Card>

          <Card className="bg-emerald-500/5 border-emerald-500/20 p-6 flex flex-col items-center text-center space-y-4">
             <Presentation className="h-10 w-10 text-emerald-400" />
             <div>
                <h3 className="text-xl font-bold uppercase tracking-tight">BD Opportunities</h3>
                <p className="text-sm text-muted-foreground">Top consulting entry points for May 2026</p>
             </div>
             <Link href="/actions" className="mt-auto">
                <button className="text-xs font-bold text-emerald-400 flex items-center gap-1 hover:underline">
                  VIEW OPPORTUNITIES <ChevronRight className="h-3 w-3" />
                </button>
             </Link>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-4">
              <h2 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Priority Account Status</h2>
              <div className="space-y-3">
                 {urgentCards.slice(0, 4).map(card => (
                   <Link key={card.id} href={`/shei-cards/${card.cardId}`}>
                    <div className="p-4 rounded-xl border border-border bg-card/50 hover:bg-accent/10 cursor-pointer transition-all">
                       <div className="flex justify-between items-start mb-2">
                          <Badge variant="outline" className={urgencyColor(card.urgency)}>{card.urgency}</Badge>
                          <span className="text-[10px] font-mono text-muted-foreground">{card.cardId}</span>
                       </div>
                       <p className="font-bold leading-tight">{card.title}</p>
                    </div>
                   </Link>
                 ))}
              </div>
           </div>

           <div className="space-y-4">
              <h2 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Key Value Metrics</h2>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-4 rounded-xl border border-border bg-card/50">
                    <div className="text-3xl font-black text-primary">{summary?.totalCompanies || 0}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Tracked Companies</div>
                 </div>
                 <div className="p-4 rounded-xl border border-border bg-card/50">
                    <div className="text-3xl font-black text-amber-400">{summary?.totalSignals || 0}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Market Signals</div>
                 </div>
                 <div className="p-4 rounded-xl border border-border bg-card/50">
                    <div className="text-3xl font-black text-emerald-400">{summary?.totalBenchmarks || 0}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">KPI Benchmarks</div>
                 </div>
                 <div className="p-4 rounded-xl border border-border bg-card/50">
                    <div className="text-3xl font-black text-sky-400">{summary?.totalPlaybookSections || 0}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">BD Playbooks</div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">Command Centre</h1>
        <p className="text-muted-foreground mt-2">Real-time overview of tracked intelligence · FMCG India</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link href="/companies">
          <Card className="hover-elevate cursor-pointer border-l-4 border-l-primary transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Companies</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalCompanies || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary?.tier1Companies || 0} T1 · {summary?.tier2Companies || 0} T2
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/shei-cards">
          <Card className="hover-elevate cursor-pointer border-l-4 border-l-amber-500 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">SHEI Hypotheses</CardTitle>
              <Layers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalSheiCards || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary?.immediateSheiCards || 0} immediate
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/signals">
          <Card className="hover-elevate cursor-pointer border-l-4 border-l-red-500 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Signals</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalSignals || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {summary?.highSignals || 0} high strength
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/benchmarks">
          <Card className="hover-elevate cursor-pointer border-l-4 border-l-blue-500 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Benchmarks</CardTitle>
              <BarChart2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalBenchmarks || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">KPI metrics</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/playbooks">
          <Card className="hover-elevate cursor-pointer border-l-4 border-l-emerald-500 transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Playbooks</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalPlaybookSections || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">sections</p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-red-400" />
              Recent Signals
            </CardTitle>
            <Link href="/signals">
              <span className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-3 w-3" />
              </span>
            </Link>
          </CardHeader>
          <CardContent>
            {recentSignals.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">Loading signals…</p>
            ) : (
              <div className="space-y-3">
                {recentSignals.map((signal) => (
                  <div key={signal.id} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
                    <Badge variant="outline" className={`text-xs shrink-0 ${strengthColor(signal.strength)}`}>
                      {signal.strength}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm leading-snug line-clamp-2">{signal.summary}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{signal.source?.replace(/_/g, " ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Active Hypotheses
            </CardTitle>
            <Link href="/shei-cards">
              <span className="text-xs text-primary hover:underline flex items-center gap-1">
                View all <ChevronRight className="h-3 w-3" />
              </span>
            </Link>
          </CardHeader>
          <CardContent>
            {urgentCards.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-6">Loading hypotheses…</p>
            ) : (
              <div className="space-y-3">
                {urgentCards.map((card) => (
                  <Link key={card.id} href={`/shei-cards/${card.id}`}>
                    <div className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0 hover:bg-accent/10 -mx-2 px-2 rounded cursor-pointer transition-colors">
                      <Badge variant="outline" className={`text-xs shrink-0 ${urgencyColor(card.urgency)}`}>
                        {card.urgency?.replace("_", " ") || card.status}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug line-clamp-1">{card.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{card.hypothesis}</p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="flex items-start gap-3 py-4">
          <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-primary">Thoucentric FMCG Intelligence Platform</p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Consulting-grade signal tracking using the SHEI framework (Signal → Hypothesis → Evidence → Implication). 
              Monitor {summary?.totalCompanies || "8"} companies across India and global FMCG sectors.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
