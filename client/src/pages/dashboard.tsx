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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Metaverse Background Effects */}
      <div className="fixed inset-0 metaverse-grid opacity-20"></div>
      
      {/* Metaverse Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="metaverse-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 8}s`
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
                <div className="text-2xl font-black text-white">$GOLDIUM</div>
              </div>
              <div className="hidden md:flex items-center space-x-6">
                <a href="/" className="text-white/70 hover:text-white transition-colors font-medium">
                  Home
                </a>
                <a href="#portfolio" className="text-white font-medium">
                  Dashboard
                </a>
                <a href="#trading" className="text-white/70 hover:text-white transition-colors font-medium">
                  Trading
                </a>
                <a href="#analytics" className="text-white/70 hover:text-white transition-colors font-medium">
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2"><span className="metaverse-text metaverse-scan">Trading Dashboard</span></h1>
              <p className="text-white/70 text-lg">
                <span className="metaverse-typing">Real-time portfolio management and DeFi trading platform</span>
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
            <Card className="p-6 bg-black border-white/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-['Space_Grotesk']">
                  <Activity className="w-5 h-5 text-white" />
                  <span className="metaverse-text">Quick Stats</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-black border border-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1 font-['Orbitron']">+12.5%</div>
                    <div className="text-xs text-white/60 font-['Inter']">24h P&L</div>
                  </div>
                  <div className="text-center p-3 bg-black border border-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1 font-['Orbitron']">8</div>
                    <div className="text-xs text-white/60 font-['Inter']">Active Positions</div>
                  </div>
                  <div className="text-center p-3 bg-black border border-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1 font-['Orbitron']">$2.1K</div>
                    <div className="text-xs text-white/60 font-['Inter']">24h Volume</div>
                  </div>
                  <div className="text-center p-3 bg-black border border-white/10 rounded-lg">
                    <div className="text-2xl font-bold text-white mb-1 font-['Orbitron']">95%</div>
                    <div className="text-xs text-white/60 font-['Inter']">Win Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trading Interface */}
            <Card className="p-6 bg-black border-white/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-['Space_Grotesk']">
                  <TrendingUp className="w-5 h-5 text-white" />
                  <span className="metaverse-text">Trading Terminal</span>
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
            <Card className="p-6 bg-black border-white/10">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2 font-['Space_Grotesk']">
                  <BarChart3 className="w-5 h-5 text-white" />
                  <span className="metaverse-text">Market Insights</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-black border border-white/10 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-white font-['Inter']">SOL Bullish Signal</div>
                      <div className="text-xs text-white/60 font-['Inter']">RSI oversold, potential reversal</div>
                    </div>
                    <Badge className="bg-black border border-white/20 text-white font-['Inter']">Strong</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black border border-white/10 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-white font-['Inter']">GOLD Consolidation</div>
                      <div className="text-xs text-white/60 font-['Inter']">Range-bound trading expected</div>
                    </div>
                    <Badge className="bg-black border border-white/20 text-white font-['Inter']">Neutral</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-black border border-white/10 rounded-lg">
                    <div>
                      <div className="text-sm font-medium text-white font-['Inter']">DeFi TVL Rising</div>
                      <div className="text-xs text-white/60 font-['Inter']">Increased liquidity inflow</div>
                    </div>
                    <Badge className="bg-black border border-white/20 text-white font-['Inter']">Positive</Badge>
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
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2 font-['Space_Grotesk']">
                <Wallet className="w-6 h-6 text-white" />
                <span className="metaverse-text">Transaction History</span>
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