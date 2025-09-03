import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useExternalWalletBalances } from '@/hooks/use-external-wallet-balances';
import { WalletStateManager } from '@/lib/wallet-state';
import { Skeleton } from '@/components/ui/skeleton';
import { useGoldBalance } from '@/hooks/use-gold-balance';
import { useExternalWallets } from '@/hooks/use-external-wallets';
import { RefreshCw } from 'lucide-react';
import logoImage from '@assets/k1xiYLna_400x400-removebg-preview_1754140723127.png';
import { SolanaIcon } from '@/components/solana-icon';

export function BalanceCards() {
  const { data: balances, isLoading } = useExternalWalletBalances();
  const goldBalance = useGoldBalance();
  const externalWallet = useExternalWallets();
  const [walletState, setWalletState] = useState(WalletStateManager.getState());
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Subscribe to global wallet state
  useEffect(() => {
    const unsubscribe = WalletStateManager.subscribe(() => {
      setWalletState(WalletStateManager.getState());
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // ALWAYS use external wallet balance when connected for REAL data
  const currentBalance = walletState.connected && walletState.address ? walletState.balance : (balances?.sol || 0);
  
  console.log('🔍 REAL Balance Cards Debug:', {
    connected: walletState.connected,
    selectedWallet: walletState.selectedWallet,
    walletBalance: walletState.balance,
    currentBalance: currentBalance,
    address: walletState.address?.slice(0, 8) + '...',
    selfContainedBalance: balances?.sol,
    isUsingRealBalance: walletState.connected && walletState.address
  });

  // Manual refresh function
  const handleRefreshBalance = async () => {
    if (!walletState.connected) return;
    
    setIsRefreshing(true);
    try {
      console.log('🔄 Manual balance refresh triggered');
      // Force refresh through external wallet hook
      if (externalWallet.refreshBalance) {
        await externalWallet.refreshBalance();
      }
      // Also refresh gold balance
      if (goldBalance.refreshBalance) {
        await goldBalance.refreshBalance();
      }
    } catch (error) {
      console.error('Manual refresh failed:', error);
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  // Use same balance structure as Swap tab for consistency
  const safeBalances = {
    sol: currentBalance, // Direct balance from wallet state
    gold: goldBalance.balance, // User's actual GOLD balance from real service
    stakedGold: goldBalance.stakedBalance // User's actual staked amount from real service
  };

  // Skip refresh balance calls to avoid RPC errors
  // React.useEffect(() => {
  //   if (wallet.refreshBalance) {
  //     const timer = setTimeout(() => {
  //       wallet.refreshBalance();
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [wallet.refreshBalance]);
  
  // Show wallet info if external wallet is connected
  const walletInfo = walletState.connected && walletState.selectedWallet ? 
    ` (${walletState.selectedWallet.charAt(0).toUpperCase() + walletState.selectedWallet.slice(1)})` : '';

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-defi-secondary/80 backdrop-blur-sm border-defi-accent/30">
            <CardContent className="p-6">
              <Skeleton className="h-6 w-32 mb-4" />
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {/* SOL Balance */}
      <Card className="group bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-white/20/20 hover:border-white/20/40 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                SOL Balance
              </h3>
              {walletInfo && (
                <p className="text-xs font-medium text-white/60 mt-1 tracking-wider uppercase">
                  {walletInfo.replace(/[()]/g, '')}
                </p>
              )}
            </div>
            <div className="relative">
              <SolanaIcon size={32} className="text-white group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-300"></div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-stats text-white tracking-tight">
              {currentBalance.toFixed(4)}
              <span className="text-lg font-normal text-white/70 ml-2">SOL</span>
            </p>
            <div className="flex items-center justify-between">
              <p className="font-small text-white/70">
                ≈ ${(currentBalance * 195.5).toFixed(2)} USD
              </p>
              <div className="flex items-center gap-2">
                {walletState.connected ? (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-small text-green-400">REAL</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleRefreshBalance}
                      disabled={isRefreshing}
                      className="h-6 w-6 p-0 hover:bg-white/10"
                    >
                      <RefreshCw className={`w-3 h-3 text-white/60 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                  </>
                ) : (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GOLD Balance */}
      <Card className="group bg-black backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-card-title text-white tracking-tight">
                GOLD Balance
              </h3>
              <p className="text-xs font-medium text-white/60 mt-1 tracking-wider uppercase">
                GOLDIUM TOKEN
              </p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="GOLD Token" 
                  className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <div className="text-white text-2xl font-bold hidden">🥇</div>
              </div>
              <div className="absolute inset-0 bg-white/10 rounded-full blur-xl group-hover:bg-white/20 transition-all duration-300"></div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="font-stats text-white tracking-tight">
              {safeBalances.gold.toFixed(2)}
              <span className="text-lg font-normal text-white/70 ml-2">GOLD</span>
            </p>
            <div className="flex items-center justify-between">
              <p className="font-small text-white/70">
                ≈ ${(safeBalances.gold * 20).toFixed(2)} USD
              </p>
              <div className="flex items-center gap-1">
                {goldBalance.isLoading ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-small text-green-400">REAL</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staked GOLD */}
      <Card className="group bg-gradient-to-br from-emerald-900/90 to-green-900/90 backdrop-blur-xl border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-500 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10">
        <CardContent className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent tracking-tight">
                Staked GOLD
              </h3>
              <p className="text-xs font-medium text-emerald-300/70 mt-1 tracking-wider uppercase">
                {goldBalance.stakingInfo.apy}% APY REWARDS
              </p>
            </div>
            <div className="relative">
              <div className="w-10 h-10 flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Staked GOLD" 
                  className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                />
                <div className="absolute -top-1 -right-1 text-emerald-400 text-sm animate-pulse">🔒</div>
              </div>
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl group-hover:bg-emerald-400/30 transition-all duration-300"></div>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-4xl font-black text-white tracking-tight font-mono">
              {safeBalances.stakedGold.toFixed(2)}
              <span className="text-lg font-normal text-emerald-300/80 ml-2">GOLD</span>
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-300">
                ≈ ${(safeBalances.stakedGold * 20).toFixed(2)} USD
              </p>
              {goldBalance.isLoading ? (
                <div className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              ) : (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
