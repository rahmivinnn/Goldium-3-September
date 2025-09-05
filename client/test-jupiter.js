// Simple Jupiter API test for GOLDIUM token
const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
const SOL_MINT = 'So11111111111111111111111111111111111111112';

async function testJupiterAPI() {
  console.log('🧪 Testing Jupiter API for GOLDIUM token...');
  console.log('=' .repeat(50));
  
  try {
    const testAmount = 0.001; // 0.001 SOL
    const amountInLamports = Math.floor(testAmount * 1e9);
    
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${SOL_MINT}&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${amountInLamports}&slippageBps=50`;
    
    console.log(`🔍 Testing quote for ${testAmount} SOL...`);
    console.log(`📡 Quote URL: ${quoteUrl}`);
    
    const response = await fetch(quoteUrl);
    const data = await response.json();
    
    console.log('📋 Raw Jupiter Response:');
    console.log(JSON.stringify(data, null, 2));
    
    if (data.error) {
      console.error(`❌ Jupiter API Error: ${data.error}`);
      console.log(`💡 This might indicate:`);
      console.log(`   • No liquidity available for GOLDIUM`);
      console.log(`   • Token not supported on Jupiter`);
      console.log(`   • Network connectivity issues`);
      console.log(`   • Token might not be tradeable`);
    } else if (data.routePlan && data.routePlan.length > 0) {
      const outputAmount = Number(data.outAmount) / Math.pow(10, 6); // Assuming 6 decimals
      console.log(`✅ Jupiter Quote Success!`);
      console.log(`   • Input: ${testAmount} SOL`);
      console.log(`   • Output: ${outputAmount} GOLDIUM`);
      console.log(`   • Price Impact: ${data.priceImpactPct || 'N/A'}%`);
      console.log(`   • Route Plan: ${data.routePlan.length} steps`);
    } else {
      console.warn(`⚠️ No route found for this swap`);
      console.log(`This indicates no liquidity or trading path available`);
    }
    
  } catch (error) {
    console.error('❌ Jupiter API test failed:', error.message);
  }
}

// Test different amounts
async function testMultipleAmounts() {
  const amounts = [0.001, 0.01, 0.1, 1.0];
  
  for (const amount of amounts) {
    console.log(`\n🔄 Testing ${amount} SOL...`);
    const amountInLamports = Math.floor(amount * 1e9);
    const quoteUrl = `https://quote-api.jup.ag/v6/quote?inputMint=${SOL_MINT}&outputMint=${GOLDIUM_TOKEN_ADDRESS}&amount=${amountInLamports}&slippageBps=50`;
    
    try {
      const response = await fetch(quoteUrl);
      const data = await response.json();
      
      if (data.error) {
        console.log(`❌ ${amount} SOL: ${data.error}`);
      } else if (data.routePlan && data.routePlan.length > 0) {
        const outputAmount = Number(data.outAmount) / Math.pow(10, 6);
        console.log(`✅ ${amount} SOL → ${outputAmount} GOLDIUM`);
      } else {
        console.log(`⚠️ ${amount} SOL: No route found`);
      }
    } catch (error) {
      console.log(`❌ ${amount} SOL: ${error.message}`);
    }
  }
}

// Run tests
async function runAllTests() {
  await testJupiterAPI();
  console.log('\n' + '='.repeat(50));
  console.log('🔄 Testing multiple amounts...');
  await testMultipleAmounts();
}

runAllTests().catch(console.error);