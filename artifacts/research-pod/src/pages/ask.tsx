import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Bot, User, Lightbulb, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

const STARTER_QUESTIONS = [
  "Why is Marico underperforming on demand forecasting?",
  "What should I pitch to a Dabur CSCO right now?",
  "Top 3 supply chain risks in India FMCG for FY26?",
  "How does HUL's quick-commerce readiness compare to P&G?",
  "What's the financial impact of Mondelez's cocoa crisis?",
  "Which India FMCG companies have the biggest procurement gap?",
  "What are the top consulting opportunities in sustainable packaging?",
  "How does P&G's demand sensing benchmark compare to India FMCG?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  loading?: boolean;
}

export default function Ask() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (question: string) => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: q },
      { role: "assistant", content: "", loading: true },
    ]);
    setLoading(true);

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Server error" }));
        setMessages((prev) =>
          prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, loading: false, content: `Error: ${err.error}` } : m
          )
        );
        return;
      }

      const data = await res.json();
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, loading: false, content: data.answer } : m
        )
      );
    } catch (err) {
      setMessages((prev) =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, loading: false, content: `Network error: ${String(err)}` } : m
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-in fade-in duration-300 max-w-4xl">
      <div className="mb-4 shrink-0">
        <h1 className="text-3xl font-bold font-mono tracking-tight">Ask Anything</h1>
        <p className="text-muted-foreground mt-1">
          AI-powered FMCG intelligence · Grounded in 15 companies + SHEI signals + KPI benchmarks
        </p>
      </div>

      {/* Starter Questions */}
      {messages.length === 0 && (
        <div className="mb-6 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-muted-foreground">Suggested questions</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {STARTER_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-left px-3 py-2.5 rounded-lg border border-border bg-card hover:border-primary/50 hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground flex items-center gap-2 group"
              >
                <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 group-hover:translate-x-0.5 transition-transform" />
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div className={`max-w-[85%] ${msg.role === "user" ? "bg-primary/20 border-primary/30" : "bg-card border-border"} border rounded-xl px-4 py-3`}>
              {msg.loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-3 w-48" />
                  <Skeleton className="h-3 w-64" />
                  <Skeleton className="h-3 w-40" />
                </div>
              ) : msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_strong]:text-foreground [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_ul]:space-y-1 [&_li]:text-muted-foreground">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
            {msg.role === "user" && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="mt-4 shrink-0">
        {messages.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {STARTER_QUESTIONS.slice(0, 3).map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={loading}
                className="text-xs px-2.5 py-1.5 rounded-md border border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all disabled:opacity-40"
              >
                {q.length > 45 ? q.slice(0, 45) + "…" : q}
              </button>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="flex gap-3 items-end"
        >
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              disabled={loading}
              placeholder="Ask about any FMCG company, supply chain challenge, or consulting opportunity..."
              rows={2}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/50 transition-colors disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="shrink-0 w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Powered by Replit AI · Grounded in Thoucentric FMCG intelligence database
        </p>
      </div>
    </div>
  );
}
