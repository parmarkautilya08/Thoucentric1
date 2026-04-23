import { useRoute, Link } from "wouter";
import { useGetCompany } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, ExternalLink, TrendingUp, Globe, MapPin, BarChart2 } from "lucide-react";

export default function CompanyDetail() {
  const [, params] = useRoute("/companies/:id");
  const id = Number(params?.id);

  const { data: company, isLoading } = useGetCompany(id);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <p className="text-muted-foreground">Company not found</p>
        <Link href="/companies" className="text-primary text-sm mt-2 hover:underline">← Back to Companies</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center gap-3">
        <Link href="/companies">
          <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Companies
          </button>
        </Link>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {company.revenue && (
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Revenue</div>
              <div className="text-xl font-bold font-mono">{company.revenue}</div>
            </CardContent>
          </Card>
        )}
        {company.ebitdaMargin && (
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">EBITDA Margin</div>
              <div className="text-xl font-bold font-mono text-emerald-400">{company.ebitdaMargin}</div>
            </CardContent>
          </Card>
        )}
        {company.earningsCadence && (
          <Card className="bg-card border-border">
            <CardContent className="pt-4">
              <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Earnings Cadence</div>
              <div className="text-xl font-bold font-mono">{company.earningsCadence}</div>
            </CardContent>
          </Card>
        )}
      </div>

      {company.quickTake && (
        <Card className="bg-card border-border border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Quick Take</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed">{company.quickTake}</p>
          </CardContent>
        </Card>
      )}

      {company.watchFlags && company.watchFlags.length > 0 && (
        <Card className="bg-card border-border border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Watch Flags</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {company.watchFlags.map((flag: string, i: number) => (
                <Badge key={i} variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                  {flag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
