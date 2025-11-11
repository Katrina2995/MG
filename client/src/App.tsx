import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import BlogListPage from "@/pages/blog-list";
import PostDetailPage from "@/pages/post-detail";
import AdminDashboardPage from "@/pages/admin-dashboard";
import PostEditorPage from "@/pages/post-editor";
import DemoLogosPage from "@/pages/demo-logos";

function Router() {
  return (
    <Switch>
      <Route path="/demo/logos" component={DemoLogosPage} />
      <Route path="/blog" component={BlogListPage} />
      <Route path="/blog/login" component={LoginPage} />
      <Route path="/blog/post/:slug" component={PostDetailPage} />
      <Route path="/blog/admin" component={AdminDashboardPage} />
      <Route path="/blog/new" component={PostEditorPage} />
      <Route path="/blog/edit/:id" component={PostEditorPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
