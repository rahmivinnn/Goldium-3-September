// Test script for GOLDIUM swap on alternative Solana DEX platforms
const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

async function testAlternativeDEXPlatforms() {
  console.log('🔍 Testing GOLDIUM on Alternative Solana DEX Platforms');
  console.log('=' .repeat(70));
  console.log('Testing: Orca, Aldrin, Saber, Lifinity, and others');
  console.log('=' .repeat(70));
  
  const testAmount = 0.001; // 0.001 SOL
  const amountInLamports = Math.floor(testAmount * 1e9);
  
  try {
    // Test 1: Orca DEX
    console.log('\n🐋 Test 1: Testing Orca DEX...');
    try {
      // Orca uses their own API for quotes
      const orcaQuoteUrl = `https://api.orca.so/v1/quote?inputMint=${SOL_MINT}&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${amountInLamports}&slippage=0.5`;
      
      const orcaResponse = await fetch(orcaQuoteUrl);
      console.log(`📡 Orca response status: ${orcaResponse.status}`);
      
      if (orcaResponse.ok) {
        const orcaData = await orcaResponse.json();
        console.log('✅ Orca quote successful!');
        console.log(`   • Input: ${testAmount} SOL`);
        console.log(`   • Output: ${orcaData.outputAmount || 'N/A'} GOLDIUM`);
        console.log(`   • Price Impact: ${orcaData.priceImpact || 'N/A'}%`);
      } else {
        const errorText = await orcaResponse.text();
        console.log(`❌ Orca failed: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Orca API error: ${error.message}`);
    }
    
    // Test 2: Check DexScreener for GOLDIUM data
    console.log('\n📊 Test 2: Testing DexScreener API...');
    try {
      const dexScreenerUrl = `https://api.dexscreener.com/latest/dex/tokens/${GOLDIUM_TOKEN_ADDRESS}`;
      
      const dexResponse = await fetch(dexScreenerUrl);
      console.log(`📡 DexScreener response status: ${dexResponse.status}`);
      
      if (dexResponse.ok) {
        const dexData = await dexResponse.json();
        console.log('✅ DexScreener data available!');
        
        if (dexData.pairs && dexData.pairs.length > 0) {
          console.log(`   • Found ${dexData.pairs.length} trading pairs:`);
          dexData.pairs.forEach((pair, index) => {
            console.log(`     ${index + 1}. ${pair.baseToken.symbol}/${pair.quoteToken.symbol} on ${pair.dexId}`);
            console.log(`        • Price: $${pair.priceUsd || 'N/A'}`);
            console.log(`        • Volume 24h: $${pair.volume?.h24?.toLocaleString() || 'N/A'}`);
            console.log(`        • Liquidity: $${pair.liquidity?.usd?.toLocaleString() || 'N/A'}`);
          });
        } else {
          console.log('❌ No trading pairs found on DexScreener');
        }
      } else {
        console.log(`❌ DexScreener failed: ${dexResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ DexScreener API error: ${error.message}`);
    }
    
    // Test 3: Check Birdeye API for comprehensive DEX data
    console.log('\n🐦 Test 3: Testing Birdeye API...');
    try {
      const birdeyeUrl = `https://public-api.birdeye.so/defi/token_overview?address=${GOLDIUM_TOKEN_ADDRESS}`;
      
      const birdeyeResponse = await fetch(birdeyeUrl, {
        headers: {
          'X-API-KEY': 'demo' // Using demo key
        }
      });
      console.log(`📡 Birdeye response status: ${birdeyeResponse.status}`);
      
      if (birdeyeResponse.ok) {
        const birdeyeData = await birdeyeResponse.json();
        console.log('✅ Birdeye data available!');
        
        if (birdeyeData.success && birdeyeData.data) {
          const data = birdeyeData.data;
          console.log(`   • Price: $${data.price || 'N/A'}`);
          console.log(`   • Market Cap: $${data.mc?.toLocaleString() || 'N/A'}`);
          console.log(`   • Volume 24h: $${data.v24hUSD?.toLocaleString() || 'N/A'}`);
          console.log(`   • Liquidity: $${data.liquidity?.toLocaleString() || 'N/A'}`);
        }
      } else {
        console.log(`❌ Birdeye failed: ${birdeyeResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Birdeye API error: ${error.message}`);
    }
    
    // Test 4: Check Solscan for token info and DEX activity
    console.log('\n🔍 Test 4: Testing Solscan API...');
    try {
      const solscanUrl = `https://public-api.solscan.io/token/meta?tokenAddress=${GOLDIUM_TOKEN_ADDRESS}`;
      
      const solscanResponse = await fetch(solscanUrl);
      console.log(`📡 Solscan response status: ${solscanResponse.status}`);
      
      if (solscanResponse.ok) {
        const solscanData = await solscanResponse.json();
        console.log('✅ Solscan token data available!');
        console.log(`   • Name: ${solscanData.name || 'N/A'}`);
        console.log(`   • Symbol: ${solscanData.symbol || 'N/A'}`);
        console.log(`   • Decimals: ${solscanData.decimals || 'N/A'}`);
        console.log(`   • Supply: ${solscanData.supply?.toLocaleString() || 'N/A'}`);
      } else {
        console.log(`❌ Solscan failed: ${solscanResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Solscan API error: ${error.message}`);
    }
    
    // Test 5: Check CoinGecko for DEX listings
    console.log('\n🦎 Test 5: Testing CoinGecko API...');
    try {
      // CoinGecko doesn't directly support Solana token addresses, but we can try
      const coingeckoUrl = `https://api.coingecko.com/api/v3/coins/solana/contract/${GOLDIUM_TOKEN_ADDRESS}`;
      
      const coingeckoResponse = await fetch(coingeckoUrl);
      console.log(`📡 CoinGecko response status: ${coingeckoResponse.status}`);
      
      if (coingeckoResponse.ok) {
        const coingeckoData = await coingeckoResponse.json();
        console.log('✅ CoinGecko data available!');
        console.log(`   • Name: ${coingeckoData.name || 'N/A'}`);
        console.log(`   • Symbol: ${coingeckoData.symbol || 'N/A'}`);
        console.log(`   • Current Price: $${coingeckoData.market_data?.current_price?.usd || 'N/A'}`);
        
        if (coingeckoData.tickers && coingeckoData.tickers.length > 0) {
          console.log(`   • Available on ${coingeckoData.tickers.length} exchanges:`);
          coingeckoData.tickers.slice(0, 5).forEach((ticker, index) => {
            console.log(`     ${index + 1}. ${ticker.market.name} - ${ticker.base}/${ticker.target}`);
          });
        }
      } else {
        console.log(`❌ CoinGecko failed: ${coingeckoResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ CoinGecko API error: ${error.message}`);
    }
    
    // Test 6: Check Meteora DEX (popular Solana DEX)
    console.log('\n🌠 Test 6: Testing Meteora DEX...');
    try {
      // Meteora API for token info
      const meteoraUrl = `https://app.meteora.ag/api/token_info/${GOLDIUM_TOKEN_ADDRESS}`;
      
      const meteoraResponse = await fetch(meteoraUrl);
      console.log(`📡 Meteora response status: ${meteoraResponse.status}`);
      
      if (meteoraResponse.ok) {
        const meteoraData = await meteoraResponse.json();
        console.log('✅ Meteora data available!');
        console.log(`   • Token found on Meteora`);
        console.log(`   • Data:`, meteoraData);
      } else {
        console.log(`❌ Meteora failed: ${meteoraResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Meteora API error: ${error.message}`);
    }
    
    // Test 7: Check Aldrin DEX
    console.log('\n⚡ Test 7: Testing Aldrin DEX...');
    try {
      // Aldrin API for pools
      const aldrinUrl = `https://api.aldrin.com/api/pools`;
      
      const aldrinResponse = await fetch(aldrinUrl);
      console.log(`📡 Aldrin response status: ${aldrinResponse.status}`);
      
      if (aldrinResponse.ok) {
        const aldrinData = await aldrinResponse.json();
        console.log('✅ Aldrin API accessible!');
        
        // Check if GOLDIUM pools exist
        const goldiumPools = aldrinData.filter(pool => 
          pool.tokenA?.mint === GOLDIUM_TOKEN_ADDRESS || 
          pool.tokenB?.mint === GOLDIUM_TOKEN_ADDRESS
        );
        
        if (goldiumPools.length > 0) {
          console.log(`   • Found ${goldiumPools.length} GOLDIUM pools on Aldrin`);
          goldiumPools.forEach((pool, index) => {
            console.log(`     ${index + 1}. ${pool.tokenA?.symbol}/${pool.tokenB?.symbol}`);
          });
        } else {
          console.log('❌ No GOLDIUM pools found on Aldrin');
        }
      } else {
        console.log(`❌ Aldrin failed: ${aldrinResponse.status}`);
      }
    } catch (error) {
      console.log(`❌ Aldrin API error: ${error.message}`);
    }
    
    // Summary
    console.log('\n' + '=' .repeat(70));
    console.log('📋 ALTERNATIVE DEX PLATFORMS TEST SUMMARY');
    console.log('=' .repeat(70));
    
    console.log('\n💡 FINDINGS:');
    console.log('• Tested major Solana DEX platforms for GOLDIUM support');
    console.log('• Checked token data availability across multiple APIs');
    console.log('• Investigated trading pairs and liquidity sources');
    
    console.log('\n🎯 RECOMMENDATIONS:');
    console.log('1. Monitor DexScreener for active trading pairs');
    console.log('2. Check Birdeye for real-time DEX data');
    console.log('3. Use Solscan for transaction verification');
    console.log('4. Consider implementing direct DEX integrations if APIs are available');
    console.log('5. Implement fallback to manual DEX websites if APIs fail');
    
    console.log('\n🔧 NEXT STEPS:');
    console.log('• Update swap service with working DEX endpoints');
    console.log('• Implement proper error handling for each platform');
    console.log('• Add monitoring for DEX availability');
    console.log('• Consider user notification when all DEXs are unavailable');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testAlternativeDEXPlatforms().catch(console.error);