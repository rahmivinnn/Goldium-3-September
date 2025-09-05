// Check if GOLDIUM token has migrated from pump.fun to Raydium
import { Connection, PublicKey } from '@solana/web3.js';

const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(SOLANA_RPC_URL);

// Raydium program IDs
const RAYDIUM_AMM_PROGRAM_ID = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
const RAYDIUM_LIQUIDITY_POOL_V4 = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';

async function checkTokenMigration() {
  console.log('🔍 Checking GOLDIUM token migration status...');
  console.log('=' .repeat(60));
  
  try {
    // Check if token exists and get basic info
    const tokenMint = new PublicKey(GOLDIUM_TOKEN_ADDRESS);
    const tokenInfo = await connection.getAccountInfo(tokenMint);
    
    if (!tokenInfo) {
      console.log('❌ Token not found on Solana mainnet');
      return;
    }
    
    console.log('✅ Token found on Solana mainnet');
    console.log(`   • Token Address: ${GOLDIUM_TOKEN_ADDRESS}`);
    console.log(`   • Account Owner: ${tokenInfo.owner.toString()}`);
    
    // Check for Raydium liquidity pools
    await checkRaydiumPools();
    
    // Check for recent transactions
    await checkRecentTransactions();
    
    // Test Raydium API
    await testRaydiumAPI();
    
  } catch (error) {
    console.error('❌ Error checking token migration:', error.message);
  }
}

async function checkRaydiumPools() {
  console.log('\n🏊 Checking Raydium liquidity pools...');
  console.log('-' .repeat(40));
  
  try {
    // Search for Raydium pools containing GOLDIUM
    const raydiumProgramAccounts = await connection.getProgramAccounts(
      new PublicKey(RAYDIUM_AMM_PROGRAM_ID),
      {
        filters: [
          {
            memcmp: {
              offset: 400, // Approximate offset for token mints in Raydium pool
              bytes: GOLDIUM_TOKEN_ADDRESS
            }
          }
        ]
      }
    );
    
    if (raydiumProgramAccounts.length > 0) {
      console.log(`✅ Found ${raydiumProgramAccounts.length} Raydium pool(s) for GOLDIUM`);
      raydiumProgramAccounts.forEach((account, index) => {
        console.log(`   Pool ${index + 1}: ${account.pubkey.toString()}`);
      });
    } else {
      console.log('⚠️ No Raydium pools found for GOLDIUM token');
      console.log('   This suggests the token may still be on pump.fun bonding curve');
    }
    
  } catch (error) {
    console.log('❌ Error checking Raydium pools:', error.message);
  }
}

async function checkRecentTransactions() {
  console.log('\n📋 Checking recent transactions...');
  console.log('-' .repeat(40));
  
  try {
    const signatures = await connection.getSignaturesForAddress(
      new PublicKey(GOLDIUM_TOKEN_ADDRESS),
      { limit: 10 }
    );
    
    console.log(`Found ${signatures.length} recent transactions`);
    
    for (let i = 0; i < Math.min(3, signatures.length); i++) {
      const sig = signatures[i];
      console.log(`\n   Transaction ${i + 1}: ${sig.signature}`);
      console.log(`   • Time: ${new Date(sig.blockTime * 1000).toLocaleString()}`);
      console.log(`   • Status: ${sig.err ? 'Failed' : 'Success'}`);
      
      // Get transaction details
      try {
        const txDetails = await connection.getTransaction(sig.signature, {
          maxSupportedTransactionVersion: 0
        });
        
        if (txDetails && txDetails.meta && txDetails.meta.logMessages) {
          const logs = txDetails.meta.logMessages;
          const hasRaydium = logs.some(log => log.includes('Raydium') || log.includes('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'));
          const hasPumpFun = logs.some(log => log.includes('pump') || log.includes('6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P'));
          
          if (hasRaydium) {
            console.log('   • 🏊 Contains Raydium interaction');
          }
          if (hasPumpFun) {
            console.log('   • 🚀 Contains pump.fun interaction');
          }
        }
      } catch (txError) {
        console.log('   • Could not fetch transaction details');
      }
    }
    
  } catch (error) {
    console.log('❌ Error checking recent transactions:', error.message);
  }
}

async function testRaydiumAPI() {
  console.log('\n🧪 Testing Raydium API...');
  console.log('-' .repeat(40));
  
  try {
    // Test Raydium quote API
    const testAmount = 0.001; // 0.001 SOL
    const amountInLamports = Math.floor(testAmount * 1e9);
    
    const raydiumQuoteUrl = `https://transaction-v1.raydium.io/compute/swap-base-in?inputMint=So11111111111111111111111111111111111111112&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${amountInLamports}&slippageBps=50&txVersion=V0`;
    
    console.log(`🔍 Testing Raydium quote for ${testAmount} SOL...`);
    
    const response = await fetch(raydiumQuoteUrl);
    const data = await response.json();
    
    console.log('📋 Raydium API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.success && data.data) {
      console.log('✅ Raydium API successful!');
      console.log(`   • Can swap ${testAmount} SOL for GOLDIUM on Raydium`);
    } else {
      console.log('❌ Raydium API failed or no liquidity');
      console.log('   • Token may not be available on Raydium yet');
    }
    
  } catch (error) {
    console.log('❌ Raydium API test failed:', error.message);
  }
}

// Alternative: Check pump.fun bonding curve status
async function checkPumpFunStatus() {
  console.log('\n🚀 Checking pump.fun bonding curve status...');
  console.log('-' .repeat(40));
  
  try {
    // pump.fun program ID
    const PUMP_FUN_PROGRAM = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
    
    // Try to find bonding curve account
    const pumpAccounts = await connection.getProgramAccounts(
      new PublicKey(PUMP_FUN_PROGRAM),
      {
        filters: [
          {
            memcmp: {
              offset: 8, // Skip discriminator
              bytes: GOLDIUM_TOKEN_ADDRESS
            }
          }
        ]
      }
    );
    
    if (pumpAccounts.length > 0) {
      console.log('✅ Found pump.fun bonding curve account');
      console.log('   • Token is still on pump.fun or recently migrated');
      
      // Try to decode bonding curve data to check completion status
      const curveAccount = pumpAccounts[0];
      const data = curveAccount.account.data;
      
      // Simple check for completion flag (this is approximate)
      const isCompleted = data[data.length - 1] === 1;
      console.log(`   • Bonding curve completed: ${isCompleted ? 'Yes' : 'No'}`);
      
      if (isCompleted) {
        console.log('   • 🎓 Token has graduated and should be on Raydium');
      } else {
        console.log('   • 📈 Token is still on bonding curve');
      }
    } else {
      console.log('⚠️ No pump.fun bonding curve found');
      console.log('   • Token may have fully migrated to Raydium');
    }
    
  } catch (error) {
    console.log('❌ Error checking pump.fun status:', error.message);
  }
}

// Run all checks
async function runAllChecks() {
  await checkTokenMigration();
  await checkPumpFunStatus();
  
  console.log('\n' + '=' .repeat(60));
  console.log('🎯 RECOMMENDATIONS:');
  console.log('=' .repeat(60));
  console.log('1. If token is on Raydium: Use Raydium API for swaps');
  console.log('2. If token is on pump.fun: Use pump.fun API for swaps');
  console.log('3. If migration is recent: Try both APIs with fallback');
  console.log('4. Monitor migration events for real-time updates');
}

runAllChecks().catch(console.error);