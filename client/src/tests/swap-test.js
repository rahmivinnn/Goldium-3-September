/**
 * GOLDIUM Swap Test Script
 * 
 * This script helps test and debug SOL to GOLDIUM swaps using Jupiter DEX
 * Run with: node src/tests/swap-test.js
 */

const { Connection, PublicKey, Keypair } = require('@solana/web3.js');
const { getAssociatedTokenAddress } = require('@solana/spl-token');

// Configuration
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';
const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
const TEST_WALLET_ADDRESS = '7L9zh9uCS5wbukClplphwLawZVnDRayKof6BhFr7VNzJ';

class SwapTester {
  constructor() {
    this.connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    this.goldiumMint = new PublicKey(GOLDIUM_TOKEN_ADDRESS);
    this.testWallet = new PublicKey(TEST_WALLET_ADDRESS);
  }

  // Test 1: Check wallet balances
  async testWalletBalances() {
    console.log('\n🧪 Test 1: Checking Wallet Balances');
    console.log('=' .repeat(50));
    
    try {
      // SOL balance
      const solBalance = await this.connection.getBalance(this.testWallet);
      console.log(`💰 SOL Balance: ${solBalance / 1e9} SOL`);
      
      // GOLDIUM token account
      const goldiumATA = await getAssociatedTokenAddress(
        this.goldiumMint,
        this.testWallet
      );
      
      try {
        const tokenAccount = await this.connection.getTokenAccountBalance(goldiumATA);
        console.log(`🥇 GOLDIUM Balance: ${tokenAccount.value.uiAmount || 0} GOLD`);
      } catch (error) {
        console.log(`🥇 GOLDIUM Balance: 0 GOLD (No token account found)`);
      }
      
    } catch (error) {
      console.error('❌ Balance check failed:', error.message);
    }
  }

  // Test 2: Check Jupiter API availability
  async testJupiterAPI() {
    console.log('\n🧪 Test 2: Testing Jupiter API');
    console.log('=' .repeat(50));
    
    try {
      const testAmount = 0.001; // 0.001 SOL
      const amountInLamports = Math.floor(testAmount * 1e9);
      
      const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${amountInLamports}&slippageBps=50`;
      
      console.log(`🔍 Testing quote for ${testAmount} SOL...`);
      
      const response = await fetch(quoteUrl);
      const data = await response.json();
      
      if (data.error) {
        console.error(`❌ Jupiter API Error: ${data.error}`);
        console.log(`💡 This might indicate:`);
        console.log(`   • No liquidity available for GOLDIUM`);
        console.log(`   • Token not supported on Jupiter`);
        console.log(`   • Network connectivity issues`);
      } else {
        const outputAmount = Number(data.outAmount) / Math.pow(10, 6); // Assuming 6 decimals
        console.log(`✅ Jupiter Quote Success!`);
        console.log(`   • Input: ${testAmount} SOL`);
        console.log(`   • Output: ${outputAmount} GOLDIUM`);
        console.log(`   • Price Impact: ${data.priceImpactPct || 'N/A'}%`);
      }
      
    } catch (error) {
      console.error('❌ Jupiter API test failed:', error.message);
    }
  }

  // Test 3: Verify transaction details
  async testTransactionVerification(signature) {
    console.log('\n🧪 Test 3: Transaction Verification');
    console.log('=' .repeat(50));
    
    if (!signature) {
      console.log('⚠️ No transaction signature provided');
      console.log('💡 Use: node swap-test.js verify <signature>');
      return;
    }
    
    try {
      console.log(`🔍 Analyzing transaction: ${signature}`);
      
      const txDetails = await this.connection.getTransaction(signature, {
        commitment: 'confirmed',
        maxSupportedTransactionVersion: 0
      });
      
      if (!txDetails) {
        console.error('❌ Transaction not found');
        return;
      }
      
      console.log(`✅ Transaction found!`);
      console.log(`   • Slot: ${txDetails.slot}`);
      console.log(`   • Block Time: ${new Date(txDetails.blockTime * 1000).toISOString()}`);
      console.log(`   • Success: ${txDetails.meta?.err ? 'Failed' : 'Success'}`);
      
      // Analyze balance changes
      if (txDetails.meta?.preBalances && txDetails.meta?.postBalances) {
        console.log('\n💰 SOL Balance Changes:');
        txDetails.meta.preBalances.forEach((preBalance, index) => {
          const postBalance = txDetails.meta.postBalances[index];
          const change = (postBalance - preBalance) / 1e9;
          if (Math.abs(change) > 0.0001) {
            console.log(`   • Account ${index}: ${change > 0 ? '+' : ''}${change.toFixed(6)} SOL`);
          }
        });
      }
      
      // Analyze token transfers
      if (txDetails.meta?.preTokenBalances && txDetails.meta?.postTokenBalances) {
        console.log('\n🪙 Token Balance Changes:');
        txDetails.meta.postTokenBalances.forEach(postBalance => {
          const preBalance = txDetails.meta.preTokenBalances.find(
            b => b.accountIndex === postBalance.accountIndex
          );
          const preAmount = preBalance ? Number(preBalance.uiTokenAmount.amount) : 0;
          const postAmount = Number(postBalance.uiTokenAmount.amount);
          const change = (postAmount - preAmount) / Math.pow(10, postBalance.uiTokenAmount.decimals);
          
          if (Math.abs(change) > 0.0001) {
            console.log(`   • ${postBalance.mint}: ${change > 0 ? '+' : ''}${change} tokens`);
            if (postBalance.mint === GOLDIUM_TOKEN_ADDRESS) {
              console.log(`     🥇 GOLDIUM tokens ${change > 0 ? 'received' : 'sent'}!`);
            }
          }
        });
      }
      
    } catch (error) {
      console.error('❌ Transaction verification failed:', error.message);
    }
  }

  // Test 4: Check GOLDIUM token info
  async testTokenInfo() {
    console.log('\n🧪 Test 4: GOLDIUM Token Information');
    console.log('=' .repeat(50));
    
    try {
      const mintInfo = await this.connection.getParsedAccountInfo(this.goldiumMint);
      
      if (mintInfo.value?.data?.parsed) {
        const tokenData = mintInfo.value.data.parsed.info;
        console.log(`✅ GOLDIUM Token Details:`);
        console.log(`   • Mint: ${GOLDIUM_TOKEN_ADDRESS}`);
        console.log(`   • Decimals: ${tokenData.decimals}`);
        console.log(`   • Supply: ${Number(tokenData.supply) / Math.pow(10, tokenData.decimals)}`);
        console.log(`   • Mint Authority: ${tokenData.mintAuthority || 'None'}`);
        console.log(`   • Freeze Authority: ${tokenData.freezeAuthority || 'None'}`);
      } else {
        console.error('❌ Could not fetch GOLDIUM token information');
      }
      
    } catch (error) {
      console.error('❌ Token info test failed:', error.message);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 GOLDIUM Swap Debugging Suite');
    console.log('=' .repeat(50));
    
    await this.testWalletBalances();
    await this.testJupiterAPI();
    await this.testTokenInfo();
    
    console.log('\n✅ All tests completed!');
    console.log('\n💡 Usage:');
    console.log('   • node swap-test.js - Run all tests');
    console.log('   • node swap-test.js verify <signature> - Verify specific transaction');
  }
}

// Main execution
async function main() {
  const tester = new SwapTester();
  const args = process.argv.slice(2);
  
  if (args[0] === 'verify' && args[1]) {
    await tester.testTransactionVerification(args[1]);
  } else {
    await tester.runAllTests();
  }
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error.message);
  process.exit(1);
});

// Run the tests
if (require.main === module) {
  main();
}

module.exports = SwapTester;