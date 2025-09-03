import { Connection, Keypair, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getClientKeypair, CLIENT_WALLET_DATA, checkClientWalletBalance } from './wallet-validator';
import { SOLANA_RPC_URL, GOLDIUM_TOKEN_ADDRESS } from './constants';

export class ClientWalletService {
  private connection: Connection;
  private clientKeypair: Keypair | null;

  constructor() {
    this.connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    this.clientKeypair = getClientKeypair();
    
    if (this.clientKeypair) {
      console.log('✅ Client wallet service initialized with valid keypair');
      console.log('📍 Public Key:', this.clientKeypair.publicKey.toBase58());
    } else {
      console.error('❌ Client wallet service failed - invalid keypair');
    }
  }

  // Check if client wallet is ready
  isReady(): boolean {
    return this.clientKeypair !== null;
  }

  // Get public key
  getPublicKey(): PublicKey | null {
    return this.clientKeypair?.publicKey || null;
  }

  // Get current balance
  async getBalance(): Promise<number> {
    try {
      if (!this.clientKeypair) throw new Error('Wallet not initialized');
      
      const balance = await this.connection.getBalance(this.clientKeypair.publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  // Simulate SOL to GOLDIUM swap
  async simulateSwap(solAmount: number): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      if (!this.clientKeypair) throw new Error('Wallet not initialized');
      
      console.log(`🔄 Simulating SWAP: ${solAmount} SOL → GOLDIUM`);
      console.log(`📍 From Wallet: ${this.clientKeypair.publicKey.toBase58()}`);
      console.log(`🎯 GOLDIUM Contract: ${GOLDIUM_TOKEN_ADDRESS}`);
      
      // Check balance first
      const balance = await this.getBalance();
      if (balance < solAmount) {
        throw new Error(`Insufficient balance. Have: ${balance.toFixed(4)} SOL, Need: ${solAmount} SOL`);
      }
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate realistic transaction signature
      const signature = `swap_${Date.now()}_${Math.random().toString(36).substr(2, 11)}`;
      
      console.log(`✅ SWAP Simulation Complete`);
      console.log(`📊 Transaction Signature: ${signature}`);
      console.log(`🔗 Track on Solscan: https://solscan.io/tx/${signature}`);
      
      return { success: true, signature };
      
    } catch (error) {
      console.error('❌ Swap simulation failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Simulate SOL send
  async simulateSend(amount: number, recipient: string): Promise<{ success: boolean; signature?: string; error?: string }> {
    try {
      if (!this.clientKeypair) throw new Error('Wallet not initialized');
      
      console.log(`💸 Simulating SEND: ${amount} SOL → ${recipient}`);
      console.log(`📍 From Wallet: ${this.clientKeypair.publicKey.toBase58()}`);
      
      // Validate recipient address
      try {
        new PublicKey(recipient);
      } catch {
        throw new Error('Invalid recipient address format');
      }
      
      // Check balance first
      const balance = await this.getBalance();
      if (balance < amount) {
        throw new Error(`Insufficient balance. Have: ${balance.toFixed(4)} SOL, Need: ${amount} SOL`);
      }
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate realistic transaction signature
      const signature = `send_${Date.now()}_${Math.random().toString(36).substr(2, 11)}`;
      
      console.log(`✅ SEND Simulation Complete`);
      console.log(`📊 Transaction Signature: ${signature}`);
      console.log(`🔗 Track on Solscan: https://solscan.io/tx/${signature}`);
      
      return { success: true, signature };
      
    } catch (error) {
      console.error('❌ Send simulation failed:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Get wallet info for display
  getWalletInfo() {
    return {
      address: CLIENT_WALLET_DATA.publicAddress,
      isValid: this.isReady(),
      publicKey: this.getPublicKey()?.toBase58() || null
    };
  }
}

export const clientWalletService = new ClientWalletService();