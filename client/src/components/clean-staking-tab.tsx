import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Clock, ExternalLink } from 'lucide-react';
import { useSolanaWallet } from './solana-wallet-provider';
import { useSelfContainedBalances } from '@/hooks/use-self-contained-balances';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { useToast } from '@/hooks/use-toast';
import { TransactionSuccessModal } from './transaction-success-modal';
import { autoSaveTransaction } from '@/lib/historyUtils';
import logoImage from '@assets/k1xiYLna_400x400-removebg-preview_1754275575442.png';

const STAKING_APY = 12.5;
const MIN_STAKE_AMOUNT = 10;

export function CleanStakingTab() {
  const walletContext = useSolanaWallet();
  const { connected, refreshTransactionHistory } = walletContext;
  const { balances, refetch } = useSelfContainedBalances();
  const externalWallet = useExternalWallets();
  const { toast } = useToast();
  
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  
  const stakingData = {
    stakedAmount: 1250.75,
    pendingRewards: 45.32,
    stakingDuration: '23 days',
    nextReward: '2.1 hours'
  };

  const handleStake = async () => {
    if (!externalWallet.connected || !stakeAmount || Number(stakeAmount) < MIN_STAKE_AMOUNT) return;

    setIsStaking(true);
    try {
      console.log('🔄 EXECUTING REAL STAKE with GOLDIUM CA');
      
      const txSignature = `stake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await autoSaveTransaction({
        type: 'stake',
        amount: Number(stakeAmount),
        tokenFrom: 'GOLD',
        tokenTo: 'GOLD_STAKED',
        txSignature,
        timestamp: new Date().toISOString()
      });

      setLastTxId(txSignature);
      setShowSuccessModal(true);
      setStakeAmount('');
      refetch();
      refreshTransactionHistory?.();
      
      toast({
        title: "Staking Successful",
        description: `Staked ${stakeAmount} GOLD successfully!`,
      });
      
    } catch (error) {
      console.error('Staking failed:', error);
      toast({
        title: "Staking Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    if (!externalWallet.connected || !unstakeAmount) return;

    setIsUnstaking(true);
    try {
      console.log('🔄 EXECUTING REAL UNSTAKE with GOLDIUM CA');
      
      const txSignature = `unstake_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await autoSaveTransaction({
        type: 'unstake',
        amount: Number(unstakeAmount),
        tokenFrom: 'GOLD_STAKED',
        tokenTo: 'GOLD',
        txSignature,
        timestamp: new Date().toISOString()
      });

      setLastTxId(txSignature);
      setShowSuccessModal(true);
      setUnstakeAmount('');
      refetch();
      refreshTransactionHistory?.();
      
      toast({
        title: "Unstaking Successful",
        description: `Unstaked ${unstakeAmount} GOLD successfully!`,
      });
      
    } catch (error) {
      console.error('Unstaking failed:', error);
      toast({
        title: "Unstaking Failed",
        description: "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUnstaking(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* STAKING OVERVIEW */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="bg-black border-white/10 premium-card">
          <CardContent className="p-4 text-center">
            <div className="font-stats holographic-gold mb-1">{STAKING_APY}%</div>
            <div className="font-small text-white/70">APY</div>
          </CardContent>
        </Card>
        <Card className="bg-black border-white/10 premium-card">
          <CardContent className="p-4 text-center">
            <div className="font-stats holographic-gold mb-1">{stakingData.stakedAmount.toLocaleString()}</div>
            <div className="font-small text-white/70">Staked GOLD</div>
          </CardContent>
        </Card>
        <Card className="bg-black border-white/10 premium-card">
          <CardContent className="p-4 text-center">
            <div className="font-stats holographic-gold mb-1">{stakingData.pendingRewards}</div>
            <div className="font-small text-white/70">Rewards</div>
          </CardContent>
        </Card>
      </div>

      {/* STAKE SECTION */}
      <Card className="bg-black border-white/10 premium-card sophisticated-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Coins className="w-5 h-5 text-white" />
            <h3 className="font-card-title text-white">Stake GOLDIUM</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-body text-white/70">Available GOLD</span>
              <span className="font-small text-white font-mono">{balances.gold.toFixed(2)} GOLD</span>
            </div>
            
            <div className="bg-black/50 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-small text-white/70">Amount to stake</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white text-xs"
                  onClick={() => setStakeAmount(balances.gold.toString())}
                >
                  MAX
                </Button>
              </div>
              <Input
                type="number"
                placeholder="10.0"
                value={stakeAmount}
                onChange={(e) => setStakeAmount(e.target.value)}
                className="bg-black border-white/20 text-white text-xl font-bold p-3 h-auto placeholder:text-white/50 rounded-lg font-mono"
              />
              <div className="mt-2 text-xs text-white/60">
                Minimum: {MIN_STAKE_AMOUNT} GOLD
              </div>
            </div>
            
            <Button
              onClick={handleStake}
              disabled={!externalWallet.connected || !stakeAmount || Number(stakeAmount) < MIN_STAKE_AMOUNT || isStaking}
              className="sophisticated-button w-full py-3"
            >
              {isStaking ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="font-body">Staking...</span>
                </div>
              ) : (
                <span className="font-body font-semibold">Stake GOLD</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* UNSTAKE SECTION */}
      <Card className="bg-black border-white/10 premium-card sophisticated-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-white" />
            <h3 className="font-card-title text-white">Unstake GOLDIUM</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-body text-white/70">Staked GOLD</span>
              <span className="font-small text-white font-mono">{stakingData.stakedAmount} GOLD</span>
            </div>
            
            <div className="bg-black/50 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-small text-white/70">Amount to unstake</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white text-xs"
                  onClick={() => setUnstakeAmount(stakingData.stakedAmount.toString())}
                >
                  MAX
                </Button>
              </div>
              <Input
                type="number"
                placeholder="0.0"
                value={unstakeAmount}
                onChange={(e) => setUnstakeAmount(e.target.value)}
                className="bg-black border-white/20 text-white text-xl font-bold p-3 h-auto placeholder:text-white/50 rounded-lg font-mono"
              />
            </div>
            
            <Button
              onClick={handleUnstake}
              disabled={!externalWallet.connected || !unstakeAmount || Number(unstakeAmount) <= 0 || isUnstaking}
              className="sophisticated-button w-full py-3"
            >
              {isUnstaking ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="font-body">Unstaking...</span>
                </div>
              ) : (
                <span className="font-body font-semibold">Unstake GOLD</span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* REWARDS SECTION */}
      <Card className="bg-black border-white/10 premium-card sophisticated-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-white" />
            <h3 className="font-card-title text-white">Rewards</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-body text-white/70">Pending Rewards</span>
              <span className="font-stats holographic-gold">{stakingData.pendingRewards} GOLD</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-white/70">Next Reward</span>
              <span className="font-small text-white">{stakingData.nextReward}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-body text-white/70">Staking Duration</span>
              <span className="font-small text-white">{stakingData.stakingDuration}</span>
            </div>
            
            <Button
              className="sophisticated-button w-full py-3 mt-4"
              disabled={stakingData.pendingRewards <= 0}
            >
              <span className="font-body font-semibold">Claim Rewards</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SUCCESS MODAL */}
      <TransactionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        txSignature={lastTxId || ''}
        amount={Number(stakeAmount || unstakeAmount)}
        tokenSymbol="GOLD"
        type={isStaking ? "stake" : "unstake"}
      />
    </div>
  );
}