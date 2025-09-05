import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Wallet, Send, RefreshCw, ArrowUpDown, BookOpen } from 'lucide-react';
import { validateClientWallet, checkClientWalletBalance, CLIENT_WALLET_DATA } from '@/lib/wallet-validator';
import { clientWalletService } from '@/lib/client-wallet-service';
import { useToast } from '@/hooks/use-toast';
import ManualSwapGuide from './ManualSwapGuide';

export function ClientWalletTester() {
  const [walletValid, setWalletValid] = useState<boolean | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [swapAmount, setSwapAmount] = useState('0.1');
  const [sendAmount, setSendAmount] = useState('0.01');
  const [sendRecipient, setSendRecipient] = useState('');
  const [showManualGuide, setShowManualGuide] = useState(false);
  const { toast } = useToast();

  // Validate wallet on component mount
  useEffect(() => {
    const validation = validateClientWallet();
    setWalletValid(validation.isValid);
    
    if (validation.isValid) {
      toast({
        title: "✅ Wallet Validated",
        description: "Client wallet keypair is valid and ready for testing!",
      });
    } else {
      toast({
        title: "❌ Validation Failed", 
        description: validation.error || "Wallet validation failed",
        variant: "destructive"
      });
    }
  }, [toast]);

  const refreshBalance = async () => {
    setLoading(true);
    try {
      const newBalance = await checkClientWalletBalance();
      setBalance(newBalance);
      
      toast({
        title: "Balance Updated",
        description: `Current balance: ${newBalance.toFixed(4)} SOL`,
      });
    } catch (error) {
      toast({
        title: "Balance Check Failed",
        description: "Failed to fetch wallet balance",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testSwapFeature = async () => {
    if (!walletValid) return;
    
    setLoading(true);
    try {
      const result = await clientWalletService.simulateSwap(parseFloat(swapAmount));
      
      if (result.success) {
        toast({
          title: "✅ Swap Test Successful!",
          description: `Simulated swap of ${swapAmount} SOL to GOLDIUM`,
        });
        
        console.log(`🔗 Track on Solscan: https://solscan.io/tx/${result.signature}`);
      } else {
        throw new Error(result.error || 'Swap test failed');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to test swap feature";
      
      toast({
        title: "❌ Swap Test Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const testSendFeature = async () => {
    if (!walletValid || !sendRecipient) return;
    
    setLoading(true);
    try {
      const result = await clientWalletService.simulateSend(parseFloat(sendAmount), sendRecipient);
      
      if (result.success) {
        toast({
          title: "✅ Send Test Successful!",
          description: `Simulated send of ${sendAmount} SOL to ${sendRecipient.slice(0, 8)}...`,
        });
        
        console.log(`🔗 Track on Solscan: https://solscan.io/tx/${result.signature}`);
      } else {
        throw new Error(result.error || 'Send test failed');
      }
      
    } catch (error) {
      toast({
        title: "❌ Send Test Failed",
        description: error instanceof Error ? error.message : "Failed to test send feature",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Status */}
      <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-yellow-400" />
            Client Wallet Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Public Address</div>
              <div className="text-white font-mono text-sm break-all bg-gray-800 p-2 rounded">
                {CLIENT_WALLET_DATA.publicAddress}
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm text-gray-400">Validation Status</div>
              <Badge variant={walletValid ? "default" : "destructive"} className="w-fit">
                {walletValid === null ? 'Checking...' : walletValid ? '✅ Valid' : '❌ Invalid'}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="space-y-1">
              <div className="text-sm text-gray-400">Balance</div>
              <div className="text-xl font-bold text-white">{balance.toFixed(4)} SOL</div>
            </div>
            
            <Button 
              onClick={refreshBalance}
              disabled={loading}
              variant="outline"
              size="sm"
              className="border-white/20"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={`https://solscan.io/account/${CLIENT_WALLET_DATA.publicAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
            >
              <ExternalLink className="w-4 h-4" />
              View on Solscan
            </a>
          </div>
        </CardContent>
      </Card>

      {/* DeFi Testing */}
      <Card className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-xl border-2 border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white">DeFi Features Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="swap" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800/80 border border-white/20">
              <TabsTrigger value="swap" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Swap Test
              </TabsTrigger>
              <TabsTrigger value="send" className="data-[state=active]:bg-yellow-400 data-[state=active]:text-black">
                <Send className="w-4 h-4 mr-2" />
                Send Test
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="swap" className="space-y-4">
              <div className="space-y-2">
                <label className="text-white text-sm">Amount to Swap (SOL)</label>
                <Input
                  value={swapAmount}
                  onChange={(e) => setSwapAmount(e.target.value)}
                  placeholder="0.1"
                  className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <Button 
                  onClick={testSwapFeature}
                  disabled={loading || !walletValid}
                  className="w-full bg-yellow-400 text-black hover:bg-yellow-500"
                >
                  {loading ? 'Testing Swap...' : `Test Swap ${swapAmount} SOL → GOLDIUM`}
                </Button>
                
                <Button 
                  onClick={() => setShowManualGuide(true)}
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manual Swap Guide
                </Button>
              </div>
              
              <div className="text-sm text-gray-400">
                This will simulate a swap transaction and log the signature for Solscan tracking.
              </div>
            </TabsContent>
            
            <TabsContent value="send" className="space-y-4">
              <div className="space-y-2">
                <label className="text-white text-sm">Amount to Send (SOL)</label>
                <Input
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.01"
                  className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-white text-sm">Recipient Address</label>
                <Input
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                  placeholder="Enter recipient Solana address..."
                  className="bg-white/10 border-white/30 text-white placeholder-gray-400"
                />
              </div>
              
              <Button 
                onClick={testSendFeature}
                disabled={loading || !walletValid || !sendRecipient}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Testing Send...' : `Test Send ${sendAmount} SOL`}
              </Button>
              
              <div className="text-sm text-gray-400">
                This will simulate a send transaction and log the signature for Solscan tracking.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Manual Swap Guide Modal */}
      <ManualSwapGuide 
        isOpen={showManualGuide}
        onClose={() => setShowManualGuide(false)}
        solAmount={parseFloat(swapAmount)}
      />

    </div>
  );
}