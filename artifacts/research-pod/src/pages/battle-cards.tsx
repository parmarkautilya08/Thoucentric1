import { useState, useMemo } from "react";
import { useListCompanies, useListBenchmarks } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Swords, TrendingUp, AlertTriangle, CheckCircle2, XCircle,
  Target, Zap, ArrowRight, BarChart2, ShieldAlert
} from "lucide-react";

export default function BattleCards() {
  const { data: companies, isLoading: companiesLoading } = useListCompanies();
  const { data: benchmarks } = useListBenchmarks();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleCompany = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else if (selectedIds.length < 2) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds([selectedIds[1], id]);
    }
  };

  const compA = useMemo(() => Array.isArray(companies) ? companies.find : [].find(c => c.id === selectedIds[0]), [companies, selectedIds]);
  const compB = useMemo(() => Array.isArray(companies) ? companies.find : [].find(c => c.id === selectedIds[1]), [companies, selectedIds]);

  const isLoading = companiesLoading;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold font-mono tracking-tight">Battle Cards</h1>
          <p className="text-muted-foreground mt-1">
            Head-to-head FMCG comparison · Strategic priorities · SC Maturity · Competitive edges
          </p>
        </div>
        <Badge variant="outline" className="border-primary/40 text-primary gap-1">
          <Swords className="h-3 w-3" /> Select 2 to Compare
        </Badge>
      </div>

      {/* Selection Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)
        ) : (
          Array.isArray(companies) ? companies.map : [].map((company) => (
            <button
              key={company.id}
              onClick={() => toggleCompany(company.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                selectedIds.includes(company.id)
                  ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]"
                  : "bg-card border-border hover:border-primary/40"
              }`}
            >
              <div className="text-xs font-mono text-muted-foreground mb-1">{company.name}</div>
              <div className="text-sm font-bold truncate">{company.fullName}</div>
              {selectedIds.includes(company.id) && (
                <div className="mt-1.5 flex justify-end">
                  <Badge className="bg-primary h-4 px-1.5 text-[10px]">SELECTED</Badge>
                </div>
              )}
            </button>
          ))
        )}
      </div>

      {compA && compB ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* Company Profiles */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[compA, compB].map((comp, idx) => (
              <Card key={comp.id} className="border-t-4 border-t-primary">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge variant="outline" className="mb-2">TIER {comp.tier}</Badge>
                      <CardTitle className="text-2xl font-bold">{comp.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{comp.fullName}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono font-bold text-primary">{comp.revenue}</div>
                      <div className="text-xs text-muted-foreground">EBITDA: {comp.ebitdaMargin}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-xs font-mono font-bold text-muted-foreground uppercase mb-2">Strategic Priorities</div>
                    <div className="flex flex-wrap gap-1.5">
                      {comp.strategicPriorities?.split(",").map(p => (
                        <Badge key={p} variant="secondary" className="text-[10px] font-medium">{p.trim()}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Head-to-Head Attributes */}
          <div className="space-y-6">
             <h2 className="text-lg font-bold flex items-center gap-2">
               <Target className="h-5 w-5 text-primary" /> Supply Chain & Tech Maturity
             </h2>

             {[
               { label: "SC Intelligence", field: "scIntelligence" },
               { label: "Tech Maturity", field: "techIntelligence" },
               { label: "Open Problems", field: "openProblems" }
             ].map(attr => (
               <Card key={attr.label} className="overflow-hidden">
                 <div className="bg-muted/50 px-4 py-2 text-xs font-bold font-mono border-b">{attr.label.toUpperCase()}</div>
                 <div className="grid grid-cols-2 divide-x border-border">
                   <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap">{compA[attr.field as keyof typeof compA]}</div>
                   <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap">{compB[attr.field as keyof typeof compB]}</div>
                 </div>
               </Card>
             ))}
          </div>

          {/* Strategic Moats & Risks */}
          <div className="space-y-6">
             <h2 className="text-lg font-bold flex items-center gap-2">
               <ShieldAlert className="h-5 w-5 text-amber-500" /> Competitive Moat & Strategic Risks
             </h2>

             <Card className="overflow-hidden border-amber-500/30">
               <div className="bg-amber-500/10 px-4 py-2 text-xs font-bold font-mono border-b border-amber-500/20 text-amber-500">QUICK TAKE / COMPETITIVE EDGE</div>
               <div className="grid grid-cols-2 divide-x border-border">
                 <div className="p-4 text-sm font-medium italic">"{compA.quickTake}"</div>
                 <div className="p-4 text-sm font-medium italic">"{compB.quickTake}"</div>
               </div>
             </Card>

             <Card className="overflow-hidden border-red-500/30">
               <div className="bg-red-500/10 px-4 py-2 text-xs font-bold font-mono border-b border-red-500/20 text-red-400">WHERE THEY FAIL (CONSULTING HOOK)</div>
               <div className="grid grid-cols-2 divide-x border-border">
                 <div className="p-4 text-sm space-y-2">
                   {compA.openProblems?.split(".").map((p, i) => p.trim() && (
                     <div key={i} className="flex gap-2">
                       <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                       <span>{p.trim()}</span>
                     </div>
                   ))}
                 </div>
                 <div className="p-4 text-sm space-y-2">
                   {compB.openProblems?.split(".").map((p, i) => p.trim() && (
                     <div key={i} className="flex gap-2">
                       <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                       <span>{p.trim()}</span>
                     </div>
                   ))}
                 </div>
               </div>
             </Card>

             <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 space-y-4">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm">
                  <Zap className="h-4 w-4" /> Thoucentric Strategic Recommendation
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Pitch Strategy for {compA.name}</p>
                    <p className="text-sm font-medium leading-relaxed">Focus on {compA.openProblems?.split(".")[0]}. Align with their priority of {compA.strategicPriorities?.split(",")[0]}.</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Pitch Strategy for {compB.name}</p>
                    <p className="text-sm font-medium leading-relaxed">Leverage their {compB.scIntelligence?.split(".")[0].slice(0, 50)}... gap. Position against {compB.name}'s risk of {compB.openProblems?.split(".")[0]}.</p>
                  </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-border rounded-3xl bg-muted/5">
          <Swords className="h-16 w-16 text-muted-foreground/30 mb-6" />
          <h3 className="text-xl font-bold text-muted-foreground">Select Two Companies to Start Battle</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md text-center">
            Compare financial metrics, supply chain maturity, and strategic priorities head-to-head to identify competitive edges and consulting entry points.
          </p>
        </div>
      )}
    </div>
  );
}
