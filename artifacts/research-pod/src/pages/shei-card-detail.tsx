import { useRoute, Link } from "wouter";
import { useGetSheiCard } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, TrendingUp, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const FRAMEWORK = [
  { key: "signal", label: "S", title: "Signal", color: "text-blue-400", border: "border-l-blue-500" },
  { key: "hypothesis", label: "H", title: "Hypothesis", color: "text-amber-400", border: "border-l-amber-500" },
  { key: "evidence", label: "E", title: "Evidence", color: "text-emerald-400", border: "border-l-emerald-500" },
  { key: "implication", label: "I", title: "Implication", color: "text-primary", border: "border-l-primary" },
] as const;

export default function SheiCardDetail() {
  const [, params] = useRoute("/shei-cards/:id");
  const id = Number(params?.id);
  const { data: card, isLoading } = useGetSheiCard(id);

  if (isLoading) return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-96 rounded-xl" />
    </div>
  );

  if (!card) return (
    <div className="flex flex-col items-center justify-center py-16">
      <p className="text-muted-foreground">SHEI card not found</p>
      <Link href="/shei-cards" className="text-primary text-sm mt-2 hover:underline">← Back to SHEI Cards</Link>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <Link href="/shei-cards">
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> SHEI Cards
        </button>
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-mono text-muted-foreground">#{String(card.id).padStart(3, "0")} · {card.category}</span>
          <Badge variant="outline" className="text-xs">{card.status}</Badge>
          {card.urgency && <Badge variant="outline" className="text-xs">{card.urgency.replace("_", " ")}</Badge>}
        </div>
        <h1 className="text-2xl font-bold font-mono tracking-tight leading-snug">{card.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FRAMEWORK.map(({ key, label, title, color, border }) => {
          const value = (card as any)[key];
          return (
            <Card key={key} className={`bg-card border border-border border-l-4 ${border}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className={`font-mono font-bold ${color}`}>{label}</span>
                  <span className="text-muted-foreground">— {title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{value || "—"}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {card.consultingAction && (
        <Card className="bg-primary/5 border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-primary">
              <TrendingUp className="h-4 w-4" />
              Consulting Action
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{card.consultingAction}</p>
          </CardContent>
        </Card>
      )}

      {card.dataGap && (
        <Card className="bg-amber-500/5 border-amber-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-amber-400">
              <AlertTriangle className="h-4 w-4" />
              Data Gap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{card.dataGap}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
