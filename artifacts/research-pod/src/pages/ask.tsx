import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Send, Bot, User, Lightbulb, ChevronRight, RotateCcw, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";

const STARTER_QUESTIONS = [
  "What should I pitch to a Dabur CSCO right now?",
  "How does Coca-Cola's SC model compare to PepsiCo India?",
  "Top 3 supply chain risks in India FMCG for FY26?",
  "What's Kraft Heinz's supply chain transformation status?",
  "Which global FMCG companies have the biggest procurement gaps?",
  "What's the financial impact of Mondelez's cocoa crisis on margins?",
  "How does Nestlé global's demand sensing benchmark vs. HUL India?",
  "Analyse Diageo's India SC strategy and where Thoucentric can play",
  "What are the top consulting opportunities in sustainable packaging?",
  "How is AB InBev managing distribution in emerging markets?",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

export default function Ask() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const clearChat = () => {
    if (loading && abortRef.current) {
      abortRef.current.abort();
      setLoading(false);
    }
    setMessages([]);
  };

  const send = async (question: string) => {
    if (!question.trim() || loading) return;
    const q = question.trim();
    setInput("");

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: q },
      { role: "assistant", content: "", streaming: true },
    ];
    setMessages(updatedMessages);
    setLoading(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const history = updatedMessages
        .filter(m => !m.streaming)
        .concat({ role: "user", content: q })
        .filter(m => m.content.trim().length > 0);

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(m => ({ role: m.role, content: m.content })),
        }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({ error: "Server error" }));
        setMessages(prev =>
          prev.map((m, i) =>
            i === prev.length - 1
              ? { ...m, streaming: false, content: `⚠️ Error: ${err.error}` }
              : m
          )
        );
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.content) {
              accumulated += parsed.content;
              const snapshot = accumulated;
              setMessages(prev =>
                prev.map((m, i) =>
                  i === prev.length - 1
                    ? { ...m, content: snapshot, streaming: true }
                    : m
                )
              );
            }
          } catch {
            // ignore parse errors
          }
        }
      }

      setMessages(prev =>
        prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, streaming: false } : m
        )
      );
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") return;
      setMessages(prev =>
        prev.map((m, i) =>
          i === prev.length - 1
            ? { ...m, streaming: false, content: `⚠️ Network error: ${String(err)}` }
            : m
        )
      );
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-in fade-in duration-300 max-w-4xl">
      {/* Header */}
      <div className="mb-4 shrink-0 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold font-mono tracking-tight">Ask Anything</h1>
            <Badge variant="outline" className="border-green-500/40 text-green-400 text-xs gap-1">
              <Globe className="h-3 w-3" />
              Global FMCG
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Any FMCG company worldwide · Supply chain · Procurement · Consulting angles · Powered by AI
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border rounded-lg px-3 py-2 transition-colors hover:border-border/80"
          >
            <RotateCcw className="h-3 w-3" />
            New chat
          </button>
        )}
      </div>

      {/* Starter Questions */}
      {messages.length === 0 && (
        <div className="mb-6 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium text-muted-foreground">
              Ask about any company — tracked or not
            </span>
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
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div
              className={`max-w-[88%] ${
                msg.role === "user"
                  ? "bg-primary/20 border-primary/30"
                  : "bg-card border-border"
              } border rounded-xl px-4 py-3`}
            >
              {msg.role === "assistant" && msg.content === "" && msg.streaming ? (
                <div className="space-y-2 py-1">
                  <Skeleton className="h-3 w-52" />
                  <Skeleton className="h-3 w-72" />
                  <Skeleton className="h-3 w-44" />
                </div>
              ) : msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none text-sm leading-relaxed [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_strong]:text-foreground [&_h1]:text-base [&_h2]:text-sm [&_h3]:text-sm [&_ul]:space-y-1 [&_li]:text-muted-foreground">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                  {msg.streaming && (
                    <span className="inline-block w-1.5 h-3.5 bg-primary/70 animate-pulse ml-0.5 align-middle rounded-sm" />
                  )}
                </div>
              ) : (
                <p className="text-sm">{msg.content}</p>
              )}
            </div>
            {msg.role === "user" && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center mt-0.5">
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
            {STARTER_QUESTIONS.slice(0, 4).map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={loading}
                className="text-xs px-2.5 py-1.5 rounded-md border border-border bg-card hover:border-primary/50 text-muted-foreground hover:text-foreground transition-all disabled:opacity-40"
              >
                {q.length > 50 ? q.slice(0, 50) + "…" : q}
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
              placeholder="Ask about Kraft Heinz, Coca-Cola, HUL, Danone, or any FMCG company worldwide…"
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
          Streaming · Conversation memory within session · Grounded in Thoucentric FMCG intelligence
        </p>
      </div>
    </div>
  );
}
