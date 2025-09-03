import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Wallet, CheckCircle, AlertCircle } from 'lucide-react';

export function ForceRealBalance() {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');
  const [error, setError] = useState<string>('');

  // SUPER SIMPLE wallet detection and balance fetch
  const connectAndGetBalance = async () => {
    setIsLoading(true);
    setError('');
    setStatus('connecting');

    try {
      console.log('🚀 STARTING WALLET CONNECTION...');
      
      // Step 1: Check if Phantom is available
      if (!(window as any).solana?.isPhantom) {
        throw new Error('Phantom wallet not found! Please install Phantom wallet extension.');
      }

      console.log('✅ Phantom wallet detected');

      // Step 2: Connect to Phantom
      const response = await (window as any).solana.connect();
      const publicKey = response.publicKey.toString();
      
      console.log('✅ Phantom connected:', publicKey);
      setWalletAddress(publicKey);
      setStatus('connected');

      // Step 3: Get balance DIRECTLY from Solana RPC
      console.log('🔄 Fetching balance from Solana mainnet...');
      
      const rpcResponse = await fetch('https://api.mainnet-beta.solana.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [publicKey]
        })
      });

      const rpcData = await rpcResponse.json();
      console.log('📊 RPC Response:', rpcData);

      if (rpcData.result?.value !== undefined) {
        const balanceSOL = rpcData.result.value / 1000000000; // Convert lamports to SOL
        console.log(`💰 REAL BALANCE FOUND: ${balanceSOL} SOL`);
        setBalance(balanceSOL);
      } else {
        throw new Error('Invalid RPC response: ' + JSON.stringify(rpcData));
      }

    } catch (err: any) {
      console.error('❌ Connection/Balance fetch failed:', err);
      setError(err.message || 'Connection failed');
      setStatus('error');
      setBalance(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-connect on component mount
  useEffect(() => {
    // Wait a bit for page to load, then try auto-connect
    const timer = setTimeout(() => {
      if ((window as any).solana?.isConnected) {
        console.log('🔄 Auto-connecting to already connected Phantom...');
        connectAndGetBalance();
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-400';
      case 'connecting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected': return 'CONNECTED';
      case 'connecting': return 'CONNECTING...';
      case 'error': return 'ERROR';
      default: return 'NOT CONNECTED';
    }
  };

  return (
    <Card className="bg-black border border-white/10 hover:border-white/20 transition-all">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Wallet className="w-6 h-6 text-white" />
            <h3 className="text-xl font-bold text-white">Real Balance Test</h3>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2">
            {status === 'connected' ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : status === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            )}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Address */}
          {walletAddress && (
            <div className="text-xs text-white/60 font-mono">
              {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
            </div>
          )}

          {/* Balance */}
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${balance.toFixed(4)} SOL`
              )}
            </div>
            <div className="text-sm text-white/70">
              ≈ ${(balance * 195.5).toFixed(2)} USD
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="text-sm text-red-400 bg-red-900/20 border border-red-500/30 rounded p-2">
              {error}
            </div>
          )}

          {/* Connect Button */}
          <Button
            onClick={connectAndGetBalance}
            disabled={isLoading}
            className="w-full bg-black hover:bg-gray-900 border border-white/20 text-white"
          >
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {status === 'connected' ? 'Refresh Balance' : 'Connect Phantom & Get Balance'}
            </div>
          </Button>

          {/* Instructions */}
          <div className="text-xs text-white/50 space-y-1">
            <p>1. Install Phantom wallet extension</p>
            <p>2. Click button above to connect</p>
            <p>3. Real balance will appear from Solana mainnet</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}