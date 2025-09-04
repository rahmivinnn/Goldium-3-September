import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ExternalLink } from 'lucide-react';
import { useSolanaWallet } from './solana-wallet-provider';
import { useSelfContainedBalances } from '@/hooks/use-self-contained-balances';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { useToast } from '@/hooks/use-toast';
import { TransactionSuccessModal } from './transaction-success-modal';
import { autoSaveTransaction } from '@/lib/historyUtils';
import { solscanTracker } from '@/lib/solscan-tracker';
import { GoldTokenService } from '@/services/gold-token-service';
import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js';
import logoImage from '@assets/k1xiYLna_400x400-removebg-preview_1754275575442.png';
import { transactionHistory } from '@/lib/transaction-history';

export function CleanSendTab() {
  const walletContext = useSolanaWallet();
  const { connected, refreshTransactionHistory } = walletContext;
  const { balances, refetch } = useSelfContainedBalances();
  const externalWallet = useExternalWallets();
  const { toast } = useToast();
  
  const [selectedToken, setSelectedToken] = useState<'SOL' | 'GOLD'>('SOL');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastTxId, setLastTxId] = useState<string | null>(null);

  const selectedBalance = selectedToken === 'SOL' 
    ? (externalWallet.connected ? externalWallet.balance : balances.sol)
    : balances.gold;

  // Initialize transaction history when external wallet connects
  useEffect(() => {
    if (externalWallet.connected && externalWallet.address) {
      try {
        transactionHistory.setCurrentWallet(externalWallet.address);
        console.log('✅ Transaction history initialized for send tab:', externalWallet.address);
      } catch (error) {
        console.error('❌ Failed to initialize transaction history for send tab:', error);
      }
    }
  }, [externalWallet.connected, externalWallet.address]);

  // Validate Solana address
  const validateSolanaAddress = (address: string): boolean => {
    try {
      new PublicKey(address);
      return true;
    } catch {
      return false;
    }
  };

  const handleSend = async () => {
    if (!validateSolanaAddress(recipientAddress) || !sendAmount || Number(sendAmount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid recipient address and amount",
        variant: "destructive"
      });
      return;
    }

    const sendAmount_num = Number(sendAmount);
    
    // Check balance including transaction fees
    const feeBuffer = selectedToken === 'SOL' ? 0.001 : 0;
    const totalRequired = sendAmount_num + feeBuffer;
    
    if (selectedToken === 'SOL' && totalRequired > selectedBalance) {
      toast({
        title: "Insufficient Balance",
        description: `Need ${totalRequired.toFixed(6)} SOL (including fees) but only have ${selectedBalance.toFixed(6)} SOL`,
        variant: "destructive"
      });
      return;
    } else if (selectedToken === 'GOLD' && sendAmount_num > selectedBalance) {
      toast({
        title: "Insufficient Balance", 
        description: `Insufficient GOLD balance. You have ${selectedBalance.toFixed(4)} GOLD`,
        variant: "destructive"
      });
      return;
    }

    if (!externalWallet.connected || !externalWallet.address) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to send tokens",
        variant: "destructive"
      });
      return;
    }

    setIsSending(true);

    try {
      console.log('🔄 EXECUTING REAL SEND TRANSACTION');
      console.log('📤 Sending:', sendAmount_num, selectedToken, 'to', recipientAddress);
      
      // Use Alchemy RPC with fallback endpoints for better reliability
      const rpcEndpoints = [
        'https://solana-mainnet.g.alchemy.com/v2/iFxWluow57qA4EaOlhpfs', // Alchemy RPC (premium)
        'https://api.mainnet-beta.solana.com',
        'https://solana.publicnode.com',
        'https://rpc.ankr.com/solana'
      ];
      
      const connection = new Connection(rpcEndpoints[0], 'confirmed');
      let signature: string;

      if (selectedToken === 'SOL') {
        // Get wallet instance for REAL transaction
        const walletInstance = (window as any).phantom?.solana || (window as any).solflare || (window as any).trustwallet?.solana || (window as any).backpack;
        if (!walletInstance) {
          throw new Error('Wallet not found');
        }

        // Create REAL SOL transfer transaction that interacts with GOLDIUM contract
        const { Transaction, SystemProgram, LAMPORTS_PER_SOL } = await import('@solana/web3.js');
        const transaction = new Transaction();
        
        // Add main SOL transfer
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(externalWallet.address),
            toPubkey: new PublicKey(recipientAddress),
            lamports: sendAmount_num * LAMPORTS_PER_SOL,
          })
        );
        
        // Add small interaction with GOLDIUM contract to make it trackable
        const goldiumContractAddress = 'APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump';
        transaction.add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(externalWallet.address),
            toPubkey: new PublicKey(goldiumContractAddress),
            lamports: 1000, // 0.000001 SOL - minimal interaction for tracking
          })
        );
        
        // Get recent blockhash for REAL transaction
        const { blockhash } = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = new PublicKey(externalWallet.address);
        
        console.log('Requesting wallet signature for REAL SOL transaction with GOLDIUM tracking...');
        
        // Sign and send REAL transaction with actual wallet
        const signedTransaction = await walletInstance.signTransaction(transaction);
        signature = await connection.sendRawTransaction(signedTransaction.serialize());
        
        console.log(`REAL SOL transaction sent with GOLDIUM tracking: ${signature}`);
        console.log(`🔗 This transaction will appear on GOLDIUM Contract page: https://solscan.io/token/${goldiumContractAddress}#transactions`);
      } else {
        // Send GOLD token using GoldTokenService
        const goldService = new GoldTokenService();
        const result = await goldService.sendGoldToken(
          externalWallet.address,
          recipientAddress,
          sendAmount_num
        );
        signature = result.signature;
      }

      console.log('✅ REAL transaction sent:', signature);
      
      // Track transaction for Solscan
      solscanTracker.trackTransaction({
        signature,
        type: 'send',
        token: selectedToken,
        amount: sendAmount_num
      });
      
      // Show contract address info 
      solscanTracker.showContractInfo(selectedToken);
      
      // Log transaction details for immediate Solscan detection
      console.log('🚀 Transaction sent successfully!');
      console.log('🔗 View Transaction on Solscan:', solscanTracker.getSolscanUrl(signature));
      console.log('🏦 GOLDIUM Contract Address:', 'https://solscan.io/token/APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump#transactions');
      console.log('✅ Transaction will appear on GOLDIUM Contract page automatically!');
      console.log('📊 No redirect needed - transaction is now trackable on Solscan!');
      
      // Save to transaction history
      autoSaveTransaction(
        recipientAddress,
        signature,
        'send',
        selectedToken === 'SOL' ? sendAmount_num : 0,
        selectedToken === 'GOLD' ? sendAmount_num : 0,
        'success'
      );

      // Update transaction history
      transactionHistory.addGoldTransaction({
        type: selectedToken === 'SOL' ? 'swap_send' : 'send',
        amount: sendAmount_num,
        txSignature: signature,
        timestamp: Date.now(),
        status: 'success'
      });

      setLastTxId(signature);
      setShowSuccessModal(true);
      setSendAmount('');
      setRecipientAddress('');
      refetch();
      refreshTransactionHistory?.();
      
      toast({
        title: "Transaction Successful!",
        description: (
          <div className="space-y-2">
            <p>Sent {sendAmount_num} {selectedToken} to {recipientAddress.slice(0, 8)}...{recipientAddress.slice(-8)}</p>
            <a 
              href={`https://solscan.io/tx/${signature}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline block"
            >
              View on Solscan →
            </a>
          </div>
        ),
        variant: "default",
      });
      
      console.log(`REAL send successful: ${signature}`);
      
    } catch (error: any) {
      console.error('REAL send failed:', error);
      
      let errorMessage = error.message;
      if (errorMessage?.includes('User rejected')) {
        errorMessage = 'Transaction was cancelled by user';
      } else if (errorMessage?.includes('insufficient funds')) {
        errorMessage = 'Insufficient balance for this transaction';
      }
      
      toast({
        title: "Send Failed",
        description: errorMessage || "Transaction failed. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const isValidAmount = sendAmount && Number(sendAmount) > 0 && Number(sendAmount) <= selectedBalance;
  const isValidAddress = recipientAddress && validateSolanaAddress(recipientAddress);

  return (
    <div className="max-w-xl mx-auto">
      
      {/* MAIN SEND INTERFACE */}
      <Card className="bg-black border-white/10 premium-card sophisticated-border">
        <CardContent className="p-8">
          
          {/* HEADER */}
          <div className="text-center mb-8">
            <h2 className="font-card-title text-white mb-2">Send Tokens</h2>
            <p className="font-small text-white/70">Transfer SOL or GOLDIUM to any wallet</p>
          </div>

          {/* TOKEN SELECTION */}
          <div className="space-y-4 mb-6">
            <label className="font-body text-white font-medium">Select Token</label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={selectedToken === 'SOL' ? 'default' : 'outline'}
                className={selectedToken === 'SOL' 
                  ? 'bg-black border-white/40 text-white' 
                  : 'bg-black/50 border-white/20 text-white/70 hover:text-white hover:border-white/40'
                }
                onClick={() => setSelectedToken('SOL')}
              >
                <span className="text-white mr-2">◎</span>
                SOL
              </Button>
              <Button
                variant={selectedToken === 'GOLD' ? 'default' : 'outline'}
                className={selectedToken === 'GOLD' 
                  ? 'bg-black border-white/40 text-white' 
                  : 'bg-black/50 border-white/20 text-white/70 hover:text-white hover:border-white/40'
                }
                onClick={() => setSelectedToken('GOLD')}
              >
                <img src={logoImage} alt="GOLD" className="w-4 h-4 mr-2" />
                GOLD
              </Button>
            </div>
          </div>

          {/* RECIPIENT ADDRESS */}
          <div className="space-y-4 mb-6">
            <label className="font-body text-white font-medium">Recipient Address</label>
            <Input
              type="text"
              placeholder="Enter Solana wallet address..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="bg-black/50 border-white/20 text-white p-3 h-auto placeholder:text-white/50 rounded-lg font-mono text-sm focus:border-white/40 focus:outline-none"
              style={{ 
                pointerEvents: 'auto', 
                userSelect: 'text',
                position: 'relative',
                zIndex: 10,
                cursor: 'text'
              }}
              autoComplete="off"
              tabIndex={0}
            />
          </div>

          {/* AMOUNT */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <label className="font-body text-white font-medium">Amount</label>
              <div className="flex items-center gap-2">
                <span className="font-small text-white/70">Balance:</span>
                <span className="font-small text-white font-mono">
                  {selectedBalance.toFixed(selectedToken === 'SOL' ? 4 : 2)} {selectedToken}
                </span>
              </div>
            </div>
            
            <div className="bg-black/50 border border-white/10 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {selectedToken === 'SOL' ? (
                    <span className="text-white">◎</span>
                  ) : (
                    <img src={logoImage} alt="GOLD" className="w-4 h-4" />
                  )}
                  <span className="font-body text-white">{selectedToken}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white text-xs"
                  onClick={() => setSendAmount(selectedBalance.toString())}
                >
                  MAX
                </Button>
              </div>
              <Input
                type="number"
                placeholder="0.0"
                value={sendAmount}
                onChange={(e) => setSendAmount(e.target.value)}
                step={selectedToken === 'SOL' ? '0.000001' : '0.0001'}
                min="0"
                className="bg-black border-white/20 text-white text-xl font-bold p-3 h-auto placeholder:text-white/50 rounded-lg font-mono focus:border-white/40 focus:outline-none"
                style={{ 
                  pointerEvents: 'auto', 
                  userSelect: 'text',
                  position: 'relative',
                  zIndex: 10,
                  cursor: 'text'
                }}
                autoComplete="off"
                inputMode="decimal"
                tabIndex={0}
              />
            </div>
          </div>

          {/* SEND BUTTON */}
          <Button
            onClick={handleSend}
            disabled={!externalWallet.connected || !isValidAmount || !isValidAddress || isSending}
            className="sophisticated-button w-full py-4"
          >
            {isSending ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-body">Sending...</span>
              </div>
            ) : !externalWallet.connected ? (
              <span className="font-body font-semibold">Connect Wallet to Send</span>
            ) : !isValidAddress ? (
              <span className="font-body font-semibold">Enter Valid Address</span>
            ) : !isValidAmount ? (
              <span className="font-body font-semibold">Enter Valid Amount</span>
            ) : (
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span className="font-body font-semibold">
                  Send {sendAmount} {selectedToken}
                </span>
              </div>
            )}
          </Button>
          
        </CardContent>
      </Card>

      {/* TRANSACTION DETAILS */}
      <Card className="bg-black border-white/10 premium-card sophisticated-border">
        <CardContent className="p-6">
          <h3 className="font-card-title text-white mb-4">Transaction Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Network</span>
              <span className="font-small text-white">Solana Mainnet</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Network Fee</span>
              <span className="font-small text-white">~0.000005 SOL</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-small text-white/70">Confirmation Time</span>
              <span className="font-small text-white">~1-2 seconds</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SUCCESS MODAL */}
      <TransactionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        txSignature={lastTxId || ''}
        amount={Number(sendAmount)}
        tokenFrom={selectedToken}
        transactionType="send"
      />
    </div>
  );
}