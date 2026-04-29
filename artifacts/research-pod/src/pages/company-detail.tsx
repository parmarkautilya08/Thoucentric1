import { useRoute, Link } from "wouter";
import { useGetCompany, useListSheiCards, useListSignals } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink, Globe, MapPin, TrendingUp, AlertTriangle, Server, BarChart2, Layers, Activity, Target } from "lucide-react";

export default function CompanyDetail() {
  const [, params] = useRoute("/companies/:id");
  const id = Number(params?.id);

  const { data: company, isLoading } = useGetCompany(id);
  const { data: allShei } = useListSheiCards();
  const { data: allSignals } = useListSignals();

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 rounded-xl" />
    </div>
  );

  if (!company) return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-muted-foreground">Company not found</p>
      <Link href="/companies" className="text-primary text-sm mt-2 hover:underline">← Back to Companies</Link>
    </div>
  );

  const linkedShei = (allShei ?? []).filter((s) =>
    s.relatedCompanies?.toLowerCase().includes(company.name.toLowerCase())
  );
  const linkedSignals = (allSignals ?? []).filter((s) =>
    s.companyName?.toLowerCase().includes(company.name.toLowerCase()) ||
    s.companyName === "All FMCG"
  ).slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-5xl">
      <Link href="/companies">
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Companies
        </button>
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight">{company.name}</h1>
          <p className="text-muted-foreground">{company.fullName}</p>
          <div className="flex gap-2 mt-3 flex-wrap">
            <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">Tier {company.tier}</Badge>
            <Badge variant="outline">
              {company.geography === "INDIA" ? <MapPin className="h-3 w-3 mr-1" /> : <Globe className="h-3 w-3 mr-1" />}
              {company.geography}
            </Badge>
            {company.exchange && <Badge variant="outline">{company.exchange}</Badge>}
            {company.confidence && (
              <Badge variant="outline" className={
                company.confidence === "HIGH" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                company.confidence === "LOW" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                "bg-amber-500/20 text-amber-400 border-amber-500/30"
              }>{company.confidence} confidence</Badge>
            )}
          </div>
        </div>
        {company.irPage && (
          <a href={`https://${company.irPage}`} target="_blank" rel="noreferrer"
             className="flex items-center gap-1.5 text-sm text-primary hover:underline">
            IR Page <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {company.revenue && (
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Revenue</div>
              <div className="text-lg font-bold font-mono leading-tight">{company.revenue}</div>
            </CardContent>
          </Card>
        )}
        {company.revenueGrowth && (
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Revenue Growth</div>
              <div className="text-lg font-bold font-mono text-primary leading-tight">{company.revenueGrowth}</div>
            </CardContent>
          </Card>
        )}
        {company.ebitdaMargin && (
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">EBITDA Margin</div>
              <div className="text-lg font-bold font-mono text-emerald-400 leading-tight">{company.ebitdaMargin}</div>
            </CardContent>
          </Card>
        )}
        {company.marketCap && (
          <Card className="bg-card border-border">
            <CardContent className="pt-4 pb-3">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Market Cap</div>
              <div className="text-lg font-bold font-mono leading-tight">{company.marketCap}</div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Take */}
      {company.quickTake && (
        <Card className="bg-card border-border border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest">Quick Take</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{company.quickTake}</p>
          </CardContent>
        </Card>
      )}

      {/* Intelligence Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strategic Priorities */}
        {company.strategicPriorities && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" /> Strategic Priorities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{company.strategicPriorities}</p>
            </CardContent>
          </Card>
        )}

        {/* SC Intelligence */}
        {company.scIntelligence && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <BarChart2 className="h-3.5 w-3.5 text-blue-400" /> Supply Chain Intelligence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{company.scIntelligence}</p>
            </CardContent>
          </Card>
        )}

        {/* Tech Intelligence */}
        {company.techIntelligence && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Server className="h-3.5 w-3.5 text-cyan-400" /> Technology & Digital Maturity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{company.techIntelligence}</p>
            </CardContent>
          </Card>
        )}

        {/* Open Problems / Consulting Entry */}
        {company.openProblems && (
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" /> Open Problems & Consulting Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">{company.openProblems}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Categories */}
      {company.categories && (
        <div>
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">Product Portfolio</h3>
          <div className="flex flex-wrap gap-2">
            {company.categories.split(",").map((cat) => (
              <Badge key={cat.trim()} variant="outline" className="text-xs">{cat.trim()}</Badge>
            ))}
          </div>
        </div>
      )}

      {/* Linked SHEI Cards */}
      {linkedShei.length > 0 && (
        <div>
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-primary" /> Active SHEI Hypotheses
          </h3>
          <div className="space-y-2">
            {linkedShei.map((s) => (
              <Link key={s.id} href={`/shei-cards/${s.id}`}>
                <Card className="border border-primary/20 bg-primary/5 hover:border-primary/50 cursor-pointer transition-all">
                  <CardContent className="py-3 flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-primary">{s.cardId}</span>
                        <Badge variant="outline" className="text-xs">{s.urgency?.replace(/_/g, " ")}</Badge>
                      </div>
                      <p className="text-sm font-medium leading-snug">{s.title}</p>
                      {s.financialImpact && (
                        <p className="text-xs text-emerald-400 mt-1 line-clamp-1">{s.financialImpact}</p>
                      )}
                    </div>
                    <TrendingUp className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Linked Signals */}
      {linkedSignals.length > 0 && (
        <div>
          <h3 className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-amber-400" /> Recent Signals
          </h3>
          <div className="space-y-2">
            {linkedSignals.map((s) => (
              <Card key={s.id} className="border border-border">
                <CardContent className="py-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="outline" className={`text-xs ${s.strength === "HIGH" ? "text-red-400 border-red-500/30" : s.strength === "MEDIUM" ? "text-amber-400 border-amber-500/30" : ""}`}>
                      {s.strength}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{s.category?.replace(/_/g, " ")}</span>
                    {s.quarter && <span className="text-xs font-mono text-muted-foreground">{s.quarter}</span>}
                  </div>
                  <p className="text-sm leading-snug line-clamp-2">{s.summary}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
