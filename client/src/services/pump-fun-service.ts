import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { WalletContextState } from '@solana/wallet-adapter-react';
import { solscanTracker } from '../lib/solscan-tracker';

interface PumpFunSwapParams {
  wallet: WalletContextState;
  solAmount: number;
  slippageBps?: number;
}

interface PumpFunQuoteResponse {
  success: boolean;
  data?: {
    inputAmount: string;
    outputAmount: string;
    priceImpact: number;
    fee: string;
  };
  error?: string;
}

class PumpFunService {
  private connection: Connection;
  private readonly GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
  private readonly PUMP_FUN_PROGRAM_ID = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
  private readonly SOL_MINT = 'So11111111111111111111111111111111111111112';

  constructor() {
    this.connection = new Connection(
      process.env.REACT_APP_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
      'confirmed'
    );
  }

  /**
   * Get quote for swapping SOL to GOLDIUM on pump.fun
   */
  async getSwapQuote(solAmount: number): Promise<PumpFunQuoteResponse> {
    try {
      const amountInLamports = Math.floor(solAmount * LAMPORTS_PER_SOL);
      
      // Try pump.fun API endpoint
      const response = await fetch('https://pumpportal.fun/api/trade-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: this.GOLDIUM_TOKEN_ADDRESS,
          action: 'buy',
          amount: amountInLamports,
          denominatedInSol: 'true',
          slippage: 10,
          priorityFee: 0.0005,
          pool: 'pump'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        return {
          success: false,
          error: data.error
        };
      }

      return {
        success: true,
        data: {
          inputAmount: amountInLamports.toString(),
          outputAmount: data.outputAmount || '0',
          priceImpact: data.priceImpact || 0,
          fee: data.fee || '0'
        }
      };
    } catch (error) {
      console.error('Error getting pump.fun quote:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Execute swap SOL for GOLDIUM on pump.fun
   */
  async swapSolForGoldium({ wallet, solAmount, slippageBps = 1000 }: PumpFunSwapParams): Promise<string> {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log(`🚀 Starting pump.fun swap: ${solAmount} SOL for GOLDIUM`);
      
      // Get quote first
      const quote = await this.getSwapQuote(solAmount);
      if (!quote.success || !quote.data) {
        throw new Error(quote.error || 'Failed to get quote');
      }

      console.log('📊 Quote received:', quote.data);

      // Get swap transaction from pump.fun
      const swapResponse = await fetch('https://pumpportal.fun/api/trade-local', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: wallet.publicKey.toString(),
          action: 'buy',
          mint: this.GOLDIUM_TOKEN_ADDRESS,
          amount: Math.floor(solAmount * LAMPORTS_PER_SOL),
          denominatedInSol: 'true',
          slippage: slippageBps / 100, // Convert bps to percentage
          priorityFee: 0.0005,
          pool: 'pump'
        })
      });

      if (!swapResponse.ok) {
        throw new Error(`Failed to get swap transaction: ${swapResponse.status}`);
      }

      const swapData = await swapResponse.json();
      
      if (swapData.error) {
        throw new Error(swapData.error);
      }

      if (!swapData.transaction) {
        throw new Error('No transaction returned from pump.fun API');
      }

      // Deserialize and sign transaction
      const transaction = Transaction.from(Buffer.from(swapData.transaction, 'base64'));
      
      console.log('✍️ Signing transaction...');
      const signedTransaction = await wallet.signTransaction(transaction);
      
      console.log('📡 Sending transaction...');
      const signature = await this.connection.sendRawTransaction(
        signedTransaction.serialize(),
        {
          skipPreflight: false,
          preflightCommitment: 'confirmed'
        }
      );

      console.log('⏳ Confirming transaction...');
      await this.connection.confirmTransaction(signature, 'confirmed');
      
      console.log('✅ Swap completed successfully!');
      console.log(`🔗 Transaction: https://solscan.io/tx/${signature}`);

      // Track transaction with solscan tracker
      try {
        await solscanTracker.trackTransaction({
          signature,
          type: 'swap',
          amount: solAmount,
          token: 'GOLDIUM',
          programId: this.PUMP_FUN_PROGRAM_ID,
          timestamp: Date.now()
        });
      } catch (trackingError) {
        console.warn('Failed to track transaction:', trackingError);
      }

      return signature;
    } catch (error) {
      console.error('❌ Pump.fun swap failed:', error);
      throw error;
    }
  }

  /**
   * Alternative method using direct pump.fun bonding curve interaction
   */
  async swapViaBondingCurve({ wallet, solAmount }: PumpFunSwapParams): Promise<string> {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error('Wallet not connected');
    }

    try {
      console.log(`🎯 Direct bonding curve swap: ${solAmount} SOL for GOLDIUM`);
      
      const transaction = new Transaction();
      const amountInLamports = Math.floor(solAmount * LAMPORTS_PER_SOL);
      
      // Create associated token account if needed
      const goldiumMint = new PublicKey(this.GOLDIUM_TOKEN_ADDRESS);
      const associatedTokenAccount = await getAssociatedTokenAddress(
        goldiumMint,
        wallet.publicKey
      );

      // Check if ATA exists
      const ataInfo = await this.connection.getAccountInfo(associatedTokenAccount);
      if (!ataInfo) {
        console.log('🏗️ Creating associated token account...');
        transaction.add(
          createAssociatedTokenAccountInstruction(
            wallet.publicKey,
            associatedTokenAccount,
            wallet.publicKey,
            goldiumMint
          )
        );
      }

      // Add pump.fun buy instruction
      // Note: This is a simplified version - actual pump.fun instruction would need proper program interaction
      const pumpFunProgram = new PublicKey(this.PUMP_FUN_PROGRAM_ID);
      
      // For now, we'll use the API method as the direct instruction is complex
      throw new Error('Direct bonding curve interaction not yet implemented. Use swapSolForGoldium instead.');
      
    } catch (error) {
      console.error('❌ Bonding curve swap failed:', error);
      throw error;
    }
  }

  /**
   * Check if token is still on pump.fun bonding curve
   */
  async checkBondingCurveStatus(): Promise<{ isActive: boolean; progress?: number }> {
    try {
      const response = await fetch(`https://frontend-api.pump.fun/coins/${this.GOLDIUM_TOKEN_ADDRESS}`);
      
      if (!response.ok) {
        return { isActive: false };
      }

      const data = await response.json();
      
      return {
        isActive: !data.complete,
        progress: data.progress || 0
      };
    } catch (error) {
      console.error('Error checking bonding curve status:', error);
      return { isActive: false };
    }
  }
}

export const pumpFunService = new PumpFunService();
export default pumpFunService;