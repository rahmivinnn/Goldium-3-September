import { Connection, PublicKey } from '@solana/web3.js';
import { transactionTracker, TransactionInfo } from './transaction-tracker';
import { transactionHistory } from './transaction-history';
import { TREASURY_WALLET, SOLSCAN_BASE_URL } from './constants';

export interface PaymentMonitorConfig {
  expectedAmount: number;
  userWallet: string;
  memo?: string;
  timeout?: number; // in milliseconds
}

export interface PaymentResult {
  success: boolean;
  txHash?: string;
  amount?: number;
  timestamp?: number;
  error?: string;
}

class PaymentMonitor {
  private connection: Connection;
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();
  private lastCheckedSignatures: Map<string, string[]> = new Map();

  constructor() {
    // Use Alchemy RPC with fallback endpoints for better reliability
    const rpcEndpoints = [
      'https://solana-mainnet.g.alchemy.com/v2/iFxWluow57qA4EaOlhpfs', // Alchemy RPC (premium)
      'https://api.mainnet-beta.solana.com',
      'https://solana-api.projectserum.com',
      'https://rpc.ankr.com/solana',
      'https://solana.blockdaemon.com'
    ];
    
    this.connection = new Connection(rpcEndpoints[0], 'confirmed');
  }

  // Start monitoring for a specific payment
  async startMonitoring(
    config: PaymentMonitorConfig,
    onPaymentReceived: (result: PaymentResult) => void
  ): Promise<string> {
    const monitorId = `${config.userWallet}_${Date.now()}`;
    const startTime = Date.now();
    const timeout = config.timeout || 300000; // 5 minutes default
    
    console.log(`🔍 Starting payment monitoring for ${config.expectedAmount} SOL from ${config.userWallet}`);
    
    // Get initial signatures to avoid detecting old transactions
    const treasuryPubkey = new PublicKey(TREASURY_WALLET);
    const initialSignatures = await this.getRecentSignatures(treasuryPubkey);
    this.lastCheckedSignatures.set(monitorId, initialSignatures);
    
    const interval = setInterval(async () => {
      try {
        const elapsed = Date.now() - startTime;
        
        // Check for timeout
        if (elapsed > timeout) {
          this.stopMonitoring(monitorId);
          onPaymentReceived({
            success: false,
            error: 'Payment monitoring timeout'
          });
          return;
        }
        
        // Check for new transactions
        const paymentResult = await this.checkForPayment(monitorId, config);
        
        if (paymentResult.success) {
          this.stopMonitoring(monitorId);
          onPaymentReceived(paymentResult);
        }
        
      } catch (error) {
        console.error('Error during payment monitoring:', error);
      }
    }, 3000); // Check every 3 seconds
    
    this.monitoringIntervals.set(monitorId, interval);
    return monitorId;
  }

  // Stop monitoring for a specific payment
  stopMonitoring(monitorId: string): void {
    const interval = this.monitoringIntervals.get(monitorId);
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(monitorId);
      this.lastCheckedSignatures.delete(monitorId);
      console.log(`⏹️ Stopped payment monitoring: ${monitorId}`);
    }
  }

  // Check for new payment transactions
  private async checkForPayment(
    monitorId: string,
    config: PaymentMonitorConfig
  ): Promise<PaymentResult> {
    try {
      const treasuryPubkey = new PublicKey(TREASURY_WALLET);
      const currentSignatures = await this.getRecentSignatures(treasuryPubkey);
      const lastChecked = this.lastCheckedSignatures.get(monitorId) || [];
      
      // Find new signatures
      const newSignatures = currentSignatures.filter(
        sig => !lastChecked.includes(sig)
      );
      
      if (newSignatures.length === 0) {
        return { success: false };
      }
      
      console.log(`🔍 Found ${newSignatures.length} new transactions to check`);
      
      // Check each new transaction
      for (const signature of newSignatures) {
        const paymentResult = await this.validatePayment(signature, config);
        if (paymentResult.success) {
          // Update transaction history
          if (paymentResult.amount) {
            transactionHistory.addGoldTransaction(
              'swap_receive',
              paymentResult.amount,
              paymentResult.txHash || signature
            );
          }
          
          return paymentResult;
        }
      }
      
      // Update last checked signatures
      this.lastCheckedSignatures.set(monitorId, currentSignatures);
      
      return { success: false };
      
    } catch (error) {
      console.error('Error checking for payment:', error);
      return { success: false, error: 'Failed to check payment' };
    }
  }

  // Get recent transaction signatures for an address
  private async getRecentSignatures(pubkey: PublicKey): Promise<string[]> {
    try {
      const signatures = await this.connection.getSignaturesForAddress(
        pubkey,
        { limit: 10 }
      );
      
      return signatures.map(sig => sig.signature);
    } catch (error) {
      console.error('Error getting signatures:', error);
      return [];
    }
  }

  // Validate if a transaction matches our payment criteria
  private async validatePayment(
    signature: string,
    config: PaymentMonitorConfig
  ): Promise<PaymentResult> {
    try {
      const transaction = await this.connection.getTransaction(
        signature,
        { commitment: 'confirmed' }
      );
      
      if (!transaction || transaction.meta?.err) {
        return { success: false };
      }
      
      // Check if transaction involves the user's wallet
      const userPubkey = new PublicKey(config.userWallet);
      const accountKeys = transaction.transaction.message.accountKeys;
      
      const userInvolved = accountKeys.some(key => 
        key.pubkey.toString() === userPubkey.toString()
      );
      
      if (!userInvolved) {
        return { success: false };
      }
      
      // Extract payment amount
      const amount = this.extractPaymentAmount(transaction);
      
      // Check if amount matches expected (with small tolerance for fees)
      const tolerance = 0.001; // 0.001 SOL tolerance
      const amountMatches = Math.abs(amount - config.expectedAmount) <= tolerance;
      
      if (!amountMatches) {
        console.log(`❌ Amount mismatch: expected ${config.expectedAmount}, got ${amount}`);
        return { success: false };
      }
      
      // Check memo if provided
      if (config.memo) {
        const memo = this.extractMemo(transaction);
        if (!memo || !memo.includes(config.memo)) {
          console.log(`❌ Memo mismatch: expected ${config.memo}, got ${memo}`);
          return { success: false };
        }
      }
      
      console.log(`✅ Payment validated: ${amount} SOL from ${config.userWallet}`);
      
      // Add to transaction tracker
      const txInfo: TransactionInfo = {
        signature,
        timestamp: (transaction.blockTime || Date.now() / 1000) * 1000,
        type: 'transfer',
        amount,
        token: 'SOL',
        status: 'confirmed',
        solscanUrl: `${SOLSCAN_BASE_URL}/tx/${signature}`,
        memo: config.memo
      };
      
      transactionTracker.addTransaction(txInfo);
      
      return {
        success: true,
        txHash: signature,
        amount,
        timestamp: txInfo.timestamp
      };
      
    } catch (error) {
      console.error('Error validating payment:', error);
      return { success: false, error: 'Failed to validate payment' };
    }
  }

  // Extract payment amount from transaction
  private extractPaymentAmount(transaction: any): number {
    try {
      const preBalances = transaction.meta?.preBalances || [];
      const postBalances = transaction.meta?.postBalances || [];
      
      // Find the largest balance change (usually the main transfer)
      let maxChange = 0;
      
      for (let i = 0; i < Math.min(preBalances.length, postBalances.length); i++) {
        const change = Math.abs(postBalances[i] - preBalances[i]);
        if (change > maxChange) {
          maxChange = change;
        }
      }
      
      return maxChange / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Error extracting payment amount:', error);
      return 0;
    }
  }

  // Extract memo from transaction
  private extractMemo(transaction: any): string | undefined {
    try {
      const instructions = transaction?.transaction?.message?.instructions || [];
      
      for (const instruction of instructions) {
        // Check if this is a memo instruction
        if (instruction?.program === 'memo' || 
            instruction?.programId?.toString() === 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr') {
          return instruction?.data || instruction?.memo;
        }
      }
      
      return undefined;
    } catch (error) {
      return undefined;
    }
  }

  // Stop all monitoring
  stopAllMonitoring(): void {
    for (const [monitorId] of this.monitoringIntervals) {
      this.stopMonitoring(monitorId);
    }
  }

  // Get active monitoring count
  getActiveMonitoringCount(): number {
    return this.monitoringIntervals.size;
  }
}

export const paymentMonitor = new PaymentMonitor();