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
import { realGoldStakingService } from '@/lib/real-gold-staking-service';
import { SOLSCAN_BASE_URL } from '@/lib/constants';
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
  const [isClaiming, setIsClaiming] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  
  // Get real staking data
  const stakingInfo = externalWallet.connected && externalWallet.address ? realGoldStakingService.getStakingInfo(externalWallet.address) : [];
  const totalStaked = externalWallet.connected && externalWallet.address ? realGoldStakingService.getTotalStaked(externalWallet.address) : 0;
  const pendingRewards = externalWallet.connected && externalWallet.address ? realGoldStakingService.calculateRewards(externalWallet.address) : 0;
  
  const stakingData = {
    stakedAmount: totalStaked,
    pendingRewards: pendingRewards,
    stakingDuration: stakingInfo.length > 0 ? `${Math.floor((Date.now() - stakingInfo[0].timestamp) / (1000 * 60 * 60 * 24))} days` : '0 days',
    nextReward: '1 hour'
  };

  const handleStake = async () => {
    if (!externalWallet.connected || !stakeAmount || Number(stakeAmount) < MIN_STAKE_AMOUNT) return;

    setIsStaking(true);
    try {
      console.log('🔄 EXECUTING REAL GOLD STAKING');
      
      // Set external wallet for the staking service
      realGoldStakingService.setExternalWallet(externalWallet.wallet);
      
      // Execute real GOLD staking
      const result = await realGoldStakingService.stakeGold(Number(stakeAmount), externalWallet.address!);
      
      if (result.success && result.signature) {
        setLastTxId(result.signature);
        setShowSuccessModal(true);
        setStakeAmount('');
        refetch();
        refreshTransactionHistory?.();
        
        toast({
          title: "Staking Successful! 🔒",
          description: (
            <div className="space-y-2">
              <p>Staked {stakeAmount} GOLD successfully!</p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${result.signature}`, '_blank')}
                >
                  View on Solscan <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ),
        });
      } else {
        throw new Error(result.error || 'Staking failed');
      }
      
    } catch (error: any) {
      console.error('Staking failed:', error);
      toast({
        title: "Staking Failed",
        description: error.message || "Transaction failed. Please try again.",
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
      console.log('🔄 EXECUTING REAL GOLD UNSTAKING');
      
      // Set external wallet for the staking service
      realGoldStakingService.setExternalWallet(externalWallet.wallet);
      
      // Execute real GOLD unstaking
      const result = await realGoldStakingService.unstakeGold(Number(unstakeAmount), externalWallet.address!);
      
      if (result.success && result.signature) {
        setLastTxId(result.signature);
        setShowSuccessModal(true);
        setUnstakeAmount('');
        refetch();
        refreshTransactionHistory?.();
        
        toast({
          title: "Unstaking Successful! 🔓",
          description: (
            <div className="space-y-2">
              <p>Unstaked {unstakeAmount} GOLD successfully!</p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${result.signature}`, '_blank')}
                >
                  View on Solscan <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ),
        });
      } else {
        throw new Error(result.error || 'Unstaking failed');
      }
      
    } catch (error: any) {
      console.error('Unstaking failed:', error);
      toast({
        title: "Unstaking Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUnstaking(false);
    }
  };

  const handleClaimRewards = async () => {
    if (!externalWallet.connected || pendingRewards <= 0) {
      toast({
        title: "No Rewards",
        description: "No claimable rewards available",
        variant: "destructive",
      });
      return;
    }

    setIsClaiming(true);
    try {
      console.log('🔄 CLAIMING GOLD REWARDS');
      
      // Set external wallet for the staking service
      realGoldStakingService.setExternalWallet(externalWallet.wallet);
      
      // Execute real rewards claim
      const result = await realGoldStakingService.claimRewards(externalWallet.address!);
      
      if (result.success && result.signature) {
        setLastTxId(result.signature);
        setShowSuccessModal(true);
        refetch();
        refreshTransactionHistory?.();
        
        toast({
          title: "Rewards Claimed! 💰",
          description: (
            <div className="space-y-2">
              <p>Claimed {pendingRewards.toFixed(4)} GOLD rewards!</p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${result.signature}`, '_blank')}
                >
                  View on Solscan <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ),
        });
      } else {
        throw new Error(result.error || 'Claim failed');
      }
      
    } catch (error: any) {
      console.error('Claiming failed:', error);
      toast({
        title: "Claiming Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
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
              onClick={handleClaimRewards}
              className="sophisticated-button w-full py-3 mt-4"
              disabled={!externalWallet.connected || stakingData.pendingRewards <= 0 || isClaiming}
            >
              {isClaiming ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="font-body">Claiming...</span>
                </div>
              ) : (
                <span className="font-body font-semibold">Claim Rewards</span>
              )}
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
        tokenFrom="GOLD"
        transactionType={isStaking ? "stake" : "unstake"}
      />
    </div>
  );
}