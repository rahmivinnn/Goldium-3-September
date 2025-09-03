import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: 'Address required' });
  }

  try {
    console.log('🔄 Backend: Fetching balance for', address);

    // Multiple RPC endpoints to try
    const rpcEndpoints = [
      'https://api.mainnet-beta.solana.com',
      'https://solana.publicnode.com',
      'https://rpc.ankr.com/solana',
      'https://solana-mainnet.g.alchemy.com/v2/alch-demo'
    ];

    for (const rpcUrl of rpcEndpoints) {
      try {
        console.log(`🔄 Trying RPC: ${rpcUrl}`);
        
        const connection = new Connection(rpcUrl, 'confirmed');
        const publicKey = new PublicKey(address);
        const balanceLamports = await connection.getBalance(publicKey);
        const balanceSOL = balanceLamports / LAMPORTS_PER_SOL;
        
        console.log(`✅ SUCCESS: ${balanceSOL} SOL from ${rpcUrl}`);
        
        return res.status(200).json({
          success: true,
          balance: balanceSOL,
          address: address,
          rpcUsed: rpcUrl,
          timestamp: new Date().toISOString()
        });
        
      } catch (rpcError: any) {
        console.log(`❌ RPC ${rpcUrl} failed:`, rpcError.message);
        continue;
      }
    }

    // If all RPCs fail
    return res.status(500).json({
      success: false,
      error: 'All RPC endpoints failed',
      balance: 0
    });

  } catch (error: any) {
    console.error('❌ Backend balance fetch error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
      balance: 0
    });
  }
}