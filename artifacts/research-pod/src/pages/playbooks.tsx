import { useState } from "react";
import { useListPlaybooks } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ChevronDown, ChevronRight, TrendingUp, AlertCircle, Target, Zap, Users, Lightbulb, CheckCircle2, Cpu } from "lucide-react";

const FUNCTION_LABELS: Record<string, string> = {
  SUPPLY_CHAIN: "Supply Chain",
  PROCUREMENT: "Procurement",
  DISTRIBUTION_GTM: "Distribution & GTM",
  IT_TECHNOLOGY: "Technology",
  SALES_DISTRIBUTION: "Sales & Distribution",
  FINANCIAL: "Financial",
  ESG: "ESG",
  MANUFACTURING: "Manufacturing",
};

const FUNCTION_COLORS: Record<string, string> = {
  SUPPLY_CHAIN: "border-l-blue-500",
  PROCUREMENT: "border-l-amber-500",
  DISTRIBUTION_GTM: "border-l-violet-500",
  IT_TECHNOLOGY: "border-l-cyan-500",
  SALES_DISTRIBUTION: "border-l-emerald-500",
  FINANCIAL: "border-l-yellow-500",
  ESG: "border-l-green-500",
  MANUFACTURING: "border-l-orange-500",
};

function PlaybookCard({ section }: { section: any }) {
  const [open, setOpen] = useState(false);

  const triggerItems = section.triggerSignals?.split(";").map((s: string) => s.trim()).filter(Boolean) ?? [];
  const failureItems = section.failureModes?.split("\n").map((s: string) => s.trim()).filter(Boolean) ?? [];
  const techItems = section.technologyEnablers?.split(";").map((s: string) => s.trim()).filter(Boolean) ?? [];

  return (
    <Card className={`border border-border border-l-4 ${FUNCTION_COLORS[section.functionTag] || "border-l-border"} overflow-hidden`}>
      <button className="w-full text-left" onClick={() => setOpen(!open)}>
        <CardHeader className="pb-3 hover:bg-accent/20 transition-colors">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs font-mono text-muted-foreground">#{section.sectionNumber}</span>
                <Badge variant="outline" className="text-xs">
                  {FUNCTION_LABELS[section.functionTag] || section.functionTag}
                </Badge>
                {section.status && (
                  <Badge variant="outline" className={`text-xs ${
                    section.status === "PUBLISHED" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                    section.status === "DRAFT" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                    "bg-muted text-muted-foreground"
                  }`}>{section.status}</Badge>
                )}
              </div>
              <CardTitle className="text-base font-semibold leading-snug">{section.title}</CardTitle>
              {section.whyItMatters && (
                <p className="text-sm text-muted-foreground mt-1.5 line-clamp-2">{section.whyItMatters}</p>
              )}
            </div>
            <div className="shrink-0 text-muted-foreground">
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
      </button>

      {open && (
        <CardContent className="pt-0 border-t border-border space-y-5 pb-5">
          {/* Trigger Signals */}
          {triggerItems.length > 0 && (
            <div className="pt-4">
              <h4 className="text-xs font-mono font-semibold text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Trigger Signals
              </h4>
              <div className="flex flex-wrap gap-2">
                {triggerItems.map((t: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs bg-amber-500/5 border-amber-500/20 text-amber-300">{t}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Why It Matters */}
          {section.whyItMatters && (
            <div>
              <h4 className="text-xs font-mono font-semibold text-primary uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" /> Why It Matters
              </h4>
              <p className="text-sm leading-relaxed bg-primary/5 border border-primary/20 rounded-lg p-3">
                {section.whyItMatters}
              </p>
            </div>
          )}

          {/* Industry Landscape */}
          {section.industryLandscape && (
            <div>
              <h4 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" /> Industry Landscape
              </h4>
              <p className="text-sm leading-relaxed text-muted-foreground bg-muted/20 border border-border rounded-lg p-3">
                {section.industryLandscape}
              </p>
            </div>
          )}

          {/* What Good Looks Like */}
          {section.whatGoodLooksLike && (
            <div>
              <h4 className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> What Good Looks Like
              </h4>
              <p className="text-sm leading-relaxed bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                {section.whatGoodLooksLike}
              </p>
            </div>
          )}

          {/* Failure Modes */}
          {failureItems.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-semibold text-red-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" /> Failure Modes
              </h4>
              <ul className="space-y-1.5">
                {failureItems.map((item: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 bg-red-500/5 border border-red-500/10 rounded px-3 py-2">
                    <span className="text-red-400 mt-0.5 shrink-0 font-mono">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technology Enablers */}
          {techItems.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-semibold text-cyan-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5" /> Technology Enablers
              </h4>
              <div className="flex flex-wrap gap-2">
                {techItems.map((t: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs bg-cyan-500/5 border-cyan-500/20 text-cyan-300">{t}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Consulting Entry Points */}
          {section.consultingEntryPoints && (
            <div>
              <h4 className="text-xs font-mono font-semibold text-primary uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Consulting Entry Points
              </h4>
              <p className="text-sm leading-relaxed bg-primary/5 border border-primary/20 rounded-lg p-3">
                {section.consultingEntryPoints}
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function Playbooks() {
  const { data: playbooks, isLoading } = useListPlaybooks();

  const grouped = (playbooks ?? []).reduce<Record<string, typeof playbooks>>((acc, s) => {
    const key = s.functionTag || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key]!.push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">Consulting Playbooks</h1>
        <p className="text-muted-foreground mt-1">
          Engagement blueprints · Trigger signals · Entry points · {playbooks?.length ?? 0} playbooks published
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([funcTag, items]) => (
            <div key={funcTag}>
              <h2 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-widest mb-3 flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5" /> {FUNCTION_LABELS[funcTag] || funcTag}
              </h2>
              <div className="space-y-3">
                {(items ?? []).map((section) => (
                  <PlaybookCard key={section.id} section={section} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && (!playbooks || playbooks.length === 0) && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">No playbooks available</p>
        </div>
      )}
    </div>
  );
}
