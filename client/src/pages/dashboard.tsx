import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RealTimePriceTicker } from '@/components/real-time-price-ticker';
import { RealTimeNotifications } from '@/components/real-time-notifications';
import { PortfolioAnalytics } from '@/components/portfolio-analytics';
import { SelfContainedSwapTab } from '@/components/self-contained-swap-tab';
import { SelfContainedStakingTab } from '@/components/self-contained-staking-tab';
import { RealSendTab } from '@/components/real-send-tab';
import { TransactionHistory } from '@/components/transaction-history';
import { useSolanaWallet, WalletMultiButton } from '@/components/solana-wallet-provider';
import { ExternalWalletSelector } from '@/components/external-wallet-selector';
import { 
  BarChart3, 
  TrendingUp, 
  Wallet, 
  Settings, 
  Bell, 
  RefreshCw,
  PieChart,
  Activity,
  DollarSign,
  Target,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const wallet = useSolanaWallet();

  return (
    <div className="min-h-screen bg-black cyber-grid text-white relative overflow-hidden">
      {/* Golden Sparkles Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Golden Sparkles */}
        {[...Array(10)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="golden-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 3}s`
            }}
          />
        ))}
        
        {/* Golden Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="golden-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 8}s`
            }}
          />
        ))}
        
        {/* Shooting Stars */}
        {[...Array(2)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="shooting-star"
            style={{
              top: `${Math.random() * 50 + 20}%`,
              width: `${Math.random() * 80 + 40}px`,
              animationDelay: `${Math.random() * 6 + i * 3}s`,
              animationDuration: `${Math.random() * 2 + 4}s`
            }}
          />
        ))}
        
        {/* Golden Glow Orbs */}
        {[...Array(2)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="golden-glow-orb"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 120 + 80}px`,
              height: `${Math.random() * 120 + 80}px`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 3 + 6}s`
            }}
          />
        ))}
      </div>
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <img 
                  src="/assets/goldium-logo.svg" 
                  alt="Goldium Logo" 
                  className="w-8 h-8 filter drop-shadow-lg"
                />
                <div className="text-2xl font-black holographic-gold golden-3d">$GOLDIUM</div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-golden-small hover:text-golden transition-colors font-medium">
                  Home
                </a>
                <a href="#portfolio" className="text-golden font-medium">
                  Dashboard
                </a>
                <a href="#trading" className="text-golden-small hover:text-golden transition-colors font-medium">
                  Trading
                </a>
                <a href="#analytics" className="text-golden-small hover:text-golden transition-colors font-medium">
                  Analytics
                </a>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
              <WalletMultiButton className="!bg-black hover:!bg-gray-900 !border-white/20" />
              <ExternalWalletSelector />
            </div>
          </div>
        </div>
      </nav>

      {/* Real-time Notifications */}
      <div className="fixed top-20 right-4 z-40 space-y-4 max-w-sm">
        <RealTimeNotifications className="shadow-2xl" maxNotifications={5} />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 relative">
        {/* SUBTLE DIGITAL RAIN */}
        <div className="matrix-rain">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="matrix-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${10 + Math.random() * 5}s`
              }}
            >
              {['•', '·', '○', '◦'][Math.floor(Math.random() * 4)]}
            </div>
          ))}
        </div>
        
        {/* ELEGANT PARTICLES */}
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="quantum-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`
            }}
          />
        ))}
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-main-title text-golden-large holographic-gold golden-3d mb-2">Trading Dashboard</h1>
              <p className="font-subtitle text-golden">
                Real-time portfolio management and DeFi trading platform
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </Button>
              <Button className="bg-black hover:bg-gray-900 text-white font-semibold border border-white/20">
                <Zap className="w-4 h-4 mr-2" />
                Quick Trade
              </Button>
            </div>
          </div>

          {/* Real-time Price Ticker */}
          <RealTimePriceTicker className="mb-8" showConnectionStatus={true} />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Portfolio Analytics */}
          <div className="xl:col-span-2 space-y-6">
            <PortfolioAnalytics className="" autoRefresh={true} />
          </div>

          {/* Right Column - Trading Interface */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6 bg-black border-white/10 premium-card refined-shimmer sophisticated-border ">
              <CardHeader className="pb-4">
                <CardTitle className="font-card-title text-golden flex items-center gap-2">
                  <Activity className="w-5 h-5 text-golden-small" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-black border border-white/10 rounded-lg">
                    <div className="font-stats holographic-gold mb-1">+12.5%</div>
                    <div className="font-small text-golden-small">24h P&L</div>
                  </div>
                  <div className="text-center p-3 bg-black border border-white/10 rounded-lg">
                    <div className="font-stats holographic-gold mb-1">8</div>
                    <div className="font-small text-golden-small">Active Positions</div>
                  </div>
                  <div className="text-center p-3 bg-black border border-white/10 rounded-lg">
                    <div className="font-stats holographic-gold mb-1">$2.1K</div>
                    <div className="font-small text-golden-small">24h Volume</div>
                  </div>
                  <div className="text-center p-3 bg-black border border-white/10 rounded-lg">
                    <div className="font-stats holographic-gold mb-1">95%</div>
                    <div className="font-small text-golden-small">Win Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trading Interface */}
            <Card className="p-6 bg-black border-white/10 premium-card refined-shimmer sophisticated-border ">
              <CardHeader className="pb-4">
                <CardTitle className="font-card-title text-golden flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-golden-small" />
                  Trading Terminal
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="swap" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-black border border-white/10">
                    <TabsTrigger value="swap" className="text-xs font-['Inter'] font-semibold">Swap</TabsTrigger>
                    <TabsTrigger value="stake" className="text-xs font-['Inter'] font-semibold">Stake</TabsTrigger>
                    <TabsTrigger value="send" className="text-xs font-['Inter'] font-semibold">Send</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="swap" className="mt-4">
                    <SelfContainedSwapTab />
                  </TabsContent>
                  
                  <TabsContent value="stake" className="mt-4">
                    <SelfContainedStakingTab />
                  </TabsContent>
                  
                  <TabsContent value="send" className="mt-4">
                    <RealSendTab />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Market Insights */}
            <Card className="p-6 bg-black border-white/10 premium-card refined-shimmer sophisticated-border ">
              <CardHeader className="pb-4">
                <CardTitle className="font-card-title text-golden flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-golden-small" />
                  Market Insights
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black border border-white/10 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-golden">SOL Bullish Signal</div>
                      <div className="text-xs text-golden-small">RSI oversold, potential reversal</div>
                    </div>
                    <Badge className="bg-black border border-white/20 text-golden-small">Strong</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black border border-white/10 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-golden">GOLD Consolidation</div>
                      <div className="text-xs text-golden-small">Range-bound trading expected</div>
                    </div>
                    <Badge className="bg-black border border-white/20 text-golden-small">Neutral</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black border border-white/10 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-golden">DeFi TVL Rising</div>
                      <div className="text-xs text-golden-small">Increased liquidity inflow</div>
                    </div>
                    <Badge className="bg-black border border-white/20 text-golden-small">Positive</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8">
          <Card className="p-6 bg-black border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="font-card-title text-golden flex items-center gap-2">
                <Wallet className="w-6 h-6 text-golden-small" />
                Transaction History
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <TransactionHistory />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}