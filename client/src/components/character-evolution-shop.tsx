import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ShoppingCart, Star, Crown, Zap, Lock, CheckCircle } from 'lucide-react';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { useGoldBalance } from '@/hooks/use-gold-balance';
import { useWallet } from '@solana/wallet-adapter-react';
import { transactionHistory } from '@/lib/transaction-history';
import { goldTokenService } from '@/services/gold-token-service';
import { trackToGoldiumCA } from '@/lib/ca-tracking-service';
import { TREASURY_WALLET } from '@/lib/constants';

interface CharacterUpgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  goldCost: number;
  tier: 'basic' | 'premium' | 'legendary' | 'mythic';
  benefits: string[];
  unlocked: boolean;
  owned: boolean;
  requiredLevel?: number;
}

interface UserProgress {
  level: number;
  experience: number;
  goldBalance: number;
  ownedUpgrades: string[];
}

const CHARACTER_UPGRADES: CharacterUpgrade[] = [
  {
    id: 'k1_warrior_boost',
    name: 'K1 Warrior Power Boost',
    description: 'Enhance your K1 Warrior with increased staking rewards',
    icon: '/K1.png',
    goldCost: 100,
    tier: 'basic',
    benefits: ['+5% Staking APY', '+10% XP Gain', 'Warrior Aura Effect'],
    unlocked: true,
    owned: false
  },
  {
    id: 'k2_guardian_shield',
    name: 'K2 Guardian Shield',
    description: 'Protective shield that reduces transaction fees',
    icon: '/K2.png',
    goldCost: 250,
    tier: 'basic',
    benefits: ['-20% Transaction Fees', '+15% Staking APY', 'Shield Visual Effect'],
    unlocked: true,
    owned: false,
    requiredLevel: 2
  },
  {
    id: 'k3_champion_sword',
    name: 'K3 Champion Sword',
    description: 'Legendary sword that increases trading efficiency',
    icon: '/K3.png',
    goldCost: 500,
    tier: 'premium',
    benefits: ['+25% Trading Speed', '+20% Staking APY', 'Sword Animation'],
    unlocked: true,
    owned: false,
    requiredLevel: 3
  },
  {
    id: 'k4_master_armor',
    name: 'K4 Master Armor',
    description: 'Divine armor that provides ultimate protection',
    icon: '/K4.png',
    goldCost: 1000,
    tier: 'premium',
    benefits: ['+30% All Rewards', 'Risk Protection', 'Armor Glow Effect'],
    unlocked: true,
    owned: false,
    requiredLevel: 4
  },
  {
    id: 'k5_legend_crown',
    name: 'K5 Legend Crown',
    description: 'Crown of legends that unlocks exclusive features',
    icon: '/K5.png',
    goldCost: 2500,
    tier: 'legendary',
    benefits: ['+50% All Rewards', 'VIP Access', 'Crown Animation', 'Exclusive Badges'],
    unlocked: true,
    owned: false,
    requiredLevel: 5
  },
  {
    id: 'k6_mythic_wings',
    name: 'K6 Mythic Wings',
    description: 'Mythical wings that grant flight abilities',
    icon: '/K6.png',
    goldCost: 5000,
    tier: 'legendary',
    benefits: ['+75% All Rewards', 'Flight Animation', 'Mythic Aura', 'Special Powers'],
    unlocked: true,
    owned: false,
    requiredLevel: 6
  },
  {
    id: 'k7_divine_halo',
    name: 'K7 Divine Halo',
    description: 'Divine halo that provides godlike powers',
    icon: '/K7.png',
    goldCost: 10000,
    tier: 'mythic',
    benefits: ['+100% All Rewards', 'Divine Aura', 'God Mode', 'Ultimate Powers'],
    unlocked: true,
    owned: false,
    requiredLevel: 7
  },
  {
    id: 'k8_supreme_essence',
    name: 'K8 Supreme Essence',
    description: 'The ultimate evolution - Supreme Essence of power',
    icon: '/K8.png',
    goldCost: 25000,
    tier: 'mythic',
    benefits: ['+200% All Rewards', 'Supreme Aura', 'Reality Manipulation', 'Infinite Power'],
    unlocked: true,
    owned: false,
    requiredLevel: 8
  }
];

export const CharacterEvolutionShop: React.FC = () => {
  const { connected, connectWallet } = useExternalWallets();
  const { balance: goldBalance, isLoading: goldLoading, refreshBalances } = useGoldBalance();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    experience: 0,
    goldBalance: 0,
    ownedUpgrades: []
  });
  const [selectedUpgrade, setSelectedUpgrade] = useState<CharacterUpgrade | null>(null);
  const [loading, setLoading] = useState(false);
  const [upgrades, setUpgrades] = useState<CharacterUpgrade[]>(CHARACTER_UPGRADES);

  // Load user data from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('goldium_user_progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setUserProgress(progress);
      
      // Update upgrades with owned status
      setUpgrades(prev => prev.map(upgrade => ({
        ...upgrade,
        owned: progress.ownedUpgrades.includes(upgrade.id)
      })));
    }
  }, []);

  // Load saved progress on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('goldium_user_progress');
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setUserProgress(prev => ({
          ...prev,
          level: progress.level || prev.level,
          ownedUpgrades: progress.ownedUpgrades || prev.ownedUpgrades,
          experience: progress.experience || prev.experience
        }));
        console.log('🎮 Loaded character evolution progress from localStorage');
      } catch (error) {
        console.error('Failed to load character evolution progress:', error);
      }
    }
  }, []);

  // Update user progress when GOLD balance changes
  useEffect(() => {
    setUserProgress(prev => ({
      ...prev,
      goldBalance: goldBalance
    }));
  }, [goldBalance]);

  const saveUserProgress = (progress: UserProgress) => {
    localStorage.setItem('goldium_user_progress', JSON.stringify(progress));
    setUserProgress(progress);
  };

  const handlePurchase = async (upgrade: CharacterUpgrade) => {
    if (!connected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (goldBalance < upgrade.goldCost) {
      alert(`Insufficient GOLD balance! You need ${upgrade.goldCost} GOLD but only have ${goldBalance.toFixed(2)} GOLD.`);
      return;
    }

    if (upgrade.requiredLevel && userProgress.level < upgrade.requiredLevel) {
      alert(`You need to reach level ${upgrade.requiredLevel} first!`);
      return;
    }

    setLoading(true);
    
    try {
      console.log(`🎮 REAL CHARACTER PURCHASE: ${upgrade.name} for ${upgrade.goldCost} GOLD`);
      
      // Get wallet instance for REAL GOLD token transfer
      const walletInstance = (window as any).phantom?.solana || (window as any).solflare || (window as any).trustwallet?.solana;
      if (!walletInstance) {
        throw new Error('Wallet not found for GOLD transfer');
      }

      // REAL GOLD token transfer to treasury for character purchase
      console.log(`💰 Transferring ${upgrade.goldCost} GOLD tokens to treasury for character upgrade...`);
      const signature = await goldTokenService.transferGold(
        walletInstance,
        TREASURY_WALLET, // Send GOLD to treasury
        upgrade.goldCost
      );
      
      console.log(`✅ REAL GOLD transfer successful: ${signature}`);
      
      // Record the GOLD expenditure in transaction history
      transactionHistory.addGoldTransaction(
        'character_purchase', 
        upgrade.goldCost, 
        signature
      );
      
      // Track to Goldium CA for character purchase
      const walletAddress = walletInstance.publicKey?.toString() || 'unknown';
      await trackToGoldiumCA(
        walletAddress,
        signature,
        'send', // Character purchase is a send transaction
        'GOLD',
        'CHARACTER_UPGRADE',
        upgrade.goldCost,
        upgrade.goldCost
      );
      
      // Add upgrade to owned list
      const newProgress = {
        ...userProgress,
        ownedUpgrades: [...userProgress.ownedUpgrades, upgrade.id],
        experience: userProgress.experience + 100 // Bonus XP for purchase
      };
      
      saveUserProgress(newProgress);
      
      // Update upgrades
      setUpgrades(prev => prev.map(u => 
        u.id === upgrade.id ? { ...u, owned: true } : u
      ));
      
      // Save purchase to localStorage for persistence
      const savedProgress = localStorage.getItem('goldium_user_progress');
      const currentProgress = savedProgress ? JSON.parse(savedProgress) : {};
      const updatedProgress = {
        ...currentProgress,
        lastPurchase: {
          upgradeId: upgrade.id,
          timestamp: Date.now(),
          cost: upgrade.goldCost,
          signature: signature
        }
      };
      localStorage.setItem('goldium_user_progress', JSON.stringify(updatedProgress));
      
      // Refresh GOLD balance after purchase
      refreshBalances();
      
      console.log(`🎉 CHARACTER PURCHASE COMPLETED!`);
      console.log(`📋 Purchase Summary:`);
      console.log(`  • Character: ${upgrade.name}`);
      console.log(`  • Cost: ${upgrade.goldCost} GOLD`);
      console.log(`  • Transaction: ${signature}`);
      console.log(`  • XP Gained: 100`);
      console.log(`🔗 Transaction on Solscan: https://solscan.io/tx/${signature}`);
      console.log(`🔗 GOLDIUM Contract: https://solscan.io/token/APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump`);
      
      alert(`🎉 Successfully purchased ${upgrade.name}!\n\n💰 ${upgrade.goldCost} GOLD transferred to treasury\n🎯 +100 XP gained\n🔗 Transaction: ${signature}\n\nThis purchase is tracked on GOLDIUM Contract Address!`);
      setSelectedUpgrade(null);
      
    } catch (error: any) {
      console.error('❌ Character purchase failed:', error);
      
      // Handle specific wallet errors
      if (error.message?.includes('User rejected')) {
        alert('Transaction was cancelled by user');
      } else if (error.message?.includes('insufficient funds')) {
        alert('Insufficient GOLD balance or SOL for transaction fees');
      } else {
        alert(`Purchase failed: ${error.message || 'Unknown error'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'basic': return 'from-blue-400 to-blue-600';
      case 'premium': return 'from-purple-400 to-purple-600';
      case 'legendary': return 'from-yellow-400 to-orange-500';
      case 'mythic': return 'from-pink-400 to-red-500';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'basic': return <Star className="w-4 h-4" />;
      case 'premium': return <Zap className="w-4 h-4" />;
      case 'legendary': return <Crown className="w-4 h-4" />;
      case 'mythic': return <Crown className="w-4 h-4 text-pink-400" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-black border-white/10 text-white">
        <CardHeader>
          <CardTitle className="font-card-title text-white flex items-center gap-2">
            <ShoppingCart className="w-6 h-6" />
            Character Evolution Shop
          </CardTitle>
          <p className="font-small text-white/70 mt-2">
            Upgrade your characters with GOLD tokens to unlock powerful abilities
          </p>
        </CardHeader>
      </Card>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                💰
              </div>
              <div>
                <p className="text-sm text-white/70">GOLD Balance</p>
                <p className="font-bold text-white">{goldLoading ? 'Loading...' : goldBalance.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                ⭐
              </div>
              <div>
                <p className="text-sm text-white/70">Level</p>
                <p className="font-bold text-white">{userProgress.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                🎯
              </div>
              <div>
                <p className="text-sm text-white/70">Experience</p>
                <p className="font-bold text-white">{userProgress.experience.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                🛡️
              </div>
              <div>
                <p className="text-sm text-white/70">Owned Upgrades</p>
                <p className="font-bold text-white">{userProgress.ownedUpgrades.length}/{upgrades.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrades Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {upgrades.map((upgrade) => {
          const canAfford = goldBalance >= upgrade.goldCost;
          const meetsLevel = !upgrade.requiredLevel || userProgress.level >= upgrade.requiredLevel;
          const canPurchase = canAfford && meetsLevel && !upgrade.owned;
          
          return (
            <Card 
              key={upgrade.id} 
              className={`relative overflow-hidden transition-all duration-300 hover:scale-105 ${
                upgrade.owned 
                  ? 'bg-green-500/20 border-green-500/30' 
                  : canPurchase 
                    ? 'bg-black/20 border-white/10 hover:border-white/30' 
                    : 'bg-black/10 border-white/5'
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className={`bg-gradient-to-r ${getTierColor(upgrade.tier)} text-white`}>
                    {getTierIcon(upgrade.tier)}
                    {upgrade.tier.toUpperCase()}
                  </Badge>
                  {upgrade.owned && (
                    <CheckCircle className="w-5 h-5 text-green-400" />
                  )}
                  {!meetsLevel && (
                    <Lock className="w-5 h-5 text-red-400" />
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getTierColor(upgrade.tier)} flex items-center justify-center p-1`}>
                    <img 
                      src={upgrade.icon} 
                      alt={upgrade.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-sm text-white">{upgrade.name}</CardTitle>
                    {upgrade.requiredLevel && (
                      <p className="text-xs text-white/50">Requires Level {upgrade.requiredLevel}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <p className="text-xs text-white/70">{upgrade.description}</p>
                
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white">Benefits:</p>
                  {upgrade.benefits.map((benefit, index) => (
                    <p key={index} className="text-xs text-green-400">• {benefit}</p>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">💰</span>
                    <span className={`font-bold ${
                      canAfford ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {upgrade.goldCost.toLocaleString()}
                    </span>
                  </div>
                  
                  {upgrade.owned ? (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Owned
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handlePurchase(upgrade)}
                      disabled={!canPurchase || loading}
                      className={`${
                        canPurchase 
                          ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {loading ? 'Buying...' : !meetsLevel ? 'Locked' : !canAfford ? 'No GOLD' : 'Buy'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Connection Prompt */}
      {!connected && (
        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4 text-center">
            <p className="text-yellow-400 mb-3">Connect your wallet to start purchasing character upgrades!</p>
            <Button 
              onClick={connectWallet}
              className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black"
            >
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CharacterEvolutionShop;