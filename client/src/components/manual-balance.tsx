import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Check, X } from 'lucide-react';

// MANUAL BALANCE - User bisa set sendiri!
export function ManualBalance() {
  const [solBalance, setSolBalance] = useState('0.0000');
  const [goldBalance, setGoldBalance] = useState('0');
  const [address, setAddress] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempSol, setTempSol] = useState('');
  const [tempGold, setTempGold] = useState('');
  const [tempAddress, setTempAddress] = useState('');

  // Load dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('manual_balance');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setSolBalance(data.solBalance || '0.0000');
        setGoldBalance(data.goldBalance || '0');
        setAddress(data.address || '');
      } catch (e) {
        console.log('Failed to load saved balance');
      }
    }
  }, []);

  // Save ke localStorage
  const saveBalance = (sol: string, gold: string, addr: string) => {
    try {
      localStorage.setItem('manual_balance', JSON.stringify({
        solBalance: sol,
        goldBalance: gold,
        address: addr
      }));
      console.log(`💾 Manual balance saved: ${sol} SOL, ${gold} GOLD`);
    } catch (e) {
      console.log('Failed to save balance');
    }
  };

  const startEdit = () => {
    setTempSol(solBalance);
    setTempGold(goldBalance);
    setTempAddress(address);
    setIsEditing(true);
  };

  const saveEdit = () => {
    setSolBalance(tempSol);
    setGoldBalance(tempGold);
    setAddress(tempAddress);
    saveBalance(tempSol, tempGold, tempAddress);
    setIsEditing(false);
    console.log(`✅ Balance updated: ${tempSol} SOL, ${tempGold} GOLD`);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };

  // Preset balances
  const setPreset = (sol: string, gold: string, addr: string) => {
    setSolBalance(sol);
    setGoldBalance(gold);
    setAddress(addr);
    saveBalance(sol, gold, addr);
    console.log(`🎯 Preset set: ${sol} SOL, ${gold} GOLD`);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 bg-yellow-900/20 backdrop-blur-lg px-3 py-2 rounded-xl border border-yellow-400">
        <Input
          value={tempAddress}
          onChange={(e) => setTempAddress(e.target.value)}
          placeholder="Wallet address"
          className="h-6 w-20 text-xs bg-black border-yellow-400 text-white"
        />
        <Input
          value={tempSol}
          onChange={(e) => setTempSol(e.target.value)}
          placeholder="SOL"
          className="h-6 w-16 text-xs bg-black border-yellow-400 text-white"
        />
        <Input
          value={tempGold}
          onChange={(e) => setTempGold(e.target.value)}
          placeholder="GOLD"
          className="h-6 w-16 text-xs bg-black border-yellow-400 text-white"
        />
        <Button size="sm" onClick={saveEdit} className="h-6 w-6 p-0 bg-green-600">
          <Check className="w-3 h-3" />
        </Button>
        <Button size="sm" onClick={cancelEdit} className="h-6 w-6 p-0 bg-red-600">
          <X className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-black/90 backdrop-blur-lg px-3 py-2 rounded-xl border border-white/10">
      {/* Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          parseFloat(solBalance) > 0 ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
        }`}></div>
        <span className="text-xs text-golden-small font-medium">
          {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'Manual'}
        </span>
      </div>
      
      {/* Balance */}
      <div className="h-3 w-px bg-white/20"></div>
      <span className="text-xs font-semibold text-golden-small">
        {solBalance} SOL
      </span>
      
      <div className="h-3 w-px bg-white/20"></div>
      <span className="text-xs font-semibold text-golden-small">
        {goldBalance} GOLD
      </span>
      
      {/* Edit Button */}
      <Button
        size="sm"
        variant="ghost"
        onClick={startEdit}
        className="h-5 w-5 p-0 hover:bg-white/10"
        title="Edit Balance Manual"
      >
        <Edit className="w-3 h-3 text-golden-small" />
      </Button>

      {/* Quick Presets */}
      <div className="flex gap-1">
        <Button
          size="sm"
          onClick={() => setPreset('2.5000', '1000', 'Demo1...Wallet')}
          className="h-5 px-2 text-xs bg-yellow-600 hover:bg-yellow-500 text-black"
        >
          Demo
        </Button>
        <Button
          size="sm"
          onClick={() => setPreset('0.0000', '0', '')}
          className="h-5 px-2 text-xs bg-red-600 hover:bg-red-500 text-white"
        >
          Clear
        </Button>
      </div>
    </div>
  );
}