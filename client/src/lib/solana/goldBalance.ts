import {
  Connection,
  PublicKey,
  Commitment,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  getMint,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { GOLD_TOKEN_MINT, SOLANA_RPC_URL } from '../constants';

/** GOLD token mint address from constants */
export const GOLD_MINT = GOLD_TOKEN_MINT;

export const ALCHEMY_SOLANA_RPC = SOLANA_RPC_URL;

const COMMITMENT: Commitment = 'confirmed';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export function makeConnection() {
  return new Connection(ALCHEMY_SOLANA_RPC || clusterApiUrl('mainnet-beta'), COMMITMENT);
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function withRetry<T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < retries) {
        await sleep(RETRY_DELAY * (i + 1)); // exponential backoff
      }
    }
  }
  
  throw lastError!;
}

async function tryGetAta(
  owner: PublicKey,
  mint: PublicKey,
  programId: PublicKey,
) {
  // get ATA address (doesn't guarantee it exists on-chain)
  const ata = await getAssociatedTokenAddress(mint, owner, false, programId);
  return ata;
}

async function accountExists(conn: Connection, pubkey: PublicKey) {
  const info = await conn.getAccountInfo(pubkey, COMMITMENT);
  return !!info;
}

export async function getGoldDecimals(conn: Connection): Promise<number> {
  try {
    // Try TOKEN_PROGRAM_ID first
    const mintInfo = await withRetry(() => getMint(conn, GOLD_MINT, COMMITMENT, TOKEN_PROGRAM_ID));
    const decimals = mintInfo.decimals;
    // Validate decimals is a valid number
    if (typeof decimals === 'number' && decimals >= 0 && decimals <= 18) {
      return decimals;
    }
  } catch {
    try {
      // Try TOKEN_2022_PROGRAM_ID
      const mintInfo2022 = await withRetry(() => getMint(conn, GOLD_MINT, COMMITMENT, TOKEN_2022_PROGRAM_ID));
      const decimals = mintInfo2022.decimals;
      // Validate decimals is a valid number
      if (typeof decimals === 'number' && decimals >= 0 && decimals <= 18) {
        return decimals;
      }
    } catch (error) {
      console.warn('Failed to get GOLD decimals:', error);
    }
  }
  
  return 9; // Default fallback
}

/**
 * Returns:
 * {
 *   rawAmount: string,      // as returned by RPC (uiAmountString-safe)
 *   amount: string,         // human string already scaled by decimals
 *   decimals: number,
 *   ata: PublicKey | null   // the ATA used (if found)
 * }
 */
export async function fetchGoldBalance(conn: Connection, owner: PublicKey) {
  try {
    if (!owner) throw new Error('Owner public key missing');
    
    const decimals = await getGoldDecimals(conn);
  
  // Ensure decimals is valid
  if (isNaN(decimals) || decimals < 0) {
    console.warn('Invalid decimals received, using default');
    return { rawAmount: '0', amount: '0', decimals: 9, ata: null };
  }

  // 1) Try TOKEN_PROGRAM_ID (legacy)
  const ataV1 = await tryGetAta(owner, GOLD_MINT, TOKEN_PROGRAM_ID);
  const existsV1 = await withRetry(() => accountExists(conn, ataV1));

  if (existsV1) {
    const bal = await withRetry(() => conn.getTokenAccountBalance(ataV1, COMMITMENT));
    const raw = bal.value.amount; // string of base units
    
    // Safe calculation to prevent NaN
    let ui = bal.value.uiAmountString;
    if (!ui) {
      const rawNum = parseFloat(raw);
      if (isNaN(rawNum) || decimals <= 0) {
        ui = '0';
      } else {
        ui = (rawNum / Math.pow(10, decimals)).toString();
      }
    }
    
    // Final validation to ensure no NaN
    if (isNaN(parseFloat(ui))) {
      ui = '0';
    }
    
    return { rawAmount: raw, amount: ui, decimals, ata: ataV1 };
  }

  // 2) Try TOKEN_2022_PROGRAM_ID
  const ata22 = await tryGetAta(owner, GOLD_MINT, TOKEN_2022_PROGRAM_ID);
  const exists22 = await withRetry(() => accountExists(conn, ata22));

  if (exists22) {
    const bal = await withRetry(() => conn.getTokenAccountBalance(ata22, COMMITMENT));
    const raw = bal.value.amount;
    
    // Safe calculation to prevent NaN
    let ui = bal.value.uiAmountString;
    if (!ui) {
      const rawNum = parseFloat(raw);
      if (isNaN(rawNum) || decimals <= 0) {
        ui = '0';
      } else {
        ui = (rawNum / Math.pow(10, decimals)).toString();
      }
    }
    
    // Final validation to ensure no NaN
    if (isNaN(parseFloat(ui))) {
      ui = '0';
    }
    
    return { rawAmount: raw, amount: ui, decimals, ata: ata22 };
  }

  // 3) As final fallback, search parsed accounts by owner+mint (covers non-ATA edge cases)
  const parsed = await withRetry(() => conn.getParsedTokenAccountsByOwner(owner, { mint: GOLD_MINT }, COMMITMENT));
  if (parsed.value.length > 0) {
    const acc = parsed.value[0];
    const raw = acc.account.data.parsed.info.tokenAmount.amount as string;
    
    // Safe calculation to prevent NaN
    let ui = acc.account.data.parsed.info.tokenAmount.uiAmountString as string;
    if (!ui) {
      const rawNum = parseFloat(raw);
      if (isNaN(rawNum) || decimals <= 0) {
        ui = '0';
      } else {
        ui = (rawNum / Math.pow(10, decimals)).toString();
      }
    }
    
    // Final validation to ensure no NaN
    if (isNaN(parseFloat(ui))) {
      ui = '0';
    }
    
    return { rawAmount: raw, amount: ui, decimals, ata: new PublicKey(acc.pubkey) };
  }

  // No balance found
  return { rawAmount: '0', amount: '0', decimals, ata: null };
  } catch (error) {
    console.error('Error fetching GOLD balance:', error);
    // Return safe default instead of null to prevent NaN
    return { rawAmount: '0', amount: '0', decimals: 9, ata: null };
  }
}

/**
 * Subscribe to account changes for auto-refresh
 */
export function subscribeToAccountChanges(
  conn: Connection,
  ata: PublicKey,
  callback: () => void
): number {
  return conn.onAccountChange(
    ata,
    () => {
      // Small delay to ensure transaction is fully processed
      setTimeout(callback, 1000);
    },
    COMMITMENT
  );
}

export function unsubscribeFromAccountChanges(conn: Connection, subscriptionId: number) {
  conn.removeAccountChangeListener(subscriptionId);
}