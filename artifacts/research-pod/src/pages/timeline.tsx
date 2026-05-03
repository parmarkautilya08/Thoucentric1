import { useState } from "react";
import { useListSignals } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Activity, TrendingUp, DollarSign, Zap, Building2 } from "lucide-react";

const strengthColor = (s?: string) => {
  switch (s) {
    case "HIGH": return "border-red-500 bg-red-500";
    case "MEDIUM": return "border-amber-500 bg-amber-500";
    default: return "border-blue-500 bg-blue-500";
  }
};

const categoryColor = (c?: string) => {
  switch (c) {
    case "SUPPLY_CHAIN": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "PROCUREMENT": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "DISTRIBUTION_GTM": return "bg-violet-500/20 text-violet-400 border-violet-500/30";
    case "DIGITAL": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    case "ESG": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "MANUFACTURING": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    default: return "";
  }
};

const eventTypeEmoji: Record<string, string> = {
  EARNINGS_RESULT: "📊",
  ANALYST_DAY: "🎯",
  REGULATORY: "⚖️",
  NEWS: "📰",
  INDUSTRY_REPORT: "📋",
  COMPANY_FILING: "📁",
  LEADERSHIP_CHANGE: "👤",
  M_AND_A: "🤝",
  MACRO_EVENT: "🌐",
};

export default function Timeline() {
  const [filterStrength, setFilterStrength] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const { data: signals, isLoading } = useListSignals();

  const filtered = (signals ?? [])
    .filter((s) => filterStrength === "all" || s.strength === filterStrength)
    .filter((s) => filterCategory === "all" || s.category === filterCategory)
    .sort((a, b) => {
      const da = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
      const db2 = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
      return db2 - da;
    });

  // Group by quarter
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, s) => {
    const key = s.quarter || s.publishedDate?.slice(0, 7) || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  const sortedGroups = Object.entries(grouped).sort((a, b) => b[0].localeCompare(a[0]));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">Signal Timeline</h1>
        <p className="text-muted-foreground mt-1">
          Chronological view of signals, events & market intelligence · {filtered.length} events
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Select value={filterStrength} onValueChange={setFilterStrength}>
          <SelectTrigger className="w-36 bg-card border-border">
            <SelectValue placeholder="Strength" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Strength</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-44 bg-card border-border">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="SUPPLY_CHAIN">Supply Chain</SelectItem>
            <SelectItem value="PROCUREMENT">Procurement</SelectItem>
            <SelectItem value="DISTRIBUTION_GTM">Distribution / GTM</SelectItem>
            <SelectItem value="DIGITAL">Digital</SelectItem>
            <SelectItem value="ESG">ESG</SelectItem>
            <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i}>
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="space-y-3">{[1, 2, 3].map((j) => <Skeleton key={j} className="h-28 rounded-xl" />)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {sortedGroups.map(([period, items]) => (
            <div key={period}>
              {/* Period header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-border" />
                <div className="flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-full border border-border">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-mono font-semibold text-primary">{period}</span>
                  <span className="text-xs text-muted-foreground">· {items.length} events</span>
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>

              {/* Timeline items */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[11px] top-0 bottom-0 w-px bg-border" />

                <div className="space-y-4 pl-8">
                  {items.map((signal) => (
                    <div key={signal.id} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute -left-8 top-3 w-[11px] h-[11px] rounded-full border-2 ${strengthColor(signal.strength)}`} />

                      <Card className="border border-border hover:border-border/80 transition-all">
                        <CardContent className="py-4 space-y-2.5">
                          <div className="flex items-start gap-2 flex-wrap">
                            <Badge variant="outline" className={`text-xs shrink-0 ${categoryColor(signal.category)}`}>
                              {signal.category?.replace(/_/g, " ")}
                            </Badge>
                            {signal.eventType && (
                              <Badge variant="outline" className="text-xs shrink-0">
                                {eventTypeEmoji[signal.eventType]} {signal.eventType.replace(/_/g, " ")}
                              </Badge>
                            )}
                            {signal.action && (
                              <Badge variant="outline" className={`text-xs shrink-0 ${
                                signal.action === "ACT_NOW" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                signal.action === "INVESTIGATE" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                                "bg-muted text-muted-foreground"
                              }`}>
                                <Zap className="h-2.5 w-2.5 mr-1" />{signal.action.replace(/_/g, " ")}
                              </Badge>
                            )}
                            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                              {signal.companyName && (
                                <span className="flex items-center gap-1">
                                  <Building2 className="h-3 w-3" /> {signal.companyName}
                                </span>
                              )}
                              {signal.publishedDate && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(signal.publishedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                              )}
                            </div>
                          </div>

                          <p className="text-sm leading-relaxed">{signal.summary}</p>

                          {signal.financialImpact && (
                            <div className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded px-3 py-2">
                              <DollarSign className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <p className="text-xs text-emerald-300 leading-snug">{signal.financialImpact}</p>
                            </div>
                          )}

                          {signal.scRelevance && (
                            <div className="flex items-start gap-2 text-xs text-muted-foreground">
                              <TrendingUp className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                              <span>{signal.scRelevance}</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">No signals match your filters</p>
        </div>
      )}
    </div>
  );
}
