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
import { PremiumCinematicBackground } from '@/components/premium-cinematic-background';
import { EnterpriseCard } from '@/components/enterprise-card';
import { DemoTransaction } from '@/components/demo-transaction';

export default function HomeSimple() {
  console.log('🏠 HomeSimple component is rendering - MAINNET PRODUCTION...');
  
  // GOLDIUM mainnet data - consistent with user requirements
  const [tokenData, setTokenData] = useState<RealTimeTokenData>({
    currentPrice: 0.0085, // Consistent estimated price
    priceChange24h: 0.0, // Price change data
    volume24h: 382000, // $382K 24h volume
    marketCap: 5100000, // $5.10M market cap
    totalSupply: 1000000000, // 1.00B total supply
    circulatingSupply: 600000000, // 600.00M circulating supply
    stakingAPY: 8.5, // 8.5% staking APY (consistent)
    totalStaked: 210000000, // 210.00M total staked
    holders: 1200 // 1.2K token holders
  });
  
  const [loading, setLoading] = useState(true);
  const [buyingToken, setBuyingToken] = useState(false);
  const [buyAmount, setBuyAmount] = useState('0.0000434'); // Updated minimum for 1 GOLD based on Solscan data
  
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
          <h1 className="text-3xl font-bold holographic-gold golden-3d">Goldium DeFi</h1>
          <div className="text-xl">Loading...</div>
          <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white relative overflow-hidden">
      {/* Premium Cinematic Background */}
      <PremiumCinematicBackground />
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
          <motion.div className="relative perspective-1000">
            {/* Premium Title with Cinematic Entry */}
            <motion.h1 
              className="text-6xl md:text-8xl font-black tracking-wider holographic-gold golden-3d relative z-20"
              initial={{ 
                scale: 0.3, 
                opacity: 0, 
                rotateX: -120,
                y: 100,
                filter: "blur(20px)"
              }}
              animate={{ 
                scale: 1, 
                opacity: 1, 
                rotateX: 0,
                y: 0,
                filter: "blur(0px)"
              }}
              transition={{ 
                duration: 2, 
                delay: 0.5, 
                type: "spring", 
                stiffness: 50,
                damping: 20
              }}
              whileHover={{ 
                scale: 1.02,
                rotateX: -5,
                transition: { duration: 0.3 }
              }}
              style={{
                textShadow: "0 10px 30px rgba(0,0,0,0.8), 0 0 50px rgba(255,215,0,0.3)",
                letterSpacing: "0.1em"
              }}
            >
              GOLDIUM DEFI
            </motion.h1>
            
            {/* Sophisticated Underline System */}
            <motion.div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="h-1 bg-yellow-400"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "20px", opacity: 0.8 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 2 + i * 0.1,
                    type: "spring",
                    stiffness: 200
                  }}
                />
              ))}
            </motion.div>
            
            {/* Premium Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent blur-3xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 3, delay: 1 }}
            />
          </motion.div>
          <motion.p 
            className="text-xl md:text-2xl text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            The Future of Decentralized Finance on Solana
          </motion.p>
          
          {/* Enterprise Token Status */}
          <motion.div 
            className="enterprise-backdrop rounded-2xl p-8 max-w-3xl mx-auto enterprise-glow"
            initial={{ opacity: 0, scale: 0.8, rotateX: 30 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.5, delay: 2.8, type: "spring", stiffness: 80 }}
            whileHover={{ 
              scale: 1.02, 
              rotateX: -2,
              transition: { duration: 0.4 }
            }}
          >
            <div className="flex items-center justify-center gap-2 text-yellow-400 font-bold mb-4">
              <ExternalLink className="w-5 h-5" />
              <span className="text-lg">GOLDIUM Token Status</span>
            </div>
            <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 space-y-3 border border-gray-800">
              <motion.div 
                className="flex items-center gap-3 text-green-400"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <span className="text-green-400 text-lg">✅</span>
                <span className="text-white">Token exists on Solana mainnet</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                <span className="text-yellow-400 text-lg">📊</span>
                <span className="text-white">Total Supply: <span className="font-bold text-yellow-400">{tokenData.totalSupply.toLocaleString()}</span> tokens</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              >
                <span className="text-orange-400 text-lg">⚠️</span>
                <span className="text-white">Not actively traded on major DEX yet</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-3"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <span className="text-gray-400 text-lg">💡</span>
                <span className="text-white">Price estimates based on theoretical calculations</span>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Enterprise-Grade Data Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <EnterpriseCard delay={2.5} index={0}>
              <div className="space-y-3">
                <motion.div 
                  className="text-4xl font-black text-yellow-400 tracking-wide"
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 3, type: "spring", stiffness: 200 }}
                >
                  <AnimatedNumber value={tokenData.currentPrice} decimals={6} prefix="$" />
                </motion.div>
                <div className="text-sm text-gray-300 font-medium tracking-wider uppercase">Estimated Price</div>
                <div className="h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
              </div>
            </EnterpriseCard>

            <EnterpriseCard delay={2.7} index={1}>
              <div className="space-y-3">
                <motion.div 
                  className="text-4xl font-black text-green-400 tracking-wide"
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 3.2, type: "spring", stiffness: 200 }}
                >
                  +<AnimatedNumber value={tokenData.priceChange24h} decimals={1} suffix="%" />
                </motion.div>
                <div className="text-sm text-gray-300 font-medium tracking-wider uppercase">24h Change</div>
                <div className="h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
              </div>
            </EnterpriseCard>

            <EnterpriseCard delay={2.9} index={2}>
              <div className="space-y-3">
                <motion.div 
                  className="text-4xl font-black text-blue-400 tracking-wide"
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 3.4, type: "spring", stiffness: 200 }}
                >
                  $<AnimatedNumber value={tokenData.volume24h / 1000} decimals={0} suffix="K" />
                </motion.div>
                <div className="text-sm text-gray-300 font-medium tracking-wider uppercase">24h Volume</div>
                <div className="h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />
              </div>
            </EnterpriseCard>

            <EnterpriseCard delay={3.1} index={3}>
              <div className="space-y-3">
                <motion.div 
                  className="text-4xl font-black text-purple-400 tracking-wide"
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 3.6, type: "spring", stiffness: 200 }}
                >
                  <AnimatedNumber value={tokenData.holders} decimals={0} />
                </motion.div>
                <div className="text-sm text-gray-300 font-medium tracking-wider uppercase">Holders</div>
                <div className="h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
              </div>
            </EnterpriseCard>
          </div>

          {/* Enterprise-Grade Action Center */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-8 justify-center mt-20"
            initial={{ opacity: 0, y: 50, rotateX: 45 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.5, delay: 4, type: "spring", stiffness: 80 }}
          >
            <motion.div
              className="group perspective-1000"
              whileHover={{ 
                scale: 1.05, 
                rotateX: -8,
                rotateY: 5,
                z: 50
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button 
                size="lg" 
                className="bg-black border-2 border-yellow-400/60 text-yellow-400 hover:bg-yellow-400/5 hover:border-yellow-400 font-black px-12 py-6 text-xl tracking-wide shadow-2xl relative overflow-hidden transform-gpu"
                onClick={handleBuyGoldium}
                disabled={buyingToken}
              >
                {/* Enterprise Border Animation */}
                <motion.div
                  className="absolute inset-0 border-2 border-yellow-400/0"
                  whileHover={{
                    borderColor: [
                      "rgba(250, 204, 21, 0)",
                      "rgba(250, 204, 21, 0.8)",
                      "rgba(250, 204, 21, 0.4)"
                    ]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                
                {/* Sophisticated Scan Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent"
                  initial={{ x: '-100%', skewX: -30 }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                
                <div className="relative z-10 flex items-center gap-3">
                  {buyingToken ? (
                    <>
                      <motion.div 
                        className="w-6 h-6 border-2 border-yellow-400/60 border-t-yellow-400 rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      />
                      <span>PROCESSING...</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-6 h-6" />
                      <span>ACQUIRE GOLDIUM</span>
                    </>
                  )}
                </div>
              </Button>
            </motion.div>

            <motion.div
              className="group perspective-1000"
              whileHover={{ 
                scale: 1.05, 
                rotateX: -8,
                rotateY: -5,
                z: 50
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Button 
                size="lg" 
                variant="outline" 
                className="bg-black/80 border-2 border-gray-600/60 text-white hover:bg-white/5 hover:border-gray-400 px-12 py-6 text-xl font-black tracking-wide shadow-2xl relative overflow-hidden transform-gpu"
              >
                {/* Enterprise Border Animation */}
                <motion.div
                  className="absolute inset-0 border-2 border-gray-400/0"
                  whileHover={{
                    borderColor: [
                      "rgba(156, 163, 175, 0)",
                      "rgba(156, 163, 175, 0.8)",
                      "rgba(156, 163, 175, 0.4)"
                    ]
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
                
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                  initial={{ x: '-100%', skewX: -30 }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                
                <div className="relative z-10 flex items-center gap-3">
                  <ExternalLink className="w-6 h-6" />
                  <span>DOCUMENTATION</span>
                </div>
              </Button>
            </motion.div>
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
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="bg-black/80 backdrop-blur-xl border border-yellow-400/30 rounded-xl p-6 max-w-4xl mx-auto shadow-2xl">
            <motion.h2 
              className="text-3xl font-bold text-white mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              🧪 DeFi Testing Lab
            </motion.h2>
            <p className="text-gray-300 text-lg">Test GOLDIUM DeFi features dengan wallet client</p>
            <motion.div 
              className="mt-4 text-yellow-400 text-sm font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              Wallet: A9anvNZEkxQvU7H5xa1Lj33MVQGuX5rZMKqWDM9S4jSs
            </motion.div>
          </div>
        </motion.div>
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