import { useState } from "react";
import { useListSignals } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Calendar, Building2, Tag, TrendingUp } from "lucide-react";

const strengthColor = (s?: string) => {
  switch (s) {
    case "HIGH": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "MEDIUM": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "LOW": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default: return "";
  }
};

const sourceColor = (s?: string) => {
  switch (s) {
    case "EARNINGS_CALL": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "PRESS_RELEASE": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "INDUSTRY_REPORT": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "NEWS": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    default: return "";
  }
};

export default function Signals() {
  const [strengthFilter, setStrengthFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const { data: signals, isLoading } = useListSignals();

  const filtered = (signals ?? []).filter((s) => {
    const matchStrength = strengthFilter === "all" || s.strength === strengthFilter;
    const matchSource = sourceFilter === "all" || s.source === sourceFilter;
    return matchStrength && matchSource;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">Signal Tracker</h1>
        <p className="text-muted-foreground mt-1">
          Intelligence signals across companies · {filtered.length} signals tracked
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Select value={strengthFilter} onValueChange={setStrengthFilter}>
          <SelectTrigger className="w-40 bg-card border-border">
            <SelectValue placeholder="Strength" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Strength</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="LOW">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sourceFilter} onValueChange={setSourceFilter}>
          <SelectTrigger className="w-44 bg-card border-border">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="EARNINGS_CALL">Earnings Call</SelectItem>
            <SelectItem value="PRESS_RELEASE">Press Release</SelectItem>
            <SelectItem value="INDUSTRY_REPORT">Industry Report</SelectItem>
            <SelectItem value="NEWS">News</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((signal) => (
            <Card key={signal.id} className="border border-border hover:border-border/80 transition-all group">
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Badge variant="outline" className={`text-xs ${strengthColor(signal.strength)}`}>
                        {signal.strength}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${sourceColor(signal.source)}`}>
                        {signal.source?.replace(/_/g, " ")}
                      </Badge>
                      {signal.category && (
                        <Badge variant="outline" className="text-xs">
                          <Tag className="h-2.5 w-2.5 mr-1" />{signal.category}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium leading-snug">{signal.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      {signal.companyId && (
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3 w-3" /> Co. #{signal.companyId}
                        </span>
                      )}
                      {signal.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> {new Date(signal.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                  {signal.actionItem && (
                    <div className="hidden md:flex items-start gap-1.5 max-w-xs text-xs text-muted-foreground shrink-0">
                      <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{signal.actionItem}</span>
                    </div>
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
