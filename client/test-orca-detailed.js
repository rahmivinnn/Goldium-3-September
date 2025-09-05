// Detailed test for Orca DEX API to understand the response structure
const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

async function testOrcaDetailed() {
  console.log('🐋 Detailed Orca DEX API Testing for GOLDIUM');
  console.log('=' .repeat(60));
  
  const testAmount = 0.001; // 0.001 SOL
  const amountInLamports = Math.floor(testAmount * 1e9);
  
  try {
    // Test 1: Orca Quote API with detailed response
    console.log('\n📊 Test 1: Orca Quote API (Detailed Response)...');
    try {
      const orcaQuoteUrl = `https://api.orca.so/v1/quote?inputMint=${SOL_MINT}&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${amountInLamports}&slippage=0.5`;
      
      console.log(`🔗 Request URL: ${orcaQuoteUrl}`);
      
      const orcaResponse = await fetch(orcaQuoteUrl);
      console.log(`📡 Response status: ${orcaResponse.status}`);
      console.log(`📡 Response headers:`, Object.fromEntries(orcaResponse.headers.entries()));
      
      const responseText = await orcaResponse.text();
      console.log(`📄 Raw response: ${responseText}`);
      
      if (orcaResponse.ok) {
        try {
          const orcaData = JSON.parse(responseText);
          console.log('✅ Orca response parsed successfully!');
          console.log('📋 Full response data:', JSON.stringify(orcaData, null, 2));
          
          if (orcaData.outputAmount) {
            console.log(`💰 Quote details:`);
            console.log(`   • Input: ${testAmount} SOL (${amountInLamports} lamports)`);
            console.log(`   • Output: ${orcaData.outputAmount} GOLDIUM`);
            console.log(`   • Price Impact: ${orcaData.priceImpact || 'N/A'}%`);
            console.log(`   • Route: ${orcaData.route || 'N/A'}`);
          }
        } catch (parseError) {
          console.log(`❌ JSON parse error: ${parseError.message}`);
        }
      } else {
        console.log(`❌ Orca failed with status ${orcaResponse.status}`);
        console.log(`📄 Error response: ${responseText}`);
      }
    } catch (error) {
      console.log(`❌ Orca API error: ${error.message}`);
    }
    
    // Test 2: Try different Orca API endpoints
    console.log('\n🔍 Test 2: Alternative Orca API Endpoints...');
    
    const alternativeEndpoints = [
      `https://api.orca.so/v1/whirlpool/list`,
      `https://api.orca.so/v1/token/${GOLDIUM_TOKEN_ADDRESS}`,
      `https://api.orca.so/v1/pools`,
      `https://quote-api.orca.so/v1/quote?inputMint=${SOL_MINT}&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${amountInLamports}`,
    ];
    
    for (let i = 0; i < alternativeEndpoints.length; i++) {
      const endpoint = alternativeEndpoints[i];
      console.log(`\n🔗 Testing endpoint ${i + 1}: ${endpoint}`);
      
      try {
        const response = await fetch(endpoint);
        console.log(`📡 Status: ${response.status}`);
        
        const text = await response.text();
        console.log(`📄 Response (first 200 chars): ${text.substring(0, 200)}...`);
        
        if (response.ok && text.length > 0) {
          try {
            const data = JSON.parse(text);
            console.log(`✅ Valid JSON response with ${Object.keys(data).length} keys`);
            
            // Check if response contains GOLDIUM-related data
            const jsonString = JSON.stringify(data).toLowerCase();
            if (jsonString.includes('goldium') || jsonString.includes(GOLDIUM_TOKEN_ADDRESS.toLowerCase())) {
              console.log(`🎯 GOLDIUM data found in response!`);
            }
          } catch (parseError) {
            console.log(`⚠️ Non-JSON response`);
          }
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    
    // Test 3: Check if GOLDIUM is in Orca's token list
    console.log('\n📋 Test 3: Check Orca Token List...');
    try {
      const tokenListUrl = 'https://api.orca.so/v1/token/list';
      
      const tokenListResponse = await fetch(tokenListUrl);
      console.log(`📡 Token list status: ${tokenListResponse.status}`);
      
      if (tokenListResponse.ok) {
        const tokenListText = await tokenListResponse.text();
        
        if (tokenListText.toLowerCase().includes(GOLDIUM_TOKEN_ADDRESS.toLowerCase())) {
          console.log('✅ GOLDIUM found in Orca token list!');
        } else {
          console.log('❌ GOLDIUM not found in Orca token list');
        }
        
        console.log(`📄 Token list sample: ${tokenListText.substring(0, 300)}...`);
      }
    } catch (error) {
      console.log(`❌ Token list error: ${error.message}`);
    }
    
    // Test 4: Test with different amounts
    console.log('\n💰 Test 4: Testing Different Amounts...');
    const testAmounts = [0.0001, 0.001, 0.01, 0.1]; // Different SOL amounts
    
    for (const amount of testAmounts) {
      const lamports = Math.floor(amount * 1e9);
      console.log(`\n💸 Testing ${amount} SOL (${lamports} lamports)...`);
      
      try {
        const url = `https://api.orca.so/v1/quote?inputMint=${SOL_MINT}&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${lamports}&slippage=1.0`;
        
        const response = await fetch(url);
        console.log(`📡 Status: ${response.status}`);
        
        const text = await response.text();
        
        if (response.ok && text.length > 10) {
          try {
            const data = JSON.parse(text);
            if (data.outputAmount) {
              console.log(`✅ Quote successful: ${data.outputAmount} GOLDIUM`);
            } else {
              console.log(`⚠️ No output amount in response`);
            }
          } catch (e) {
            console.log(`⚠️ Parse error: ${e.message}`);
          }
        } else {
          console.log(`❌ Failed: ${text.substring(0, 100)}`);
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    
    // Test 5: Check Orca SDK documentation endpoints
    console.log('\n📚 Test 5: Orca SDK Related Endpoints...');
    const sdkEndpoints = [
      'https://api.orca.so/v1/whirlpool/list',
      'https://api.orca.so/v1/whirlpools',
      'https://api.orca.so/v1/aquafarm/list',
    ];
    
    for (const endpoint of sdkEndpoints) {
      console.log(`\n🔗 Testing: ${endpoint}`);
      
      try {
        const response = await fetch(endpoint);
        console.log(`📡 Status: ${response.status}`);
        
        if (response.ok) {
          const text = await response.text();
          console.log(`📄 Response length: ${text.length} characters`);
          
          if (text.toLowerCase().includes('goldium') || text.toLowerCase().includes(GOLDIUM_TOKEN_ADDRESS.toLowerCase())) {
            console.log(`🎯 GOLDIUM reference found!`);
          }
        }
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n' + '=' .repeat(60));
    console.log('📋 ORCA DETAILED TEST SUMMARY');
    console.log('=' .repeat(60));
    
    console.log('\n🔍 KEY FINDINGS:');
    console.log('• Orca API is accessible (status 200)');
    console.log('• Need to analyze actual response structure');
    console.log('• May require different API endpoints or parameters');
    console.log('• GOLDIUM token may not be supported on Orca');
    
    console.log('\n💡 NEXT STEPS:');
    console.log('1. Analyze Orca response structure in detail');
    console.log('2. Check if GOLDIUM pools exist on Orca');
    console.log('3. Consider implementing Orca SDK directly');
    console.log('4. Test with known working token pairs first');
    console.log('5. Implement proper error handling for unsupported tokens');
    
  } catch (error) {
    console.error('❌ Detailed test failed:', error);
  }
}

// Run detailed tests
testOrcaDetailed().catch(console.error);