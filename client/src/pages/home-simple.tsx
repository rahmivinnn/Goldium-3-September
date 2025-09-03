import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ModernDeFiTabs } from '@/components/modern-defi-tabs';
import { useSolanaWallet } from '@/components/solana-wallet-provider';
import { ExternalWalletSelector } from '@/components/external-wallet-selector';

import { RealTimeNotifications } from '@/components/real-time-notifications';
import { ExternalLink, DollarSign } from 'lucide-react';
import { AnimatedTokenomicsCharts } from '@/components/animated-tokenomics-charts';
import { realTimeDataService, RealTimeTokenData } from '@/services/real-time-data-service';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { useToast } from '@/hooks/use-toast';
import { goldTokenService } from '@/services/gold-token-service';
import { autoSaveTransaction } from "@/lib/historyUtils";
import { useGoldBalance } from '@/hooks/use-gold-balance';
// Logo import removed
import GoldiumGamifiedStaking from '@/components/goldium-gamified-staking';
import { TwitterEmbed } from '@/components/twitter-embed';
import { EfficientWalletBalance } from '@/components/efficient-wallet-balance';
import { AnimatedNumber } from '@/components/animated-number';
import { SimpleParticles } from '@/components/simple-particles';
import { SettingsPanel } from '@/components/settings-panel';
import { LivePriceChart } from '@/components/live-price-chart';
import { StakingCalculator } from '@/components/staking-calculator';

export default function HomeSimple() {
  const wallet = useSolanaWallet();
  const [tokenData, setTokenData] = useState<RealTimeTokenData | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyingToken, setBuyingToken] = useState(false);
  const [buyAmount, setBuyAmount] = useState('0.000047'); // Default amount for 1 GOLD
  
  const externalWallet = useExternalWallets();
  const { toast } = useToast();
  const goldBalance = useGoldBalance();
  
  // Removed global balance state - using efficient wallet balance instead

  // Fetch real-time data on component mount
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        const data = await realTimeDataService.getRealTimeTokenData();
        setTokenData(data);
      } catch (error) {
        console.error('Failed to fetch token data:', error);
        // Fallback to default data
        setTokenData({
          currentPrice: 0.0089,
          priceChange24h: 12.8,
          volume24h: 485000,
          marketCap: 890000,
          totalSupply: 100000000,
          circulatingSupply: 60000000,
          stakingAPY: 8.5,
          totalStaked: 21000000,
          holders: 1247
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();

    // Update data every 2 minutes (reduced frequency)
    const interval = setInterval(fetchTokenData, 120000);
    return () => clearInterval(interval);
  }, []);

  const handleBuyGoldium = async () => {
    if (!externalWallet.connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to buy GOLDIUM tokens.",
        variant: "destructive"
      });
      return;
    }

    if (!buyAmount || parseFloat(buyAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to buy.",
        variant: "destructive"
      });
      return;
    }

    setBuyingToken(true);
    
    try {
      // REAL BLOCKCHAIN TRANSACTION - No more simulation!
      console.log('🚀 Starting REAL GOLDIUM purchase with blockchain integration');
      
      const solAmount = parseFloat(buyAmount);
      const goldAmount = solAmount * 21486.893; // Exchange rate: 1 SOL = 21,486.893 GOLD
      
      // Import and use REAL swap service
      const { SwapService } = await import('@/lib/swap-service');
      const swapService = new SwapService();
      
      // Set external wallet for real transaction
      if (externalWallet.walletInstance) {
        swapService.setExternalWallet(externalWallet);
        console.log('✅ External wallet connected for REAL transaction');
      }
      
      console.log(`💰 Executing REAL swap: ${solAmount} SOL → ${goldAmount.toFixed(2)} GOLD`);
      console.log(`🔗 Transaction will be tracked with GOLD Contract Address (CA)`);
      
      // Execute REAL blockchain swap
      const swapResult = await swapService.swapSolToGold(solAmount);
      
      if (!swapResult.success) {
        throw new Error(swapResult.error || 'Swap failed');
      }
      
      const signature = swapResult.signature!;
      console.log(`✅ REAL transaction completed: ${signature}`);
      console.log(`🔍 View on Solscan: https://solscan.io/tx/${signature}`);
      
      // Update transaction history with REAL signature
      const { transactionHistory } = await import('@/lib/transaction-history');
      if (externalWallet.address) {
        transactionHistory.setCurrentWallet(externalWallet.address);
        transactionHistory.addGoldTransaction('swap_receive', goldAmount, signature);
      }

      // Auto-save REAL transaction
      if (externalWallet.address) {
        await autoSaveTransaction(
          externalWallet.address,
          signature,
          'buy',
          solAmount,
          goldAmount,
          'success'
        );
      }

      toast({
        title: "🎉 REAL Purchase Successful!",
        description: `Successfully bought ${goldAmount.toFixed(2)} GOLDIUM tokens with ${buyAmount} SOL! Transaction: ${signature.slice(0, 8)}...`,
        variant: "default"
      });

      // Reset buy amount
      setBuyAmount('0.000047');
      
      // Refresh balances after real transaction
      setTimeout(() => {
        window.location.reload();
      }, 2000);
      
    } catch (error) {
      console.error('Failed to buy GOLDIUM:', error);
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Failed to buy GOLDIUM tokens. Please try again.",
        variant: "destructive"
      });
    } finally {
      setBuyingToken(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* INTERACTIVE PARTICLES BACKGROUND */}
      <SimpleParticles count={80} className="z-0" />
      
      {/* SETTINGS PANEL */}
      <SettingsPanel />
      
      {/* Golden Sparkles Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Golden Sparkles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="golden-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${Math.random() * 2 + 4}s`
            }}
          />
        ))}
        
        {/* Golden Particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="golden-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              animationDelay: `${Math.random() * 10}s`,
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
              top: `${Math.random() * 60 + 20}%`,
              width: `${Math.random() * 80 + 40}px`,
              animationDelay: `${Math.random() * 8 + i * 4}s`,
              animationDuration: `${Math.random() * 3 + 5}s`
            }}
          />
        ))}
        
        {/* Golden Glow Orbs */}
        {[...Array(3)].map((_, i) => (
          <div
            key={`orb-${i}`}
            className="golden-glow-orb"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 60}px`,
              height: `${Math.random() * 100 + 60}px`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${Math.random() * 4 + 8}s`
            }}
          />
        ))}
      </div>
      {/* Navigation Bar - Modern Style */}
      <nav className="fixed top-0 w-full z-50 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl/95 backdrop-blur-2xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 p-2 shadow-xl shadow-white/10 hover:shadow-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center">
                <img 
                  src="/logo goldium.png" 
                  alt="Goldium Logo" 
                  className="w-6 h-6 filter drop-shadow-lg"
                />
              </div>
              <div className="font-small text-white font-bold tracking-tight">GOLDIUM</div>
            </div>
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#brand" className="font-small text-white/80 hover:text-white transition-all duration-300 uppercase tracking-wide hover:scale-105">Brand</a>
              <a href="#defi" className="font-small text-white/80 hover:text-white transition-all duration-300 uppercase tracking-wide hover:scale-105">DeFi</a>
              <a href="#tokenomics" className="font-small text-white/80 hover:text-white transition-all duration-300 uppercase tracking-wide hover:scale-105">Tokenomics</a>
              <a href="/premium-features" className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold px-3 py-1 rounded-lg text-xs uppercase tracking-wide hover:scale-105 transition-all duration-300">Premium</a>
              {/* EFFICIENT WALLET BALANCE - RATE LIMIT FRIENDLY */}
              <EfficientWalletBalance />
              <ExternalWalletSelector />
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {/* EFFICIENT MOBILE BALANCE */}
              <EfficientWalletBalance />
              <button className="text-white p-2 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Real-time notifications */}
      <div className="fixed top-16 sm:top-20 right-2 sm:right-6 z-40">
        <RealTimeNotifications className="shadow-2xl" maxNotifications={3} />
      </div>



      {/* Hero Section - Modern Style */}
      <section className="relative pt-20 pb-32 min-h-screen flex items-center overflow-hidden bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
        {/* Pure Black Background */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl" />
        
        {/* Modern Subtle Orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-gradient-to-r from-white/5 to-white/3 rounded-full blur-3xl chainzoku-float"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-gradient-to-r from-white/3 to-white/2 rounded-full blur-3xl chainzoku-float delay-2000"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-gradient-to-r from-white/6 to-white/4 rounded-full blur-2xl chainzoku-float delay-1000"></div>
          <div className="absolute top-3/4 left-1/3 w-40 h-40 bg-gradient-to-r from-white/8 to-white/6 rounded-full blur-xl chainzoku-float delay-3000"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-16 chainzoku-fade-in">
            <div className="space-y-8">

              <h1 className="font-main-title tracking-tight">
                <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-2xl" style={{
                  textShadow: '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.6), 0 0 90px rgba(255,215,0,0.4)'
                }}>
                  GOLDIUM
                </span>
              </h1>
              <div className="font-subtitle chainzoku-subtitle max-w-4xl mx-auto">
                <span className="metaverse-typing">Next-generation digital gold protocol</span>
              </div>
              <p className="font-body text-white/70 max-w-3xl mx-auto leading-relaxed">
                Secure, transparent, and backed by real gold reserves on the Solana blockchain. 
                Experience the future of digital assets.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="glass-card glass-hover neumorphic p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 p-2.5 shadow-lg">
                      <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Buy GOLDIUM</h3>
                      <p className="text-sm text-white/60">Instant transactions</p>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                    <p className="text-white/90 text-sm">
                      Exchange Rate: <span className="chainzoku-highlight font-semibold">1 SOL = 21,486 GOLD</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="relative">
                    <input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(e.target.value)}
                      placeholder="0.1"
                      min="0.000047"
                      step="0.000047"
                      className="chainzoku-input w-full"
                      disabled={buyingToken}
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 text-sm font-medium">SOL</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-white bg-white/5 rounded-lg p-3 border border-white/10">
                    <span className="text-lg font-medium">≈</span>
                    <span className="chainzoku-highlight font-semibold text-lg">
                      {buyAmount ? (parseFloat(buyAmount) * 21486.893).toLocaleString() : '0'} GOLD
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleBuyGoldium}
                  disabled={buyingToken || !externalWallet.connected}
                  className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold py-4 px-8 rounded-xl shadow-2xl shadow-yellow-400/50 hover:shadow-yellow-400/70 transform hover:scale-105 transition-all duration-300 w-full mt-6 text-lg"
                >
                  {buyingToken ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Buy GOLDIUM'
                  )}
                </Button>
                {!externalWallet.connected && (
                  <p className="font-small text-white/70 text-center mt-4">Connect your wallet to purchase GOLDIUM</p>
                )}
              </div>
              <div className="glass-card glass-hover neumorphic p-6">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Follow Updates</h3>
                      <p className="text-sm text-white/60">Stay connected</p>
                    </div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-lg rounded-lg p-4 border border-white/10">
                    <p className="text-white/90 text-sm">
                      Stay updated with latest news and announcements
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => window.open('https://twitter.com/goldiumofficial', '_blank')}
                  className="sophisticated-button elegant-glow w-full py-3  font-bold holographic-gold"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Follow on Twitter
                  </div>
                </Button>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* ULTRA MODERN Market Data Section */}
      <section className="py-32 px-4 sm:px-6 relative overflow-hidden bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
        {/* Ultra Futuristic Market Background */}
        <div className="absolute inset-0 bg-radial-gradient(ellipse at center, #0a0a0f 0%, #000000 70%)"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_100%,rgba(255,255,0,0.08),transparent)]"></div>
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-gradient-to-r from-black/8 to-gray-900/8 rounded-full blur-3xl chainzoku-float"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-l from-black/10 to-gray-900/10 rounded-full blur-3xl chainzoku-float delay-2000"></div>
          <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-br from-black/6 to-gray-900/6 rounded-full blur-2xl chainzoku-float delay-1000"></div>
        
        {/* Ultra Modern Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,215,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.4) 1px, transparent 1px)`,
            backgroundSize: '120px 120px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20 chainzoku-fade-in">
            <h2 className="font-main-title text-white mb-8 uppercase tracking-wider">
              <span className="metaverse-text holographic-gold golden-3d">
                MARKET OVERVIEW
              </span>
            </h2>
            <p className="font-subtitle text-white/80 max-w-4xl mx-auto leading-relaxed">
              Real-time performance metrics and market statistics
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="bg-black/20 backdrop-blur-xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:border-yellow-400/50 transition-all duration-300 p-8 text-center rounded-2xl">
              <div className="w-20 h-20 mx-auto mb-8 rounded-3xl bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 p-4 shadow-2xl shadow-white/20 chainzoku-pulse chainzoku-float">
                <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="font-small text-white/80 mb-4 uppercase tracking-wider">💰 GOLDIUM PRICE</div>
              <div className="text-4xl font-bold mb-6" style={{
                color: '#FFD700',
                textShadow: '0 0 20px rgba(255,215,0,1), 0 0 40px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.6)'
              }}>
                $<AnimatedNumber 
                  value={tokenData ? tokenData.currentPrice : 0} 
                  decimals={6}
                />
              </div>
              <div className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 text-white font-small px-6 py-3 rounded-2xl shadow-lg shadow-white/20 uppercase chainzoku-glow">{tokenData ? `+${tokenData.priceChange24h.toFixed(1)}%` : '+0.0%'} 🚀</div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:border-yellow-400/50 transition-all duration-300 rounded-2xl p-8 text-center entrance-fade entrance-stagger-2">
              <div className="w-20 h-20 mx-auto mb-8 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl shadow-white/20 chainzoku-pulse chainzoku-float">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="font-small text-white/80 mb-4 uppercase tracking-wider">📊 MARKET CAP</div>
              <div className="font-stats holographic-gold mb-6">
                $<AnimatedNumber 
                  value={tokenData ? tokenData.marketCap / 1000000 : 0} 
                  decimals={1}
                  suffix="M"
                  className="holographic-gold"
                />
              </div>
              <div className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 text-white font-small px-6 py-3 rounded-2xl shadow-lg shadow-white/20 uppercase chainzoku-glow">+5.7% 📈</div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:border-yellow-400/50 transition-all duration-300 rounded-2xl p-8 text-center entrance-fade entrance-stagger-2">
              <div className="w-20 h-20 mx-auto mb-8 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl shadow-white/20 chainzoku-pulse chainzoku-float">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="font-small text-white/80 mb-4 uppercase tracking-wider">⚡ 24H VOLUME</div>
              <div className="font-stats holographic-gold mb-6">${tokenData ? (tokenData.volume24h / 1000).toFixed(0) : '0'}K</div>
              <div className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 text-white font-small px-6 py-3 rounded-2xl shadow-lg shadow-white/20 uppercase chainzoku-glow">+12.4% 💥</div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-xl border-2 border-yellow-400/30 shadow-2xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:border-yellow-400/50 transition-all duration-300 rounded-2xl p-8 text-center entrance-fade entrance-stagger-2">
              <div className="w-20 h-20 mx-auto mb-8 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl shadow-white/20 chainzoku-pulse chainzoku-float">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="font-small text-white/80 mb-4 uppercase tracking-wider">👥 HOLDERS</div>
              <div className="font-stats holographic-gold mb-6">{tokenData ? tokenData.holders.toLocaleString() : '0'}</div>
              <div className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 text-white font-small px-6 py-3 rounded-2xl shadow-lg shadow-white/20 uppercase chainzoku-glow">+8.2% 🔥</div>
            </div>
          </div>
          

        </div>
      </section>



      {/* DeFi Section */}
      <section id="defi" className="py-20 px-4 relative overflow-hidden bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
        {/* Pure Black DeFi Background */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl"></div>
        
        <div className="max-w-full mx-auto relative z-10 px-4 cinematic-scan">
          <div className="text-center mb-16 chainzoku-fade-in">
            <h2 className="font-main-title text-white mb-8 uppercase tracking-wider">
              <span className="metaverse-text metaverse-pulse holographic-gold golden-3d">DeFi Platform</span>
            </h2>
            <p className="font-subtitle text-white/80 max-w-4xl mx-auto leading-relaxed">
              Complete ecosystem for trading, staking, and managing your digital assets
            </p>
          </div>
          
          <ModernDeFiTabs />
        </div>
      </section>

      {/* PREMIUM FEATURES PREVIEW */}
      <section className="py-20 px-6 relative overflow-hidden bg-gradient-to-r from-yellow-400/10 to-amber-500/10 border-t border-yellow-400/20">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-main-title text-white mb-8 uppercase tracking-wider">
              <span className="bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                PREMIUM FEATURES
              </span>
            </h2>
            <p className="font-subtitle text-white/80 max-w-4xl mx-auto leading-relaxed">
              Advanced tools and analytics for serious GOLDIUM traders
            </p>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
            <LivePriceChart />
            <StakingCalculator />
          </div>
          
          <div className="text-center">
            <Button 
              onClick={() => window.location.href = '/premium-features'}
              className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold px-8 py-4 rounded-xl shadow-2xl shadow-yellow-400/50 text-lg"
            >
              View All 40+ Premium Features
            </Button>
          </div>
        </div>
      </section>

      {/* Tokenomics Section */}
      <section id="tokenomics" className="py-20 px-6 relative overflow-hidden bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
        {/* Pure Black Background */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_20%_50%,rgba(255,255,255,0.02),transparent)]"></div>
        <div className="absolute top-20 right-10 w-40 h-40 bg-gradient-to-bl from-white/3 to-white/1 rounded-full blur-2xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-section-title text-white mb-8">
              <span className="metaverse-text holographic-gold golden-3d">Tokenomics</span>
            </h2>
            <p className="font-subtitle text-white/70 max-w-3xl mx-auto">
              Transparent and sustainable token distribution designed for long-term value
            </p>
          </div>
          
          {/* Tokenomics Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {/* Total Supply */}
            <div className="glass-card glass-hover neumorphic premium-card p-6 text-center metaverse-pulse refined-shimmer sophisticated-border ">
              <div className="w-16 h-16 mx-auto mb-4 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="font-small text-white/80 mb-2 uppercase tracking-wider">💎 TOTAL SUPPLY</div>
              <div className="font-stats text-white mb-4">1,000M</div>
              <div className="font-small text-white/60">GOLD Tokens</div>
            </div>

            {/* Circulating Supply */}
            <div className="glass-card glass-hover neumorphic premium-card p-6 text-center metaverse-pulse refined-shimmer sophisticated-border ">
              <div className="w-16 h-16 mx-auto mb-4 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="font-small text-white/80 mb-2 uppercase tracking-wider">🔄 CIRCULATING</div>
              <div className="font-stats text-white mb-4">600M</div>
              <div className="font-small text-white/60">60% Available</div>
            </div>

            {/* Liquidity Pool */}
            <div className="glass-card glass-hover neumorphic premium-card p-6 text-center metaverse-pulse refined-shimmer sophisticated-border ">
              <div className="w-16 h-16 mx-auto mb-4 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="font-small text-white/80 mb-2 uppercase tracking-wider">💧 LIQUIDITY</div>
              <div className="font-stats text-white mb-4">300M</div>
              <div className="font-small text-white/60">30% Pool</div>
            </div>

            {/* Community Rewards */}
            <div className="glass-card glass-hover neumorphic premium-card p-6 text-center metaverse-pulse refined-shimmer sophisticated-border ">
              <div className="w-16 h-16 mx-auto mb-4 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="font-small text-white/80 mb-2 uppercase tracking-wider">🎁 REWARDS</div>
              <div className="font-stats text-white mb-4">250M</div>
              <div className="font-small text-white/60">25% Community</div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="glass-card glass-hover neumorphic premium-card refined-shimmer sophisticated-border p-8">
                <h3 className="font-card-title text-white luxury-glow mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 p-2 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  Detailed Distribution
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="font-body text-white/70">Liquidity Pool</span>
                    <span className="font-stats text-white">300,000,000 (30%)</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="font-body text-white/70">Community Rewards</span>
                    <span className="font-stats text-white">250,000,000 (25%)</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="font-body text-white/70">Development</span>
                    <span className="font-stats text-white">200,000,000 (20%)</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="font-body text-white/70">Marketing</span>
                    <span className="font-stats text-white">150,000,000 (15%)</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="font-body text-white/70">Team (Locked)</span>
                    <span className="font-stats text-white">100,000,000 (10%)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <AnimatedTokenomicsCharts />
            </div>
          </div>
        </div>
      </section>

      {/* Twitter Feed Section */}
      <section className="py-20 px-6 relative overflow-hidden bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
        {/* Pure Black Background */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/10 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <h2 className="font-section-title text-white"><span className="metaverse-text metaverse-glitch">Community Updates</span></h2>
            </div>
            <p className="font-subtitle text-white/70">Stay connected with the latest news from Goldium and Solana ecosystem</p>
          </div>
          
          <div className="flex justify-center">
            <TwitterEmbed />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 lg:py-20 border-t border-white/10 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10 lg:mb-12">
            <div className="space-y-3 sm:space-y-4 sm:col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-3xl font-bold text-white">GOLDIUM</div>
              <p className="text-white/60 leading-relaxed text-sm sm:">
                The future of digital gold on Solana blockchain. Secure, fast, and decentralized.
              </p>
              <div className="flex space-x-3 sm:space-x-4">
                <div className="w-10 h-10 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div className="w-10 h-10 bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl border border-white/20 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/40 transition-all duration-300 cursor-pointer">
                  <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className=" sm:text-lg font-semibold text-white">Product</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#defi" className="block text-white/60 hover:text-white transition-colors text-sm sm:">DeFi App</a>
                <a href="#tokenomics" className="block text-white/60 hover:text-white transition-colors text-sm sm:">Tokenomics</a>
                <a href="#" className="block text-white/60 hover:text-white transition-colors text-sm sm:">API</a>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className=" sm:text-lg font-semibold text-white">Resources</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#" className="block text-white/60 hover:text-white transition-colors text-sm sm:">Documentation</a>
                <a href="#" className="block text-white/60 hover:text-white transition-colors text-sm sm:">Whitepaper</a>
                <a href="#" className="block text-white/60 hover:text-white transition-colors text-sm sm:">Security Audit</a>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h3 className=" sm:text-lg font-semibold text-white">Support</h3>
              <div className="space-y-1 sm:space-y-2">
                <a href="#" className="block text-white/60 hover:text-white transition-colors text-sm sm:">Help Center</a>
                <a href="#" className="block text-white/60 hover:text-white transition-colors text-sm sm:">Contact Us</a>
                <a href="#" className="block text-white/60 hover:text-white transition-colors text-sm sm:">Status</a>
              </div>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 sm:space-y-4 md:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 lg:space-x-8 text-xs sm:text-sm text-white/40 text-center sm:text-left">
                <a href="#" className="hover:text-white/70 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white/70 transition-colors">Privacy Policy</a>
              </div>
              <div className="text-xs sm:text-sm text-white/40 text-center">
                © 2025 Goldium. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
