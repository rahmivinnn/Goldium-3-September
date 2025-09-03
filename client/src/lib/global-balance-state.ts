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
    globalBalanceState.solBalance = balance;
    globalBalanceState.lastUpdated = Date.now();
    console.log(`💰 SOL Balance updated: ${balance}`);
    listeners.forEach(listener => listener());
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
    globalBalanceState.solBalance = solBalance;
    globalBalanceState.lastUpdated = Date.now();
    console.log(`✅ Wallet connected: ${address} with ${solBalance} SOL`);
    listeners.forEach(listener => listener());
  },
  
  setWalletDisconnected: () => {
    globalBalanceState.isConnected = false;
    globalBalanceState.walletAddress = null;
    globalBalanceState.solBalance = 0;
    globalBalanceState.goldBalance = 0;
    globalBalanceState.lastUpdated = Date.now();
    console.log('❌ Wallet disconnected');
    listeners.forEach(listener => listener());
  }
};