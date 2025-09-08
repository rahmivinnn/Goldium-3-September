/**
 * GOLDIUM Liquidity Pool Setup Script
 * 
 * Script ini membantu setup liquidity pool untuk token GOLDIUM
 * agar bisa muncul di Solscan DeFi activities dan dapat diperdagangkan
 */

import { Connection, PublicKey } from '@solana/web3.js';

// Konfigurasi
const GOLDIUM_TOKEN_ADDRESS = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
const SOLANA_RPC_URL = 'https://api.mainnet-beta.solana.com';

// Program IDs
const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
const RAYDIUM_LIQUIDITY_POOL_PROGRAM_ID = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
const RAYDIUM_AMM_PROGRAM_ID = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';

class GoldiumLiquiditySetup {
    constructor() {
        this.connection = new Connection(SOLANA_RPC_URL, 'confirmed');
        this.goldiumTokenAddress = new PublicKey(GOLDIUM_TOKEN_ADDRESS);
    }

    /**
     * Cek status token GOLDIUM saat ini
     */
    async checkTokenStatus() {
        console.log('🔍 Checking GOLDIUM token status...');
        
        try {
            // Cek token account info
            const tokenInfo = await this.connection.getAccountInfo(this.goldiumTokenAddress);
            
            if (!tokenInfo) {
                console.log('❌ Token account not found');
                return false;
            }

            console.log('✅ Token account exists');
            console.log('📊 Token Info:');
            console.log(`   - Address: ${GOLDIUM_TOKEN_ADDRESS}`);
            console.log(`   - Owner: ${tokenInfo.owner.toString()}`);
            console.log(`   - Data Length: ${tokenInfo.data.length}`);
            console.log(`   - Lamports: ${tokenInfo.lamports}`);

            return true;
        } catch (error) {
            console.error('❌ Error checking token status:', error.message);
            return false;
        }
    }

    /**
     * Cek existing liquidity pools untuk GOLDIUM
     */
    async checkExistingPools() {
        console.log('\n🏊 Checking existing liquidity pools...');
        
        try {
            // Cek Raydium pools
            const raydiumPools = await this.checkRaydiumPools();
            
            // Cek Orca pools
            const orcaPools = await this.checkOrcaPools();
            
            console.log(`\n📈 Pool Summary:`);
            console.log(`   - Raydium pools: ${raydiumPools.length}`);
            console.log(`   - Orca pools: ${orcaPools.length}`);
            
            return {
                raydium: raydiumPools,
                orca: orcaPools,
                total: raydiumPools.length + orcaPools.length
            };
        } catch (error) {
            console.error('❌ Error checking pools:', error.message);
            return { raydium: [], orca: [], total: 0 };
        }
    }

    /**
     * Cek Raydium pools
     */
    async checkRaydiumPools() {
        try {
            // Query program accounts untuk Raydium
            const accounts = await this.connection.getProgramAccounts(
                new PublicKey(RAYDIUM_LIQUIDITY_POOL_PROGRAM_ID),
                {
                    filters: [
                        {
                            memcmp: {
                                offset: 400, // Offset untuk token mint
                                bytes: GOLDIUM_TOKEN_ADDRESS
                            }
                        }
                    ]
                }
            );

            console.log(`   - Found ${accounts.length} Raydium accounts`);
            return accounts;
        } catch (error) {
            console.log('   - No Raydium pools found or error:', error.message);
            return [];
        }
    }

    /**
     * Cek Orca pools
     */
    async checkOrcaPools() {
        try {
            // Orca menggunakan program ID yang berbeda
            const ORCA_WHIRLPOOL_PROGRAM_ID = 'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc';
            
            const accounts = await this.connection.getProgramAccounts(
                new PublicKey(ORCA_WHIRLPOOL_PROGRAM_ID),
                {
                    filters: [
                        {
                            memcmp: {
                                offset: 101, // Offset untuk token A
                                bytes: GOLDIUM_TOKEN_ADDRESS
                            }
                        }
                    ]
                }
            );

            console.log(`   - Found ${accounts.length} Orca pools`);
            return accounts;
        } catch (error) {
            console.log('   - No Orca pools found or error:', error.message);
            return [];
        }
    }

    /**
     * Generate setup instructions untuk liquidity pool
     */
    generateSetupInstructions() {
        console.log('\n📋 GOLDIUM Liquidity Pool Setup Instructions:');
        console.log('\n1. 💰 Prepare Funds:');
        console.log('   - Minimal 1-5 SOL untuk liquidity');
        console.log('   - GOLDIUM tokens sesuai ratio yang diinginkan');
        console.log('   - SOL untuk transaction fees (~0.01 SOL)');
        
        console.log('\n2. 🏊 Create Pool Options:');
        console.log('\n   Option A - Raydium:');
        console.log('   - Visit: https://raydium.io/liquidity/create/');
        console.log('   - Select SOL as base token');
        console.log(`   - Input GOLDIUM address: ${GOLDIUM_TOKEN_ADDRESS}`);
        console.log('   - Set initial price and liquidity amounts');
        console.log('   - Confirm transaction');
        
        console.log('\n   Option B - Orca:');
        console.log('   - Visit: https://www.orca.so/pools');
        console.log('   - Click "Create Pool"');
        console.log(`   - Add GOLDIUM token: ${GOLDIUM_TOKEN_ADDRESS}`);
        console.log('   - Pair with SOL or USDC');
        console.log('   - Set fee tier and initial liquidity');
        
        console.log('\n3. 📊 Post-Creation Steps:');
        console.log('   - Wait 5-10 minutes for indexing');
        console.log('   - Test small swap transactions');
        console.log('   - Monitor pool on Solscan');
        console.log('   - Submit to token lists if needed');
        
        console.log('\n4. 🔍 Verification:');
        console.log('   - Check pool appears on DEX interfaces');
        console.log('   - Verify trading functionality');
        console.log('   - Monitor Solscan DeFi activities');
        console.log(`   - Pool should appear at: https://solscan.io/token/${GOLDIUM_TOKEN_ADDRESS}`);
    }

    /**
     * Monitor token untuk DeFi activity
     */
    async monitorForDefiActivity() {
        console.log('\n👀 Monitoring GOLDIUM for DeFi activity...');
        console.log('This will check every 30 seconds for new activity.');
        console.log('Press Ctrl+C to stop monitoring.\n');
        
        let lastTransactionSignature = null;
        
        const monitor = async () => {
            try {
                // Get recent transactions
                const signatures = await this.connection.getSignaturesForAddress(
                    this.goldiumTokenAddress,
                    { limit: 5 }
                );
                
                if (signatures.length > 0) {
                    const latestSig = signatures[0].signature;
                    
                    if (lastTransactionSignature !== latestSig) {
                        console.log(`🔄 New transaction detected: ${latestSig}`);
                        console.log(`   Time: ${new Date().toLocaleString()}`);
                        console.log(`   Solscan: https://solscan.io/tx/${latestSig}`);
                        lastTransactionSignature = latestSig;
                    }
                }
                
                // Check if token appears in DeFi activities
                console.log(`⏰ ${new Date().toLocaleTimeString()} - Monitoring active...`);
                
            } catch (error) {
                console.error('❌ Monitoring error:', error.message);
            }
        };
        
        // Run initial check
        await monitor();
        
        // Set interval for monitoring
        setInterval(monitor, 30000); // 30 seconds
    }

    /**
     * Main execution function
     */
    async run() {
        console.log('🚀 GOLDIUM Liquidity Setup Tool\n');
        console.log('='.repeat(50));
        
        // Step 1: Check token status
        const tokenExists = await this.checkTokenStatus();
        if (!tokenExists) {
            console.log('\n❌ Cannot proceed - token not found');
            return;
        }
        
        // Step 2: Check existing pools
        const pools = await this.checkExistingPools();
        
        if (pools.total > 0) {
            console.log('\n✅ Existing pools found! Token should be tradeable.');
            console.log('If trading still fails, pools might need more liquidity.');
        } else {
            console.log('\n❌ No liquidity pools found.');
            console.log('This explains why trading fails.');
        }
        
        // Step 3: Generate setup instructions
        this.generateSetupInstructions();
        
        // Step 4: Ask if user wants to monitor
        console.log('\n' + '='.repeat(50));
        console.log('\n🤔 Would you like to monitor for DeFi activity?');
        console.log('Run: node setup-goldium-liquidity.js --monitor');
    }
}

// CLI handling
const args = process.argv.slice(2);
const setup = new GoldiumLiquiditySetup();

if (args.includes('--monitor')) {
    setup.monitorForDefiActivity();
} else {
    setup.run().catch(console.error);
}

export default GoldiumLiquiditySetup;