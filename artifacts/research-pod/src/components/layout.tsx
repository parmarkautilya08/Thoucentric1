import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Building2, Layers, Activity, BarChart2, BookOpen, RefreshCw } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshStatus, setRefreshStatus] = useState<"idle" | "ok" | "error">("idle");

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/companies", label: "Companies", icon: Building2 },
    { href: "/shei-cards", label: "SHEI Cards", icon: Layers },
    { href: "/signals", label: "Signals", icon: Activity },
    { href: "/benchmarks", label: "Benchmarks", icon: BarChart2 },
    { href: "/playbooks", label: "Playbooks", icon: BookOpen },
  ];

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    setRefreshStatus("idle");
    try {
      const res = await fetch("/api/admin/reseed", { method: "POST" });
      if (res.ok) {
        setRefreshStatus("ok");
        setTimeout(() => {
          setRefreshStatus("idle");
          window.location.reload();
        }, 1500);
      } else {
        setRefreshStatus("error");
        setTimeout(() => setRefreshStatus("idle"), 3000);
      }
    } catch {
      setRefreshStatus("error");
      setTimeout(() => setRefreshStatus("idle"), 3000);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl font-bold tracking-tight text-primary font-mono">INDUSTRY POD</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Thoucentric FMCG Intelligence</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Refresh Button */}
        <div className="p-4 border-t border-border">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md text-xs font-medium transition-all ${
              refreshStatus === "ok"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : refreshStatus === "error"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground border border-border"
            }`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing
              ? "Refreshing data..."
              : refreshStatus === "ok"
              ? "Refreshed! Reloading..."
              : refreshStatus === "error"
              ? "Refresh failed"
              : "Refresh Data"}
          </button>
          <p className="text-xs text-muted-foreground text-center mt-1.5 leading-tight">
            Re-seeds all intelligence data
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
