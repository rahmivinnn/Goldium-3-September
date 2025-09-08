import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Gamepad2, 
  BarChart3, 
  Palette, 
  Wrench,
  ExternalLink,
  Zap,
  TrendingUp,
  Users
} from 'lucide-react';

interface FeatureCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  features: string[];
  status: 'Live' | 'Coming Soon' | 'Beta';
  category: string;
}

const featureCategories = [
  {
    id: 'nft',
    title: 'NFT Marketplace',
    subtitle: 'Digital Asset Trading',
    features: [
      {
        id: 'nft-1',
        title: 'Goldium NFT Collection',
        description: 'Exclusive NFT collection with utility in the Goldium ecosystem',
        icon: <Palette className="w-6 h-6" />,
        gradient: 'from-purple-500 to-pink-500',
        features: ['Unique Artwork', 'Staking Rewards', 'Exclusive Access'],
        status: 'Coming Soon' as const,
        category: 'NFT'
      },
      {
        id: 'nft-2',
        title: 'NFT Staking Rewards',
        description: 'Stake your NFTs and earn GOLDIUM tokens as rewards',
        icon: <TrendingUp className="w-6 h-6" />,
        gradient: 'from-green-500 to-emerald-500',
        features: ['Auto-Compounding', 'High APY', 'No Lock Period'],
        status: 'Beta' as const,
        category: 'NFT'
      },
      {
        id: 'nft-3',
        title: 'Digital Art Marketplace',
        description: 'Buy, sell, and trade digital art on Solana blockchain',
        icon: <Users className="w-6 h-6" />,
        gradient: 'from-blue-500 to-cyan-500',
        features: ['Low Fees', 'Fast Transactions', 'Creator Royalties'],
        status: 'Live' as const,
        category: 'NFT'
      }
    ]
  },
  {
    id: 'gaming',
    title: 'Web3 Gaming',
    subtitle: 'Play-to-Earn Games',
    features: [
      {
        id: 'game-1',
        title: 'Goldium Arena',
        description: 'Battle arena game where you can earn GOLDIUM tokens',
        icon: <Gamepad2 className="w-6 h-6" />,
        gradient: 'from-red-500 to-orange-500',
        features: ['PvP Battles', 'Token Rewards', 'NFT Characters'],
        status: 'Coming Soon' as const,
        category: 'Gaming'
      },
      {
        id: 'game-2',
        title: 'Treasure Hunt',
        description: 'Explore virtual worlds and discover hidden GOLDIUM treasures',
        icon: <Zap className="w-6 h-6" />,
        gradient: 'from-yellow-500 to-amber-500',
        features: ['Daily Quests', 'Rare Items', 'Social Features'],
        status: 'Beta' as const,
        category: 'Gaming'
      },
      {
        id: 'game-3',
        title: 'Trading Simulator',
        description: 'Practice trading with virtual tokens before using real funds',
        icon: <BarChart3 className="w-6 h-6" />,
        gradient: 'from-indigo-500 to-purple-500',
        features: ['Risk-Free', 'Real Market Data', 'Learning Rewards'],
        status: 'Live' as const,
        category: 'Gaming'
      }
    ]
  },
  {
    id: 'analytics',
    title: 'Analytics Tools',
    subtitle: 'Market Intelligence',
    features: [
      {
        id: 'analytics-1',
        title: 'Portfolio Tracker',
        description: 'Track your GOLDIUM and Solana portfolio performance',
        icon: <BarChart3 className="w-6 h-6" />,
        gradient: 'from-green-500 to-teal-500',
        features: ['Real-time Data', 'Profit/Loss', 'Performance Charts'],
        status: 'Live' as const,
        category: 'Analytics'
      },
      {
        id: 'analytics-2',
        title: 'Market Scanner',
        description: 'Discover trending tokens and trading opportunities',
        icon: <TrendingUp className="w-6 h-6" />,
        gradient: 'from-blue-500 to-indigo-500',
        features: ['Price Alerts', 'Volume Analysis', 'Trend Indicators'],
        status: 'Beta' as const,
        category: 'Analytics'
      },
      {
        id: 'analytics-3',
        title: 'DeFi Dashboard',
        description: 'Monitor your DeFi positions across multiple protocols',
        icon: <Users className="w-6 h-6" />,
        gradient: 'from-purple-500 to-violet-500',
        features: ['Multi-Protocol', 'Yield Tracking', 'Risk Assessment'],
        status: 'Coming Soon' as const,
        category: 'Analytics'
      }
    ]
  },
  {
    id: 'tools',
    title: 'DeFi Tools',
    subtitle: 'Advanced Trading',
    features: [
      {
        id: 'tools-1',
        title: 'Limit Orders',
        description: 'Set buy and sell orders at specific price levels',
        icon: <Wrench className="w-6 h-6" />,
        gradient: 'from-orange-500 to-red-500',
        features: ['Advanced Orders', 'Auto-Execution', 'Price Protection'],
        status: 'Coming Soon' as const,
        category: 'Tools'
      },
      {
        id: 'tools-2',
        title: 'Yield Farming',
        description: 'Earn rewards by providing liquidity to various pools',
        icon: <TrendingUp className="w-6 h-6" />,
        gradient: 'from-green-500 to-lime-500',
        features: ['Multiple Pools', 'Auto-Compound', 'High APY'],
        status: 'Beta' as const,
        category: 'Tools'
      },
      {
        id: 'tools-3',
        title: 'Bridge Services',
        description: 'Transfer assets between different blockchain networks',
        icon: <Zap className="w-6 h-6" />,
        gradient: 'from-cyan-500 to-blue-500',
        features: ['Multi-Chain', 'Low Fees', 'Fast Transfer'],
        status: 'Live' as const,
        category: 'Tools'
      }
    ]
  }
];

const FeatureCardComponent: React.FC<{ feature: FeatureCard; index: number }> = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="min-w-[320px] max-w-[320px]"
    >
      <Card className="h-full bg-black/40 border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/20">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${feature.gradient}`}>
              {feature.icon}
            </div>
            <Badge 
              variant="secondary" 
              className={`
                ${feature.status === 'Live' ? 'bg-green-500/20 text-green-400 border-green-500' : 
                  feature.status === 'Beta' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500' : 
                  'bg-gray-500/20 text-gray-400 border-gray-500'}
              `}
            >
              {feature.status}
            </Badge>
          </div>
          <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
          <p className="text-gray-400 text-sm">{feature.description}</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-6">
            {feature.features.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                <span className="text-gray-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-black font-semibold"
            disabled={feature.status === 'Coming Soon'}
          >
            {feature.status === 'Coming Soon' ? 'Coming Soon' : 'Learn More'}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const CategorySection: React.FC<{ category: typeof featureCategories[0]; index: number }> = ({ category, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="mb-16"
    >
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold text-white mb-2">{category.title}</h3>
        <p className="text-gray-400 text-lg">{category.subtitle}</p>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-6 min-w-max">
          {category.features.map((feature, idx) => (
            <FeatureCardComponent key={feature.id} feature={feature} index={idx} />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const SolanaFeaturesGallery: React.FC = () => {
  return (
    <div className="relative z-10 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Solana Ecosystem
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
              Features Gallery
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore the comprehensive suite of features and tools available in the Goldium ecosystem built on Solana blockchain
          </p>
        </motion.div>

        {featureCategories.map((category, index) => (
          <CategorySection key={category.id} category={category} index={index} />
        ))}
      </div>

      {/* Enhanced scrollbar styling */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};
