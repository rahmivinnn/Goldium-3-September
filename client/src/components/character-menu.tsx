import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sword, 
  Shield, 
  Zap, 
  Crown, 
  Star, 
  Flame, 
  Gem, 
  Target,
  TrendingUp,
  Award,
  Users,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Character {
  id: string;
  name: string;
  title: string;
  description: string;
  speciality: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  stats: {
    power: number;
    speed: number;
    luck: number;
  };
  abilities: string[];
}

const characters: Character[] = [
  {
    id: 'K1',
    name: 'Kai Shadowblade',
    title: 'Master Trader',
    description: 'Elite DeFi strategist with unmatched market intuition',
    speciality: 'Swing Trading',
    rarity: 'legendary',
    icon: <Sword className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    bgGradient: 'from-purple-900/20 to-pink-900/20',
    stats: { power: 95, speed: 88, luck: 92 },
    abilities: ['Market Prediction', 'Risk Management', 'Profit Maximization']
  },
  {
    id: 'K2',
    name: 'Kira Stormguard',
    title: 'Shield Maiden',
    description: 'Defensive specialist protecting portfolios from market crashes',
    speciality: 'Risk Management',
    rarity: 'epic',
    icon: <Shield className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    bgGradient: 'from-blue-900/20 to-cyan-900/20',
    stats: { power: 78, speed: 85, luck: 90 },
    abilities: ['Portfolio Protection', 'Loss Prevention', 'Stable Returns']
  },
  {
    id: 'K3',
    name: 'Kenzo Lightning',
    title: 'Speed Demon',
    description: 'Lightning-fast scalper dominating micro-movements',
    speciality: 'Scalping',
    rarity: 'rare',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-yellow-500 to-orange-500',
    bgGradient: 'from-yellow-900/20 to-orange-900/20',
    stats: { power: 82, speed: 98, luck: 75 },
    abilities: ['Quick Execution', 'Micro Profits', 'High Frequency']
  },
  {
    id: 'K4',
    name: 'Kyra Goldcrown',
    title: 'Wealth Empress',
    description: 'Royal strategist accumulating generational wealth',
    speciality: 'Long-term Investment',
    rarity: 'legendary',
    icon: <Crown className="w-6 h-6" />,
    color: 'from-yellow-400 to-yellow-600',
    bgGradient: 'from-yellow-900/20 to-amber-900/20',
    stats: { power: 90, speed: 70, luck: 95 },
    abilities: ['Wealth Building', 'Compound Growth', 'Strategic Vision']
  },
  {
    id: 'K5',
    name: 'Kane Starforge',
    title: 'Cosmic Analyst',
    description: 'Technical analysis master reading market constellations',
    speciality: 'Technical Analysis',
    rarity: 'epic',
    icon: <Star className="w-6 h-6" />,
    color: 'from-indigo-500 to-purple-500',
    bgGradient: 'from-indigo-900/20 to-purple-900/20',
    stats: { power: 88, speed: 80, luck: 85 },
    abilities: ['Chart Reading', 'Pattern Recognition', 'Trend Analysis']
  },
  {
    id: 'K6',
    name: 'Kaia Fireborn',
    title: 'Momentum Hunter',
    description: 'Aggressive momentum trader riding explosive trends',
    speciality: 'Momentum Trading',
    rarity: 'rare',
    icon: <Flame className="w-6 h-6" />,
    color: 'from-red-500 to-pink-500',
    bgGradient: 'from-red-900/20 to-pink-900/20',
    stats: { power: 92, speed: 87, luck: 80 },
    abilities: ['Trend Riding', 'Breakout Detection', 'Explosive Gains']
  },
  {
    id: 'K7',
    name: 'Kael Gemcutter',
    title: 'Value Seeker',
    description: 'Precision trader finding hidden gems in the market',
    speciality: 'Value Trading',
    rarity: 'epic',
    icon: <Gem className="w-6 h-6" />,
    color: 'from-emerald-500 to-teal-500',
    bgGradient: 'from-emerald-900/20 to-teal-900/20',
    stats: { power: 85, speed: 75, luck: 88 },
    abilities: ['Value Discovery', 'Undervalued Assets', 'Patient Profits']
  },
  {
    id: 'K8',
    name: 'Kira Precision',
    title: 'Sniper Elite',
    description: 'Surgical precision trader with perfect entry timing',
    speciality: 'Precision Trading',
    rarity: 'legendary',
    icon: <Target className="w-6 h-6" />,
    color: 'from-slate-500 to-gray-500',
    bgGradient: 'from-slate-900/20 to-gray-900/20',
    stats: { power: 93, speed: 90, luck: 87 },
    abilities: ['Perfect Timing', 'Surgical Entries', 'Minimal Risk']
  }
];

const rarityColors = {
  common: 'border-gray-400 text-gray-400',
  rare: 'border-blue-400 text-blue-400',
  epic: 'border-purple-400 text-purple-400',
  legendary: 'border-yellow-400 text-yellow-400'
};

const CharacterMenu: React.FC = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [hoveredCharacter, setHoveredCharacter] = useState<string | null>(null);

  return (
    <div className="w-full">
      {/* Character Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {characters.map((character) => (
          <motion.div
            key={character.id}
            className="relative"
            onMouseEnter={() => setHoveredCharacter(character.id)}
            onMouseLeave={() => setHoveredCharacter(null)}
          >
            <Card 
              className={`
                cursor-pointer transition-all duration-300 overflow-hidden
                bg-gradient-to-br ${character.bgGradient}
                border-2 ${selectedCharacter?.id === character.id ? 'border-white' : 'border-white/20'}
                hover:border-white/40 hover:shadow-lg hover:shadow-white/10
                ${hoveredCharacter === character.id ? 'shadow-xl shadow-white/20' : ''}
              `}
              onClick={() => setSelectedCharacter(character)}
            >
              <CardContent className="p-4 text-center">
                {/* Character Icon */}
                <div className={`
                  w-12 h-12 mx-auto mb-3 rounded-full 
                  bg-gradient-to-r ${character.color}
                  flex items-center justify-center text-white
                  shadow-lg
                `}>
                  {character.icon}
                </div>
                
                {/* Character ID */}
                <div className="text-xl font-bold text-white mb-1">
                  {character.id}
                </div>
                
                {/* Character Name */}
                <div className="text-sm text-white/80 mb-2">
                  {character.name.split(' ')[0]}
                </div>
                
                {/* Rarity Badge */}
                <Badge 
                  variant="outline" 
                  className={`text-xs ${rarityColors[character.rarity]} bg-black/20`}
                >
                  {character.rarity.toUpperCase()}
                </Badge>
                
                {/* Hover Stats */}
                {hoveredCharacter === character.id && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-sm p-3 flex flex-col justify-center transition-all duration-300">
                    <div className="text-xs text-white/90 space-y-1">
                      <div className="flex justify-between">
                        <span>Power:</span>
                        <span className="text-red-400">{character.stats.power}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Speed:</span>
                        <span className="text-blue-400">{character.stats.speed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Luck:</span>
                        <span className="text-green-400">{character.stats.luck}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Character Details Panel */}
      {selectedCharacter && (
        <div className="mb-6 transition-all duration-300">
            <Card className="glass-card glass-hover border-white/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Character Avatar */}
                  <div className={`
                    w-20 h-20 rounded-xl 
                    bg-gradient-to-r ${selectedCharacter.color}
                    flex items-center justify-center text-white
                    shadow-xl flex-shrink-0
                  `}>
                    <div className="scale-150">
                      {selectedCharacter.icon}
                    </div>
                  </div>
                  
                  {/* Character Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">
                        {selectedCharacter.name}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`${rarityColors[selectedCharacter.rarity]} bg-black/20`}
                      >
                        {selectedCharacter.rarity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-lg text-white/80 mb-1">
                      {selectedCharacter.title}
                    </p>
                    
                    <p className="text-sm text-white/70 mb-4">
                      {selectedCharacter.description}
                    </p>
                    
                    {/* Speciality */}
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      <span className="text-sm text-white/80">Speciality:</span>
                      <span className="text-sm text-green-400 font-medium">
                        {selectedCharacter.speciality}
                      </span>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center p-2 bg-black/20 rounded-lg">
                        <div className="text-lg font-bold text-red-400">
                          {selectedCharacter.stats.power}
                        </div>
                        <div className="text-xs text-white/70">Power</div>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded-lg">
                        <div className="text-lg font-bold text-blue-400">
                          {selectedCharacter.stats.speed}
                        </div>
                        <div className="text-xs text-white/70">Speed</div>
                      </div>
                      <div className="text-center p-2 bg-black/20 rounded-lg">
                        <div className="text-lg font-bold text-green-400">
                          {selectedCharacter.stats.luck}
                        </div>
                        <div className="text-xs text-white/70">Luck</div>
                      </div>
                    </div>
                    
                    {/* Abilities */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm text-white/80">Special Abilities:</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCharacter.abilities.map((ability, index) => (
                          <Badge 
                            key={index}
                            variant="outline" 
                            className="text-xs border-white/30 text-white/80 bg-black/20"
                          >
                            {ability}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3 mt-6">
                  <Button 
                    className={`
                      bg-gradient-to-r ${selectedCharacter.color} 
                      text-white font-medium hover:opacity-90
                    `}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Select Character
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View Stats
                  </Button>
                </div>
              </CardContent>
            </Card>
        </div>
      )}
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button 
          variant="outline" 
          className="border-white/20 text-white hover:bg-white/10 p-4 h-auto flex flex-col gap-2"
        >
          <TrendingUp className="w-5 h-5 text-green-400" />
          <span className="text-xs">Trading Signals</span>
        </Button>
        <Button 
          variant="outline" 
          className="border-white/20 text-white hover:bg-white/10 p-4 h-auto flex flex-col gap-2"
        >
          <Trophy className="w-5 h-5 text-yellow-400" />
          <span className="text-xs">Leaderboard</span>
        </Button>
        <Button 
          variant="outline" 
          className="border-white/20 text-white hover:bg-white/10 p-4 h-auto flex flex-col gap-2"
        >
          <Award className="w-5 h-5 text-purple-400" />
          <span className="text-xs">Achievements</span>
        </Button>
        <Button 
          variant="outline" 
          className="border-white/20 text-white hover:bg-white/10 p-4 h-auto flex flex-col gap-2"
        >
          <Users className="w-5 h-5 text-blue-400" />
          <span className="text-xs">Community</span>
        </Button>
      </div>
    </div>
  );
};

export default CharacterMenu;