import { useState } from "react";
import { useListSignals } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calendar, Building2, Tag, TrendingUp, DollarSign, ExternalLink, Zap } from "lucide-react";

const strengthColor = (s?: string) => {
  switch (s) {
    case "HIGH": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "MEDIUM": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "LOW": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default: return "";
  }
};

const categoryColor = (c?: string) => {
  switch (c) {
    case "EARNINGS": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "PROCUREMENT": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "SUPPLY_CHAIN": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "TECHNOLOGY": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    case "REGULATORY": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "DISRUPTION": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    case "MACRO": return "bg-green-500/20 text-green-400 border-green-500/30";
    case "STRATEGY": return "bg-indigo-500/20 text-indigo-400 border-indigo-500/30";
    default: return "";
  }
};

const eventTypeIcon: Record<string, string> = {
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

const actionColor = (a?: string) => {
  switch (a) {
    case "SHEI_CANDIDATE": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "UPDATE_CARD": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "DISRUPTION_BRIEF": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "MONITOR": return "bg-muted text-muted-foreground";
    default: return "";
  }
};

export default function Signals() {
  const [strengthFilter, setStrengthFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [eventFilter, setEventFilter] = useState("all");

  const { data: signals, isLoading } = useListSignals();

  const filtered = (signals ?? []).filter((s) => {
    const matchStrength = strengthFilter === "all" || s.strength === strengthFilter;
    const matchCat = categoryFilter === "all" || s.category === categoryFilter;
    const matchEvent = eventFilter === "all" || s.eventType === eventFilter;
    return matchStrength && matchCat && matchEvent;
  });

  const eventTypes = [...new Set((signals ?? []).map((s) => s.eventType).filter(Boolean))];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">Signal Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Finance · News · Events intelligence across FMCG · {filtered.length} signals
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Select value={strengthFilter} onValueChange={setStrengthFilter}>
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
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-44 bg-card border-border">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="EARNINGS">Earnings</SelectItem>
            <SelectItem value="PROCUREMENT">Procurement</SelectItem>
            <SelectItem value="SUPPLY_CHAIN">Supply Chain</SelectItem>
            <SelectItem value="TECHNOLOGY">Technology</SelectItem>
            <SelectItem value="REGULATORY">Regulatory</SelectItem>
            <SelectItem value="DISRUPTION">Disruption</SelectItem>
            <SelectItem value="MACRO">Macro</SelectItem>
            <SelectItem value="STRATEGY">Strategy</SelectItem>
          </SelectContent>
        </Select>
        <Select value={eventFilter} onValueChange={setEventFilter}>
          <SelectTrigger className="w-44 bg-card border-border">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {eventTypes.map((e) => (
              <SelectItem key={e} value={e!}>{eventTypeIcon[e!]} {e!.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((signal) => (
            <Card key={signal.id} className="border border-border hover:border-border/80 transition-all group">
              <CardContent className="py-4">
                <div className="space-y-3">
                  {/* Header row */}
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={`text-xs shrink-0 ${strengthColor(signal.strength)}`}>
                        {signal.strength}
                      </Badge>
                      <Badge variant="outline" className={`text-xs shrink-0 ${categoryColor(signal.category)}`}>
                        <Tag className="h-2.5 w-2.5 mr-1" />{signal.category?.replace(/_/g, " ")}
                      </Badge>
                      {signal.eventType && (
                        <Badge variant="outline" className="text-xs shrink-0">
                          {eventTypeIcon[signal.eventType]} {signal.eventType.replace(/_/g, " ")}
                        </Badge>
                      )}
                      {signal.action && signal.action !== "MONITOR" && (
                        <Badge variant="outline" className={`text-xs shrink-0 ${actionColor(signal.action)}`}>
                          <Zap className="h-2.5 w-2.5 mr-1" />{signal.action.replace(/_/g, " ")}
                        </Badge>
                      )}
                    </div>
                    <div className="ml-auto flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                      {signal.companyName && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> {signal.companyName}
                        </span>
                      )}
                      {signal.quarter && <span className="font-mono">{signal.quarter}</span>}
                      {signal.publishedDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(signal.publishedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-sm leading-relaxed">{signal.summary}</p>

                  {/* Financial Impact */}
                  {signal.financialImpact && (
                    <div className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/20 rounded px-3 py-2">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-emerald-300 leading-snug">{signal.financialImpact}</p>
                    </div>
                  )}

                  {/* SC Relevance */}
                  {signal.scRelevance && (
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{signal.scRelevance}</span>
                    </div>
                  )}

                  {/* Source */}
                  {signal.source && (
                    <p className="text-xs text-muted-foreground border-t border-border/50 pt-2">
                      Source: {signal.source}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
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
