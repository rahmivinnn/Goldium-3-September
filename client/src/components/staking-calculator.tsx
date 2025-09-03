import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator, TrendingUp, Clock, DollarSign } from 'lucide-react';
import { AnimatedNumber } from './animated-number';

export function StakingCalculator() {
  const [goldAmount, setGoldAmount] = useState('1000');
  const [stakingMonths, setStakingMonths] = useState('12');
  const [apy] = useState(12.5); // 12.5% APY
  const [results, setResults] = useState({
    monthlyReward: 0,
    totalReward: 0,
    finalAmount: 0,
    dailyReward: 0
  });

  const calculateRewards = () => {
    const principal = Number(goldAmount) || 0;
    const months = Number(stakingMonths) || 0;
    
    if (principal <= 0 || months <= 0) {
      setResults({ monthlyReward: 0, totalReward: 0, finalAmount: 0, dailyReward: 0 });
      return;
    }

    // Compound interest calculation
    const monthlyRate = (apy / 100) / 12;
    const finalAmount = principal * Math.pow(1 + monthlyRate, months);
    const totalReward = finalAmount - principal;
    const monthlyReward = totalReward / months;
    const dailyReward = monthlyReward / 30;

    setResults({
      monthlyReward,
      totalReward,
      finalAmount,
      dailyReward
    });
  };

  useEffect(() => {
    calculateRewards();
  }, [goldAmount, stakingMonths]);

  const presetAmounts = [100, 500, 1000, 5000, 10000];
  const presetMonths = [1, 3, 6, 12, 24];

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="font-card-title text-white flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Staking Calculator
        </CardTitle>
        <p className="font-small text-white/70">Calculate your potential GOLDIUM staking rewards</p>
      </CardHeader>

      <CardContent className="space-y-6">
        
        {/* INPUT SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* GOLD AMOUNT */}
          <div className="space-y-3">
            <label className="font-body text-white font-medium">GOLD Amount</label>
            <Input
              type="number"
              placeholder="1000"
              value={goldAmount}
              onChange={(e) => setGoldAmount(e.target.value)}
              className="bg-black/50 border-white/20 text-white text-lg font-bold p-3"
            />
            <div className="grid grid-cols-5 gap-1">
              {presetAmounts.map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setGoldAmount(amount.toString())}
                  className="bg-black/30 border-white/20 text-white hover:bg-yellow-400/20 text-xs"
                >
                  {amount >= 1000 ? `${amount/1000}K` : amount}
                </Button>
              ))}
            </div>
          </div>

          {/* STAKING PERIOD */}
          <div className="space-y-3">
            <label className="font-body text-white font-medium">Staking Period (Months)</label>
            <Input
              type="number"
              placeholder="12"
              value={stakingMonths}
              onChange={(e) => setStakingMonths(e.target.value)}
              className="bg-black/50 border-white/20 text-white text-lg font-bold p-3"
            />
            <div className="grid grid-cols-5 gap-1">
              {presetMonths.map((months) => (
                <Button
                  key={months}
                  variant="outline"
                  size="sm"
                  onClick={() => setStakingMonths(months.toString())}
                  className="bg-black/30 border-white/20 text-white hover:bg-yellow-400/20 text-xs"
                >
                  {months}m
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* APY DISPLAY */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30 rounded-xl p-4 text-center">
          <div className="font-body text-white/70 mb-1">Current APY</div>
          <div className="text-3xl font-bold text-yellow-400">{apy}%</div>
          <div className="font-small text-white/60">Compounded monthly</div>
        </div>

        {/* RESULTS */}
        <div className="grid grid-cols-2 gap-4">
          
          <div className="bg-black/30 border border-white/10 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="font-small text-white/70">Daily Reward</span>
            </div>
            <div className="text-xl font-bold text-green-400">
              <AnimatedNumber value={results.dailyReward} decimals={2} />
              <span className="font-small text-white/70 ml-1">GOLD</span>
            </div>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="font-small text-white/70">Monthly Reward</span>
            </div>
            <div className="text-xl font-bold text-blue-400">
              <AnimatedNumber value={results.monthlyReward} decimals={2} />
              <span className="font-small text-white/70 ml-1">GOLD</span>
            </div>
          </div>

          <div className="bg-black/30 border border-white/10 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-purple-400" />
              <span className="font-small text-white/70">Total Rewards</span>
            </div>
            <div className="text-xl font-bold text-purple-400">
              <AnimatedNumber value={results.totalReward} decimals={2} />
              <span className="font-small text-white/70 ml-1">GOLD</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-yellow-400" />
              <span className="font-small text-white/70">Final Amount</span>
            </div>
            <div className="text-xl font-bold text-yellow-400">
              <AnimatedNumber value={results.finalAmount} decimals={2} />
              <span className="font-small text-white/70 ml-1">GOLD</span>
            </div>
          </div>
        </div>

        {/* BREAKDOWN */}
        <div className="bg-black/20 border border-white/10 rounded-xl p-4">
          <h4 className="font-body text-white font-medium mb-3">Reward Breakdown</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Initial Stake</span>
              <span className="font-small text-white">{Number(goldAmount).toLocaleString()} GOLD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Staking Period</span>
              <span className="font-small text-white">{stakingMonths} months</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Compound Frequency</span>
              <span className="font-small text-white">Monthly</span>
            </div>
            <div className="border-t border-white/10 pt-2 mt-3">
              <div className="flex justify-between items-center">
                <span className="font-body text-white font-medium">ROI</span>
                <span className="font-body text-yellow-400 font-bold">
                  {goldAmount && Number(goldAmount) > 0 
                    ? ((results.totalReward / Number(goldAmount)) * 100).toFixed(1)
                    : '0'
                  }%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <Button className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold py-3">
          Start Staking Now
        </Button>
      </CardContent>
    </Card>
  );
}