import { useState } from "react";
import { Link } from "wouter";
import { useListSheiCards } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Layers, ChevronRight, AlertTriangle, TrendingUp, FileSearch } from "lucide-react";

const statusColor = (status?: string) => {
  switch (status) {
    case "CONFIRMED": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    case "ACTIVE": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    case "MONITORING": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "CLOSED": return "bg-muted text-muted-foreground";
    default: return "";
  }
};

const urgencyColor = (urgency?: string) => {
  switch (urgency) {
    case "IMMEDIATE": return "bg-red-500/20 text-red-400 border-red-500/30";
    case "SHORT_TERM": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    case "LONG_TERM": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default: return "";
  }
};

const FRAMEWORK_LABELS: Record<string, string> = {
  S: "Signal",
  H: "Hypothesis",
  E: "Evidence",
  I: "Implication",
};

export default function SheiCards() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [urgencyFilter, setUrgencyFilter] = useState("all");

  const { data: cards, isLoading } = useListSheiCards();

  const filtered = (cards ?? []).filter((c) => {
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchUrgency = urgencyFilter === "all" || c.urgency === urgencyFilter;
    return matchStatus && matchUrgency;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">SHEI Hypothesis Cards</h1>
        <p className="text-muted-foreground mt-1">
          Signal → Hypothesis → Evidence → Implication framework · {filtered.length} cards
        </p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-card border-border">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="MONITORING">Monitoring</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
          <SelectTrigger className="w-44 bg-card border-border">
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Urgency</SelectItem>
            <SelectItem value="IMMEDIATE">Immediate</SelectItem>
            <SelectItem value="SHORT_TERM">Short Term</SelectItem>
            <SelectItem value="LONG_TERM">Long Term</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((card) => (
            <Link key={card.id} href={`/shei-cards/${card.id}`}>
              <Card className="hover-elevate cursor-pointer border border-border hover:border-primary/50 transition-all duration-200 group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">
                          #{String(card.id).padStart(3, "0")} · {card.category}
                        </span>
                      </div>
                      <CardTitle className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                        {card.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="outline" className={`text-xs ${statusColor(card.status)}`}>{card.status}</Badge>
                      {card.urgency && (
                        <Badge variant="outline" className={`text-xs ${urgencyColor(card.urgency)}`}>{card.urgency?.replace("_", " ")}</Badge>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(["S", "H", "E", "I"] as const).map((key) => {
                      const value = key === "S" ? card.signal : key === "H" ? card.hypothesis : key === "E" ? card.evidence : card.implication;
                      return (
                        <div key={key} className="bg-muted/30 rounded-md p-2.5 border border-border/50">
                          <div className="text-xs font-mono text-primary mb-1">{key} — {FRAMEWORK_LABELS[key]}</div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{value || "—"}</p>
                        </div>
                      );
                    })}
                  </div>
                  {card.consultingAction && (
                    <div className="flex items-start gap-2 mt-3 pt-3 border-t border-border">
                      <TrendingUp className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">{card.consultingAction}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Layers className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">No SHEI cards match your filters</p>
        </div>
      )}
    </div>
  );
}
