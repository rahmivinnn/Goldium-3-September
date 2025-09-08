/**
 * Test Swap Script for GOLDIUM Devnet
 * Generated automatically by deploy-goldium-devnet.js
 */

import { Connection, PublicKey } from '@solana/web3.js';

const DEVNET_RPC = 'https://api.devnet.solana.com';
const GOLDIUM_MINT = 'DWXCrhwbD6GPWiYXEgtWvuKZ3v6MuCwMD4wE7atxZTNT';
const WALLET_ADDRESS = '8mcqq8s4GGnew95N2fHZq38sFWoydrwrjMm7CaVNnbZX';

class DevnetSwapTester {
    constructor() {
        this.connection = new Connection(DEVNET_RPC, 'confirmed');
    }

    async testJupiterSwap() {
        console.log('🔄 Testing Jupiter swap on devnet...');
        
        try {
            const response = await fetch('https://quote-api.jup.ag/v6/quote?' + new URLSearchParams({
                inputMint: 'So11111111111111111111111111111111111111112', // SOL
                outputMint: GOLDIUM_MINT,
                amount: '100000000', // 0.1 SOL
                slippageBps: '100' // 1%
            }));
            
            if (response.ok) {
                const quote = await response.json();
                console.log('✅ Jupiter quote received:', quote);
                return true;
            } else {
                console.log('❌ Jupiter quote failed:', response.status);
                return false;
            }
        } catch (error) {
            console.log('❌ Jupiter error:', error.message);
            return false;
        }
    }

    async monitorTransactions() {
        console.log('👀 Monitoring GOLDIUM transactions...');
        
        const signatures = await this.connection.getSignaturesForAddress(
            new PublicKey(GOLDIUM_MINT),
            { limit: 10 }
        );
        
        console.log(`Found ${signatures.length} transactions:`);
        signatures.forEach((sig, index) => {
            console.log(`  ${index + 1}. ${sig.signature}`);
            console.log(`     Solscan: https://solscan.io/tx/${sig.signature}?cluster=devnet`);
        });
    }

    async run() {
        console.log('🧪 GOLDIUM Devnet Swap Test\n');
        
        await this.testJupiterSwap();
        await this.monitorTransactions();
        
        console.log('\n✅ Test completed!');
        console.log('Check Solscan devnet for DeFi activities:');
        console.log(`https://solscan.io/token/${GOLDIUM_MINT}?cluster=devnet`);
    }
}

const tester = new DevnetSwapTester();
tester.run().catch(console.error);

export default DevnetSwapTester;
