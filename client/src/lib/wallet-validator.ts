import { Keypair, PublicKey } from '@solana/web3.js';

// Client wallet data untuk testing
export const CLIENT_WALLET_DATA = {
  publicAddress: 'A9anvNZEkxQvU7H5xa1Lj33MVQGuX5rZMKqWDM9S4jSs',
  privateKeyArray: [41,182,148,231,218,154,70,144,30,90,225,244,217,58,65,179,11,47,60,66,33,187,240,49,44,233,127,59,235,5,103,97,135,236,9,136,109,168,32,68,137,127,69,182,215,63,158,123,106,10,158,229,27,113,157,56,234,101,188,233,176,248,15,204]
};

export function validateClientWallet(): { isValid: boolean; keypair?: Keypair; error?: string } {
  try {
    console.log('🔍 Validating client wallet...');
    
    // Create keypair from private key array
    const privateKeyUint8 = new Uint8Array(CLIENT_WALLET_DATA.privateKeyArray);
    const keypair = Keypair.fromSecretKey(privateKeyUint8);
    
    // Get public key from private key
    const derivedPublicKey = keypair.publicKey.toBase58();
    
    console.log('📋 Validation Results:');
    console.log('  Expected Public Key:', CLIENT_WALLET_DATA.publicAddress);
    console.log('  Derived Public Key: ', derivedPublicKey);
    console.log('  Match:', derivedPublicKey === CLIENT_WALLET_DATA.publicAddress);
    
    if (derivedPublicKey === CLIENT_WALLET_DATA.publicAddress) {
      console.log('✅ Wallet validation successful - keypair matches!');
      return { isValid: true, keypair };
    } else {
      console.log('❌ Wallet validation failed - keypair mismatch!');
      return { 
        isValid: false, 
        error: `Public key mismatch. Expected: ${CLIENT_WALLET_DATA.publicAddress}, Got: ${derivedPublicKey}` 
      };
    }
    
  } catch (error) {
    console.error('❌ Wallet validation error:', error);
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Unknown validation error' 
    };
  }
}

export function getClientKeypair(): Keypair | null {
  const validation = validateClientWallet();
  return validation.isValid ? validation.keypair! : null;
}

export function getClientPublicKey(): PublicKey | null {
  try {
    return new PublicKey(CLIENT_WALLET_DATA.publicAddress);
  } catch (error) {
    console.error('Invalid public key format:', error);
    return null;
  }
}

// Safe balance checking
export async function checkClientWalletBalance(): Promise<number> {
  try {
    const response = await fetch('https://api.mainnet-beta.solana.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [CLIENT_WALLET_DATA.publicAddress]
      })
    });
    
    const data = await response.json();
    const balance = (data.result?.value || 0) / 1000000000; // Convert to SOL
    
    console.log(`💰 Client wallet balance: ${balance} SOL`);
    return balance;
    
  } catch (error) {
    console.error('Failed to fetch balance:', error);
    return 0;
  }
}