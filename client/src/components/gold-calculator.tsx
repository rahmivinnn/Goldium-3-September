import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, DollarSign, Calculator } from 'lucide-react';
import { AnimatedNumber } from './animated-number';

export function GoldCalculator() {
  const [inputType, setInputType] = useState<'USD' | 'SOL'>('USD');
  const [inputAmount, setInputAmount] = useState('100');
  const [goldOutput, setGoldOutput] = useState(0);
  const [solPrice] = useState(195.50); // Current SOL price
  const [goldPrice] = useState(0.00849); // Current GOLD price in USD (from Solscan)
  const [solToGoldRate] = useState(23041); // SOL to GOLD rate (calculated from real prices)

  const calculateGold = () => {
    const amount = Number(inputAmount) || 0;
    
    if (inputType === 'USD') {
      // USD → GOLD
      const goldAmount = amount / goldPrice;
      setGoldOutput(goldAmount);
    } else {
      // SOL → GOLD
      const goldAmount = amount * solToGoldRate;
      setGoldOutput(goldAmount);
    }
  };

  useEffect(() => {
    calculateGold();
  }, [inputAmount, inputType]);

  const toggleInputType = () => {
    setInputType(inputType === 'USD' ? 'SOL' : 'USD');
    setInputAmount('');
  };

  const presetAmounts = {
    USD: [10, 50, 100, 500, 1000],
    SOL: [0.1, 0.5, 1, 5, 10]
  };

  return (
    <Card className="bg-black/20 backdrop-blur-xl border-2 border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="font-card-title text-white flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          GOLDIUM Calculator
        </CardTitle>
        <p className="font-small text-white/70">Calculate how much GOLDIUM you can get</p>
      </CardHeader>

      <CardContent className="space-y-6">
        
        {/* INPUT TYPE TOGGLE */}
        <div className="flex items-center justify-center">
          <Button
            onClick={toggleInputType}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold px-6 py-2 rounded-xl"
          >
            <ArrowRightLeft className="w-4 h-4 mr-2" />
            Switch to {inputType === 'USD' ? 'SOL' : 'USD'}
          </Button>
        </div>

        {/* INPUT SECTION */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-xl p-4">
            <label className="font-body text-white font-medium flex items-center gap-2 mb-3">
              {inputType === 'USD' ? (
                <DollarSign className="w-4 h-4" />
              ) : (
                <span className="text-white">◎</span>
              )}
              Enter {inputType} Amount
            </label>
            
            <Input
              type="number"
              placeholder={inputType === 'USD' ? '100' : '1.0'}
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              className="bg-black/50 border-white/20 text-white text-2xl font-bold p-4 text-center"
            />
            
            {/* PRESET BUTTONS */}
            <div className="grid grid-cols-5 gap-2 mt-3">
              {presetAmounts[inputType].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputAmount(amount.toString())}
                  className="bg-black/30 border-white/20 text-white hover:bg-blue-400/20 text-xs"
                >
                  {inputType === 'USD' ? `$${amount}` : `${amount} SOL`}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* CONVERSION ARROW */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full p-3">
            <ArrowRightLeft className="w-6 h-6 text-black rotate-90" />
          </div>
        </div>

        {/* OUTPUT SECTION */}
        <div className="bg-gradient-to-r from-yellow-400/20 to-amber-500/20 border border-yellow-400/30 rounded-xl p-6 text-center">
          <div className="font-body text-white/70 mb-2">You will receive</div>
          <div className="text-4xl font-bold text-yellow-400 mb-2">
            <AnimatedNumber value={goldOutput} decimals={2} />
            <span className="text-lg font-normal text-white/70 ml-2">GOLD</span>
          </div>
          <div className="font-small text-white/60">
            ≈ ${(goldOutput * goldPrice).toFixed(2)} USD value
          </div>
        </div>

        {/* EXCHANGE RATES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/30 border border-white/10 rounded-lg p-4 text-center">
            <div className="font-small text-white/70 mb-1">SOL Price</div>
            <div className="font-body text-white font-bold">${solPrice}</div>
          </div>
          <div className="bg-black/30 border border-white/10 rounded-lg p-4 text-center">
            <div className="font-small text-white/70 mb-1">GOLD Price</div>
            <div className="font-body text-white font-bold">${goldPrice.toFixed(6)}</div>
          </div>
        </div>

        {/* RATE INFO */}
        <div className="bg-black/20 border border-white/10 rounded-xl p-4">
          <h4 className="font-body text-white font-medium mb-3">Exchange Rates</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">1 SOL =</span>
              <span className="font-small text-white">{solToGoldRate.toLocaleString()} GOLD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">1 GOLD =</span>
              <span className="font-small text-white">{(1/solToGoldRate).toFixed(8)} SOL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">1 USD =</span>
              <span className="font-small text-white">{(1/goldPrice).toLocaleString()} GOLD</span>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3"
            onClick={() => window.open('#defi', '_self')}
          >
            Buy GOLDIUM
          </Button>
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3"
            onClick={() => window.open('#defi', '_self')}
          >
            Start Staking
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}