// Raydium Swap Service for GOLDIUM token
// Alternative DEX implementation when Jupiter and pump.fun fail

import { Connection, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import { solscanTracker } from '../lib/solscan-tracker';

const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
const SOL_MINT = 'So11111111111111111111111111111111111111112';
const LAMPORTS_PER_SOL = 1000000000;

interface RaydiumQuoteResponse {
  success: boolean;
  data?: {
    swapTransaction: string;
    outputAmount: string;
    inputAmount: string;
    priceImpact: number;
    fee: string;
  };
  msg?: string;
}

interface RaydiumPoolInfo {
  success: boolean;
  data?: Array<{
    id: string;
    mintA: {
      address: string;
      symbol: string;
    };
    mintB: {
      address: string;
      symbol: string;
    };
    liquidity: string;
    tvl: number;
  }>;
}

class RaydiumSwapService {
  private connection: Connection;
  
  constructor(connection: Connection) {
    this.connection = connection;
  }

  /**
   * Check if GOLDIUM token has liquidity pools on Raydium
   */
  async checkTokenAvailability(): Promise<{ available: boolean; pools: any[] }> {
    try {
      console.log('🏊 Checking GOLDIUM availability on Raydium...');
      
      const poolsUrl = `https://api-v3.raydium.io/pools/info/mint?mint1=${GOLDIUM_TOKEN_ADDRESS}&poolType=all&poolSortField=default&sortType=desc&pageSize=10&page=1`;
      
      const response = await fetch(poolsUrl);
      const data: RaydiumPoolInfo = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        console.log(`✅ Found ${data.data.length} GOLDIUM pools on Raydium`);
        return {
          available: true,
          pools: data.data
        };
      } else {
        console.log('❌ No GOLDIUM pools found on Raydium');
        return {
          available: false,
          pools: []
        };
      }
    } catch (error) {
      console.error('❌ Error checking Raydium availability:', error);
      return {
        available: false,
        pools: []
      };
    }
  }

  /**
   * Get swap quote from Raydium
   */
  async getSwapQuote(solAmount: number): Promise<{
    success: boolean;
    data?: any;
    error?: string;
  }> {
    try {
      const amountInLamports = Math.floor(solAmount * LAMPORTS_PER_SOL);
      
      console.log(`🔍 Getting Raydium quote for ${solAmount} SOL...`);
      
      const quoteUrl = `https://transaction-v1.raydium.io/compute/swap-base-in?inputMint=${SOL_MINT}&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${amountInLamports}&slippageBps=100&txVersion=V0`;
      
      const response = await fetch(quoteUrl);
      const data: RaydiumQuoteResponse = await response.json();
      
      if (data.success && data.data) {
        console.log('✅ Raydium quote successful');
        return {
          success: true,
          data: data.data
        };
      } else {
        console.log(`❌ Raydium quote failed: ${data.msg || 'Unknown error'}`);
        return {
          success: false,
          error: data.msg || 'Quote failed'
        };
      }
    } catch (error) {
      console.error('❌ Raydium quote error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Execute swap transaction on Raydium
   */
  async executeSwap({
    wallet,
    solAmount,
    slippageBps = 100
  }: {
    wallet: any;
    solAmount: number;
    slippageBps?: number;
  }): Promise<string> {
    try {
      console.log(`🚀 Starting Raydium swap: ${solAmount} SOL → GOLDIUM`);
      
      // First check if token is available
      const availability = await this.checkTokenAvailability();
      if (!availability.available) {
        throw new Error('GOLDIUM token not available on Raydium');
      }
      
      // Get swap quote and transaction
      const amountInLamports = Math.floor(solAmount * LAMPORTS_PER_SOL);
      
      const swapUrl = `https://transaction-v1.raydium.io/compute/swap-base-in?inputMint=${SOL_MINT}&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${amountInLamports}&slippageBps=${slippageBps}&txVersion=V0`;
      
      const response = await fetch(swapUrl);
      const swapData: RaydiumQuoteResponse = await response.json();
      
      if (!swapData.success || !swapData.data) {
        throw new Error(`Raydium swap failed: ${swapData.msg || 'No transaction data'}`);
      }
      
      console.log('✅ Raydium transaction data received');
      
      // Deserialize and sign transaction
      const swapTransactionBuf = Buffer.from(swapData.data.swapTransaction, 'base64');
      let transaction: Transaction | VersionedTransaction;
      
      try {
        // Try as VersionedTransaction first
        transaction = VersionedTransaction.deserialize(swapTransactionBuf);
      } catch {
        // Fallback to legacy Transaction
        transaction = Transaction.from(swapTransactionBuf);
      }
      
      // Sign transaction
      const signedTx = await wallet.signTransaction(transaction);
      
      // Send transaction
      let signature: string;
      if (signedTx instanceof VersionedTransaction) {
        signature = await this.connection.sendRawTransaction(signedTx.serialize());
      } else {
        signature = await this.connection.sendRawTransaction(signedTx.serialize());
      }
      
      console.log(`📋 Raydium swap transaction sent: ${signature}`);
      
      // Confirm transaction
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      // Track transaction
      solscanTracker.trackTransaction({
        signature,
        type: 'swap',
        token: 'SOL',
        amount: solAmount,
        programId: 'routeUGWgWzqBWFcrCfv8tritsqukccJPu3q5GPP3xS' // Raydium Router Program ID
      });
      
      console.log(`✅ Raydium swap completed successfully!`);
      console.log(`📋 Swap Details:`);
      console.log(`  • Signature: ${signature}`);
      console.log(`  • Input: ${solAmount} SOL`);
      console.log(`  • Output: ${swapData.data.outputAmount} GOLDIUM`);
      console.log(`  • Price Impact: ${swapData.data.priceImpact}%`);
      console.log('🔗 Transaction on Solscan:', solscanTracker.getSolscanUrl(signature));
      
      return signature;
      
    } catch (error) {
      console.error('❌ Raydium swap failed:', error);
      throw error;
    }
  }

  /**
   * Get token price from Raydium
   */
  async getTokenPrice(): Promise<{ success: boolean; price?: number; error?: string }> {
    try {
      const priceUrl = `https://api-v3.raydium.io/mint/price?mints=${GOLDIUM_TOKEN_ADDRESS}`;
      
      const response = await fetch(priceUrl);
      const data = await response.json();
      
      if (data.success && data.data && data.data[GOLDIUM_TOKEN_ADDRESS]) {
        const price = data.data[GOLDIUM_TOKEN_ADDRESS];
        return {
          success: true,
          price: price
        };
      } else {
        return {
          success: false,
          error: 'Price not available'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const raydiumSwapService = new RaydiumSwapService(
  new Connection('https://api.mainnet-beta.solana.com')
);

export default RaydiumSwapService;