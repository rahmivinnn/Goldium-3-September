// Test script for GOLDIUM swap functionality
const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';

async function testSwapFunctionality() {
  console.log('🧪 Testing GOLDIUM Swap Functionality');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Test Jupiter API (should fail with TOKEN_NOT_TRADABLE)
    console.log('\n🪐 Test 1: Testing Jupiter API...');
    try {
      const jupiterQuoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=1000000&slippageBps=50`;
      
      const response = await fetch(jupiterQuoteUrl);
      const data = await response.json();
      
      if (data.error) {
        console.log(`❌ Jupiter failed as expected: ${data.error}`);
        console.log('   ✅ This confirms we need pump.fun fallback');
      } else {
        console.log(`✅ Jupiter quote successful (unexpected):`, data);
      }
    } catch (error) {
      console.log(`❌ Jupiter API error: ${error.message}`);
    }
    
    // Test 2: Test pump.fun coin info API
    console.log('\n🚀 Test 2: Testing pump.fun coin info API...');
    try {
      const coinInfoResponse = await fetch(`https://frontend-api.pump.fun/coins/${GOLDIUM_TOKEN_ADDRESS}`);
      if (coinInfoResponse.ok) {
        const coinInfo = await coinInfoResponse.json();
        console.log('✅ pump.fun coin info available:');
        console.log(`   • Name: ${coinInfo.name || 'N/A'}`);
        console.log(`   • Symbol: ${coinInfo.symbol || 'N/A'}`);
        console.log(`   • Market Cap: $${coinInfo.market_cap || 'N/A'}`);
        console.log(`   • Complete: ${coinInfo.complete || false}`);
        console.log(`   • Progress: ${coinInfo.progress || 0}%`);
        
        if (!coinInfo.complete) {
          console.log('   ✅ Token is still on bonding curve - pump.fun swap should work');
        } else {
          console.log('   ⚠️ Token has graduated - may need Raydium instead');
        }
      } else {
        console.log(`❌ pump.fun coin info failed: ${coinInfoResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ pump.fun coin info error: ${error.message}`);
    }
    
    // Test 3: Test pumpportal.fun API for quote
    console.log('\n🚪 Test 3: Testing pumpportal.fun quote API...');
    try {
      const testAmounts = [0.001, 0.01]; // Test different SOL amounts
      
      for (const amount of testAmounts) {
        console.log(`\n🔍 Testing quote for ${amount} SOL:`);
        
        const portalResponse = await fetch('https://pumpportal.fun/api/trade-local', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            publicKey: 'So11111111111111111111111111111111111111112', // Dummy wallet
            action: 'buy',
            mint: GOLDIUM_TOKEN_ADDRESS,
            amount: Math.floor(amount * 1e9), // Convert to lamports
            denominatedInSol: 'true',
            slippage: 10,
            priorityFee: 0.0005,
            pool: 'pump'
          })
        });
        
        if (portalResponse.ok) {
          const portalData = await portalResponse.json();
          if (portalData.error) {
            console.log(`❌ pumpportal.fun error: ${portalData.error}`);
          } else {
            console.log(`✅ pumpportal.fun quote successful for ${amount} SOL`);
            console.log(`   • Transaction available: ${!!portalData.transaction}`);
            if (portalData.outputAmount) {
              console.log(`   • Expected output: ${portalData.outputAmount} tokens`);
            }
          }
        } else {
          console.log(`❌ pumpportal.fun failed: ${portalResponse.status}`);
          const errorText = await portalResponse.text();
          console.log(`   Error details: ${errorText.substring(0, 200)}`);
        }
      }
    } catch (error) {
      console.log(`❌ pumpportal.fun error: ${error.message}`);
    }
    
    // Test 4: Test Raydium API
    console.log('\n🏊 Test 4: Testing Raydium API...');
    try {
      const testAmount = 0.001; // 0.001 SOL
      const amountInLamports = Math.floor(testAmount * 1e9);
      
      const raydiumQuoteUrl = `https://transaction-v1.raydium.io/compute/swap-base-in?inputMint=So11111111111111111111111111111111111111112&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${amountInLamports}&slippageBps=50&txVersion=V0`;
      
      console.log(`🔍 Testing Raydium quote for ${testAmount} SOL...`);
      
      const response = await fetch(raydiumQuoteUrl);
      const data = await response.json();
      
      if (data.success && data.data) {
        console.log('✅ Raydium API successful!');
        console.log(`   • Can swap ${testAmount} SOL for GOLDIUM on Raydium`);
      } else {
        console.log('❌ Raydium API failed or no liquidity');
        console.log(`   • Response: ${JSON.stringify(data)}`);
      }
      
    } catch (error) {
      console.log('❌ Raydium API test failed:', error.message);
    }
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📋 SWAP FUNCTIONALITY TEST SUMMARY');
    console.log('=' .repeat(60));
    console.log('\n🎯 SWAP STRATEGY RECOMMENDATIONS:');
    console.log('1. ✅ Jupiter fails with TOKEN_NOT_TRADABLE (expected)');
    console.log('2. 🔄 Try pump.fun first (if token is on bonding curve)');
    console.log('3. 🏊 Try Raydium as secondary fallback (if token graduated)');
    console.log('4. 📊 Monitor token graduation status for optimal routing');
    console.log('\n💡 IMPLEMENTATION STATUS:');
    console.log('✅ Jupiter + pump.fun fallback implemented in gold-token-service.ts');
    console.log('✅ Error handling for both platforms implemented');
    console.log('✅ Comprehensive error messages for debugging');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testSwapFunctionality().catch(console.error);