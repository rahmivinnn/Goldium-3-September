import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, RefreshCw, Clock, ArrowUpDown } from 'lucide-react';
import { useSolanaWallet } from './solana-wallet-provider';
import { getTransactionHistory, Transaction } from '@/lib/historyUtils';
import { SOLSCAN_BASE_URL } from '@/lib/constants';
import logoImage from '@assets/k1xiYLna_400x400-removebg-preview_1754275575442.png';

export function CleanTransactionHistory() {
  const { connected } = useSolanaWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (connected) {
      loadTransactions();
    }
  }, [connected]);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const history = await getTransactionHistory();
      setTransactions(history.slice(0, 10)); // Show last 10 transactions
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'swap': return <ArrowUpDown className="w-4 h-4" />;
      case 'stake': return <Clock className="w-4 h-4" />;
      case 'send': return <ExternalLink className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'swap': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'stake': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'send': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default: return 'bg-white/20 text-white border-white/30';
    }
  };

  if (!connected) {
    return (
      <div className="max-w-xl mx-auto">
        <Card className="bg-black border-white/10 premium-card">
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <h3 className="font-card-title text-white mb-2">Transaction History</h3>
            <p className="font-small text-white/70">Connect your wallet to view transaction history</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* HEADER */}
      <Card className="bg-black border-white/10 premium-card sophisticated-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-card-title text-white mb-1">Transaction History</h2>
              <p className="font-small text-white/70">Your recent DeFi activity</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadTransactions}
              disabled={isLoading}
              className="bg-black border-white/20 hover:border-white/40 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TRANSACTIONS LIST */}
      {isLoading ? (
        <Card className="bg-black border-white/10 premium-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-white/10 rounded w-3/4"></div>
                      <div className="h-3 bg-white/10 rounded w-1/2"></div>
                    </div>
                    <div className="w-16 h-4 bg-white/10 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : transactions.length === 0 ? (
        <Card className="bg-black border-white/10 premium-card">
          <CardContent className="p-8 text-center">
            <Clock className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <h3 className="font-card-title text-white mb-2">No Transactions</h3>
            <p className="font-small text-white/70">Start trading to see your transaction history</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-black border-white/10 premium-card sophisticated-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-black/50 border border-white/10 rounded-xl hover:border-white/20 transition-all duration-300">
                  
                  {/* TRANSACTION ICON */}
                  <div className="w-10 h-10 bg-black border border-white/20 rounded-lg flex items-center justify-center">
                    {getTransactionIcon(tx.type)}
                  </div>
                  
                  {/* TRANSACTION INFO */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-body text-white font-medium capitalize">{tx.type}</span>
                      <Badge className={`text-xs border ${getStatusColor(tx.type)}`}>
                        {tx.type.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-small text-white/70">
                        {tx.amount} {tx.tokenFrom}
                        {tx.type === 'swap' && ` → ${tx.tokenTo}`}
                      </span>
                      <span className="text-white/50">•</span>
                      <span className="font-small text-white/70">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* VIEW ON SOLSCAN */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white/70 hover:text-white p-2"
                    onClick={() => window.open(`${SOLSCAN_BASE_URL}/tx/${tx.txSignature}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATS SUMMARY */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-black border-white/10 premium-card">
          <CardContent className="p-4 text-center">
            <div className="font-stats holographic-gold mb-1">{transactions.length}</div>
            <div className="font-small text-white/70">Total Txs</div>
          </CardContent>
        </Card>
        <Card className="bg-black border-white/10 premium-card">
          <CardContent className="p-4 text-center">
            <div className="font-stats holographic-gold mb-1">
              {transactions.filter(tx => tx.type === 'swap').length}
            </div>
            <div className="font-small text-white/70">Swaps</div>
          </CardContent>
        </Card>
        <Card className="bg-black border-white/10 premium-card">
          <CardContent className="p-4 text-center">
            <div className="font-stats holographic-gold mb-1">
              {transactions.filter(tx => tx.type === 'stake').length}
            </div>
            <div className="font-small text-white/70">Stakes</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}