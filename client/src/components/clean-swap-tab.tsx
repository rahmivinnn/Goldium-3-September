import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUpDown, ExternalLink } from 'lucide-react';
import { solscanTracker } from '@/lib/solscan-tracker';
import { useSolanaWallet } from './solana-wallet-provider';
import { useSelfContainedBalances } from '@/hooks/use-self-contained-balances';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { useInstantBalance } from '@/hooks/use-instant-balance';
import { useToast } from '@/hooks/use-toast';
import { TransactionSuccessModal } from './transaction-success-modal';
import { TransactionAnimation } from './transaction-animations';
import { SOL_TO_GOLD_RATE, GOLD_TO_SOL_RATE, SOLSCAN_BASE_URL, GOLDIUM_TOKEN_ADDRESS } from '@/lib/constants';
import { autoSaveTransaction } from '@/lib/historyUtils';
import { useSoundSystem } from '@/lib/sound-system';
import { swapService } from '@/lib/swap-service';
import logoImage from '@assets/k1xiYLna_400x400-removebg-preview_1754275575442.png';

export function CleanSwapTab() {
  const walletContext = useSolanaWallet();
  const { connected, swapService, refreshTransactionHistory } = walletContext;
  const { balances, refetch } = useSelfContainedBalances();
  const externalWallet = useExternalWallets();
  const instantBalance = useInstantBalance();
  const { toast } = useToast();
  const { playSuccess } = useSoundSystem();
  
  const [fromToken, setFromToken] = useState<'SOL' | 'GOLD'>('SOL');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  const exchangeRate = fromToken === 'SOL' ? SOL_TO_GOLD_RATE : GOLD_TO_SOL_RATE;
  const slippage = 0.1;

  const getTokenBalance = (token: 'SOL' | 'GOLD') => {
    if (externalWallet.connected) {
      return token === 'SOL' ? externalWallet.balance : balances.gold;
    }
    return token === 'SOL' ? balances.sol : balances.gold;
  };

  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    if (value && Number(value) > 0) {
      const calculatedTo = Number(value) * exchangeRate;
      setToAmount(calculatedTo.toFixed(fromToken === 'SOL' ? 2 : 6));
    } else {
      setToAmount('');
    }
  };

  const handleSwapDirection = () => {
    const newFromToken = fromToken === 'SOL' ? 'GOLD' : 'SOL';
    setFromToken(newFromToken);
    setFromAmount('');
    setToAmount('');
  };

  const handleSwap = async () => {
    if (!externalWallet.connected || !fromAmount || Number(fromAmount) <= 0) return;

    setIsSwapping(true);
    setShowAnimation(true);
    
    try {
      console.log('🔄 EXECUTING REAL SWAP with GOLDIUM CA');
      
      // Refresh external wallet balance before swap to ensure accuracy
      console.log('🔄 Refreshing wallet balance before swap...');
      await externalWallet.refreshRealBalance();
      console.log(`✅ Updated balance: ${externalWallet.balance} SOL`);
      
      // Set external wallet for swap service
      swapService.setExternalWallet(externalWallet);
      
      let result;
      if (fromToken === 'SOL') {
        // SOL to GOLD swap
        result = await swapService.swapSolToGold(Number(fromAmount));
      } else {
        // GOLD to SOL swap
        result = await swapService.swapGoldToSol(Number(fromAmount));
      }
      
      if (!result.success) {
        throw new Error(result.error || 'Swap failed');
      }
      
      const txSignature = result.signature!;
      
      // Auto-save transaction
      autoSaveTransaction(
        externalWallet.address || '',
        txSignature,
        'swap',
        fromToken === 'SOL' ? Number(fromAmount) : Number(toAmount),
        fromToken === 'GOLD' ? Number(fromAmount) : Number(toAmount),
        'success'
      );

      setLastTxId(txSignature);
      
      // Wait for animation to complete
      setTimeout(() => {
        setShowAnimation(false);
        setShowSuccessModal(true);
        playSuccess();
        
        // Reset form
        setFromAmount('');
        setToAmount('');
        
        // Refresh balances
        refetch();
        refreshTransactionHistory?.();
        
        toast({
          title: "Swap Successful! 🎉",
          description: (
            <div className="space-y-2">
              <p>Swapped {fromAmount} {fromToken} successfully!</p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${txSignature}`, '_blank')}
                >
                  View on Solscan <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ),
        });
      }, 3500);
      
    } catch (error: any) {
      console.error('Swap failed:', error);
      setShowAnimation(false);
      toast({
        title: "Swap Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsSwapping(false), 3500);
    }
  };

  const fromBalance = getTokenBalance(fromToken);
  const toBalance = getTokenBalance(fromToken === 'SOL' ? 'GOLD' : 'SOL');
  const isValidAmount = fromAmount && Number(fromAmount) > 0 && Number(fromAmount) <= fromBalance;

  return (
    <div className="max-w-xl mx-auto">
      
      {/* MAIN SWAP INTERFACE */}
      <Card className="glass-card glass-hover neumorphic gold-hover">
        <CardContent className="p-8">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="font-card-title text-white mb-2">Token Swap</h2>
            <p className="font-small text-white/70">Exchange tokens with real GOLDIUM CA</p>
          </div>

          {/* FROM SECTION */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <label className="font-body text-white font-medium">From</label>
              <div className="flex items-center gap-2">
                <span className="font-small text-white/70">Balance:</span>
                <span className="font-small text-white font-mono">
                  {fromBalance.toFixed(fromToken === 'SOL' ? 4 : 2)} {fromToken}
                </span>
              </div>
            </div>
            
            <div className="bg-black/50 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black border-white/20 hover:border-white/40 text-white px-3 py-2 rounded-lg"
                  onClick={handleSwapDirection}
                >
                  {fromToken === 'SOL' ? (
                    <span className="text-white mr-2">◎</span>
                  ) : (
                    <img src={logoImage} alt="GOLD" className="w-4 h-4 mr-2" />
                  )}
                  {fromToken}
                  <ArrowUpDown className="ml-2 h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white text-xs"
                  onClick={() => setFromAmount(fromBalance.toString())}
                >
                  MAX
                </Button>
              </div>
              <Input
                type="number"
                placeholder="0.0"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                className="bg-black border-white/20 text-white text-xl font-bold p-3 h-auto placeholder:text-white/50 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* SWAP ARROW */}
          <div className="flex justify-center my-6">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full bg-black border-white/20 hover:border-white/40 p-3"
              onClick={handleSwapDirection}
            >
              <ArrowUpDown className="h-4 w-4 text-white" />
            </Button>
          </div>

          {/* TO SECTION */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <label className="font-body text-white font-medium">To</label>
              <div className="flex items-center gap-2">
                <span className="font-small text-white/70">Balance:</span>
                <span className="font-small text-white font-mono">
                  {toBalance.toFixed(fromToken === 'SOL' ? 2 : 4)} {fromToken === 'SOL' ? 'GOLD' : 'SOL'}
                </span>
              </div>
            </div>
            
            <div className="bg-black/50 border border-white/10 rounded-xl p-4">
              <div className="flex items-center mb-3">
                <div className="flex items-center gap-2 text-white/70">
                  {fromToken === 'SOL' ? (
                    <img src={logoImage} alt="GOLD" className="w-4 h-4" />
                  ) : (
                    <span className="text-white">◎</span>
                  )}
                  <span className="font-body">{fromToken === 'SOL' ? 'GOLD' : 'SOL'}</span>
                </div>
              </div>
              <Input
                type="number"
                placeholder="0.0"
                value={toAmount}
                readOnly
                className="bg-black/70 border-white/20 text-white text-xl font-bold p-3 h-auto placeholder:text-white/50 rounded-lg font-mono"
              />
            </div>
          </div>

          {/* SWAP BUTTON */}
          <Button
            onClick={handleSwap}
            disabled={!isValidAmount || isSwapping || !externalWallet.connected}
            className="sophisticated-button w-full py-4 mt-6"
          >
            {isSwapping ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-body">Swapping...</span>
              </div>
            ) : !externalWallet.connected ? (
              <span className="font-body font-semibold">Connect Wallet to Swap</span>
            ) : !isValidAmount ? (
              <span className="font-body font-semibold">Enter Valid Amount</span>
            ) : (
              <span className="font-body font-semibold">
                Swap {fromAmount} {fromToken} → {toAmount} {fromToken === 'SOL' ? 'GOLD' : 'SOL'}
              </span>
            )}
          </Button>
          
        </CardContent>
      </Card>

      {/* SWAP DETAILS */}
      <Card className="glass-card glass-hover mt-6">
        <CardContent className="p-6">
          <h3 className="font-card-title text-white mb-4">Transaction Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Exchange Rate</span>
              <span className="font-small text-white font-mono">
                1 {fromToken} = {fromToken === 'SOL' ? SOL_TO_GOLD_RATE.toLocaleString() : GOLD_TO_SOL_RATE.toFixed(6)} {fromToken === 'SOL' ? 'GOLD' : 'SOL'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Network Fee</span>
              <span className="font-small text-white">~0.000005 SOL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Slippage</span>
              <span className="font-small text-white">0.1%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Contract Address</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`${SOLSCAN_BASE_URL}/token/${GOLDIUM_TOKEN_ADDRESS}`, '_blank')}
                className="font-small text-white font-mono hover:text-galaxy-accent p-1 h-auto"
              >
                APkB...pump <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TRANSACTION ANIMATION */}
      <TransactionAnimation
        type="swap"
        isActive={showAnimation}
        onComplete={() => setShowAnimation(false)}
        fromToken={fromToken}
        toToken={fromToken === 'SOL' ? 'GOLD' : 'SOL'}
        amount={Number(fromAmount)}
      />

      {/* SUCCESS MODAL */}
      <TransactionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        txSignature={lastTxId || ''}
        amount={Number(fromAmount)}
        tokenFrom={fromToken}
        tokenTo={fromToken === 'SOL' ? 'GOLD' : 'SOL'}
        transactionType="swap"
      />
    </div>
  );
}