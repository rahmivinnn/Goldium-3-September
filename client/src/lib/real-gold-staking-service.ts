import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import {
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID
} from '@solana/spl-token';
import { solscanTracker } from './solscan-tracker';
import { transactionHistory } from './transaction-history';
import { TREASURY_WALLET, GOLDIUM_TOKEN_ADDRESS, STAKING_APY, SOLANA_RPC_URL } from './constants';
import { trackToGoldiumCA } from './ca-tracking-service';

export interface StakingResult {
  success: boolean;
  signature?: string;
  error?: string;
}

export interface StakeInfo {
  amount: number;
  timestamp: number;
  apy: number;
  rewards: number;
  txHash: string;
}

class RealGoldStakingService {
  private connection: Connection;
  private stakes: Map<string, StakeInfo[]> = new Map();
  private externalWallet: any = null;

  constructor() {
    this.connection = new Connection(SOLANA_RPC_URL);
  }

  // Set external wallet for transactions
  setExternalWallet(wallet: any) {
    this.externalWallet = wallet;
  }

  // REAL GOLD staking using SPL token transfers
  async stakeGold(goldAmount: number, walletAddress: string): Promise<StakingResult> {
    try {
      console.log(`🔄 REAL GOLD STAKING: ${goldAmount} GOLD tokens`);
      
      if (!this.externalWallet) {
        throw new Error('External wallet not connected');
      }

      const userPubkey = new PublicKey(walletAddress);
      const treasuryPubkey = new PublicKey(TREASURY_WALLET);
      const goldMintPubkey = new PublicKey(GOLDIUM_TOKEN_ADDRESS);
      
      // Get user's GOLD token account
      const userGoldTokenAccount = await getAssociatedTokenAddress(
        goldMintPubkey,
        userPubkey
      );
      
      // Get treasury's GOLD token account
      const treasuryGoldTokenAccount = await getAssociatedTokenAddress(
        goldMintPubkey,
        treasuryPubkey
      );

      const transaction = new Transaction();
      
      // Check if treasury token account exists, create if not
      try {
        await this.connection.getAccountInfo(treasuryGoldTokenAccount);
      } catch {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            userPubkey,
            treasuryGoldTokenAccount,
            treasuryPubkey,
            goldMintPubkey,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
          )
        );
      }

      // Convert GOLD amount to token units (assuming 6 decimals)
      const goldTokenAmount = Math.floor(goldAmount * 1_000_000);
      
      // Transfer GOLD tokens from user to treasury for staking
      transaction.add(
        createTransferInstruction(
          userGoldTokenAccount,
          treasuryGoldTokenAccount,
          userPubkey,
          goldTokenAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = userPubkey;
      
      console.log('📝 Requesting wallet signature for GOLD staking transaction...');
      
      // Sign and send transaction via external wallet
      const signedTransaction = await this.externalWallet.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log(`🚀 GOLD staking transaction sent: ${signature}`);
      
      // Wait for confirmation
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      // Record stake info
      const stakeInfo: StakeInfo = {
        amount: goldAmount,
        timestamp: Date.now(),
        apy: STAKING_APY,
        rewards: 0,
        txHash: signature
      };
      
      if (!this.stakes.has(walletAddress)) {
        this.stakes.set(walletAddress, []);
      }
      this.stakes.get(walletAddress)!.push(stakeInfo);
      
      // Track transaction for Solscan
      solscanTracker.trackTransaction({
        signature,
        type: 'stake',
        token: 'GOLD',
        amount: goldAmount
      });
      
      // Add to transaction history
      transactionHistory.addTransaction({
        id: signature,
        type: 'stake',
        amount: goldAmount,
        token: 'GOLD',
        timestamp: Date.now(),
        status: 'completed',
        hash: signature
      });
      
      // Track to Goldium CA
      await trackToGoldiumCA(
        walletAddress,
        signature,
        'stake',
        'GOLD',
        'STAKED_GOLD',
        goldAmount,
        goldAmount
      );
      
      console.log(`✅ REAL GOLD staking successful: ${signature}`);
      console.log('🔗 GOLD Staking Transaction on Solscan:', solscanTracker.getSolscanUrl(signature));
      console.log('🔗 GOLDIUM Contract on Solscan:', `https://solscan.io/token/${GOLDIUM_TOKEN_ADDRESS}`);
      
      return { success: true, signature };
      
    } catch (error: any) {
      console.error('❌ REAL GOLD staking failed:', error);
      
      // Handle specific wallet errors
      if (error.message?.includes('User rejected')) {
        return { success: false, error: 'Transaction was cancelled by user' };
      } else if (error.message?.includes('insufficient funds')) {
        return { success: false, error: 'Insufficient GOLD balance for staking' };
      } else {
        return { success: false, error: error.message || 'Staking failed' };
      }
    }
  }

  // REAL GOLD unstaking with SPL token transfers
  async unstakeGold(goldAmount: number, walletAddress: string): Promise<StakingResult> {
    try {
      console.log(`🔄 REAL GOLD UNSTAKING: ${goldAmount} GOLD tokens`);
      
      if (!this.externalWallet) {
        throw new Error('External wallet not connected');
      }

      const userStakes = this.stakes.get(walletAddress) || [];
      const totalStaked = userStakes.reduce((sum, stake) => sum + stake.amount, 0);
      
      if (goldAmount > totalStaked) {
        return { success: false, error: 'Insufficient staked GOLD amount' };
      }

      const userPubkey = new PublicKey(walletAddress);
      const treasuryPubkey = new PublicKey(TREASURY_WALLET);
      const goldMintPubkey = new PublicKey(GOLDIUM_TOKEN_ADDRESS);
      
      // Get user's GOLD token account
      const userGoldTokenAccount = await getAssociatedTokenAddress(
        goldMintPubkey,
        userPubkey
      );
      
      // Get treasury's GOLD token account
      const treasuryGoldTokenAccount = await getAssociatedTokenAddress(
        goldMintPubkey,
        treasuryPubkey
      );

      const transaction = new Transaction();
      
      // Convert GOLD amount to token units (assuming 6 decimals)
      const goldTokenAmount = Math.floor(goldAmount * 1_000_000);
      
      // Transfer GOLD tokens from treasury back to user
      transaction.add(
        createTransferInstruction(
          treasuryGoldTokenAccount,
          userGoldTokenAccount,
          treasuryPubkey,
          goldTokenAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = userPubkey;
      
      console.log('📝 Requesting wallet signature for GOLD unstaking transaction...');
      
      // Sign and send transaction via external wallet
      const signedTransaction = await this.externalWallet.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log(`🚀 GOLD unstaking transaction sent: ${signature}`);
      
      // Wait for confirmation
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      // Update stakes (remove unstaked amount)
      let remainingAmount = goldAmount;
      const remainingStakes = userStakes.filter(stake => {
        if (remainingAmount > 0 && stake.amount <= remainingAmount) {
          remainingAmount -= stake.amount;
          return false;
        }
        return true;
      });
      
      this.stakes.set(walletAddress, remainingStakes);
      
      // Track transaction for Solscan
      solscanTracker.trackTransaction({
        signature,
        type: 'unstake',
        token: 'GOLD',
        amount: goldAmount
      });
      
      // Add to transaction history
      transactionHistory.addTransaction({
        id: signature,
        type: 'unstake',
        amount: goldAmount,
        token: 'GOLD',
        timestamp: Date.now(),
        status: 'completed',
        hash: signature
      });
      
      // Track to Goldium CA
      await trackToGoldiumCA(
        walletAddress,
        signature,
        'unstake',
        'STAKED_GOLD',
        'GOLD',
        goldAmount,
        goldAmount
      );
      
      console.log(`✅ REAL GOLD unstaking successful: ${signature}`);
      console.log('🔗 GOLD Unstaking Transaction on Solscan:', solscanTracker.getSolscanUrl(signature));
      console.log('🔗 GOLDIUM Contract on Solscan:', `https://solscan.io/token/${GOLDIUM_TOKEN_ADDRESS}`);
      
      return { success: true, signature };
      
    } catch (error: any) {
      console.error('❌ REAL GOLD unstaking failed:', error);
      
      if (error.message?.includes('User rejected')) {
        return { success: false, error: 'Transaction was cancelled by user' };
      } else if (error.message?.includes('insufficient funds')) {
        return { success: false, error: 'Insufficient SOL balance for transaction fees' };
      } else {
        return { success: false, error: error.message || 'Unstaking failed' };
      }
    }
  }

  // Claim staking rewards (simplified - in reality would mint new GOLD tokens)
  async claimRewards(walletAddress: string): Promise<StakingResult> {
    try {
      const rewards = this.calculateRewards(walletAddress);
      
      if (rewards <= 0) {
        return { success: false, error: 'No rewards to claim' };
      }
      
      console.log(`🔄 CLAIMING REWARDS: ${rewards} GOLD tokens`);
      
      if (!this.externalWallet) {
        throw new Error('External wallet not connected');
      }

      const userPubkey = new PublicKey(walletAddress);
      const treasuryPubkey = new PublicKey(TREASURY_WALLET);
      const goldMintPubkey = new PublicKey(GOLDIUM_TOKEN_ADDRESS);
      
      // Get user's GOLD token account
      const userGoldTokenAccount = await getAssociatedTokenAddress(
        goldMintPubkey,
        userPubkey
      );
      
      // Get treasury's GOLD token account
      const treasuryGoldTokenAccount = await getAssociatedTokenAddress(
        goldMintPubkey,
        treasuryPubkey
      );

      const transaction = new Transaction();
      
      // Convert rewards to token units (assuming 6 decimals)
      const rewardTokenAmount = Math.floor(rewards * 1_000_000);
      
      // Transfer reward GOLD tokens from treasury to user
      transaction.add(
        createTransferInstruction(
          treasuryGoldTokenAccount,
          userGoldTokenAccount,
          treasuryPubkey,
          rewardTokenAmount,
          [],
          TOKEN_PROGRAM_ID
        )
      );

      // Get recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = userPubkey;
      
      console.log('📝 Requesting wallet signature for rewards claim transaction...');
      
      // Sign and send transaction via external wallet
      const signedTransaction = await this.externalWallet.signTransaction(transaction);
      const signature = await this.connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log(`🚀 Rewards claim transaction sent: ${signature}`);
      
      // Wait for confirmation
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      // Reset rewards for all stakes
      const userStakes = this.stakes.get(walletAddress) || [];
      userStakes.forEach(stake => {
        stake.timestamp = Date.now(); // Reset timestamp for new reward calculation
        stake.rewards = 0;
      });
      
      // Track transaction for Solscan
      solscanTracker.trackTransaction({
        signature,
        type: 'claim',
        token: 'GOLD',
        amount: rewards
      });
      
      // Add to transaction history
      transactionHistory.addTransaction({
        id: signature,
        type: 'claim',
        amount: rewards,
        token: 'GOLD',
        timestamp: Date.now(),
        status: 'completed',
        hash: signature
      });
      
      // Track to Goldium CA
      await trackToGoldiumCA(
        walletAddress,
        signature,
        'claim',
        'REWARDS',
        'GOLD',
        rewards,
        rewards
      );
      
      console.log(`✅ Rewards claim successful: ${signature}`);
      console.log('🔗 Rewards Claim Transaction on Solscan:', solscanTracker.getSolscanUrl(signature));
      console.log('🔗 GOLDIUM Contract on Solscan:', `https://solscan.io/token/${GOLDIUM_TOKEN_ADDRESS}`);
      
      return { success: true, signature };
      
    } catch (error: any) {
      console.error('❌ Rewards claim failed:', error);
      
      if (error.message?.includes('User rejected')) {
        return { success: false, error: 'Transaction was cancelled by user' };
      } else {
        return { success: false, error: error.message || 'Claim failed' };
      }
    }
  }

  // Get user's staking info
  getStakingInfo(walletAddress: string): StakeInfo[] {
    return this.stakes.get(walletAddress) || [];
  }

  // Calculate rewards based on time staked and APY
  calculateRewards(walletAddress: string): number {
    const userStakes = this.stakes.get(walletAddress) || [];
    const currentTime = Date.now();
    
    return userStakes.reduce((totalRewards, stake) => {
      const timeStaked = (currentTime - stake.timestamp) / (1000 * 60 * 60 * 24 * 365); // Years
      const rewards = stake.amount * (stake.apy / 100) * timeStaked;
      return totalRewards + rewards;
    }, 0);
  }

  // Get total staked amount
  getTotalStaked(walletAddress: string): number {
    const userStakes = this.stakes.get(walletAddress) || [];
    return userStakes.reduce((sum, stake) => sum + stake.amount, 0);
  }

  // Get staking history
  getStakingHistory(walletAddress: string): StakeInfo[] {
    return this.stakes.get(walletAddress) || [];
  }

  // Clear staking data
  clearStakingData(walletAddress: string): void {
    this.stakes.delete(walletAddress);
  }
}

export const realGoldStakingService = new RealGoldStakingService();