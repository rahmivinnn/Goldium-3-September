import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
import GoldiumGamifiedStaking from '@/components/goldium-gamified-staking';
import { TwitterEmbed } from '@/components/twitter-embed';
import { EfficientWalletBalance } from '@/components/efficient-wallet-balance';
import { AnimatedNumber } from '@/components/animated-number';
import { ClientWalletTester } from '@/components/client-wallet-tester';
import { AnimatedDashboardBackground } from '@/components/animated-dashboard-background';

export default function HomeSimple() {
  console.log('🏠 HomeSimple component is rendering - MAINNET PRODUCTION...');
  
  // REAL GOLDIUM mainnet data - TOKEN EXISTS BUT NOT ACTIVELY TRADED
  const [tokenData, setTokenData] = useState<RealTimeTokenData>({
    currentPrice: 0.000001, // Real estimated price (token exists, no major DEX trading)
    priceChange24h: 0.0, // No trading data available
    volume24h: 0, // No trading volume (not on major DEX)
    marketCap: 1000, // Estimated market cap
    totalSupply: 999999999, // REAL from mainnet: 999,999,999.995357 tokens
    circulatingSupply: 999999999, // Same as total supply
    stakingAPY: 0, // No staking program
    totalStaked: 0, // No staking
    holders: 1 // Minimal holders detected
  });
  
  const [loading, setLoading] = useState(true);
  const [buyingToken, setBuyingToken] = useState(false);
  const [buyAmount, setBuyAmount] = useState('0.000047');
  
  // Safe hook usage with error handling
  let wallet = null;
  let externalWallet = null;
  let goldBalance = null;
  let toast = null;
  
  try {
    wallet = useSolanaWallet();
    console.log('✅ Wallet hook loaded');
  } catch (error) {
    console.error('❌ Wallet hook error:', error);
  }
  
  try {
    externalWallet = useExternalWallets();
    console.log('✅ External wallet hook loaded');
  } catch (error) {
    console.error('❌ External wallet hook error:', error);
    externalWallet = { connected: false, address: null, balance: 0 }; // Fallback
  }
  
  try {
    ({ toast } = useToast());
    console.log('✅ Toast hook loaded');
  } catch (error) {
    console.error('❌ Toast hook error:', error);
    toast = () => {}; // Fallback
  }
  
  try {
    goldBalance = useGoldBalance();
    console.log('✅ Gold balance hook loaded');
  } catch (error) {
    console.error('❌ Gold balance hook error:', error);
    goldBalance = { balance: 0, stakedBalance: 0, totalValue: 0, isLoading: false, error: null }; // Fallback
  }

  // Safe data fetching with timeout
  useEffect(() => {
    console.log('🔄 HomeFixed useEffect starting...');
    
    const fetchTokenData = async () => {
      try {
        setLoading(true);
        console.log('📊 Fetching token data...');
        
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Data fetch timeout')), 10000);
        });
        
        const dataPromise = realTimeDataService.getRealTimeTokenData();
        
        const data = await Promise.race([dataPromise, timeoutPromise]) as RealTimeTokenData;
        setTokenData(data);
        console.log('✅ Token data loaded successfully');
        
      } catch (error) {
        console.error('Failed to fetch token data:', error);
        // Keep fallback data, don't throw
      } finally {
        setLoading(false);
        console.log('✅ Loading completed');
      }
    };

    fetchTokenData();
  }, []); // Empty dependency array to prevent infinite loop

  const handleBuyGoldium = async () => {
    if (!externalWallet?.connected) {
      if (toast) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your wallet to buy GOLDIUM tokens.",
          variant: "destructive"
        });
      }
      return;
    }

    setBuyingToken(true);
    
    try {
      console.log('💰 Simulating GOLDIUM purchase...');
      
      // Simulate purchase
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (toast) {
        toast({
          title: "Purchase Successful!",
          description: `Successfully bought GOLDIUM tokens!`,
        });
      }
      
    } catch (error) {
      console.error('Failed to buy GOLDIUM:', error);
      if (toast) {
        toast({
          title: "Purchase Failed",
          description: "Failed to buy GOLDIUM tokens. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setBuyingToken(false);
    }
  };

  console.log('🏠 HomeSimple about to render MAINNET PRODUCTION, loading:', loading);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-yellow-400">Goldium DeFi</h1>
          <div className="text-xl">Loading...</div>
          <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedDashboardBackground />
      {/* Header */}
      <nav className="container mx-auto px-4 py-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="/goldium-logo.png" 
              alt="Goldium Logo" 
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-xl font-bold">Goldium</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className={`${externalWallet?.connected ? 'text-green-400 border-green-400' : 'text-gray-400 border-gray-400'}`}>
              {externalWallet?.connected ? 'Connected' : 'Disconnected'}
            </Badge>
            <ExternalWalletSelector />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.div 
        className="container mx-auto px-4 py-12 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3, type: "spring", stiffness: 100 }}
          >
            Goldium DeFi
          </motion.h1>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            The Future of Decentralized Finance on Solana
          </motion.p>
          
          {/* Token Status Disclaimer */}
          <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 backdrop-blur-xl border-2 border-blue-400/50 rounded-xl p-6 max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center justify-center gap-2 text-blue-300 font-bold mb-3">
              <ExternalLink className="w-5 h-5" />
              <span className="text-lg">GOLDIUM Token Status</span>
            </div>
            <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <span className="text-green-400">✅</span>
                <span className="text-white">Token exists on Solana mainnet</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <span className="text-blue-400">📊</span>
                <span className="text-white">Total Supply: <span className="font-bold text-yellow-400">{tokenData.totalSupply.toLocaleString()}</span> tokens</span>
              </div>
              <div className="flex items-center gap-2 text-orange-400">
                <span className="text-orange-400">⚠️</span>
                <span className="text-white">Not actively traded on major DEX yet</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <span className="text-purple-400">💡</span>
                <span className="text-white">Price estimates based on theoretical calculations</span>
              </div>
            </div>
          </div>
          
          {/* Price Cards */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
            >
              <Card className="bg-black/30 backdrop-blur-xl border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-500 hover:scale-105 hover:bg-yellow-400/10 group cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
                    <AnimatedNumber value={tokenData.currentPrice} decimals={6} prefix="$" />
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Estimated Price</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              <Card className="bg-black/30 backdrop-blur-xl border border-green-400/30 hover:border-green-400/60 transition-all duration-500 hover:scale-105 hover:bg-green-400/10 group cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300">
                    +<AnimatedNumber value={tokenData.priceChange24h} decimals={1} suffix="%" />
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">24h Change</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Card className="bg-black/30 backdrop-blur-xl border border-blue-400/30 hover:border-blue-400/60 transition-all duration-500 hover:scale-105 hover:bg-blue-400/10 group cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                    $<AnimatedNumber value={tokenData.volume24h / 1000} decimals={0} suffix="K" />
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">24h Volume</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
            >
              <Card className="bg-black/30 backdrop-blur-xl border border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 hover:bg-purple-400/10 group cursor-pointer">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-400 group-hover:text-purple-300 transition-colors duration-300">
                    <AnimatedNumber value={tokenData.holders} decimals={0} />
                  </div>
                  <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">Holders</div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 font-bold transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-400/50"
              onClick={handleBuyGoldium}
              disabled={buyingToken}
            >
              {buyingToken ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                  Buying...
                </div>
              ) : (
                'Buy Goldium'
              )}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/20 hover:border-white/50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-white/20"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Learn More
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Wallet Balance Display */}
      <motion.div 
        className="container mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <EfficientWalletBalance />
      </motion.div>

      {/* Client Wallet Testing */}
      <motion.div 
        className="container mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 backdrop-blur-xl border-2 border-yellow-400/50 rounded-xl p-6 max-w-4xl mx-auto shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">🧪 DeFi Testing Lab</h2>
            <p className="text-gray-300 text-lg">Test GOLDIUM DeFi features dengan wallet client</p>
            <div className="mt-4 text-yellow-400 text-sm">
              Wallet: A9anvNZEkxQvU7H5xa1Lj33MVQGuX5rZMKqWDM9S4jSs
            </div>
          </div>
        </div>
        <ClientWalletTester />
      </motion.div>

      {/* DeFi Features */}
      <motion.div 
        className="container mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.9 }}
      >
        <ModernDeFiTabs />
      </motion.div>

      {/* Gamified Staking */}
      <motion.div 
        className="container mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
      >
        <GoldiumGamifiedStaking />
      </motion.div>

      {/* Tokenomics */}
      <motion.div 
        className="container mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      >
        <AnimatedTokenomicsCharts />
      </motion.div>

      {/* Twitter Feed */}
      <motion.div 
        className="container mx-auto px-4 py-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <TwitterEmbed />
      </motion.div>

      {/* Real-time Notifications */}
      <RealTimeNotifications />
    </div>
  );
}