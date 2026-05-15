import { useState } from "react";
import { Link } from "wouter";
import { useListCompanies } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, TrendingUp, ChevronRight, Globe, MapPin } from "lucide-react";

const confidenceBadge = (c?: string) => {
  if (c === "HIGH") return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  if (c === "LOW") return "bg-red-500/20 text-red-400 border-red-500/30";
  return "bg-amber-500/20 text-amber-400 border-amber-500/30";
};

export default function Companies() {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [geoFilter, setGeoFilter] = useState<string>("all");

  const { data: companies, isLoading } = useListCompanies();

  const filtered = (Array.isArray(companies) ? companies : []).filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.fullName.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === "all" || String(c.tier) === tierFilter;
    const matchGeo = geoFilter === "all" || c.geography === geoFilter;
    return matchSearch && matchTier && matchGeo;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">Company Intelligence</h1>
        <p className="text-muted-foreground mt-1">
          {filtered.length} companies tracked · Last updated April 2025
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Search companies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs bg-card border-border"
        />
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-36 bg-card border-border">
            <SelectValue placeholder="Tier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tiers</SelectItem>
            <SelectItem value="1">Tier 1</SelectItem>
            <SelectItem value="2">Tier 2</SelectItem>
          </SelectContent>
        </Select>
        <Select value={geoFilter} onValueChange={setGeoFilter}>
          <SelectTrigger className="w-40 bg-card border-border">
            <SelectValue placeholder="Geography" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Geographies</SelectItem>
            <SelectItem value="INDIA">India</SelectItem>
            <SelectItem value="GLOBAL">Global</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <Link key={company.id} href={`/companies/${company.name}`}>
              <Card className="hover-elevate cursor-pointer h-full border border-border hover:border-primary/50 transition-all duration-200 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold font-mono">{company.name}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{company.fullName}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className={company.tier === 1 ? "bg-primary/20 text-primary border-primary/30 text-xs" : "text-xs"}>
                      Tier {company.tier}
                    </Badge>
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      {company.geography === "INDIA" ? <MapPin className="h-2.5 w-2.5" /> : <Globe className="h-2.5 w-2.5" />}
                      {company.geography}
                    </Badge>
                    <Badge variant="outline" className={`text-xs ${confidenceBadge(company.confidence)}`}>
                      {company.confidence}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {company.revenue && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="text-muted-foreground text-xs">{company.revenue}</span>
                    </div>
                  )}
                  {company.ebitdaMargin && (
                    <div className="text-xs text-muted-foreground">
                      EBITDA: <span className="text-foreground font-medium">{company.ebitdaMargin}</span>
                    </div>
                  )}
                  {company.quickTake && (
                    <p className="text-xs text-muted-foreground line-clamp-2 border-t border-border pt-2 mt-2">
                      {company.quickTake}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">No companies match your filters</p>
        </div>
      )}
    </div>
  );
}
