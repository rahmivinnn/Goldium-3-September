import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { 
  fetchGoldBalance, 
  makeConnection, 
  subscribeToAccountChanges,
  unsubscribeFromAccountChanges 
} from '@/lib/solana/goldBalance';

type State = {
  loading: boolean;
  error: string | null;
  amount: string;
  rawAmount: string;
  decimals: number;
  ata: PublicKey | null;
};

export function useGoldBalance() {
  const { publicKey, connected } = useWallet();
  const [state, setState] = useState<State>({
    loading: false,
    error: null,
    amount: '0',
    rawAmount: '0',
    decimals: 9,
    ata: null,
  });

  const conn = useMemo(() => makeConnection(), []);
  const subIdRef = useRef<number | null>(null);
  const ataRef = useRef<PublicKey | null>(null);
  const isLoadingRef = useRef(false);

  const fetchBalance = useCallback(async (owner: PublicKey) => {
    if (isLoadingRef.current) return; // Prevent concurrent requests
    
    isLoadingRef.current = true;
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await fetchGoldBalance(conn, owner);
      
      // fetchGoldBalance now always returns a valid result, never null
      // But we still validate to be extra safe
      const amount = result?.amount || '0';
      const validAmount = isNaN(parseFloat(amount)) ? '0' : amount;
      
      setState({
        loading: false,
        error: null,
        amount: validAmount,
        rawAmount: result?.rawAmount || '0',
        decimals: result?.decimals || 9,
        ata: result?.ata || null,
      });

      // Update ATA reference for subscription
      ataRef.current = result.ata;

      // Set up subscription if we have an ATA and no existing subscription
      if (result.ata && !subIdRef.current) {
        try {
          subIdRef.current = subscribeToAccountChanges(
            conn,
            result.ata,
            () => {
              if (publicKey && connected) {
                fetchBalance(publicKey);
              }
            }
          );
        } catch (subError) {
          console.warn('Failed to subscribe to account changes:', subError);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `RPC Error: ${error.message}` 
        : 'RPC Error: Unknown error occurred';
      
      setState({
        loading: false,
        error: errorMessage,
        amount: '0',
        rawAmount: '0',
        decimals: 9,
        ata: null,
      });
    } finally {
      isLoadingRef.current = false;
    }
  }, [conn, publicKey, connected]);

  const refresh = useCallback(() => {
    if (publicKey && connected) {
      fetchBalance(publicKey);
    }
  }, [publicKey, connected, fetchBalance]);

  // Clean up subscription when ATA changes or component unmounts
  const cleanupSubscription = useCallback(() => {
    if (subIdRef.current !== null) {
      try {
        unsubscribeFromAccountChanges(conn, subIdRef.current);
      } catch (error) {
        console.warn('Failed to unsubscribe from account changes:', error);
      }
      subIdRef.current = null;
    }
  }, [conn]);

  // Effect for wallet connection/disconnection
  useEffect(() => {
    if (connected && publicKey) {
      fetchBalance(publicKey);
    } else {
      // Reset state when wallet disconnects
      setState({
        loading: false,
        error: null,
        amount: '0',
        rawAmount: '0',
        decimals: 9,
        ata: null,
      });
      cleanupSubscription();
      ataRef.current = null;
    }

    return () => {
      cleanupSubscription();
    };
  }, [connected, publicKey, fetchBalance, cleanupSubscription]);

  // Effect for ATA changes (cleanup old subscription when ATA changes)
  useEffect(() => {
    const currentAta = ataRef.current;
    const newAta = state.ata;
    
    if (currentAta && newAta && !currentAta.equals(newAta)) {
      cleanupSubscription();
    }
  }, [state.ata, cleanupSubscription]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupSubscription();
    };
  }, [cleanupSubscription]);

  return {
    balance: parseFloat(state.amount),
    balanceString: state.amount,
    rawBalance: state.rawAmount,
    decimals: state.decimals,
    ata: state.ata,
    isLoading: state.loading,
    error: state.error,
    refresh,
    connected: connected && !!publicKey,
  };
}

// Legacy compatibility - export the same interface as before
export interface GoldBalanceState {
  balance: number;
  stakedBalance: number;
  totalValue: number;
  isLoading: boolean;
  error: string | null;
}

// Legacy hook for backward compatibility
export function useGoldBalanceLegacy(): GoldBalanceState {
  const newHook = useGoldBalance();
  
  return {
    balance: newHook.balance,
    stakedBalance: 0, // Not implemented in new system yet
    totalValue: newHook.balance, // For now, total = balance
    isLoading: newHook.isLoading,
    error: newHook.error,
  };
}