import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Button } from '@/components/ui/button';
import { Wallet, RefreshCw } from 'lucide-react';

// EFFICIENT WALLET BALANCE - Minimal RPC calls, maximum efficiency
export function EfficientWalletBalance() {
  const { publicKey, connected, connecting, disconnect } = useWallet();
  const [balance, setBalance] = useState<number>(0);
  const [goldBalance, setGoldBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetch, setLastFetch] = useState<number>(0);

  // Efficient balance fetch - only when needed, with caching
  const fetchBalance = async (force: boolean = false) => {
    if (!connected || !publicKey) {
      setBalance(0);
      setGoldBalance(0);
      return;
    }

    // Rate limiting - only fetch if 30 seconds passed or forced
    const now = Date.now();
    if (!force && (now - lastFetch < 30000)) {
      console.log('⏳ Skipping balance fetch - rate limited (30s cooldown)');
      return;
    }

    setIsLoading(true);
    setLastFetch(now);

    try {
      console.log('💰 Fetching balance for:', publicKey.toString());
      
      // Use our backend proxy to avoid direct RPC rate limits
      const response = await fetch('/api/get-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          address: publicKey.toString(),
          timestamp: now // Add timestamp to prevent caching issues
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBalance(data.balance || 0);
          console.log(`✅ Balance fetched: ${data.balance} SOL`);
          
          // REAL GOLD balance from SPL token account (to be implemented)
          setGoldBalance(0); // Real GOLD balance - for now 0 until SPL token account is fetched
        } else {
          console.log('⚠️ Backend returned no balance');
          setBalance(0);
          setGoldBalance(0);
        }
      } else {
        console.log('❌ Backend proxy failed - NO BALANCE');
        setBalance(0);
        setGoldBalance(0);
      }

    } catch (error) {
      console.error('❌ Balance fetch failed - NO BALANCE:', error);
      // NO DEMO BALANCE - REAL ONLY OR 0
      setBalance(0);
      setGoldBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  // DEBUG and auto-fetch balance
  useEffect(() => {
    console.log('🔍 Wallet state changed:', { 
      connected, 
      publicKey: publicKey?.toString(), 
      balance,
      connecting 
    });
    
    if (connected && publicKey) {
      console.log('🔄 Wallet connected - fetching balance');
      fetchBalance(true); // Force fetch
    } else if (!connected) {
      console.log('❌ Wallet not connected - resetting balance');
      setBalance(0);
      setGoldBalance(0);
    }
  }, [connected, publicKey, connecting]);

  // Also try to fetch on component mount if wallet already connected
  useEffect(() => {
    const timer = setTimeout(() => {
      if (connected && publicKey && balance === 0) {
        console.log('🔄 Component mounted with connected wallet - fetching balance');
        fetchBalance(true);
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Manual refresh with rate limiting
  const handleRefresh = () => {
    const timeSinceLastFetch = Date.now() - lastFetch;
    if (timeSinceLastFetch < 30000) {
      const waitTime = Math.ceil((30000 - timeSinceLastFetch) / 1000);
      alert(`Please wait ${waitTime} seconds before refreshing again (rate limit protection)`);
      return;
    }
    fetchBalance(true);
  };

  const getStatusColor = () => {
    if (connecting) return 'bg-yellow-400 animate-pulse';
    if (connected && balance > 0) return 'bg-green-400 animate-pulse';
    if (connected && balance === 0) return 'bg-blue-400 animate-pulse';
    return 'bg-gray-400';
  };

  const getStatusText = () => {
    if (connecting) return 'Connecting...';
    if (connected && isLoading) return 'Fetching...';
    if (connected && balance > 0) return 'Live';
    if (connected) return 'Connected';
    return 'Not Connected';
  };

  // Hanya tampilkan jika wallet connected DAN ada balance
  if (!connected || (!balance && !goldBalance)) {
    return null; // Tidak tampilkan apa-apa jika tidak connected atau balance 0
  }

  return (
    <div className="flex items-center gap-3 bg-black/90 backdrop-blur-lg px-3 py-2 rounded-xl border border-white/10">
      {/* Connection Status - hanya jika connected */}
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span className="text-xs text-golden-small font-medium">
          {`${publicKey!.toString().slice(0, 4)}...${publicKey!.toString().slice(-4)}`}
        </span>
      </div>
      
      {/* Balance Display */}
      <div className="h-3 w-px bg-white/20"></div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-golden-small">
          {balance.toFixed(4)} SOL
        </span>
      </div>
      
      {goldBalance > 0 && (
        <>
          <div className="h-3 w-px bg-white/20"></div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-golden-small">
              {goldBalance.toLocaleString()} GOLD
            </span>
          </div>
        </>
      )}
      
      {/* Refresh button */}
      <Button
        size="sm"
        variant="ghost"
        onClick={handleRefresh}
        disabled={isLoading || (Date.now() - lastFetch < 30000)}
        className="h-6 w-6 p-0 hover:bg-white/10"
        title="Refresh balance (30s cooldown)"
      >
        <RefreshCw className={`w-3 h-3 text-golden-small ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}