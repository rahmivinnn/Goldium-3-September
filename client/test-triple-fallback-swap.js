// Test script for GOLDIUM swap with triple fallback: Jupiter → pump.fun → Raydium
const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

async function testTripleFallbackSwap() {
  console.log('🚀 Testing GOLDIUM Triple Fallback Swap Strategy');
  console.log('=' .repeat(70));
  console.log('Strategy: Jupiter → pump.fun → Raydium');
  console.log('=' .repeat(70));
  
  try {
    // Test 1: Jupiter API (expected to fail)
    console.log('\n🪐 Test 1: Testing Jupiter API...');
    let jupiterWorking = false;
    try {
      const jupiterQuoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${SOL_MINT}&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=1000000&slippageBps=50`;
      
      const response = await fetch(jupiterQuoteUrl);
      const data = await response.json();
      
      if (data.error) {
        console.log(`❌ Jupiter failed as expected: ${data.error}`);
        console.log('   ✅ Will fallback to pump.fun');
      } else {
        console.log(`✅ Jupiter quote successful (unexpected):`, data);
        jupiterWorking = true;
      }
    } catch (error) {
      console.log(`❌ Jupiter API error: ${error.message}`);
    }
    
    // Test 2: pump.fun API
    console.log('\n🚀 Test 2: Testing pump.fun API...');
    let pumpFunWorking = false;
    try {
      const coinInfoResponse = await fetch(`https://frontend-api.pump.fun/coins/${GOLDIUM_TOKEN_ADDRESS}`);
      console.log(`📡 pump.fun response status: ${coinInfoResponse.status}`);
      
      if (coinInfoResponse.ok) {
        const coinInfo = await coinInfoResponse.json();
        console.log('✅ pump.fun coin info available:');
        console.log(`   • Name: ${coinInfo.name || 'N/A'}`);
        console.log(`   • Symbol: ${coinInfo.symbol || 'N/A'}`);
        console.log(`   • Complete: ${coinInfo.complete || false}`);
        
        if (!coinInfo.complete) {
          console.log('   ✅ Token is still on bonding curve - pump.fun should work');
          pumpFunWorking = true;
        } else {
          console.log('   ⚠️ Token has graduated - may need Raydium instead');
        }
      } else {
        console.log(`❌ pump.fun coin info failed: ${coinInfoResponse.status}`);
        console.log('   ✅ Will fallback to Raydium');
      }
    } catch (error) {
      console.log(`❌ pump.fun API error: ${error.message}`);
    }
    
    // Test 3: Raydium API (our final fallback)
    console.log('\n🏊 Test 3: Testing Raydium API...');
    let raydiumWorking = false;
    
    // Test 3a: Check if GOLDIUM pools exist on Raydium
    try {
      console.log('🔍 Checking GOLDIUM pools on Raydium...');
      const poolsUrl = `https://api-v3.raydium.io/pools/info/mint?mint1=${GOLDIUM_TOKEN_ADDRESS}&poolType=all&poolSortField=default&sortType=desc&pageSize=10&page=1`;
      
      const poolsResponse = await fetch(poolsUrl);
      const poolsData = await poolsResponse.json();
      
      console.log(`📡 Raydium pools response status: ${poolsResponse.status}`);
      
      if (poolsData.success && poolsData.data && poolsData.data.length > 0) {
        console.log(`✅ Found ${poolsData.data.length} GOLDIUM pools on Raydium:`);
        poolsData.data.forEach((pool, index) => {
          console.log(`   ${index + 1}. Pool ID: ${pool.id}`);
          console.log(`      • ${pool.mintA.symbol}/${pool.mintB.symbol}`);
          console.log(`      • TVL: $${pool.tvl?.toLocaleString() || 'N/A'}`);
        });
        raydiumWorking = true;
      } else {
        console.log('❌ No GOLDIUM pools found on Raydium');
      }
    } catch (error) {
      console.log(`❌ Raydium pools check error: ${error.message}`);
    }
    
    // Test 3b: Test Raydium swap quote
    if (raydiumWorking) {
      try {
        console.log('\n🔍 Testing Raydium swap quote...');
        const testAmount = 0.001; // 0.001 SOL
        const amountInLamports = Math.floor(testAmount * 1e9);
        
        const quoteUrl = `https://transaction-v1.raydium.io/compute/swap-base-in?inputMint=${SOL_MINT}&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${amountInLamports}&slippageBps=100&txVersion=V0`;
        
        const quoteResponse = await fetch(quoteUrl);
        const quoteData = await quoteResponse.json();
        
        console.log(`📡 Raydium quote response status: ${quoteResponse.status}`);
        
        if (quoteData.success && quoteData.data) {
          console.log('✅ Raydium swap quote successful!');
          console.log(`   • Input: ${testAmount} SOL`);
          console.log(`   • Output: ${quoteData.data.outputAmount || 'N/A'} GOLDIUM`);
          console.log(`   • Price Impact: ${quoteData.data.priceImpact || 'N/A'}%`);
          console.log(`   • Transaction ready: ${!!quoteData.data.swapTransaction}`);
        } else {
          console.log(`❌ Raydium swap quote failed: ${quoteData.msg || 'Unknown error'}`);
          raydiumWorking = false;
        }
      } catch (error) {
        console.log(`❌ Raydium quote error: ${error.message}`);
        raydiumWorking = false;
      }
    }
    
    // Test 4: Test Raydium price API
    console.log('\n💰 Test 4: Testing Raydium price API...');
    try {
      const priceUrl = `https://api-v3.raydium.io/mint/price?mints=${GOLDIUM_TOKEN_ADDRESS}`;
      
      const priceResponse = await fetch(priceUrl);
      const priceData = await priceResponse.json();
      
      console.log(`📡 Raydium price response status: ${priceResponse.status}`);
      
      if (priceData.success && priceData.data && priceData.data[GOLDIUM_TOKEN_ADDRESS]) {
        const price = priceData.data[GOLDIUM_TOKEN_ADDRESS];
        console.log(`✅ GOLDIUM price on Raydium: $${price}`);
      } else {
        console.log('❌ GOLDIUM price not available on Raydium');
      }
    } catch (error) {
      console.log(`❌ Raydium price error: ${error.message}`);
    }
    
    // Summary and Strategy Recommendation
    console.log('\n' + '=' .repeat(70));
    console.log('📋 TRIPLE FALLBACK SWAP TEST SUMMARY');
    console.log('=' .repeat(70));
    
    console.log('\n🎯 PLATFORM STATUS:');
    console.log(`1. Jupiter DEX: ${jupiterWorking ? '✅ Working' : '❌ Not available (expected)'}`);
    console.log(`2. pump.fun: ${pumpFunWorking ? '✅ Working' : '❌ Not available'}`);
    console.log(`3. Raydium DEX: ${raydiumWorking ? '✅ Working' : '❌ Not available'}`);
    
    console.log('\n🚀 SWAP STRATEGY RECOMMENDATION:');
    if (jupiterWorking) {
      console.log('✅ Use Jupiter DEX (primary)');
    } else if (pumpFunWorking) {
      console.log('✅ Use pump.fun (fallback #1)');
    } else if (raydiumWorking) {
      console.log('✅ Use Raydium DEX (fallback #2)');
    } else {
      console.log('❌ No working swap platform found');
      console.log('💡 Recommendations:');
      console.log('   • Check if token has migrated to other DEXs');
      console.log('   • Wait for pump.fun API to recover');
      console.log('   • Consider manual swap on DEX websites');
    }
    
    console.log('\n💡 IMPLEMENTATION STATUS:');
    console.log('✅ Triple fallback implemented in gold-token-service.ts:');
    console.log('   1. Jupiter DEX (primary)');
    console.log('   2. pump.fun (fallback #1)');
    console.log('   3. Raydium DEX (fallback #2)');
    console.log('✅ Comprehensive error handling for all platforms');
    console.log('✅ Automatic platform detection and routing');
    
    const workingPlatforms = [jupiterWorking, pumpFunWorking, raydiumWorking].filter(Boolean).length;
    console.log(`\n📊 AVAILABILITY SCORE: ${workingPlatforms}/3 platforms working`);
    
    if (workingPlatforms > 0) {
      console.log('🎉 GOLDIUM swaps should work with current implementation!');
    } else {
      console.log('⚠️ No platforms currently available - swaps may fail');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testTripleFallbackSwap().catch(console.error);