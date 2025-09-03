import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Shield, AlertTriangle } from 'lucide-react';

interface WalletTestResult {
  isValid: boolean;
  balance?: number;
  transactions?: number;
  lastActivity?: string;
  error?: string;
}

export function SafeWalletTester() {
  const [testAddress, setTestAddress] = useState('A9anvNZEkxQvU7H5xa1Lj33MVQGuX5rZMKqWDM9S4jSs');
  const [testResult, setTestResult] = useState<WalletTestResult | null>(null);
  const [testing, setTesting] = useState(false);

  const testWalletSafely = async () => {
    if (!testAddress) return;
    
    setTesting(true);
    try {
      console.log('🔍 Testing wallet address safely:', testAddress);
      
      // Validate address format
      if (testAddress.length !== 44) {
        throw new Error('Invalid Solana address length');
      }
      
      // Test with Solana RPC (safe - only public data)
      const response = await fetch('/api/solana-rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method: 'getAccountInfo',
          params: [testAddress, { encoding: 'base64' }]
        })
      });
      
      const data = await response.json();
      
      if (data.result) {
        setTestResult({
          isValid: true,
          balance: (data.result.lamports || 0) / 1000000000, // Convert to SOL
          transactions: Math.floor(Math.random() * 100), // Placeholder
          lastActivity: new Date().toLocaleDateString()
        });
      } else {
        setTestResult({
          isValid: false,
          error: 'Address not found or invalid'
        });
      }
      
    } catch (error) {
      console.error('Wallet test error:', error);
      setTestResult({
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card className="bg-black/20 backdrop-blur-xl border border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" />
          Safe Wallet Testing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Warning */}
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-400 font-bold mb-2">
            <AlertTriangle className="w-5 h-5" />
            SECURITY WARNING
          </div>
          <p className="text-red-300 text-sm">
            Never share private keys! This tool only tests public addresses safely.
          </p>
        </div>

        {/* Address Input */}
        <div className="space-y-2">
          <label className="text-white text-sm font-medium">
            Public Wallet Address (Safe to test)
          </label>
          <Input
            value={testAddress}
            onChange={(e) => setTestAddress(e.target.value)}
            placeholder="Enter Solana public address..."
            className="bg-white/5 border-white/20 text-white"
          />
        </div>

        {/* Test Button */}
        <Button 
          onClick={testWalletSafely}
          disabled={testing || !testAddress}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {testing ? 'Testing...' : 'Test Address Safely'}
        </Button>

        {/* Results */}
        {testResult && (
          <div className="space-y-3">
            {testResult.isValid ? (
              <div className="bg-green-500/20 border border-green-500 rounded-lg p-4">
                <h3 className="text-green-400 font-bold mb-2">✅ Valid Address</h3>
                <div className="space-y-1 text-sm">
                  <div className="text-green-300">Balance: {testResult.balance?.toFixed(4)} SOL</div>
                  <div className="text-green-300">Status: Active on Mainnet</div>
                  <div className="flex items-center gap-2 mt-2">
                    <a 
                      href={`https://solscan.io/account/${testAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Solscan
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
                <h3 className="text-red-400 font-bold mb-2">❌ Test Failed</h3>
                <p className="text-red-300 text-sm">{testResult.error}</p>
              </div>
            )}
          </div>
        )}

        {/* Safe Testing Instructions */}
        <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
          <h3 className="text-blue-400 font-bold mb-2">🛡️ Safe Testing Guide</h3>
          <ul className="text-blue-300 text-sm space-y-1">
            <li>• Only public address testing (no private keys)</li>
            <li>• Check balance and transaction history</li>
            <li>• Verify on Solscan explorer</li>
            <li>• Test DeFi features with wallet connection</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}