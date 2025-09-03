import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, CandlestickChart } from 'recharts';
import { TrendingUp, TrendingDown, BarChart3, Activity } from 'lucide-react';

interface PriceData {
  time: string;
  timestamp: number;
  solPrice: number;
  goldPrice: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
}

export function LivePriceChart() {
  const [chartData, setChartData] = useState<PriceData[]>([]);
  const [viewType, setViewType] = useState<'line' | 'candlestick'>('line');
  const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [isLoading, setIsLoading] = useState(true);

  // Generate realistic price data
  const generatePriceData = () => {
    const data: PriceData[] = [];
    const now = Date.now();
    const intervals = {
      '1h': { count: 60, interval: 60000 }, // 1 minute intervals
      '24h': { count: 24, interval: 3600000 }, // 1 hour intervals  
      '7d': { count: 7, interval: 86400000 }, // 1 day intervals
      '30d': { count: 30, interval: 86400000 } // 1 day intervals
    };

    const config = intervals[timeframe];
    let baseSOL = 195.50;
    let baseGOLD = 0.000047;

    for (let i = config.count; i >= 0; i--) {
      const timestamp = now - (i * config.interval);
      
      // Realistic price fluctuation
      const solChange = (Math.random() - 0.5) * 10; // ±$5 change
      const goldChange = (Math.random() - 0.5) * 0.000010; // ±0.000005 change
      
      baseSOL = Math.max(180, Math.min(220, baseSOL + solChange));
      baseGOLD = Math.max(0.000030, Math.min(0.000070, baseGOLD + goldChange));

      const high = baseSOL + Math.random() * 5;
      const low = baseSOL - Math.random() * 5;
      
      data.push({
        time: new Date(timestamp).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          ...(timeframe === '7d' || timeframe === '30d' ? { 
            month: 'short', 
            day: 'numeric' 
          } : {})
        }),
        timestamp,
        solPrice: baseSOL,
        goldPrice: baseGOLD,
        volume: Math.random() * 100000 + 50000,
        high,
        low,
        open: baseSOL - (Math.random() - 0.5) * 3,
        close: baseSOL
      });
    }

    return data;
  };

  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const data = generatePriceData();
      setChartData(data);
      setIsLoading(false);
    }, 500);

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      const data = generatePriceData();
      setChartData(data);
    }, 30000);

    return () => clearInterval(interval);
  }, [timeframe]);

  const latestData = chartData[chartData.length - 1];
  const previousData = chartData[chartData.length - 2];
  const solChange = latestData && previousData ? 
    ((latestData.solPrice - previousData.solPrice) / previousData.solPrice) * 100 : 0;
  const goldChange = latestData && previousData ? 
    ((latestData.goldPrice - previousData.goldPrice) / previousData.goldPrice) * 100 : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 backdrop-blur-xl border border-white/20 rounded-lg p-3 shadow-xl">
          <p className="font-small text-white/70 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="font-small text-white">
              <span style={{ color: entry.color }}>{entry.name}: </span>
              ${entry.value.toFixed(entry.dataKey === 'goldPrice' ? 6 : 2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-card-title text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Live Price Chart
          </CardTitle>
          
          {/* TIMEFRAME BUTTONS */}
          <div className="flex gap-1">
            {(['1h', '24h', '7d', '30d'] as const).map((tf) => (
              <Button
                key={tf}
                variant={timeframe === tf ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeframe(tf)}
                className={timeframe === tf 
                  ? 'bg-yellow-400 text-black font-bold' 
                  : 'bg-black/50 border-white/20 text-white hover:bg-white/10'
                }
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>

        {/* PRICE INDICATORS */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-black/30 border border-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-white text-lg">◎</span>
              <span className="font-small text-white/70">SOL</span>
              {solChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className="text-xl font-bold text-white">
              ${latestData?.solPrice.toFixed(2) || '195.50'}
            </div>
            <div className={`font-small ${solChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {solChange > 0 ? '+' : ''}{solChange.toFixed(2)}%
            </div>
          </div>
          
          <div className="bg-black/30 border border-white/10 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <span className="text-yellow-400">🥇</span>
              <span className="font-small text-white/70">GOLD</span>
              {goldChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            <div className="text-xl font-bold text-white">
              ${latestData?.goldPrice.toFixed(6) || '0.000047'}
            </div>
            <div className={`font-small ${goldChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {goldChange > 0 ? '+' : ''}{goldChange.toFixed(2)}%
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* CHART TYPE TOGGLE */}
        <div className="flex items-center gap-2 mb-4">
          <Button
            variant={viewType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('line')}
            className={viewType === 'line' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-black/50 border-white/20 text-white'
            }
          >
            <Activity className="w-4 h-4 mr-1" />
            Line
          </Button>
          <Button
            variant={viewType === 'candlestick' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewType('candlestick')}
            className={viewType === 'candlestick' 
              ? 'bg-yellow-400 text-black' 
              : 'bg-black/50 border-white/20 text-white'
            }
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            Candles
          </Button>
        </div>

        {/* CHART */}
        <div className="h-80">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="time" 
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                />
                <YAxis 
                  yAxisId="sol"
                  orientation="left"
                  stroke="rgba(255,255,255,0.7)"
                  fontSize={12}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <YAxis 
                  yAxisId="gold"
                  orientation="right"
                  stroke="rgba(255,215,0,0.7)"
                  fontSize={12}
                  domain={['dataMin - 0.000005', 'dataMax + 0.000005']}
                />
                <Tooltip content={<CustomTooltip />} />
                
                <Line 
                  yAxisId="sol"
                  type="monotone" 
                  dataKey="solPrice" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                  name="SOL Price"
                />
                <Line 
                  yAxisId="gold"
                  type="monotone" 
                  dataKey="goldPrice" 
                  stroke="#FFD700" 
                  strokeWidth={2}
                  dot={{ fill: '#FFD700', strokeWidth: 2, r: 4 }}
                  name="GOLD Price"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* CHART STATS */}
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-black/30 border border-white/10 rounded-lg p-3 text-center">
            <div className="font-small text-white/70">24h Volume</div>
            <div className="font-body text-white font-bold">
              ${latestData?.volume.toLocaleString() || '75,000'}
            </div>
          </div>
          <div className="bg-black/30 border border-white/10 rounded-lg p-3 text-center">
            <div className="font-small text-white/70">SOL High</div>
            <div className="font-body text-green-400 font-bold">
              ${latestData?.high.toFixed(2) || '198.50'}
            </div>
          </div>
          <div className="bg-black/30 border border-white/10 rounded-lg p-3 text-center">
            <div className="font-small text-white/70">SOL Low</div>
            <div className="font-body text-red-400 font-bold">
              ${latestData?.low.toFixed(2) || '192.30'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}