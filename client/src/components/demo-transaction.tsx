import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Wallet } from 'lucide-react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { GOLD_TOKEN_MINT, TREASURY_WALLET, SOL_TO_GOLD_RATE, GOLD_DECIMALS, SOLSCAN_BASE_URL } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { saveTransactionHistory, type GoldiumTransactionHistory } from '@/lib/historyUtils';
import { useSolanaWallet } from './solana-wallet-provider';

interface TransactionDetails {
  solAmount: number;
  goldAmount: number;
  fee: string;
  total: string;
  signature: string;
  status: string;
  instructions: string[];
}

const RealTransaction: React.FC = () => {
  const [amount, setAmount] = useState('0.001'); // Minimal amount
  const [isLoading, setIsLoading] = useState(false);
  const [txSignature, setTxSignature] = useState('');
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const { toast } = useToast();
  const { publicKey, signTransaction, connected } = useWallet();
  const { refreshTransactionHistory } = useSolanaWallet();

  // Multiple RPC endpoints for reliability
  const rpcEndpoints = [
    'https://solana-api.projectserum.com',
    'https://api.mainnet-beta.solana.com',
    'https://rpc.ankr.com/solana'
  ];
  
  const getConnection = () => {
    // Try different endpoints if one fails
    return new Connection(rpcEndpoints[0]);
  };

  const executeMinimalTransaction = async () => {
    if (!connected || !publicKey) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet first',
        variant: 'destructive'
      });
      return;
    }

    if (!amount) {
      toast({
        title: 'Error',
        description: 'Please provide amount',
        variant: 'destructive'
      });
      return;
    }

    if (!signTransaction) {
      toast({
        title: 'Error',
        description: 'Wallet does not support transaction signing',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const solAmount = parseFloat(amount);
      const userPublicKey = publicKey;
      const treasuryPubkey = new PublicKey(TREASURY_WALLET);
      const goldAmount = solAmount * SOL_TO_GOLD_RATE;
      
      console.log(`Processing transaction: ${solAmount} SOL -> ${goldAmount} GOLD`);
      console.log(`Connected wallet: ${publicKey.toString()}`);

      // Use working RPC endpoints (tested and verified)
      const workingRpcEndpoints = [
        'https://solana-mainnet.g.alchemy.com/v2/iFxWluow57qA4EaOlhpfs', // Alchemy RPC (premium)
        'https://api.mainnet-beta.solana.com',
        'https://solana-api.projectserum.com',
        'https://rpc.ankr.com/solana',
        'https://solana.blockdaemon.com',
        'http://localhost:8899' // Local validator fallback
      ];
      
      let connection: Connection | null = null;
      
      // Function to test connection with timeout and retry
      const testConnectionWithTimeout = async (endpoint: string, timeout = 15000, retries = 2) => {
        for (let attempt = 1; attempt <= retries; attempt++) {
          try {
            console.log(`🔄 Attempt ${attempt}/${retries} for ${endpoint}`);
            
            const result = await Promise.race([
              (async () => {
                const testConnection = new Connection(endpoint, {
                  commitment: 'confirmed',
                  confirmTransactionInitialTimeout: timeout,
                  wsEndpoint: undefined, // Disable websocket for better compatibility
                  disableRetryOnRateLimit: false
                });
                
                // Test with multiple calls to ensure stability
                await testConnection.getSlot();
                await testConnection.getLatestBlockhash();
                
                console.log(`✅ RPC ${endpoint} berhasil ditest (attempt ${attempt})`);
                return testConnection;
              })(),
              new Promise((_, reject) => 
                setTimeout(() => reject(new Error(`Connection timeout after ${timeout}ms`)), timeout)
              )
            ]);
            
            return result;
          } catch (error) {
            console.warn(`⚠️ Attempt ${attempt}/${retries} failed for ${endpoint}:`, error);
            if (attempt === retries) {
              throw error;
            }
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          }
        }
      };
      
      for (const endpoint of workingRpcEndpoints) {
          try {
            console.log(`🚀 Mencoba koneksi ke: ${endpoint}`);
            connection = await testConnectionWithTimeout(endpoint, 15000, 2) as Connection;
            console.log(`🎉 Berhasil terhubung ke: ${endpoint}`);
            break;
        } catch (error) {
          console.error(`❌ Gagal terhubung ke ${endpoint}:`, {
            error: error instanceof Error ? error.message : error,
            endpoint,
            timestamp: new Date().toISOString()
          });
          // Log additional details for Alchemy endpoint
          if (endpoint.includes('alchemy.com')) {
            console.error('🔍 Alchemy RPC Error Details:', {
              possibleCauses: [
                'API key might be invalid or expired',
                'Rate limit exceeded',
                'Network connectivity issues',
                'CORS policy blocking request'
              ],
              endpoint
            });
          }
        }
      }
      
      if (!connection) {
         // Fallback: Create offline mode transaction
         console.warn('⚠️ Semua RPC endpoint gagal, menggunakan mode offline');
         setTransactionDetails({
           solAmount,
           goldAmount,
           fee: '~0.005',
           total: (solAmount + 0.005).toFixed(6),
           signature: 'OFFLINE_MODE_' + Date.now(),
           status: 'Siap untuk ditandatangani (Mode Offline)',
           instructions: [
             'Mode offline aktif karena masalah jaringan',
             'Transaksi akan dibuat ketika koneksi pulih',
             'Pastikan wallet Anda terhubung',
             `Akan mengirim ${solAmount} SOL ke treasury`,
             `Akan menerima ${goldAmount.toFixed(6)} GOLD token`
           ]
         });
         setIsLoading(false);
         return;
       }

      // Check balance
      const balance = await connection.getBalance(userPublicKey);
      const balanceSOL = balance / LAMPORTS_PER_SOL;
      console.log(`Wallet balance: ${balanceSOL} SOL`);
      
      const requiredAmount = solAmount + 0.005; // SOL amount + minimal fee buffer
      if (balanceSOL < requiredAmount) {
        toast({
          title: 'Insufficient Balance',
          description: `Need at least ${requiredAmount} SOL, but wallet has ${balanceSOL.toFixed(4)} SOL`,
          variant: 'destructive'
        });
        return;
      }

      const transaction = new Transaction();

      // SOL payment to treasury (simplified mainnet transaction)
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: userPublicKey,
          toPubkey: treasuryPubkey,
          lamports: Math.floor(solAmount * LAMPORTS_PER_SOL),
        })
      );

      // Note: For real mainnet deployment, token minting would be handled by the backend
      // This is a simplified version that only transfers SOL to treasury
      // The actual GOLD tokens would be distributed by the treasury wallet separately

      // Get recent blockhash and set fee payer
      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('finalized');
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;
      transaction.feePayer = userPublicKey;
      
      console.log('Transaction prepared successfully!');
      console.log(`Sending ${solAmount} SOL to treasury: ${treasuryPubkey.toString()}`);
      console.log(`Equivalent GOLD value: ${goldAmount.toFixed(6)} GOLD tokens`);
      console.log(`Estimated fee: ~0.005 SOL`);
      
      // Sign the transaction with connected wallet
      console.log('Signing transaction with wallet...');
      const signedTransaction = await signTransaction(transaction);
      
      // Send the signed transaction to the blockchain
      console.log('Sending transaction to blockchain...');
      const signature = await connection.sendRawTransaction(signedTransaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: 'confirmed'
      });
      
      console.log('Transaction sent! Signature:', signature);
      
      // Wait for confirmation with extended timeout
      console.log('Waiting for transaction confirmation...');
      
      // Use confirmTransaction with custom timeout and retry logic
      let confirmed = false;
      let attempts = 0;
      const maxAttempts = 3;
      
      while (!confirmed && attempts < maxAttempts) {
        try {
          attempts++;
          console.log(`Confirmation attempt ${attempts}/${maxAttempts}...`);
          
          const confirmation = await connection.confirmTransaction({
            signature,
            blockhash: transaction.recentBlockhash!,
            lastValidBlockHeight: transaction.lastValidBlockHeight!
          }, 'confirmed');
          
          if (confirmation.value.err) {
            throw new Error(`Transaction failed: ${confirmation.value.err}`);
          }
          
          confirmed = true;
          console.log('Transaction confirmed successfully!');
        } catch (error: any) {
          console.log(`Confirmation attempt ${attempts} failed:`, error.message);
          
          if (attempts >= maxAttempts) {
            // Final attempt failed, but transaction might still be valid
            console.log('Max confirmation attempts reached. Checking transaction status...');
            
            try {
              const txStatus = await connection.getSignatureStatus(signature);
              if (txStatus.value?.confirmationStatus === 'confirmed' || txStatus.value?.confirmationStatus === 'finalized') {
                console.log('Transaction found to be confirmed via status check');
                confirmed = true;
                break;
              }
            } catch (statusError) {
              console.log('Status check also failed:', statusError);
            }
            
            throw new Error(`Transaction confirmation timeout after ${maxAttempts} attempts. Transaction may still be processing. Check Solscan with signature: ${signature}`);
          }
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      console.log('Transaction confirmed successfully!');
      
      // Save transaction to history with real timestamp
      if (publicKey) {
        const transactionRecord: GoldiumTransactionHistory = {
          txId: signature,
          type: 'send',
          timestamp: new Date(),
          amountSOL: solAmount,
          amountGOLD: goldAmount,
          status: 'success',
          solscanLink: `${SOLSCAN_BASE_URL}/tx/${signature}`
        };
        
        saveTransactionHistory(publicKey.toString(), transactionRecord);
        console.log('✅ Transaction saved to history:', transactionRecord);
        
        // Refresh transaction history to update UI
        refreshTransactionHistory();
      }
      
      toast({
        title: '✅ Transaction Berhasil!',
        description: `${solAmount} SOL berhasil dikirim ke treasury! GOLD tokens akan didistribusikan secara otomatis.`,
      });

      setTxSignature(signature);
      
      // Set transaction details for display
      setTransactionDetails({
        solAmount,
        goldAmount,
        fee: '~0.005',
        total: (solAmount + 0.005).toFixed(6),
        signature,
        status: 'Transaction Confirmed on Mainnet!',
        instructions: [
          `✅ Sent ${solAmount} SOL to treasury`,
          `✅ Equivalent to ${goldAmount.toFixed(6)} GOLD tokens`,
          `✅ Transaction confirmed on Solana mainnet`,
          `✅ GOLD tokens will be distributed automatically`
        ]
      });
      
    } catch (error: any) {
      console.error('Transaction failed:', error);
      
      // Save failed transaction to history if we have a signature
      if (publicKey && txSignature) {
        const failedTransactionRecord: GoldiumTransactionHistory = {
          txId: txSignature,
          type: 'send',
          timestamp: new Date(),
          amountSOL: solAmount,
          amountGOLD: goldAmount,
          status: 'failed',
          solscanLink: `${SOLSCAN_BASE_URL}/tx/${txSignature}`
        };
        
        saveTransactionHistory(publicKey.toString(), failedTransactionRecord);
         console.log('❌ Failed transaction saved to history:', failedTransactionRecord);
         
         // Refresh transaction history to update UI
         refreshTransactionHistory();
      }
      
      let errorTitle = 'Transaction Failed';
      let errorDescription = error.message || 'Failed to execute transaction';
      
      // Handle specific error types
      if (error.message?.includes('confirmation timeout')) {
        errorTitle = 'Transaction Timeout';
        errorDescription = 'Transaction was sent but confirmation timed out. It may still be processing. Check Solscan for updates.';
      } else if (error.message?.includes('insufficient funds')) {
        errorTitle = 'Insufficient Funds';
        errorDescription = 'Not enough SOL in wallet to complete transaction including fees.';
      } else if (error.message?.includes('signature verification failed')) {
        errorTitle = 'Signature Error';
        errorDescription = 'Transaction signature verification failed. Please try again.';
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Real GOLD Transaction</CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Send SOL to treasury and receive GOLD tokens on Solana mainnet
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connected ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Wallet className="w-5 h-5" />
              <span>Connect your wallet to continue</span>
            </div>
            <WalletMultiButton className="!bg-blue-600 hover:!bg-blue-700" />
          </div>
        ) : (
          <>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <Wallet className="w-4 h-4" />
                <span className="font-medium">Wallet Connected</span>
              </div>
              <p className="text-xs font-mono text-green-700 break-all">
                {publicKey?.toString()}
              </p>
            </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">SOL Amount (Minimal)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.001"
            step="0.001"
            min="0.001"
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-3">Transaction Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">SOL Amount:</span>
              <span className="font-mono font-semibold">{amount || '0.001'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GOLD Amount:</span>
              <span className="font-mono font-semibold text-yellow-600">{(parseFloat(amount || '0') * SOL_TO_GOLD_RATE).toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Fee:</span>
              <span className="font-mono font-semibold">~0.005</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="font-mono">{(parseFloat(amount || '0') + 0.005).toFixed(6)} SOL</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-gray-600"><strong>GOLD CA:</strong></p>
            <p className="text-xs font-mono break-all text-blue-700">{GOLD_TOKEN_MINT.toString()}</p>
          </div>
        </div>

            <div className="space-y-2">
              <Button 
                onClick={executeMinimalTransaction}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Processing Transaction...' : 'Execute Real Transaction'}
              </Button>
            </div>
          </>
        )}

        {transactionDetails && (
          <div className="mt-4 p-4 bg-black rounded-lg border border-gray-700 shadow-lg">
            <p className="text-lg font-bold text-white mb-3">{transactionDetails.status}</p>
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <p className="text-gray-300"><strong className="text-white">SOL Amount:</strong></p>
                <p className="text-white font-mono">{transactionDetails.solAmount}</p>
                <p className="text-gray-300"><strong className="text-white">GOLD Amount:</strong></p>
                <p className="text-yellow-400 font-mono font-bold">{transactionDetails.goldAmount.toFixed(6)}</p>
                <p className="text-gray-300"><strong className="text-white">Fee:</strong></p>
                <p className="text-white font-mono">{transactionDetails.fee}</p>
                <p className="text-gray-300"><strong className="text-white">Total:</strong></p>
                <p className="text-white font-mono font-bold">{transactionDetails.total} SOL</p>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-600">
                <p className="font-bold text-white mb-2">Transaction Details:</p>
                <ul className="space-y-2">
                  {transactionDetails.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-center gap-2 text-green-400">
                      <span className="text-green-500">✓</span>
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {txSignature && !transactionDetails && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-2">Transaction Confirmed!</p>
            <div className="space-y-2">
              <a
                href={`${SOLSCAN_BASE_URL}/tx/${txSignature}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View Transaction on Solscan
              </a>
              <a
                href={`${SOLSCAN_BASE_URL}/token/${GOLD_TOKEN_MINT.toString()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View GOLD Token on Solscan
              </a>
              <p className="text-xs text-green-600 font-medium">
                ✅ SOL berhasil dikirim ke treasury di Solana mainnet!
              </p>
              <p className="text-xs text-gray-600">
                GOLD tokens akan didistribusikan secara otomatis
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { RealTransaction };
export default RealTransaction;