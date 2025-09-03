import { PublicKey, Connection } from '@solana/web3.js';
import { GOLDIUM_TOKEN_ADDRESS, TREASURY_WALLET, SOLANA_RPC_URL } from './constants';

// CA Tracking Service - Track semua transaksi ke GOLDIUM CA
export interface UserTransactionData {
  walletAddress: string;
  transactions: TransactionRecord[];
  totalSOLSent: number;
  totalGOLDReceived: number;
  totalGOLDStaked: number;
  lastActivity: number;
  joinDate: number;
}

export interface TransactionRecord {
  signature: string;
  type: 'swap' | 'send' | 'stake' | 'unstake' | 'claim';
  timestamp: number;
  fromToken: string;
  toToken: string;
  fromAmount: number;
  toAmount: number;
  status: 'pending' | 'confirmed' | 'failed';
  blockNumber?: number;
  solscanUrl: string;
}

class CATrackingService {
  private connection: Connection;
  private userDataCache: Map<string, UserTransactionData> = new Map();

  constructor() {
    this.connection = new Connection(SOLANA_RPC_URL, 'confirmed');
  }

  // Initialize user tracking
  async initializeUserTracking(walletAddress: string): Promise<UserTransactionData> {
    console.log(`🔍 Initializing tracking for wallet: ${walletAddress}`);
    console.log(`📊 GOLDIUM CA: ${GOLDIUM_TOKEN_ADDRESS}`);
    
    const existingData = this.userDataCache.get(walletAddress);
    if (existingData) {
      console.log(`✅ Found existing user data with ${existingData.transactions.length} transactions`);
      return existingData;
    }

    // Create new user data
    const userData: UserTransactionData = {
      walletAddress,
      transactions: [],
      totalSOLSent: 0,
      totalGOLDReceived: 0,
      totalGOLDStaked: 0,
      lastActivity: Date.now(),
      joinDate: Date.now()
    };

    // Load from localStorage
    try {
      const stored = localStorage.getItem(`goldium_user_${walletAddress}`);
      if (stored) {
        const parsedData = JSON.parse(stored);
        userData.transactions = parsedData.transactions || [];
        userData.totalSOLSent = parsedData.totalSOLSent || 0;
        userData.totalGOLDReceived = parsedData.totalGOLDReceived || 0;
        userData.totalGOLDStaked = parsedData.totalGOLDStaked || 0;
        userData.joinDate = parsedData.joinDate || Date.now();
        console.log(`📂 Loaded ${userData.transactions.length} transactions from storage`);
      }
    } catch (error) {
      console.log('⚠️ Failed to load user data from storage');
    }

    this.userDataCache.set(walletAddress, userData);
    return userData;
  }

  // Track new transaction to GOLDIUM CA
  async trackTransaction(
    walletAddress: string, 
    signature: string, 
    type: TransactionRecord['type'],
    fromToken: string,
    toToken: string,
    fromAmount: number,
    toAmount: number
  ): Promise<void> {
    console.log(`🔗 TRACKING TO GOLDIUM CA: ${GOLDIUM_TOKEN_ADDRESS}`);
    console.log(`📝 Transaction: ${type} - ${fromAmount} ${fromToken} → ${toAmount} ${toToken}`);
    
    const userData = await this.initializeUserTracking(walletAddress);
    
    const transaction: TransactionRecord = {
      signature,
      type,
      timestamp: Date.now(),
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      status: 'pending',
      solscanUrl: `https://solscan.io/tx/${signature}`
    };

    // Add to user transactions
    userData.transactions.push(transaction);
    userData.lastActivity = Date.now();

    // Update totals
    if (type === 'swap' && fromToken === 'SOL' && toToken === 'GOLD') {
      userData.totalSOLSent += fromAmount;
      userData.totalGOLDReceived += toAmount;
    } else if (type === 'stake' && fromToken === 'GOLD') {
      userData.totalGOLDStaked += fromAmount;
    }

    // Save to localStorage
    this.saveUserData(walletAddress, userData);

    // Send tracking data to GOLDIUM CA (via backend)
    try {
      await fetch('/api/track-to-ca', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ca: GOLDIUM_TOKEN_ADDRESS,
          walletAddress,
          transaction,
          userData: {
            totalSOLSent: userData.totalSOLSent,
            totalGOLDReceived: userData.totalGOLDReceived,
            totalGOLDStaked: userData.totalGOLDStaked,
            transactionCount: userData.transactions.length
          }
        })
      });
      console.log(`✅ Transaction tracked to GOLDIUM CA successfully`);
    } catch (error) {
      console.log(`⚠️ CA tracking failed (will retry):`, error);
    }

    console.log(`📊 User ${walletAddress} stats:`);
    console.log(`  • Total SOL sent: ${userData.totalSOLSent}`);
    console.log(`  • Total GOLD received: ${userData.totalGOLDReceived}`);
    console.log(`  • Total GOLD staked: ${userData.totalGOLDStaked}`);
    console.log(`  • Total transactions: ${userData.transactions.length}`);
  }

  // Save user data to localStorage
  private saveUserData(walletAddress: string, userData: UserTransactionData): void {
    try {
      localStorage.setItem(`goldium_user_${walletAddress}`, JSON.stringify(userData));
      this.userDataCache.set(walletAddress, userData);
      console.log(`💾 User data saved for ${walletAddress}`);
    } catch (error) {
      console.error('❌ Failed to save user data:', error);
    }
  }

  // Get user transaction history
  getUserData(walletAddress: string): UserTransactionData | null {
    return this.userDataCache.get(walletAddress) || null;
  }

  // Get all user transactions for display
  getUserTransactions(walletAddress: string): TransactionRecord[] {
    const userData = this.getUserData(walletAddress);
    return userData?.transactions || [];
  }

  // Update transaction status (when confirmed)
  async updateTransactionStatus(signature: string, status: 'confirmed' | 'failed'): Promise<void> {
    for (const [walletAddress, userData] of this.userDataCache.entries()) {
      const transaction = userData.transactions.find(tx => tx.signature === signature);
      if (transaction) {
        transaction.status = status;
        this.saveUserData(walletAddress, userData);
        console.log(`✅ Transaction ${signature} status updated to ${status}`);
        break;
      }
    }
  }
}

// Export singleton instance
export const caTrackingService = new CATrackingService();

// Helper function to track any transaction
export const trackToGoldiumCA = async (
  walletAddress: string,
  signature: string,
  type: TransactionRecord['type'],
  fromToken: string,
  toToken: string,
  fromAmount: number,
  toAmount: number
) => {
  await caTrackingService.trackTransaction(
    walletAddress, 
    signature, 
    type, 
    fromToken, 
    toToken, 
    fromAmount, 
    toAmount
  );
};