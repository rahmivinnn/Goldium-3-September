// Direct test for pump.fun API endpoints
const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';

async function testPumpFunDirect() {
  console.log('🚀 Testing pump.fun Direct API Endpoints');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Check pump.fun bonding curve API
    console.log('\n📊 Test 1: Testing pump.fun bonding curve API...');
    try {
      const bondingCurveUrl = `https://frontend-api.pump.fun/coins/${GOLDIUM_TOKEN_ADDRESS}`;
      console.log(`🔍 Fetching: ${bondingCurveUrl}`);
      
      const response = await fetch(bondingCurveUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      console.log(`📡 Response status: ${response.status}`);
      console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ pump.fun bonding curve data:', JSON.stringify(data, null, 2));
        
        if (data.complete === false) {
          console.log('🎯 Token is still on bonding curve - swaps should work!');
        } else {
          console.log('⚠️ Token has graduated from bonding curve');
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ pump.fun API failed: ${response.status}`);
        console.log(`❌ Error response: ${errorText.substring(0, 500)}`);
      }
    } catch (error) {
      console.log(`❌ pump.fun bonding curve test failed:`, error.message);
    }
    
    // Test 2: Test pump.fun trade API with different endpoints
    console.log('\n💰 Test 2: Testing pump.fun trade endpoints...');
    
    const tradeEndpoints = [
      'https://pumpportal.fun/api/trade-local',
      'https://frontend-api.pump.fun/trade',
      'https://api.pump.fun/trade'
    ];
    
    for (const endpoint of tradeEndpoints) {
      console.log(`\n🔍 Testing endpoint: ${endpoint}`);
      try {
        const testPayload = {
          publicKey: 'So11111111111111111111111111111111111111112', // Dummy key
          action: 'buy',
          mint: GOLDIUM_TOKEN_ADDRESS,
          amount: 1000000, // 0.001 SOL in lamports
          denominatedInSol: 'true',
          slippage: 10,
          priorityFee: 0.0005,
          pool: 'pump'
        };
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          body: JSON.stringify(testPayload)
        });
        
        console.log(`📡 Response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${endpoint} successful:`);
          console.log(`   • Has transaction: ${!!data.transaction}`);
          console.log(`   • Output amount: ${data.outputAmount || 'N/A'}`);
          console.log(`   • Data keys: ${Object.keys(data).join(', ')}`);
        } else {
          const errorText = await response.text();
          console.log(`❌ ${endpoint} failed: ${response.status}`);
          console.log(`   Error: ${errorText.substring(0, 200)}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint} error:`, error.message);
      }
    }
    
    // Test 3: Test alternative pump.fun APIs
    console.log('\n🔄 Test 3: Testing alternative pump.fun APIs...');
    
    const alternativeApis = [
      `https://frontend-api.pump.fun/coins/king-of-memes/${GOLDIUM_TOKEN_ADDRESS}`,
      `https://api.pump.fun/coins/${GOLDIUM_TOKEN_ADDRESS}`,
      `https://pump.fun/api/coins/${GOLDIUM_TOKEN_ADDRESS}`
    ];
    
    for (const api of alternativeApis) {
      console.log(`\n🔍 Testing API: ${api}`);
      try {
        const response = await fetch(api, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        console.log(`📡 Response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ ${api} successful:`);
          console.log(`   Data: ${JSON.stringify(data).substring(0, 200)}...`);
        } else {
          console.log(`❌ ${api} failed: ${response.status}`);
        }
      } catch (error) {
        console.log(`❌ ${api} error:`, error.message);
      }
    }
    
    // Test 4: Test Raydium API with different parameters
    console.log('\n🏊 Test 4: Testing Raydium API variations...');
    
    const raydiumEndpoints = [
      `https://api-v3.raydium.io/pools/info/mint?mint1=${GOLDIUM_TOKEN_ADDRESS}&poolType=all&poolSortField=default&sortType=desc&pageSize=10&page=1`,
      `https://api-v3.raydium.io/mint/price?mints=${GOLDIUM_TOKEN_ADDRESS}`,
      `https://transaction-v1.raydium.io/compute/swap-base-in?inputMint=So11111111111111111111111111111111111111112&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=1000000&slippageBps=50&txVersion=V0`
    ];
    
    for (const endpoint of raydiumEndpoints) {
      console.log(`\n🔍 Testing Raydium: ${endpoint.split('?')[0]}`);
      try {
        const response = await fetch(endpoint);
        console.log(`📡 Response status: ${response.status}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Raydium API successful:`);
          console.log(`   Success: ${data.success}`);
          console.log(`   Data available: ${!!data.data}`);
          if (data.data && Array.isArray(data.data)) {
            console.log(`   Results count: ${data.data.length}`);
          }
        } else {
          const errorText = await response.text();
          console.log(`❌ Raydium API failed: ${response.status}`);
          console.log(`   Error: ${errorText.substring(0, 200)}`);
        }
      } catch (error) {
        console.log(`❌ Raydium API error:`, error.message);
      }
    }
    
    // Test 5: Test Orca API
    console.log('\n🐋 Test 5: Testing Orca API...');
    try {
      const orcaQuoteUrl = `https://quote-api.orca.so/v1/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=1000000&slippageBps=100`;
      
      const response = await fetch(orcaQuoteUrl);
      console.log(`📡 Orca response status: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Orca API successful:', data);
      } else {
        const errorText = await response.text();
        console.log(`❌ Orca API failed: ${response.status}`);
        console.log(`   Error: ${errorText.substring(0, 200)}`);
      }
    } catch (error) {
      console.log(`❌ Orca API error:`, error.message);
    }
    
    // Summary
    console.log('\n' + '=' .repeat(60));
    console.log('📋 PUMP.FUN DIRECT API TEST SUMMARY');
    console.log('=' .repeat(60));
    console.log('\n🎯 FINDINGS:');
    console.log('1. 🔍 Tested multiple pump.fun API endpoints');
    console.log('2. 🔍 Tested Raydium API variations');
    console.log('3. 🔍 Tested Orca as alternative DEX');
    console.log('4. 📊 Analyzed API response patterns');
    console.log('\n💡 NEXT STEPS:');
    console.log('✅ Identify working API endpoint');
    console.log('✅ Implement proper error handling');
    console.log('✅ Update swap service with working endpoint');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run tests
testPumpFunDirect().catch(console.error);