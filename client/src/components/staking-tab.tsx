import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useTokenAccounts } from '@/hooks/use-token-accounts';
import { useWallet } from '@/components/multi-wallet-provider';
import { solanaService } from '@/lib/solana';
import { STAKING_APY, SOLSCAN_BASE_URL } from '@/lib/constants';
import { autoSaveTransaction } from '@/lib/historyUtils';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { useInstantBalance } from '@/hooks/use-instant-balance';
import { realStakingService } from '@/lib/real-staking-service';
import { solscanTracker } from '@/lib/solscan-tracker';

export function StakingTab() {
  const [selectedToken, setSelectedToken] = useState<'SOL' | 'GOLDIUM'>('GOLDIUM');
  const [stakeAmount, setStakeAmount] = useState('');
  const [unstakeAmount, setUnstakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);
  
  const { connected, wallet, publicKey } = useWallet();
  const { balances, refetch } = useTokenAccounts();
  const externalWallet = useExternalWallets();
  const instantBalance = useInstantBalance();
  const { toast } = useToast();

  // Get SOL staking info
  const solStakingInfo = externalWallet.connected && externalWallet.address ? realStakingService.getStakingInfo(externalWallet.address) : [];
  const totalSolStaked = externalWallet.connected && externalWallet.address ? realStakingService.getTotalStaked(externalWallet.address) : 0;
  const pendingSolRewards = externalWallet.connected && externalWallet.address ? realStakingService.calculateRewards(externalWallet.address) : 0;

  // Stake SOL tokens
  const handleStakeSOL = async () => {
    if (!externalWallet.connected || !stakeAmount) {
      toast({
        title: "Invalid Input",
        description: "Please connect wallet and enter an amount to stake",
        variant: "destructive"
      });
      return;
    }

    const amount = Math.floor(Number(stakeAmount) * 1000000) / 1000000;
    const availableBalance = instantBalance.balance;
    const feeBuffer = 0.001;
    
    if (amount <= 0 || (amount + feeBuffer) > availableBalance) {
      toast({
        title: "Invalid Amount", 
        description: availableBalance === 0 ? 
          "You need SOL to stake. Your wallet balance is 0." :
          `Please enter a valid amount (max: ${(availableBalance - feeBuffer).toFixed(6)} SOL)`,
        variant: "destructive"
      });
      return;
    }

    setIsStaking(true);
    
    try {
      console.log(`Executing SOL stake: ${amount} SOL from wallet ${externalWallet.address}`);
      
      const walletInstance = (window as any).phantom?.solana || (window as any).solflare || (window as any).trustwallet?.solana;
      if (!walletInstance) {
        throw new Error('Wallet not found');
      }

      if (!externalWallet.address) {
        throw new Error('Wallet address not found');
      }

      const result = await realStakingService.stakeSOL(amount, externalWallet.address, walletInstance);
      
      if (result.success && result.signature) {
        setLastTxId(result.signature);
        setStakeAmount('');
        
        solscanTracker.trackTransaction({
          signature: result.signature,
          type: 'stake',
          token: 'SOL',
          amount
        });
        
        toast({
          title: "SOL Staking Successful! 🔒",
          description: (
            <div className="space-y-2">
              <p>Your SOL has been staked successfully!</p>
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
        throw new Error(result.error || 'SOL staking failed');
      }
      
    } catch (error: any) {
      console.error('SOL staking failed:', error);
      toast({
        title: "SOL Staking Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  // Main stake handler
  const handleStake = async () => {
    if (selectedToken === 'SOL') {
      await handleStakeSOL();
    } else {
      await handleStakeGOLD();
    }
  };

  // Stake GOLD tokens
  const handleStakeGOLD = async () => {
    if (!connected || !wallet || !stakeAmount) {
      toast({
        title: "Connection Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    const amount = Number(stakeAmount);
    if (amount <= 0 || amount > balances.gold) {
      toast({
        title: "Invalid Amount",
        description: `Please enter a valid amount (max: ${balances.gold.toFixed(4)} GOLD)`,
        variant: "destructive"
      });
      return;
    }

    setIsStaking(true);
    
    try {
      console.log(`Executing real stake: ${amount} GOLD tokens`);
      
      const txId = await solanaService.executeStake(amount, wallet);
      
      setLastTxId(txId);

      // Auto-save stake transaction to history
      try {
        if (publicKey) {
          const walletAddress = publicKey.toString();

          // For stake: amountSOL = 0, amountGOLD = staked amount
          autoSaveTransaction(
            walletAddress,
            txId,
            'stake',
            0, // No SOL involved in staking
            amount, // GOLD amount staked
            'success'
          );
        }
      } catch (error) {
        console.error('Failed to auto-save stake transaction:', error);
      }

      setStakeAmount('');

      toast({
        title: "Staking Successful! 🔒",
        description: (
          <div className="space-y-2">
            <p>Your GOLD tokens have been staked!</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${txId}`, '_blank')}
              >
                View on Solscan <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ),
      });

      // Refresh balances after successful stake
      setTimeout(() => refetch(), 2000);
      
    } catch (error: any) {
      console.error('Staking failed:', error);
      toast({
        title: "Staking Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  const handleUnstake = async () => {
    if (!connected || !wallet || !unstakeAmount) {
      toast({
        title: "Connection Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    const amount = Number(unstakeAmount);
    if (amount <= 0 || amount > balances.stakedGold) {
      toast({
        title: "Invalid Amount", 
        description: `Please enter a valid amount (max: ${balances.stakedGold.toFixed(4)} GOLD)`,
        variant: "destructive"
      });
      return;
    }

    setIsStaking(true);
    
    try {
      console.log(`Executing real unstake: ${amount} GOLD tokens`);
      
      const txId = await solanaService.executeStake(-amount, wallet); // Negative for unstake
      
      setLastTxId(txId);

      // Auto-save unstake transaction to history
      try {
        if (publicKey) {
          const walletAddress = publicKey.toString();

          // For unstake: amountSOL = 0, amountGOLD = unstaked amount
          autoSaveTransaction(
            walletAddress,
            txId,
            'unstake',
            0, // No SOL involved in unstaking
            amount, // GOLD amount unstaked
            'success'
          );
        }
      } catch (error) {
        console.error('Failed to auto-save unstake transaction:', error);
      }

      setUnstakeAmount('');

      toast({
        title: "Unstaking Successful! 🔓",
        description: (
          <div className="space-y-2">
            <p>Your GOLD tokens have been unstaked!</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${txId}`, '_blank')}
              >
                View on Solscan <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ),
      });

      setTimeout(() => refetch(), 2000);
      
    } catch (error: any) {
      console.error('Unstaking failed:', error);
      toast({
        title: "Unstaking Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  // Claim SOL rewards
  const handleClaimSOLRewards = async () => {
    if (!externalWallet.connected || !externalWallet.address) {
      toast({
        title: "Connection Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    if (pendingSolRewards <= 0) {
      toast({
        title: "No Rewards",
        description: "You have no claimable SOL rewards",
        variant: "destructive"
      });
      return;
    }

    setIsStaking(true);
    
    try {
      console.log(`Claiming SOL rewards: ${pendingSolRewards} SOL`);
      
      const walletInstance = (window as any).phantom?.solana || (window as any).solflare || (window as any).trustwallet?.solana;
      if (!walletInstance) {
        throw new Error('Wallet not found');
      }

      const result = await realStakingService.claimRewards(externalWallet.address, walletInstance);
      
      if (result.success && result.signature) {
        setLastTxId(result.signature);
        
        solscanTracker.trackTransaction({
          signature: result.signature,
          type: 'claim',
          token: 'SOL',
          amount: pendingSolRewards
        });
        
        toast({
          title: "SOL Rewards Claimed! 💰",
          description: (
            <div className="space-y-2">
              <p>Your SOL rewards have been claimed!</p>
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
        throw new Error(result.error || 'SOL rewards claiming failed');
      }
      
    } catch (error: any) {
      console.error('SOL claiming failed:', error);
      toast({
        title: "SOL Claiming Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  // Main claim handler
  const handleClaimRewards = async () => {
    if (selectedToken === 'SOL') {
      await handleClaimSOLRewards();
    } else {
      await handleClaimGOLDRewards();
    }
  };

  // Claim GOLD rewards
  const handleClaimGOLDRewards = async () => {
    if (!connected || !wallet) {
      toast({
        title: "Connection Error",
        description: "Please connect your wallet first",
        variant: "destructive"
      });
      return;
    }

    if (balances.claimableRewards <= 0) {
      toast({
        title: "No Rewards",
        description: "You have no claimable rewards",
        variant: "destructive"
      });
      return;
    }

    setIsStaking(true);
    
    try {
      console.log(`Claiming rewards: ${balances.claimableRewards} GOLD`);
      
      const txId = await solanaService.executeStake(0, wallet); // Zero amount for claim
      
      setLastTxId(txId);
      
      toast({
        title: "Rewards Claimed! 💰",
        description: (
          <div className="space-y-2">
            <p>Your rewards have been claimed!</p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${txId}`, '_blank')}
              >
                View on Solscan <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        ),
      });
      
      setTimeout(() => refetch(), 2000);
      
    } catch (error: any) {
      console.error('Claiming failed:', error);
      toast({
        title: "Claiming Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-8">
      {/* Staking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-galaxy-card border-galaxy-purple/30 hover:border-white/20/50 transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-white">{STAKING_APY}%</p>
            <p className="text-sm text-galaxy-accent">Annual APY</p>
          </CardContent>
        </Card>
        <Card className="bg-galaxy-card border-galaxy-purple/30 hover:border-gold-primary/50 transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-gold-primary">
              {selectedToken === 'SOL' ? totalSolStaked.toFixed(6) : balances.stakedGold.toFixed(2)}
            </p>
            <p className="text-sm text-galaxy-accent">{selectedToken} Staked</p>
          </CardContent>
        </Card>
        <Card className="bg-galaxy-card border-galaxy-purple/30 hover:border-galaxy-blue/50 transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-galaxy-blue">
              {selectedToken === 'SOL' ? pendingSolRewards.toFixed(6) : balances.claimableRewards.toFixed(4)}
            </p>
            <p className="text-sm text-galaxy-accent">Claimable Rewards</p>
          </CardContent>
        </Card>
      </div>

      {/* Token Selector */}
      <Card className="bg-galaxy-card border-galaxy-purple/30 hover:border-white/20/50 transition-all duration-300">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold text-galaxy-bright mb-4">Select Token to Stake</h3>
          <div className="flex space-x-4">
            <Button
              variant={selectedToken === 'GOLDIUM' ? 'default' : 'outline'}
              onClick={() => setSelectedToken('GOLDIUM')}
              className={selectedToken === 'GOLDIUM' ? 'bg-galaxy-button text-white' : 'border-galaxy-purple/30 text-galaxy-bright hover:bg-white/10'}
            >
              <img src="/goldium-logo.png" alt="GOLD" className="w-5 h-5 mr-2" />
              GOLDIUM
            </Button>
            <Button
              variant={selectedToken === 'SOL' ? 'default' : 'outline'}
              onClick={() => setSelectedToken('SOL')}
              className={selectedToken === 'SOL' ? 'bg-galaxy-button text-white' : 'border-galaxy-purple/30 text-galaxy-bright hover:bg-white/10'}
            >
              <img src="/solana-logo-official.png" alt="SOL" className="w-5 h-5 mr-2" />
              SOL
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Staking Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stake */}
        <Card className="bg-galaxy-card border-galaxy-purple/30 hover:border-white/20/50 transition-all duration-300">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-galaxy-bright mb-4 flex items-center">
              <span className="mr-2 text-white">🔒</span>
              Stake {selectedToken}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-galaxy-bright mb-2 block">Amount to Stake</label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="bg-background border-galaxy-purple/30 focus:border-white/20 text-galaxy-bright"
                  step={selectedToken === 'SOL' ? '0.000001' : '0.0001'}
                />
                <p className="text-xs text-galaxy-accent mt-1">
                  Available: {selectedToken === 'SOL' ? 
                    `${instantBalance.balance.toFixed(6)} SOL` : 
                    `${balances.gold.toFixed(4)} GOLDIUM`
                  }
                </p>
              </div>
              <Button
                className="w-full bg-galaxy-button hover:bg-galaxy-button py-3 font-medium text-white"
                onClick={handleStake}
                disabled={
                  selectedToken === 'SOL' ? (
                    !externalWallet.connected ||
                    !stakeAmount ||
                    Number(stakeAmount) <= 0 ||
                    (Number(stakeAmount) + 0.001) > instantBalance.balance ||
                    isStaking
                  ) : (
                    !connected ||
                    !stakeAmount ||
                    Number(stakeAmount) <= 0 ||
                    Number(stakeAmount) > balances.gold ||
                    isStaking
                  )
                }
              >
                {isStaking ? 'Staking...' : `Stake ${selectedToken}`}
              </Button>
              
              {lastTxId && (
                <div className="mt-4 p-3 bg-black/20 border border-white/20/30 rounded-lg">
            <p className="text-sm text-white mb-2">Last staking transaction:</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${lastTxId}`, '_blank')}
                    className="border-white/20/30 text-white hover:bg-black/10"
                  >
                    View on Solscan <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Unstake */}
        <Card className="bg-galaxy-card border-galaxy-purple/30 hover:border-white/20/50 transition-all duration-300">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-galaxy-bright mb-4 flex items-center">
              <span className="mr-2 text-white">🔓</span>
              Unstake GOLD
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-galaxy-bright mb-2 block">Amount to Unstake</label>
                <Input
                  type="number"
                  placeholder="0.0"
                  value={unstakeAmount}
                  onChange={(e) => setUnstakeAmount(e.target.value)}
                  className="bg-background border-galaxy-purple/30 focus:border-white/20 text-galaxy-bright"
                />
                <p className="text-xs text-galaxy-accent mt-1">
                  Staked: {balances.stakedGold.toFixed(4)} GOLD
                </p>
              </div>
              <Button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 py-3 font-medium text-white"
                onClick={handleUnstake}
                disabled={
                  !connected ||
                  !unstakeAmount ||
                  Number(unstakeAmount) <= 0 ||
                  Number(unstakeAmount) > balances.stakedGold ||
                  isStaking
                }
              >
                {isStaking ? 'Unstaking...' : 'Unstake GOLD'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Claim Rewards */}
      <Card className="bg-galaxy-card border-gold-primary/50 hover:border-gold-primary transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-galaxy-bright">Claimable Rewards ({selectedToken})</h3>
              <p className="text-2xl font-bold text-gold-primary mt-1">
                {selectedToken === 'SOL' ? 
                  `${pendingSolRewards.toFixed(6)} SOL` : 
                  `${balances.claimableRewards.toFixed(4)} GOLD`
                }
              </p>
              <p className="text-sm text-galaxy-accent">
                ≈ ${selectedToken === 'SOL' ? 
                  (pendingSolRewards * 100).toFixed(2) : 
                  (balances.claimableRewards * 20).toFixed(2)
                } USD
              </p>
            </div>
            <Button
              className="bg-gold-gradient hover:from-gold-secondary hover:to-gray-900 px-6 py-3 font-semibold text-black transition-all duration-200"
              onClick={handleClaimRewards}
              disabled={
                selectedToken === 'SOL' ? 
                  (!externalWallet.connected || pendingSolRewards <= 0 || isStaking) :
                  (!connected || balances.claimableRewards <= 0 || isStaking)
              }
            >
              {isStaking ? 'Claiming...' : 'Claim Rewards'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
