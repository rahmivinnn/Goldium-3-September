import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Star, Crown, Shield, Gem, Award, Trophy } from 'lucide-react';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { AnimatedNumber } from '@/components/animated-number';

interface NFTBadge {
  id: string;
  name: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  requirement: number; // GOLD amount required
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress: number;
  reward: string;
}

export function NFTBadgeSystem() {
  const externalWallet = useExternalWallets();
  const [userGoldBalance] = useState(1250.75); // Mock balance - replace with real
  const [badges, setBadges] = useState<NFTBadge[]>([]);

  const badgeDefinitions: Omit<NFTBadge, 'unlocked' | 'progress'>[] = [
    {
      id: 'bronze_collector',
      name: 'Bronze Collector',
      tier: 'bronze',
      requirement: 100,
      description: 'Hold 100+ GOLDIUM tokens',
      icon: <Star className="w-5 h-5" />,
      reward: 'Bronze Badge NFT'
    },
    {
      id: 'silver_investor',
      name: 'Silver Investor', 
      tier: 'silver',
      requirement: 500,
      description: 'Hold 500+ GOLDIUM tokens',
      icon: <Shield className="w-5 h-5" />,
      reward: 'Silver Badge NFT + 5% Staking Boost'
    },
    {
      id: 'gold_trader',
      name: 'Gold Trader',
      tier: 'gold', 
      requirement: 1000,
      description: 'Hold 1,000+ GOLDIUM tokens',
      icon: <Award className="w-5 h-5" />,
      reward: 'Gold Badge NFT + 10% Staking Boost'
    },
    {
      id: 'platinum_whale',
      name: 'Platinum Whale',
      tier: 'platinum',
      requirement: 5000,
      description: 'Hold 5,000+ GOLDIUM tokens',
      icon: <Trophy className="w-5 h-5" />,
      reward: 'Platinum Badge NFT + 15% Staking Boost'
    },
    {
      id: 'diamond_legend',
      name: 'Diamond Legend',
      tier: 'diamond',
      requirement: 10000,
      description: 'Hold 10,000+ GOLDIUM tokens',
      icon: <Gem className="w-5 h-5" />,
      reward: 'Diamond Badge NFT + 25% Staking Boost'
    },
    {
      id: 'crown_emperor',
      name: 'Crown Emperor',
      tier: 'diamond',
      requirement: 50000,
      description: 'Hold 50,000+ GOLDIUM tokens',
      icon: <Crown className="w-5 h-5" />,
      reward: 'Crown Emperor NFT + 50% Staking Boost'
    }
  ];

  useEffect(() => {
    const updatedBadges = badgeDefinitions.map(badge => {
      const progress = Math.min(100, (userGoldBalance / badge.requirement) * 100);
      const unlocked = userGoldBalance >= badge.requirement;
      
      return {
        ...badge,
        unlocked,
        progress
      };
    });

    setBadges(updatedBadges);
  }, [userGoldBalance]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'from-amber-600 to-orange-600';
      case 'silver': return 'from-gray-400 to-gray-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      case 'platinum': return 'from-gray-300 to-blue-400';
      case 'diamond': return 'from-blue-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getTierBorder = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'border-amber-500/30';
      case 'silver': return 'border-gray-400/30';
      case 'gold': return 'border-yellow-400/30';
      case 'platinum': return 'border-blue-400/30';
      case 'diamond': return 'border-purple-400/30';
      default: return 'border-white/10';
    }
  };

  const unlockedBadges = badges.filter(b => b.unlocked);
  const nextBadge = badges.find(b => !b.unlocked);

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="font-card-title text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-400" />
          NFT Badge System
        </CardTitle>
        <p className="font-small text-white/70">Earn exclusive NFT badges by holding GOLDIUM</p>
        
        {/* USER STATUS */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-body text-white font-medium">Your GOLD Balance</div>
              <div className="text-2xl font-bold text-yellow-400">
                <AnimatedNumber value={userGoldBalance} decimals={2} />
                <span className="text-base font-normal text-white/70 ml-1">GOLD</span>
              </div>
            </div>
            <div className="text-right">
              <div className="font-small text-white/70">Badges Unlocked</div>
              <div className="text-2xl font-bold text-white">{unlockedBadges.length}/{badges.length}</div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        
        {/* NEXT BADGE PROGRESS */}
        {nextBadge && (
          <div className="bg-black/30 border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {nextBadge.icon}
                <span className="font-body text-white font-medium">{nextBadge.name}</span>
              </div>
              <Badge className={`bg-gradient-to-r ${getTierColor(nextBadge.tier)} text-white border-0`}>
                {nextBadge.tier.toUpperCase()}
              </Badge>
            </div>
            
            <Progress 
              value={nextBadge.progress} 
              className="h-2 bg-black/50"
            />
            
            <div className="flex justify-between items-center mt-2">
              <span className="font-small text-white/70">
                {userGoldBalance.toLocaleString()} / {nextBadge.requirement.toLocaleString()} GOLD
              </span>
              <span className="font-small text-white">
                {nextBadge.progress.toFixed(1)}%
              </span>
            </div>
            
            <div className="mt-2 font-small text-white/60">
              Need {(nextBadge.requirement - userGoldBalance).toLocaleString()} more GOLD
            </div>
          </div>
        )}

        {/* BADGES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300
                ${badge.unlocked 
                  ? `bg-gradient-to-r ${getTierColor(badge.tier)}/20 ${getTierBorder(badge.tier)} shadow-lg`
                  : 'bg-black/20 border-white/10 opacity-60'
                }
                ${badge.unlocked ? 'hover:scale-105 cursor-pointer' : ''}
              `}
            >
              {/* UNLOCK GLOW */}
              {badge.unlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-amber-500/10 rounded-xl animate-pulse"></div>
              )}
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`
                    p-2 rounded-lg 
                    ${badge.unlocked 
                      ? `bg-gradient-to-r ${getTierColor(badge.tier)}` 
                      : 'bg-black/30'
                    }
                  `}>
                    {badge.icon}
                  </div>
                  <div>
                    <div className="font-body text-white font-medium">{badge.name}</div>
                    <Badge className={`
                      text-xs border
                      ${badge.unlocked 
                        ? `bg-gradient-to-r ${getTierColor(badge.tier)} text-white border-0`
                        : 'bg-black/30 text-white/60 border-white/20'
                      }
                    `}>
                      {badge.tier.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="font-small text-white/70 mb-2">{badge.description}</div>
                
                {!badge.unlocked && (
                  <div className="space-y-2">
                    <Progress value={badge.progress} className="h-1 bg-black/50" />
                    <div className="font-small text-white/60">
                      {badge.progress.toFixed(1)}% complete
                    </div>
                  </div>
                )}

                {badge.unlocked && (
                  <div className="bg-black/30 rounded-lg p-2 mt-3">
                    <div className="font-small text-green-400 font-medium">✓ Unlocked!</div>
                    <div className="font-small text-white/70">{badge.reward}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* BENEFITS SUMMARY */}
        <div className="bg-black/20 border border-white/10 rounded-xl p-4">
          <h4 className="font-body text-white font-medium mb-3">Your Benefits</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">NFT Badges Owned</span>
              <span className="font-small text-yellow-400 font-bold">{unlockedBadges.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Total Staking Boost</span>
              <span className="font-small text-green-400 font-bold">
                +{unlockedBadges.reduce((sum, badge) => {
                  const boosts = { bronze: 0, silver: 5, gold: 10, platinum: 15, diamond: 25 };
                  return sum + (boosts[badge.tier] || 0);
                }, 0)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Community Rank</span>
              <span className="font-small text-purple-400 font-bold">
                {unlockedBadges.length === 0 ? 'Newcomer' :
                 unlockedBadges.length <= 2 ? 'Collector' :
                 unlockedBadges.length <= 4 ? 'Investor' : 'Legend'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}