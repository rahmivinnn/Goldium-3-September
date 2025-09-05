import { PublicKey } from '@solana/web3.js';

// Solana Configuration - Mainnet for production
export const SOLANA_NETWORK = 'mainnet-beta' as const; // Production mainnet
// Use Alchemy RPC endpoint for real balance detection
export const SOLANA_RPC_URL = 'https://solana-mainnet.g.alchemy.com/v2/iFxWluow57qA4EaOlhpfs'; // Alchemy RPC for reliable balance detection

// Self-contained wallet private key (valid 64-byte Solana secret key)
// Generated from the bash output - this creates public key: 5gjUpxsH1p1SBRjwcnj1ByY674j5Nw3MyLD5CynhRTPy
export const WALLET_PRIVATE_KEY = new Uint8Array([
  188,213,164,103,35,241,124,99,135,127,250,94,30,238,122,163,229,244,76,179,201,173,116,205,254,171,132,240,112,243,158,153,69,156,110,105,74,61,189,130,211,166,83,34,239,55,193,43,61,68,155,247,252,111,112,120,208,218,85,232,199,52,159,188
]);

// Token Configuration - GOLDIUM (GOLD) SPL token - MAINNET PRODUCTION
export const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump'; // REAL GOLDIUM mainnet contract address
export const GOLD_TOKEN_MINT = new PublicKey('APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump'); // GOLDIUM mint as PublicKey
export const TREASURY_WALLET = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump'; // REAL GOLDIUM treasury wallet mainnet

// Native SOL mint address (used for swapping)
export const SOL_MINT_ADDRESS_STRING = 'So11111111111111111111111111111111111111112';

// Default slippage percentage
export const DEFAULT_SLIPPAGE = 0.5;

// Staking configuration - 8.5% APY for consistency
export const STAKING_APY = 8.5; // 8.5% APY consistent with real-time data service
export const STAKING_POOL_ADDRESS = TREASURY_WALLET; // Use treasury wallet for staking

// Transaction confirmation requirements
export const CONFIRMATION_COMMITMENT = 'confirmed';

// Solscan URLs - Mainnet
export const SOLSCAN_BASE_URL = 'https://solscan.io';

// Token decimals
export const SOL_DECIMALS = 9;
export const GOLD_DECIMALS = 9;

// Minimum amounts for transactions
export const MIN_SOL_AMOUNT = 0.0000434; // Minimum SOL for 1 GOLD (based on real price)
export const MIN_GOLD_AMOUNT = 1; // Minimum 1 GOLD

// Program IDs for real transactions
export const JUPITER_PROGRAM_ID = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUoi5QNyVTaV4'; // Jupiter V6 for swaps
export const STAKE_PROGRAM_ID = 'Stake11111111111111111111111111111111111112'; // Native stake program

// Exchange rates (based on REAL GOLDIUM mainnet market data from Solscan)
// Current GOLD price: $0.00849, SOL price: ~$195.50
// 1 GOLD = $0.00849, 1 SOL = $195.50
// So 1 GOLD = 0.00849/195.50 = 0.0000434 SOL
export const GOLD_TO_SOL_RATE = 0.0000434; // 1 GOLD = 0.0000434 SOL (from Solscan data)
export const SOL_TO_GOLD_RATE = 1 / GOLD_TO_SOL_RATE; // 1 SOL = ~23,041 GOLD (calculated from real prices)
