import React, { useState, useEffect } from 'react';
import { useSolanaWallet } from '@/components/solana-wallet-provider';

interface SolGoldIntegrationProps {
  onGoldUpdate?: (balance: number) => void;
  onTransactionComplete?: (txHash: string) => void;
}

export function SolGoldIntegration({ onGoldUpdate, onTransactionComplete }: SolGoldIntegrationProps) {
  const wallet = useSolanaWallet();
  const [goldBalance, setGoldBalance] = useState(0);
  const [solBalance, setSolBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  // GOLD Token Configuration
  const GOLD_TOKEN_MINT = 'So11111111111111111111111111111111111111112'; // Replace with actual GOLD token mint
  const GOLD_DECIMALS = 9;

  // Load balances
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      loadBalances();
    }
  }, [wallet.connected, wallet.publicKey]);

  const loadBalances = async () => {
    if (!wallet.connected || !wallet.publicKey) return;

    try {
      setIsLoading(true);
      
      // Load SOL balance
      const solBalance = await wallet.connection.getBalance(wallet.publicKey);
      setSolBalance(solBalance / 1e9); // Convert lamports to SOL

      // Load GOLD token balance
      const tokenAccounts = await wallet.connection.getTokenAccountsByOwner(
        wallet.publicKey,
        { mint: GOLD_TOKEN_MINT }
      );

      if (tokenAccounts.value.length > 0) {
        const tokenAccount = tokenAccounts.value[0];
        const tokenAccountInfo = await wallet.connection.getTokenAccountBalance(tokenAccount.pubkey);
        const balance = parseFloat(tokenAccountInfo.value.amount) / Math.pow(10, GOLD_DECIMALS);
        setGoldBalance(balance);
        onGoldUpdate?.(balance);
      } else {
        setGoldBalance(0);
        onGoldUpdate?.(0);
      }
    } catch (error) {
      console.error('Error loading balances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const swapSolToGold = async (solAmount: number) => {
    if (!wallet.connected || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setTransactionStatus('pending');

      // Convert SOL to lamports
      const lamports = Math.floor(solAmount * 1e9);

      // Create swap transaction
      const transaction = await createSwapTransaction(lamports);
      
      // Sign and send transaction
      const signature = await wallet.sendTransaction(transaction, wallet.connection);
      
      // Wait for confirmation
      await wallet.connection.confirmTransaction(signature, 'confirmed');
      
      setTransactionStatus('success');
      onTransactionComplete?.(signature);
      
      // Reload balances
      await loadBalances();
      
      return signature;
    } catch (error) {
      console.error('Swap failed:', error);
      setTransactionStatus('error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const swapGoldToSol = async (goldAmount: number) => {
    if (!wallet.connected || !wallet.publicKey) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsLoading(true);
      setTransactionStatus('pending');

      // Convert GOLD to smallest unit
      const goldAmountSmallest = Math.floor(goldAmount * Math.pow(10, GOLD_DECIMALS));

      // Create reverse swap transaction
      const transaction = await createReverseSwapTransaction(goldAmountSmallest);
      
      // Sign and send transaction
      const signature = await wallet.sendTransaction(transaction, wallet.connection);
      
      // Wait for confirmation
      await wallet.connection.confirmTransaction(signature, 'confirmed');
      
      setTransactionStatus('success');
      onTransactionComplete?.(signature);
      
      // Reload balances
      await loadBalances();
      
      return signature;
    } catch (error) {
      console.error('Reverse swap failed:', error);
      setTransactionStatus('error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createSwapTransaction = async (lamports: number) => {
    // This would integrate with Jupiter, Raydium, or other DEX
    // For now, we'll create a placeholder transaction
    const { Transaction, SystemProgram } = await import('@solana/web3.js');
    
    const transaction = new Transaction();
    
    // Add swap instruction here
    // This would be replaced with actual DEX integration
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: wallet.publicKey!, // Placeholder
        lamports: 1000, // Small amount for testing
      })
    );

    return transaction;
  };

  const createReverseSwapTransaction = async (goldAmount: number) => {
    // This would integrate with Jupiter, Raydium, or other DEX
    // For now, we'll create a placeholder transaction
    const { Transaction, SystemProgram } = await import('@solana/web3.js');
    
    const transaction = new Transaction();
    
    // Add reverse swap instruction here
    // This would be replaced with actual DEX integration
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: wallet.publicKey!, // Placeholder
        lamports: 1000, // Small amount for testing
      })
    );

    return transaction;
  };

  const buyCharacterWithGold = async (characterPrice: number) => {
    if (goldBalance < characterPrice) {
      throw new Error('Insufficient GOLD balance');
    }

    try {
      setIsLoading(true);
      setTransactionStatus('pending');

      // Create character purchase transaction
      const transaction = await createCharacterPurchaseTransaction(characterPrice);
      
      // Sign and send transaction
      const signature = await wallet.sendTransaction(transaction, wallet.connection);
      
      // Wait for confirmation
      await wallet.connection.confirmTransaction(signature, 'confirmed');
      
      setTransactionStatus('success');
      onTransactionComplete?.(signature);
      
      // Reload balances
      await loadBalances();
      
      return signature;
    } catch (error) {
      console.error('Character purchase failed:', error);
      setTransactionStatus('error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createCharacterPurchaseTransaction = async (price: number) => {
    const { Transaction, SystemProgram } = await import('@solana/web3.js');
    
    const transaction = new Transaction();
    
    // Add character purchase instruction here
    // This would interact with the character NFT contract
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey!,
        toPubkey: wallet.publicKey!, // Placeholder for character contract
        lamports: 1000, // Small amount for testing
      })
    );

    return transaction;
  };

  return {
    goldBalance,
    solBalance,
    isLoading,
    transactionStatus,
    swapSolToGold,
    swapGoldToSol,
    buyCharacterWithGold,
    loadBalances,
    refreshBalances: loadBalances
  };
}

// Hook for easy integration
export function useSolGoldIntegration() {
  const [goldBalance, setGoldBalance] = useState(0);
  const [solBalance, setSolBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

  const integration = SolGoldIntegration({
    onGoldUpdate: setGoldBalance,
    onTransactionComplete: (txHash) => {
      console.log('Transaction completed:', txHash);
    }
  });

  return {
    ...integration,
    goldBalance,
    solBalance,
    isLoading,
    transactionStatus
  };
}