import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function DebugWalletReal() {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [balance, setBalance] = useState('0.0000');
  const [address, setAddress] = useState('');

  // AGGRESSIVE wallet detection
  const aggressiveCheck = () => {
    const info: any = {
      timestamp: new Date().toLocaleTimeString(),
      windowSolana: !!(window as any).solana,
      isPhantom: !!(window as any).solana?.isPhantom,
      isConnected: !!(window as any).solana?.isConnected,
      publicKey: (window as any).solana?.publicKey?.toString() || 'null',
      address: (window as any).solana?.publicKey?.toString() || 'NONE',
      walletObject: JSON.stringify((window as any).solana || 'NO SOLANA OBJECT'),
    };
    
    setDebugInfo(info);
    
    // Jika ada address, set langsung
    if (info.address && info.address !== 'NONE') {
      setAddress(info.address);
      console.log('🔥 FOUND ADDRESS:', info.address);
      
      // Set test balance langsung
      setBalance('3.1415');
      console.log('💰 SET TEST BALANCE: 3.1415 SOL');
    } else {
      setAddress('');
      setBalance('0.0000');
    }
    
    console.log('🔍 AGGRESSIVE DEBUG:', info);
  };

  // FORCE connect Phantom
  const forcePhantomConnect = async () => {
    try {
      console.log('🚀 FORCING Phantom connection...');
      
      if (!(window as any).solana) {
        alert('Phantom not installed!');
        return;
      }
      
      const response = await (window as any).solana.connect();
      console.log('✅ Phantom response:', response);
      
      if (response.publicKey) {
        const addr = response.publicKey.toString();
        setAddress(addr);
        setBalance('4.5678');
        console.log('💰 FORCE BALANCE SET:', addr, '4.5678 SOL');
        aggressiveCheck();
      }
      
    } catch (error) {
      console.error('❌ Force connect failed:', error);
    }
  };

  // Check setiap detik
  useEffect(() => {
    aggressiveCheck();
    const interval = setInterval(aggressiveCheck, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-20 right-4 z-50 w-80">
      <Card className="bg-black border border-yellow-400">
        <CardContent className="p-4">
          <h3 className="text-yellow-400 font-bold mb-4">🔥 WALLET DEBUG REAL-TIME</h3>
          
          {/* Current Display */}
          <div className="space-y-2 mb-4">
            <div className="text-white">
              <strong>Address:</strong> {address || 'NONE'}
            </div>
            <div className="text-white">
              <strong>Balance:</strong> {balance} SOL
            </div>
            <div className="text-white">
              <strong>Status:</strong> {address ? 'CONNECTED' : 'NOT CONNECTED'}
            </div>
          </div>

          {/* Debug Info */}
          <div className="bg-gray-900 p-2 rounded text-xs text-green-400 mb-4 max-h-32 overflow-y-auto">
            <div><strong>Time:</strong> {debugInfo.timestamp}</div>
            <div><strong>window.solana:</strong> {debugInfo.windowSolana ? 'YES' : 'NO'}</div>
            <div><strong>isPhantom:</strong> {debugInfo.isPhantom ? 'YES' : 'NO'}</div>
            <div><strong>isConnected:</strong> {debugInfo.isConnected ? 'YES' : 'NO'}</div>
            <div><strong>publicKey:</strong> {debugInfo.publicKey}</div>
            <div className="break-all"><strong>wallet obj:</strong> {debugInfo.walletObject?.slice(0, 100)}...</div>
          </div>

          {/* Controls */}
          <div className="space-y-2">
            <Button 
              onClick={forcePhantomConnect}
              className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold"
            >
              🔥 FORCE CONNECT PHANTOM
            </Button>
            <Button 
              onClick={aggressiveCheck}
              variant="outline"
              className="w-full border-yellow-400 text-yellow-400"
            >
              🔍 REFRESH DEBUG
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}