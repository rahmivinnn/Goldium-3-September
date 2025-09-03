import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SolanaWalletProvider } from "@/components/solana-wallet-provider";
import Home from "@/pages/home-simple";
import { About } from "@/pages/about";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import SplashScreen from "@/components/splash-screen";
import { ErrorBoundary } from "@/components/error-boundary";
import { useState, useEffect } from "react";

function Router() {
  console.log('🗺️ Router is rendering...');
  
  try {
    return (
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    );
  } catch (error) {
    console.error('🚨 Router error:', error);
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Router Error</h1>
          <p className="text-gray-300">Failed to load application routes.</p>
        </div>
      </div>
    );
  }
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    console.log('🎬 Splash screen completed, transitioning to main app...');
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  console.log('🚀 Main app is rendering...');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SolanaWalletProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </SolanaWalletProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
