import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

// BRUTAL SIMPLE - Balance yang PAKSA tidak reset
export function BrutalBalance() {
  const [balance, setBalance] = useState<string>('0.0000');
  const [address, setAddress] = useState<string>('');
  const [status, setStatus] = useState<string>('NOT CONNECTED');
  const [isLoading, setIsLoading] = useState(false);
  const [isReallyConnected, setIsReallyConnected] = useState(false);
  const [lastClickTime, setLastClickTime] = useState(0);

  // PAKSA connect dan get balance - SINGLE UPDATE ONLY
  const forceConnect = async () => {
    // Prevent rapid clicking
    const now = Date.now();
    if (isLoading || (now - lastClickTime < 3000)) {
      console.log('⏳ Please wait - preventing rapid clicks');
      return;
    }
    setLastClickTime(now);
    
    setIsLoading(true);
    
    try {
      console.log('🚀 Starting wallet connection...');
      
      // Step 1: Check/Connect Phantom
      let publicKey = '';
      
      if (!(window as any).solana?.isPhantom) {
        alert('Install Phantom wallet first!');
        setStatus('NO PHANTOM');
        setIsLoading(false);
        return;
      }

      // Check if already connected
      if ((window as any).solana?.isConnected && (window as any).solana?.publicKey) {
        publicKey = (window as any).solana.publicKey.toString();
        console.log('✅ Already connected to:', publicKey);
      } else {
        // Need to connect
        setStatus('CONNECTING...');
        const response = await (window as any).solana.connect();
        publicKey = response.publicKey.toString();
        console.log('✅ Newly connected to:', publicKey);
      }
      
      // Step 2: Fetch balance ONCE
      console.log('🔄 Fetching balance...');
      
      const backendResponse = await fetch('/api/get-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: publicKey })
      });
      
      // Step 3: Set ALL states ONCE to avoid kedip
      let finalBalance = '1.5678'; // Default test balance
      let finalStatus = 'TEST';
      
      if (backendResponse.ok) {
        const data = await backendResponse.json();
        if (data.success && data.balance > 0) {
          finalBalance = data.balance.toFixed(4);
          finalStatus = 'LIVE';
          console.log(`💰 REAL BALANCE: ${data.balance} SOL`);
        } else {
          console.log('💰 Using test balance');
        }
      } else {
        console.log('💰 Backend failed, using test balance');
      }
      
      // UPDATE ALL STATES AT ONCE - NO KEDIP!
      setAddress(publicKey);
      setIsReallyConnected(true);
      setBalance(finalBalance);
      setStatus(finalStatus);
      
      console.log(`🔒 LOCKED: ${finalBalance} SOL with status ${finalStatus}`);
      
      // STOP HERE - NO MORE STATE UPDATES!
      
    } catch (error: any) {
      console.error('❌ Connection failed:', error);
      setStatus('ERROR');
      setIsReallyConnected(false);
      setAddress('');
      setBalance('0.0000');
    }
    
    setIsLoading(false);
  };

  // TIDAK auto-connect! Hanya manual saja
  useEffect(() => {
    // Cek status wallet tapi JANGAN auto-connect
    const timer = setTimeout(() => {
      if ((window as any).solana?.isConnected && (window as any).solana?.publicKey) {
        const publicKey = (window as any).solana.publicKey.toString();
        setAddress(publicKey);
        setIsReallyConnected(true);
        setStatus('CONNECTED - Click refresh to get balance');
        console.log('✅ Wallet already connected but balance not fetched yet');
      } else {
        setStatus('NOT CONNECTED');
        setIsReallyConnected(false);
        setAddress('');
        setBalance('0.0000');
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center gap-3 bg-black/90 backdrop-blur-lg px-4 py-2 rounded-xl border border-white/10">
      {/* Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          status.includes('LIVE') ? 'bg-green-400 animate-pulse' : 
          status.includes('TEST') ? 'bg-yellow-400 animate-pulse' :
          status.includes('ERROR') ? 'bg-red-400' : 'bg-gray-400'
        }`}></div>
        <span className="text-xs text-golden-small font-medium">
          {isReallyConnected && address ? `${address.slice(0, 4)}...${address.slice(-4)}` : 'No Wallet'}
        </span>
      </div>
      
      {/* Balance */}
      <div className="h-3 w-px bg-white/20"></div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-semibold text-golden-small">
          {balance} SOL
        </span>
      </div>
      
      {/* Status Text */}
      <div className="text-xs text-golden-small">
        {status}
      </div>
      
      {/* Force Connect/Refresh */}
      <Button
        size="sm"
        variant="ghost"
        onClick={forceConnect}
        disabled={isLoading}
        className="h-6 w-6 p-0 hover:bg-white/10"
        title={isReallyConnected ? "Refresh balance" : "Connect wallet & get balance"}
      >
        <RefreshCw className={`w-3 h-3 text-golden-small ${isLoading ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}