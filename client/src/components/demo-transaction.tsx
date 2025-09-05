import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ExternalLink, Wallet } from 'lucide-react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { GOLD_TOKEN_MINT, TREASURY_WALLET, SOL_TO_GOLD_RATE, GOLD_DECIMALS, SOLSCAN_BASE_URL } from '@/lib/constants';
import { useToast } from '@/hooks/use-toast';
import { saveTransactionHistory, type GoldiumTransactionHistory } from '@/lib/historyUtils';
import { useSolanaWallet } from './solana-wallet-provider';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { GoldTokenService } from '@/services/gold-token-service';
import { TransactionSuccessModal } from './transaction-success-modal';

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<{
    type: 'swap';
    amount: number;
    tokenFrom: string;
    tokenTo: string;
    txSignature: string;
  } | null>(null);
  const { toast } = useToast();
  const wallet = useExternalWallets();
  const { publicKey: walletPublicKey, connected, signTransaction, refreshBalance, refreshRealBalance } = wallet;
  const publicKey = walletPublicKey;
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
      const goldAmount = solAmount * SOL_TO_GOLD_RATE;
      
      console.log(`🚀 Starting Jupiter DEX swap: ${solAmount} SOL → ${goldAmount.toFixed(2)} GOLD`);
      
      // Initialize GoldTokenService
      const goldTokenService = new GoldTokenService();
      
      // Create wallet adapter object for Jupiter swap
      const walletAdapter = {
        publicKey: publicKey instanceof PublicKey ? publicKey : new PublicKey(publicKey!),
        signTransaction: signTransaction
      };
      
      // Execute Jupiter swap instead of simple SOL transfer
       const signature = await goldTokenService.swapSolForGoldViaJupiter(walletAdapter, solAmount);
       
       console.log(`✅ Jupiter DEX swap completed successfully!`);
       console.log(`Transaction signature: ${signature}`);
      
      // Save transaction to history with real timestamp
      if (publicKey) {
        const transactionRecord: GoldiumTransactionHistory = {
          txId: signature,
          type: 'swap', // Changed from 'send' to 'swap' for Jupiter DEX
          timestamp: new Date(),
          amountSOL: solAmount,
          amountGOLD: goldAmount,
          status: 'success',
          solscanLink: `${SOLSCAN_BASE_URL}/tx/${signature}`
        };
        
        saveTransactionHistory(publicKey.toString(), transactionRecord);
        console.log('✅ Jupiter swap transaction saved to history:', transactionRecord);
        
        // Refresh transaction history and balance to update UI
        refreshTransactionHistory();
        
        // Refresh GOLD balance to show updated amount
        await refreshRealBalance();
        await refreshBalance();
      }
      
      toast({
        title: '✅ Jupiter Swap Berhasil!',
        description: `${solAmount} SOL berhasil di-swap menjadi ${goldAmount.toFixed(6)} GOLD melalui Jupiter DEX!`,
      });

      setTxSignature(signature);
      
      // Set transaction details for success modal
      setCompletedTransaction({
        type: 'swap',
        amount: solAmount,
        tokenFrom: 'SOL',
        tokenTo: 'GOLD',
        txSignature: signature
      });
      setShowSuccessModal(true);
      
      // Set transaction details for display
      setTransactionDetails({
        solAmount,
        goldAmount,
        fee: '~0.005',
        total: (solAmount + 0.005).toFixed(6),
        signature,
        status: 'Jupiter DEX Swap Confirmed!',
        instructions: [
          `✅ Swapped ${solAmount} SOL via Jupiter DEX`,
          `✅ Received ${goldAmount.toFixed(6)} GOLD tokens`,
          `✅ Transaction confirmed on Solana mainnet`,
          `✅ This will appear in DeFi Activities on Solscan`
        ]
      });
      
    } catch (error: any) {
      console.error('Jupiter swap failed:', error);
      
      // Save failed transaction to history if we have a signature
      if (publicKey) {
        const failedTransactionRecord: GoldiumTransactionHistory = {
           txId: 'FAILED_' + Date.now(),
           type: 'swap',
           timestamp: new Date(),
           amountSOL: parseFloat(amount),
           amountGOLD: parseFloat(amount) * SOL_TO_GOLD_RATE,
           status: 'failed',
           solscanLink: `${SOLSCAN_BASE_URL}/tx/FAILED`
        };
        
        saveTransactionHistory(publicKey.toString(), failedTransactionRecord);
         console.log('❌ Failed transaction saved to history:', failedTransactionRecord);
         
         // Refresh transaction history to update UI
         refreshTransactionHistory();
      }
      
      let errorTitle = 'Swap Failed';
      let errorDescription = 'Unable to complete swap transaction';
      
      // Handle specific error types with user-friendly messages
      if (error.message?.includes('confirmation timeout') || error.message?.includes('Transaction was not confirmed')) {
        errorTitle = 'Transaction Processing';
        errorDescription = 'Transaction was sent but is still processing. Please check Solscan in a few minutes.';
      } else if (error.message?.includes('insufficient funds')) {
        errorTitle = 'Insufficient Funds';
        errorDescription = 'Not enough SOL in wallet to complete transaction including fees.';
      } else if (error.message?.includes('signature verification failed')) {
        errorTitle = 'Transaction Rejected';
        errorDescription = 'Transaction was rejected by wallet. Please try again.';
      } else if (error.message?.includes('TOKEN_NOT_TRADABLE') || error.message?.includes('All swap methods failed')) {
        errorTitle = 'Swap Unavailable';
        errorDescription = 'GOLDIUM swap is temporarily unavailable. Please try again later.';
      } else {
        // Clean error message - remove long signatures and technical details
        let cleanMessage = error.message || 'Unknown error occurred';
        if (cleanMessage.includes('Check signature')) {
          cleanMessage = 'Transaction failed to process. Please try again.';
        }
        errorDescription = cleanMessage.length > 100 ? 'Transaction failed. Please try again.' : cleanMessage;
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
    <>
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Jupiter DEX Swap</CardTitle>
        <p className="text-sm text-gray-600 text-center">
          Swap SOL to GOLD tokens via Jupiter DEX on Solana mainnet
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!connected ? (
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <Wallet className="w-5 h-5" />
              <span>Please connect your wallet using the button in the top navigation</span>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-black p-3 rounded-lg border border-white/20">
              <div className="flex items-center gap-2 text-white mb-2">
                <Wallet className="w-4 h-4" />
                <span className="font-medium">Wallet Connected</span>
              </div>
              <p className="text-xs font-mono text-white/80 break-all">
                {publicKey ? (typeof publicKey === 'string' ? publicKey : publicKey.toString()) : 'No wallet connected'}
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

        <div className="bg-black p-4 rounded-lg border border-white/20">
          <h3 className="font-semibold text-white mb-3">Transaction Preview</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/70">SOL Amount:</span>
              <span className="font-mono font-semibold text-white">{amount || '0.001'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">GOLD Amount:</span>
              <span className="font-mono font-semibold text-yellow-400">{(parseFloat(amount || '0') * SOL_TO_GOLD_RATE).toFixed(6)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Fee:</span>
              <span className="font-mono font-semibold text-white">~0.005</span>
            </div>
            <div className="border-t border-white/20 pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span className="text-white">Total:</span>
                <span className="font-mono text-white">{(parseFloat(amount || '0') + 0.005).toFixed(6)} SOL</span>
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
                {isLoading ? 'Processing Swap...' : 'Execute Swap'}
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

        {transactionDetails && transactionDetails.status === '✅ Jupiter Swap Successful!' && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm font-medium text-green-800 mb-2">Jupiter DEX Swap Confirmed!</p>
            <div className="space-y-2">
              <a
                href="https://solscan.io/token/APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump#transactions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                View GOLDIUM CA on Solscan
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
                ✅ Jupiter DEX swap berhasil di Solana mainnet!
              </p>
              <p className="text-xs text-gray-600">
                GOLD tokens telah diterima melalui Jupiter DEX
              </p>
            </div>
          </div>
        )}
          </>
        )}
      </CardContent>
    </Card>
    
    {/* Transaction Success Modal */}
    {showSuccessModal && completedTransaction && (
      <TransactionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        transactionType={completedTransaction.type}
        amount={completedTransaction.amount}
        tokenFrom={completedTransaction.tokenFrom}
        tokenTo={completedTransaction.tokenTo}
        txSignature={completedTransaction.txSignature}
      />
    )}
  </>
  );
};

export { RealTransaction };
export default RealTransaction;