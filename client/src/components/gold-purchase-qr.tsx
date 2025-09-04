import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, CheckCircle, ExternalLink, Coins, Wallet, RefreshCw } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useGoldBalance } from '../hooks/use-gold-balance';
import { transactionHistory } from '../lib/transaction-history';
import { paymentMonitor, PaymentMonitorConfig } from '../lib/payment-monitor';

interface PaymentStatus {
  status: 'pending' | 'processing' | 'completed' | 'failed';
  txHash?: string;
  amount?: number;
  timestamp?: number;
  error?: string;
}

interface GoldPurchaseOption {
  id: string;
  goldAmount: number;
  solPrice: number;
  bonus: number;
  popular?: boolean;
}

const GOLD_PURCHASE_OPTIONS: GoldPurchaseOption[] = [
  {
    id: 'small',
    goldAmount: 100,
    solPrice: 0.1,
    bonus: 0
  },
  {
    id: 'medium',
    goldAmount: 500,
    solPrice: 0.45,
    bonus: 50,
    popular: true
  },
  {
    id: 'large',
    goldAmount: 1000,
    solPrice: 0.8,
    bonus: 150
  },
  {
    id: 'mega',
    goldAmount: 2500,
    solPrice: 1.8,
    bonus: 500
  }
];

// Treasury wallet address untuk menerima pembayaran SOL
const TREASURY_WALLET = 'GLD1111111111111111111111111111111111111111';

export const GoldPurchaseQR: React.FC = () => {
  const { connected, publicKey } = useWallet();
  const { refreshBalances } = useGoldBalance();
  
  const [selectedOption, setSelectedOption] = useState<GoldPurchaseOption | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>({ status: 'pending' });
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  // Generate payment URL untuk QR code
  const generatePaymentURL = (option: GoldPurchaseOption) => {
    const params = new URLSearchParams({
      recipient: TREASURY_WALLET,
      amount: option.solPrice.toString(),
      label: `Goldium GOLD Purchase - ${option.goldAmount + option.bonus} GOLD`,
      message: `Purchase ${option.goldAmount} GOLD (+${option.bonus} bonus) for ${option.solPrice} SOL`,
      memo: `gold_purchase_${option.id}_${publicKey?.toString() || 'unknown'}_${Date.now()}`
    });
    
    return `solana:${TREASURY_WALLET}?${params.toString()}`;
  };

  // Copy wallet address ke clipboard
  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(TREASURY_WALLET);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  // Monitor pembayaran real-time menggunakan Solana blockchain
  const startPaymentMonitoring = async (option: GoldPurchaseOption) => {
    if (!publicKey) {
      console.error('Wallet not connected');
      return;
    }
    
    setIsMonitoring(true);
    setPaymentStatus({ status: 'processing' });
    
    const config: PaymentMonitorConfig = {
      expectedAmount: option.solPrice,
      userWallet: publicKey.toString(),
      memo: `gold_purchase_${option.id}_${publicKey.toString()}_${Date.now()}`,
      timeout: 300000 // 5 minutes timeout
    };
    
    try {
      await paymentMonitor.startMonitoring(config, (result) => {
        if (result.success && result.txHash) {
          // Pembayaran berhasil terdeteksi
          setPaymentStatus({
            status: 'completed',
            txHash: result.txHash,
            amount: option.goldAmount + option.bonus,
            timestamp: result.timestamp || Date.now()
          });
          
          // Update transaction history dengan GOLD yang diterima
          transactionHistory.addGoldTransaction(
            'swap_receive',
            option.goldAmount + option.bonus,
            result.txHash
          );
          
          // Refresh GOLD balance
          refreshBalances();
          
          console.log(`✅ Payment confirmed: ${result.txHash}`);
        } else {
           // Pembayaran gagal atau timeout
           setPaymentStatus({
             status: 'failed',
             timestamp: Date.now(),
             error: result.error || 'Payment timeout or not detected'
           });
           
           console.log(`❌ Payment failed: ${result.error || 'Unknown error'}`);
         }
        
        setIsMonitoring(false);
      });
      
      console.log(`🔍 Started monitoring payment for ${option.solPrice} SOL`);
      
    } catch (error) {
       console.error('Error starting payment monitoring:', error);
       setPaymentStatus({ 
         status: 'failed',
         error: 'Failed to start payment monitoring'
       });
       setIsMonitoring(false);
     }
  };

  // Handle custom amount purchase
  const handleCustomPurchase = () => {
    const goldAmount = parseInt(customAmount);
    if (goldAmount > 0) {
      const solPrice = goldAmount * 0.001; // 1 GOLD = 0.001 SOL
      const customOption: GoldPurchaseOption = {
        id: 'custom',
        goldAmount,
        solPrice,
        bonus: 0
      };
      setSelectedOption(customOption);
      setShowCustom(false);
    }
  };

  // Reset payment status
  const resetPayment = () => {
    setPaymentStatus({ status: 'pending' });
    setSelectedOption(null);
    setIsMonitoring(false);
  };

  if (!connected) {
    return (
      <Card className="p-6 glass-card">
        <CardContent className="text-center">
          <Wallet className="w-12 h-12 text-golden-small mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-golden mb-2">Connect Wallet</h3>
          <p className="text-golden-small">Please connect your wallet to purchase GOLD tokens</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Purchase Options */}
      {!selectedOption && (
        <Card className="p-6 glass-card">
          <CardHeader>
            <CardTitle className="text-golden flex items-center gap-2">
              <Coins className="w-5 h-5" />
              Purchase GOLD Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {GOLD_PURCHASE_OPTIONS.map((option) => (
                <div
                  key={option.id}
                  className={`relative p-4 border rounded-lg cursor-pointer transition-all hover:border-golden/50 ${
                    option.popular ? 'border-golden bg-golden/5' : 'border-white/20'
                  }`}
                  onClick={() => setSelectedOption(option)}
                >
                  {option.popular && (
                    <Badge className="absolute -top-2 left-4 bg-golden text-black text-xs">
                      Most Popular
                    </Badge>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-golden">
                      {option.goldAmount.toLocaleString()}
                    </div>
                    <div className="text-sm text-golden-small">GOLD Tokens</div>
                    {option.bonus > 0 && (
                      <div className="text-xs text-green-400 mt-1">
                        +{option.bonus} Bonus!
                      </div>
                    )}
                    <div className="mt-2 text-lg font-semibold text-white">
                      {option.solPrice} SOL
                    </div>
                    <div className="text-xs text-golden-small">
                      Total: {option.goldAmount + option.bonus} GOLD
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Custom Amount */}
            <div className="border-t border-white/10 pt-4">
              {!showCustom ? (
                <Button
                  variant="outline"
                  onClick={() => setShowCustom(true)}
                  className="w-full border-white/20 text-golden-small hover:border-golden/50"
                >
                  Custom Amount
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter GOLD amount"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    className="bg-black/20 border-white/20 text-white"
                  />
                  <Button onClick={handleCustomPurchase} className="bg-golden text-black hover:bg-golden/80">
                    Create QR
                  </Button>
                  <Button variant="outline" onClick={() => setShowCustom(false)}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* QR Code Payment */}
      {selectedOption && paymentStatus.status !== 'completed' && paymentStatus.status !== 'failed' && (
        <Card className="p-6 glass-card">
          <CardHeader>
            <CardTitle className="text-golden flex items-center gap-2">
              <QRCodeSVG value="" className="w-5 h-5" />
              Scan QR Code to Pay
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Purchase Summary */}
            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-golden-small">GOLD Amount:</span>
                <span className="text-golden font-semibold">{selectedOption.goldAmount.toLocaleString()}</span>
              </div>
              {selectedOption.bonus > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-golden-small">Bonus:</span>
                  <span className="text-green-400 font-semibold">+{selectedOption.bonus}</span>
                </div>
              )}
              <div className="flex justify-between items-center mb-2">
                <span className="text-golden-small">Total GOLD:</span>
                <span className="text-golden font-bold">{(selectedOption.goldAmount + selectedOption.bonus).toLocaleString()}</span>
              </div>
              <div className="border-t border-white/10 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-white">Price:</span>
                  <span className="text-white font-bold">{selectedOption.solPrice} SOL</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={generatePaymentURL(selectedOption)}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              
              {/* Wallet Address */}
              <div className="w-full">
                <label className="text-sm text-golden-small mb-2 block">Send SOL to this address:</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={TREASURY_WALLET}
                    readOnly
                    className="bg-black/20 border-white/20 text-white font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAddress}
                    className="border-white/20 hover:border-golden/50"
                  >
                    {copiedAddress ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Payment Status */}
              {paymentStatus.status === 'processing' && (
                <div className="text-center">
                  <RefreshCw className="w-6 h-6 text-golden animate-spin mx-auto mb-2" />
                  <p className="text-golden-small">Monitoring payment...</p>
                  <p className="text-xs text-golden-small mt-1">Waiting for SOL transaction confirmation</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2 w-full">
                <Button
                  onClick={() => startPaymentMonitoring(selectedOption)}
                  disabled={isMonitoring}
                  className="flex-1 bg-golden text-black hover:bg-golden/80"
                >
                  {isMonitoring ? 'Monitoring...' : 'I\'ve Sent Payment'}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetPayment}
                  className="border-white/20 hover:border-red-500/50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Failed */}
      {paymentStatus.status === 'failed' && (
        <Card className="p-6 glass-card border-red-500/50">
          <CardContent className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">❌</span>
            </div>
            <h3 className="text-xl font-bold text-red-400">Payment Failed</h3>
            <p className="text-golden-small">
              {paymentStatus.error || 'Payment was not detected or timed out'}
            </p>
            <p className="text-xs text-golden-small">
              Please try again or contact support if the issue persists.
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={resetPayment}
                className="flex-1 bg-golden text-black hover:bg-golden/80"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://discord.gg/goldium', '_blank')}
                className="border-white/20 hover:border-golden/50"
              >
                Get Help
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Success */}
      {paymentStatus.status === 'completed' && (
        <Card className="p-6 glass-card border-green-500/50">
          <CardContent className="text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
            <h3 className="text-xl font-bold text-green-400">Payment Successful!</h3>
            <p className="text-golden-small">
              You have received {paymentStatus.amount?.toLocaleString()} GOLD tokens
            </p>
            
            {/* Transaction Hash */}
            {paymentStatus.txHash && (
              <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <label className="text-sm text-golden-small mb-2 block">Transaction Hash:</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={paymentStatus.txHash}
                    readOnly
                    className="bg-black/20 border-white/20 text-white font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open('https://solscan.io/token/APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump#transactions', '_blank')}
                    className="border-white/20 hover:border-golden/50"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-golden-small mt-2">
                  Click the link icon to view GOLDIUM CA
                </p>
              </div>
            )}
            
            <Button
              onClick={resetPayment}
              className="w-full bg-golden text-black hover:bg-golden/80"
            >
              Purchase More GOLD
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoldPurchaseQR;