import { useState } from "react";
import { useListBenchmarks } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart2, TrendingUp, TrendingDown, Minus } from "lucide-react";

const trendIcon = (t?: string) => {
  if (t === "IMPROVING") return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (t === "DECLINING") return <TrendingDown className="h-4 w-4 text-red-400" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

const trendColor = (t?: string) => {
  if (t === "IMPROVING") return "text-emerald-400";
  if (t === "DECLINING") return "text-red-400";
  return "text-muted-foreground";
};

export default function Benchmarks() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { data: benchmarks, isLoading } = useListBenchmarks();

  const categories = [...new Set((benchmarks ?? []).map((b) => b.category).filter(Boolean))];

  const filtered = (benchmarks ?? []).filter((b) =>
    categoryFilter === "all" || b.category === categoryFilter
  );

  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, b) => {
    const key = b.category || "Uncategorized";
    if (!acc[key]) acc[key] = [];
    acc[key].push(b);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">KPI Benchmarks</h1>
        <p className="text-muted-foreground mt-1">
          Industry benchmarks and performance metrics · {filtered.length} KPIs
        </p>
      </div>

      <div className="flex gap-3">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 bg-card border-border">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c!}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-sm font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <BarChart2 className="h-3.5 w-3.5" /> {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {items.map((b) => (
                  <Card key={b.id} className="bg-card border border-border hover:border-border/80 transition-all">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-medium leading-tight">{b.metric}</CardTitle>
                        {trendIcon(b.trend)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-muted/30 rounded p-2">
                          <div className="text-xs text-muted-foreground mb-0.5">Min</div>
                          <div className="text-sm font-bold font-mono">{b.minValue ?? "—"}</div>
                        </div>
                        <div className="bg-primary/10 rounded p-2 ring-1 ring-primary/30">
                          <div className="text-xs text-muted-foreground mb-0.5">Median</div>
                          <div className="text-sm font-bold font-mono text-primary">{b.medianValue ?? "—"}</div>
                        </div>
                        <div className="bg-muted/30 rounded p-2">
                          <div className="text-xs text-muted-foreground mb-0.5">Max</div>
                          <div className="text-sm font-bold font-mono">{b.maxValue ?? "—"}</div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{b.unit}</span>
                        <span className={`font-medium ${trendColor(b.trend)}`}>{b.trend?.replace("_", " ")}</span>
                      </div>
                      {b.notes && (
                        <p className="text-xs text-muted-foreground border-t border-border pt-2">{b.notes}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BarChart2 className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">No benchmarks found</p>
        </div>
      )}
    </div>
  );
}
