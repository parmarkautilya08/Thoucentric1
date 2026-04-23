import { useGetDashboardSummary, useListSignals, useListSheiCards } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Layers, Activity, BarChart2, BookOpen, ChevronRight, TrendingUp, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

const urgencyColor = (u?: string) => {
  if (u === "IMMEDIATE") return "bg-red-500/20 text-red-400 border-red-500/30";
  if (u === "SHORT_TERM") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
};

const strengthColor = (s?: string) => {
  if (s === "HIGH") return "bg-red-500/20 text-red-400 border-red-500/30";
  if (s === "MEDIUM") return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  return "bg-blue-500/20 text-blue-400 border-blue-500/30";
};

export default function Dashboard() {
  const { data: summary, isLoading } = useGetDashboardSummary();
  const { data: signals } = useListSignals();
  const { data: sheiCards } = useListSheiCards();

  const recentSignals = (signals ?? []).slice(0, 5);
  const urgentCards = (sheiCards ?? []).filter((c) => c.urgency === "IMMEDIATE" || c.status === "ACTIVE").slice(0, 4);

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

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">At a Glance</h1>
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
                      <p className="text-sm leading-snug line-clamp-2">{signal.description}</p>
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
