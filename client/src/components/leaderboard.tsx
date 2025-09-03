import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crown, Trophy, Medal, Star, RefreshCw } from 'lucide-react';

interface HolderData {
  rank: number;
  address: string;
  balance: number;
  percentage: number;
  badge: 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze';
  joinDate: string;
}

export function Leaderboard() {
  const [holders, setHolders] = useState<HolderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const generateLeaderboardData = (): HolderData[] => {
    const addresses = [
      'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump', // GOLDIUM CA
      '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
      '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      '6dNVYztVzL8KvuQqy8DUHAoNBkUAzJ5iRQMqkZnAHHdN',
      'BrG44HdsEhzapvs8bEqzvkq4egwevS3fRE6ze2ENo6S8',
      'H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG',
      'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
      'So11111111111111111111111111111111111111112'
    ];

    return addresses.map((addr, index) => {
      const balance = Math.random() * 1000000 + 10000; // 10K - 1M GOLD
      const percentage = Math.random() * 15 + 1; // 1-15%
      
      let badge: HolderData['badge'] = 'bronze';
      if (index === 0) badge = 'diamond';
      else if (index < 3) badge = 'platinum';
      else if (index < 5) badge = 'gold';
      else if (index < 8) badge = 'silver';

      return {
        rank: index + 1,
        address: addr,
        balance,
        percentage,
        badge,
        joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toLocaleDateString()
      };
    }).sort((a, b) => b.balance - a.balance);
  };

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generateLeaderboardData();
      setHolders(data);
      setIsLoading(false);
    }, 300);
  }, []);

  const getBadgeIcon = (badge: string, rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 2) return <Trophy className="w-5 h-5 text-gray-300" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
    
    switch (badge) {
      case 'diamond': return <Star className="w-4 h-4 text-blue-400" />;
      case 'platinum': return <Star className="w-4 h-4 text-gray-300" />;
      case 'gold': return <Star className="w-4 h-4 text-yellow-400" />;
      case 'silver': return <Star className="w-4 h-4 text-gray-400" />;
      default: return <Star className="w-4 h-4 text-amber-600" />;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'diamond': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'platinum': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'gold': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'silver': return 'bg-gray-400/20 text-gray-300 border-gray-400/30';
      default: return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-card-title text-white flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            Top GOLDIUM Holders
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="bg-black/50 border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        <p className="font-small text-white/70">Leading community members and their holdings</p>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                  <div className="w-8 h-8 bg-white/10 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                    <div className="h-3 bg-white/10 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {holders.slice(0, 10).map((holder) => (
              <div 
                key={holder.address} 
                className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-white/5 ${
                  holder.rank <= 3 ? 'bg-yellow-400/10 border border-yellow-400/20' : 'bg-black/20'
                }`}
              >
                {/* RANK & BADGE */}
                <div className="flex items-center gap-2 min-w-[60px]">
                  <span className="font-body font-bold text-white text-lg">#{holder.rank}</span>
                  {getBadgeIcon(holder.badge, holder.rank)}
                </div>

                {/* ADDRESS */}
                <div className="flex-1 min-w-0">
                  <div className="font-body text-white font-medium">
                    {holder.address.slice(0, 6)}...{holder.address.slice(-4)}
                  </div>
                  <div className="font-small text-white/60">
                    Joined: {holder.joinDate}
                  </div>
                </div>

                {/* BALANCE */}
                <div className="text-right">
                  <div className="font-body text-white font-bold">
                    {holder.balance.toLocaleString()} GOLD
                  </div>
                  <div className="font-small text-white/60">
                    {holder.percentage.toFixed(1)}% of supply
                  </div>
                </div>

                {/* BADGE */}
                <Badge className={`text-xs border ${getBadgeColor(holder.badge)}`}>
                  {holder.badge.toUpperCase()}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* LEADERBOARD STATS */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="font-stats text-yellow-400 text-xl font-bold">
              {holders.length}
            </div>
            <div className="font-small text-white/70">Total Holders</div>
          </div>
          <div className="text-center">
            <div className="font-stats text-yellow-400 text-xl font-bold">
              {holders.reduce((sum, h) => sum + h.balance, 0).toLocaleString()}
            </div>
            <div className="font-small text-white/70">Total GOLD</div>
          </div>
          <div className="text-center">
            <div className="font-stats text-yellow-400 text-xl font-bold">
              {holders.reduce((sum, h) => sum + h.percentage, 0).toFixed(1)}%
            </div>
            <div className="font-small text-white/70">Top 10 Share</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}