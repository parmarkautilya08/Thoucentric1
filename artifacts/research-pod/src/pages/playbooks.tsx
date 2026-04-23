import { useState } from "react";
import { useListPlaybooks } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, ChevronDown, ChevronRight, Lightbulb, Target, AlertCircle } from "lucide-react";

function PlaybookSection({ section }: { section: any }) {
  const [open, setOpen] = useState(false);

  return (
    <Card className="border border-border overflow-hidden">
      <button
        className="w-full text-left"
        onClick={() => setOpen(!open)}
      >
        <CardHeader className="pb-3 hover:bg-accent/20 transition-colors">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">{section.category}</span>
                {section.priority && (
                  <Badge variant="outline" className={`text-xs ${
                    section.priority === "HIGH" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                    section.priority === "MEDIUM" ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                    "bg-blue-500/20 text-blue-400 border-blue-500/30"
                  }`}>{section.priority}</Badge>
                )}
              </div>
              <CardTitle className="text-base font-semibold">{section.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{section.description}</p>
            </div>
            <div className="shrink-0 text-muted-foreground">
              {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </div>
          </div>
        </CardHeader>
      </button>

      {open && (
        <CardContent className="pt-0 border-t border-border space-y-4">
          {section.description && (
            <p className="text-sm leading-relaxed pt-3">{section.description}</p>
          )}

          {section.keyQuestions && section.keyQuestions.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" /> Key Questions
              </h4>
              <ul className="space-y-1.5">
                {section.keyQuestions.map((q: string, i: number) => (
                  <li key={i} className="text-sm text-foreground flex items-start gap-2">
                    <span className="text-primary font-mono mt-0.5 shrink-0">{i + 1}.</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.dataPoints && section.dataPoints.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" /> Data Points
              </h4>
              <div className="flex flex-wrap gap-2">
                {section.dataPoints.map((dp: string, i: number) => (
                  <Badge key={i} variant="outline" className="text-xs bg-muted/30">{dp}</Badge>
                ))}
              </div>
            </div>
          )}

          {section.redFlags && section.redFlags.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-semibold text-red-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5" /> Red Flags
              </h4>
              <ul className="space-y-1.5">
                {section.redFlags.map((flag: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 shrink-0">▲</span>
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {section.bestPractices && section.bestPractices.length > 0 && (
            <div>
              <h4 className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5" /> Best Practices
              </h4>
              <ul className="space-y-1.5">
                {section.bestPractices.map((bp: string, i: number) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5 shrink-0">✓</span>
                    <span>{bp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

export default function Playbooks() {
  const { data: playbooks, isLoading } = useListPlaybooks();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold font-mono tracking-tight">Consulting Playbooks</h1>
        <p className="text-muted-foreground mt-1">
          Structured frameworks and best practices · {playbooks?.length ?? 0} sections
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {(playbooks ?? []).map((section) => (
            <PlaybookSection key={section.id} section={section} />
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
