import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

// SUPER SIMPLE balance dengan localStorage persistence
const STORAGE_KEY = 'goldium_wallet_balance';

// Load from localStorage
const loadStoredBalance = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { balance: 0, address: '', connected: false };
  } catch {
    return { balance: 0, address: '', connected: false };
  }
};

// Save to localStorage
const saveBalance = (balance: number, address: string, connected: boolean) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ balance, address, connected }));
    console.log(`💾 Balance saved: ${balance} SOL for ${address}`);
  } catch (error) {
    console.error('Failed to save balance:', error);
  }
};

let STABLE_BALANCE = loadStoredBalance().balance;
let WALLET_ADDRESS = loadStoredBalance().address;
let IS_CONNECTED = loadStoredBalance().connected;

export function SimpleBalanceDisplay() {
  const [displayBalance, setDisplayBalance] = useState(STABLE_BALANCE);
  const [displayAddress, setDisplayAddress] = useState(WALLET_ADDRESS);
  const [isConnected, setIsConnected] = useState(IS_CONNECTED);
  const [isLoading, setIsLoading] = useState(false);

  // Function untuk fetch balance SEKALI dan SIMPAN PERMANENT
  const fetchAndLockBalance = async () => {
    setIsLoading(true);
    
    try {
      // Cek wallet connected
      if (!(window as any).solana?.isConnected || !(window as any).solana?.publicKey) {
        console.log('❌ No wallet connected');
        STABLE_BALANCE = 0;
        WALLET_ADDRESS = '';
        IS_CONNECTED = false;
        setDisplayBalance(0);
        setDisplayAddress('');
        setIsConnected(false);
        
        // Clear localStorage
        saveBalance(0, '', false);
        
        setIsLoading(false);
        return;
      }

      const publicKey = (window as any).solana.publicKey.toString();
      console.log('✅ Wallet connected:', publicKey);
      
      // Set connected state immediately
      WALLET_ADDRESS = publicKey;
      IS_CONNECTED = true;
      setDisplayAddress(publicKey);
      setIsConnected(true);

      // Fetch balance using backend proxy
      try {
        const response = await fetch('/api/get-balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: publicKey })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.balance > 0) {
            STABLE_BALANCE = data.balance;
            setDisplayBalance(data.balance);
            
            // SAVE TO LOCALSTORAGE untuk persistence
            saveBalance(data.balance, publicKey, true);
            
            console.log(`💰 LOCKED BALANCE: ${data.balance} SOL - SAVED TO STORAGE!`);
          } else {
            console.log('⚠️ Backend returned 0 balance');
            // Keep existing balance if backend returns 0
            if (STABLE_BALANCE > 0) {
              console.log(`🔒 Keeping stored balance: ${STABLE_BALANCE} SOL`);
            }
          }
        } else {
          console.log('❌ Backend proxy failed');
        }
      } catch (error) {
        console.error('Balance fetch error:', error);
      }

    } catch (error) {
      console.error('Connection check failed:', error);
    }
    
    setIsLoading(false);
  };

  // Cek wallet HANYA sekali di awal
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAndLockBalance();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-black/90 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/10">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
        <span className="text-xs text-golden-small font-medium">
          {isConnected && displayAddress 
            ? `${displayAddress.slice(0, 4)}...${displayAddress.slice(-4)}`
            : 'No Wallet'
          }
        </span>
      </div>
      
      {/* Balance Display */}
      <div className="h-3 w-px bg-white/20"></div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-golden-small">
          {displayBalance > 0 ? displayBalance.toFixed(4) : '0.0000'} SOL
        </span>
      </div>
      
      {/* Manual Refresh */}
      <Button
        size="sm"
        variant="ghost"
        onClick={fetchAndLockBalance}
        disabled={isLoading}
        className="h-6 w-6 p-0 hover:bg-white/10"
      >
        <RefreshCw className={`w-3 h-3 text-golden-small ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
      
      {/* Debug Info */}
      <div className="text-xs text-golden-small">
        {isLoading ? 'Fetching...' : isConnected ? 'LIVE' : 'OFFLINE'}
      </div>
    </div>
  );
}

// Export balance untuk digunakan komponen lain
export const getStableBalance = () => STABLE_BALANCE;
export const getWalletAddress = () => WALLET_ADDRESS;
export const isWalletConnected = () => IS_CONNECTED;