import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Companies from "@/pages/companies";
import CompanyDetail from "@/pages/company-detail";
import SheiCards from "@/pages/shei-cards";
import SheiCardDetail from "@/pages/shei-card-detail";
import Signals from "@/pages/signals";
import Benchmarks from "@/pages/benchmarks";
import Playbooks from "@/pages/playbooks";
import Actions from "@/pages/actions";
import Ask from "@/pages/ask";
import Timeline from "@/pages/timeline";
import Feeds from "@/pages/feeds";
import MeetingPrep from "@/pages/meeting-prep";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/companies" component={Companies} />
        <Route path="/companies/:id" component={CompanyDetail} />
        <Route path="/shei-cards" component={SheiCards} />
        <Route path="/shei-cards/:id" component={SheiCardDetail} />
        <Route path="/signals" component={Signals} />
        <Route path="/timeline" component={Timeline} />
        <Route path="/benchmarks" component={Benchmarks} />
        <Route path="/playbooks" component={Playbooks} />
        <Route path="/actions" component={Actions} />
        <Route path="/ask" component={Ask} />
        <Route path="/feeds" component={Feeds} />
        <Route path="/meeting-prep" component={MeetingPrep} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
