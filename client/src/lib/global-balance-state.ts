// Global balance state yang bisa diakses dari mana saja
interface GlobalBalanceState {
  solBalance: number;
  goldBalance: number;
  walletAddress: string | null;
  isConnected: boolean;
  lastUpdated: number;
}

let globalBalanceState: GlobalBalanceState = {
  solBalance: 0,
  goldBalance: 0,
  walletAddress: null,
  isConnected: false,
  lastUpdated: 0
};

// Prevent balance resets - keep last known good balance
let lastKnownBalance = 0;

const listeners = new Set<() => void>();

export const GlobalBalanceManager = {
  getState: () => ({ ...globalBalanceState }),
  
  setState: (newState: Partial<GlobalBalanceState>) => {
    globalBalanceState = { ...globalBalanceState, ...newState, lastUpdated: Date.now() };
    console.log('🔄 Global balance state updated:', globalBalanceState);
    listeners.forEach(listener => listener());
  },
  
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  
  updateSolBalance: (balance: number) => {
    // Only update if balance is different and not 0 (unless explicitly disconnecting)
    if (balance > 0) {
      lastKnownBalance = balance;
      globalBalanceState.solBalance = balance;
      globalBalanceState.lastUpdated = Date.now();
      console.log(`💰 SOL Balance updated: ${balance}`);
      listeners.forEach(listener => listener());
    }
  },
  
  updateGoldBalance: (balance: number) => {
    globalBalanceState.goldBalance = balance;
    globalBalanceState.lastUpdated = Date.now();
    console.log(`🥇 GOLD Balance updated: ${balance}`);
    listeners.forEach(listener => listener());
  },
  
  setWalletConnected: (address: string, solBalance: number = 0) => {
    globalBalanceState.isConnected = true;
    globalBalanceState.walletAddress = address;
    
    // Only update balance if we have a positive balance
    if (solBalance > 0) {
      lastKnownBalance = solBalance;
      globalBalanceState.solBalance = solBalance;
    } else if (lastKnownBalance > 0) {
      // Keep last known balance if new balance is 0 (might be RPC error)
      globalBalanceState.solBalance = lastKnownBalance;
      console.log(`🔄 Keeping last known balance: ${lastKnownBalance} SOL`);
    }
    
    globalBalanceState.lastUpdated = Date.now();
    console.log(`✅ Wallet connected: ${address} with ${globalBalanceState.solBalance} SOL`);
    listeners.forEach(listener => listener());
  },
  
  setWalletDisconnected: () => {
    globalBalanceState.isConnected = false;
    globalBalanceState.walletAddress = null;
    globalBalanceState.solBalance = 0;
    globalBalanceState.goldBalance = 0;
    globalBalanceState.lastUpdated = Date.now();
    lastKnownBalance = 0; // Reset last known balance
    console.log('❌ Wallet disconnected - balance reset');
    listeners.forEach(listener => listener());
  }
};