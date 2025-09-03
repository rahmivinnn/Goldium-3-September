import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

// REAL WALLET BALANCE - Pakai Solana Wallet Adapter yang proper
export function RealWalletBalance() {
  const { publicKey, connected, connecting } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch REAL balance dari wallet yang connected
  const fetchRealBalance = async () => {
    if (!connected || !publicKey) {
      setBalance(0);
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔄 Fetching REAL balance for:', publicKey.toString());
      
      // Pakai connection dari wallet adapter
      const balanceLamports = await connection.getBalance(publicKey);
      const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;
      
      setBalance(balanceSOL);
      console.log(`💰 REAL BALANCE: ${balanceSOL} SOL`);
      
    } catch (error) {
      console.error('❌ Balance fetch failed:', error);
      setBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch balance when wallet connects
  useEffect(() => {
    if (connected && publicKey) {
      fetchRealBalance();
    } else {
      setBalance(0);
    }
  }, [connected, publicKey]);

  return (
    <div className="flex items-center gap-3 bg-black/90 backdrop-blur-lg px-3 py-2 rounded-xl border border-white/10">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          connected ? 'bg-green-400 animate-pulse' : 
          connecting ? 'bg-yellow-400 animate-pulse' : 
          'bg-gray-400'
        }`}></div>
        <span className="text-xs text-golden-small font-medium">
          {connected && publicKey 
            ? `${publicKey.toString().slice(0, 4)}...${publicKey.toString().slice(-4)}`
            : connecting ? 'Connecting...'
            : 'Not Connected'
          }
        </span>
      </div>
      
      {/* Balance */}
      <div className="h-3 w-px bg-white/20"></div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-golden-small">
          {isLoading ? 'Loading...' : balance.toFixed(4)} SOL
        </span>
      </div>
      
      {/* GOLD Balance (placeholder) */}
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-golden-small">
          0 GOLD
        </span>
      </div>
      
      {/* Status */}
      <div className="text-xs text-golden-small">
        {connected ? 'REAL' : 'OFFLINE'}
      </div>
    </div>
  );
}