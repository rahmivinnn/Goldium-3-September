import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  Crown, 
  Calculator, 
  Timeline,
  TrendingUp,
  Users,
  Award,
  Map,
  Share2,
  Bot
} from 'lucide-react';

// Import all premium features
import { LivePriceChart } from '@/components/live-price-chart';
import { Leaderboard } from '@/components/leaderboard';
import { StakingCalculator } from '@/components/staking-calculator';
import { GoldCalculator } from '@/components/gold-calculator';
import { NFTBadgeSystem } from '@/components/nft-badge-system';

export default function PremiumFeatures() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      
      {/* HEADER */}
      <div className="relative z-10 pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent mb-4">
            PREMIUM FEATURES
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            Advanced tools and features for serious GOLDIUM traders and investors
          </p>
        </div>
      </div>

      {/* FEATURES NAVIGATION */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <Tabs defaultValue="charts" className="w-full">
          
          {/* FEATURE TABS */}
          <div className="flex justify-center mb-12">
            <TabsList className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex gap-2 overflow-x-auto scrollbar-hide">
              
              <TabsTrigger value="charts" className="flex items-center gap-2 px-4 py-2 rounded-xl min-w-[120px] font-body font-semibold text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white/15 data-[state=active]:to-white/5 data-[state=active]:text-white hover:bg-white/5">
                <BarChart3 className="w-4 h-4" />
                Charts
              </TabsTrigger>
              
              <TabsTrigger value="leaderboard" className="flex items-center gap-2 px-4 py-2 rounded-xl min-w-[120px] font-body font-semibold text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white/15 data-[state=active]:to-white/5 data-[state=active]:text-white hover:bg-white/5">
                <Crown className="w-4 h-4" />
                Leaderboard
              </TabsTrigger>
              
              <TabsTrigger value="calculators" className="flex items-center gap-2 px-4 py-2 rounded-xl min-w-[120px] font-body font-semibold text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white/15 data-[state=active]:to-white/5 data-[state=active]:text-white hover:bg-white/5">
                <Calculator className="w-4 h-4" />
                Calculators
              </TabsTrigger>
              
              <TabsTrigger value="badges" className="flex items-center gap-2 px-4 py-2 rounded-xl min-w-[120px] font-body font-semibold text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white/15 data-[state=active]:to-white/5 data-[state=active]:text-white hover:bg-white/5">
                <Award className="w-4 h-4" />
                NFT Badges
              </TabsTrigger>
              
              <TabsTrigger value="community" className="flex items-center gap-2 px-4 py-2 rounded-xl min-w-[120px] font-body font-semibold text-white/70 data-[state=active]:bg-gradient-to-r data-[state=active]:from-white/15 data-[state=active]:to-white/5 data-[state=active]:text-white hover:bg-white/5">
                <Users className="w-4 h-4" />
                Community
              </TabsTrigger>
              
            </TabsList>
          </div>

          {/* FEATURE CONTENT */}
          
          {/* CHARTS TAB */}
          <TabsContent value="charts" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <LivePriceChart />
              
              {/* COMING SOON: More Charts */}
              <Card className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
                <CardContent className="p-8 text-center">
                  <TrendingUp className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                  <h3 className="font-card-title text-white mb-2">Advanced Analytics</h3>
                  <p className="font-small text-white/70 mb-4">
                    Volume analysis, liquidity charts, and market depth coming soon
                  </p>
                  <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold">
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* LEADERBOARD TAB */}
          <TabsContent value="leaderboard" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <Leaderboard />
              </div>
              
              {/* COMMUNITY STATS */}
              <Card className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="font-card-title text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Community Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-400">2,847</div>
                    <div className="font-small text-white/70">Total Holders</div>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-400">+12.5%</div>
                    <div className="font-small text-white/70">Growth (7d)</div>
                  </div>
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-400">847K</div>
                    <div className="font-small text-white/70">Total Volume</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CALCULATORS TAB */}
          <TabsContent value="calculators" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <StakingCalculator />
              <GoldCalculator />
            </div>
          </TabsContent>

          {/* NFT BADGES TAB */}
          <TabsContent value="badges" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2">
                <NFTBadgeSystem />
              </div>
              
              {/* ACHIEVEMENTS PREVIEW */}
              <Card className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="font-card-title text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { name: 'First Swap', desc: 'Complete your first token swap', unlocked: true },
                    { name: 'Staking Master', desc: 'Stake GOLD for 30+ days', unlocked: true },
                    { name: 'Community Member', desc: 'Join our Discord/Twitter', unlocked: false },
                    { name: 'Whale Status', desc: 'Hold 10,000+ GOLD', unlocked: false },
                  ].map((achievement, i) => (
                    <div key={i} className={`p-3 rounded-lg ${achievement.unlocked ? 'bg-green-500/20 border border-green-500/30' : 'bg-black/20 border border-white/10'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <Award className={`w-4 h-4 ${achievement.unlocked ? 'text-green-400' : 'text-white/50'}`} />
                        <span className="font-small text-white font-medium">{achievement.name}</span>
                      </div>
                      <div className="font-small text-white/70">{achievement.desc}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* COMMUNITY TAB */}
          <TabsContent value="community" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              
              {/* BIG TRANSACTIONS FEED */}
              <Card className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="font-card-title text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Big Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { amount: '50,000 GOLD', type: 'STAKE', user: '7xKX...AsU', time: '2m ago' },
                    { amount: '25.5 SOL', type: 'SWAP', user: '9WzD...WWM', time: '5m ago' },
                    { amount: '75,000 GOLD', type: 'UNSTAKE', user: '4k3D...X6R', time: '8m ago' },
                  ].map((tx, i) => (
                    <div key={i} className="bg-black/30 border border-white/10 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-small text-yellow-400 font-bold">{tx.amount}</span>
                        <span className="font-small text-white/60">{tx.time}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-small text-white/70">{tx.user}</span>
                        <span className="font-small text-green-400">{tx.type}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* COMMUNITY GROWTH */}
              <Card className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="font-card-title text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-400 mb-1">2,847</div>
                    <div className="font-small text-white/70">Total Wallets</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">+347</div>
                    <div className="font-small text-white/70">New This Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">94.2%</div>
                    <div className="font-small text-white/70">Active Rate</div>
                  </div>
                </CardContent>
              </Card>

              {/* SOCIAL SHARING */}
              <Card className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
                <CardHeader>
                  <CardTitle className="font-card-title text-white flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Share Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                    Share to Twitter
                  </Button>
                  <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    Share to Discord
                  </Button>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                    Generate Card
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* BACK TO HOME */}
      <div className="fixed bottom-6 right-6">
        <Button 
          onClick={() => window.location.href = '/'}
          className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-3 rounded-xl shadow-2xl"
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}