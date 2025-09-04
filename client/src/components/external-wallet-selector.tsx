import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Wallet, Copy, ExternalLink, Check } from 'lucide-react';
import { useExternalWallets, SupportedWallet } from '@/hooks/use-external-wallets';
import { useToast } from '@/hooks/use-toast';
import { useGoldBalance } from '@/hooks/use-gold-balance';
import { SOLSCAN_BASE_URL } from '@/lib/constants';

interface WalletOption {
  type: SupportedWallet;
  name: string;
  icon: string;
  description: string;
}

// Wallet Logo Components (using emoji fallback for reliability)
const WalletLogos = {
  phantom: '🟣',
  solflare: '🔥', 
  backpack: '🎒',
  trust: '🔷'
};

// Wallet Logo Images (local fallback)
const WalletImages = {
  phantom: '/wallets/phantom.png',
  solflare: '/wallets/solflare.png',
  backpack: '/wallets/backpack.png',
  trust: '/wallets/trust.png'
};

// Wallet Logo Emojis (primary display)
const WalletEmojis = {
  phantom: '👻',
  solflare: '☀️',
  backpack: '🎒',
  trust: '🛡️'
};

const walletOptions: WalletOption[] = [
  {
    type: 'phantom',
    name: 'Phantom',
    icon: 'phantom',
    description: 'Most popular Solana wallet',
  },
  {
    type: 'solflare',
    name: 'Solflare',
    icon: 'solflare',
    description: 'Feature-rich Solana wallet',
  },
  {
    type: 'backpack',
    name: 'Backpack',
    icon: 'backpack',
    description: 'Modern crypto wallet',
  },
  {
    type: 'trust',
    name: 'Trust Wallet',
    icon: 'trust',
    description: 'Secure multi-coin wallet',
  },
];

export function ExternalWalletSelector() {
  const wallet = useExternalWallets();
  const { toast } = useToast();
   const [isOpen, setIsOpen] = useState(false);
   const goldBalance = useGoldBalance();

  const availableWallets = wallet.getAvailableWallets();
  const currentWallet = walletOptions.find(w => w.type === wallet.selectedWallet);

  // Copy wallet address to clipboard
  const copyAddress = async () => {
    if (!wallet.address) return;
    
    try {
      await navigator.clipboard.writeText(wallet.address);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  // View wallet on Solscan
  const viewOnSolscan = () => {
    if (!wallet.address) return;
    window.open(`${SOLSCAN_BASE_URL}/account/${wallet.address}`, '_blank');
  };

  // Handle wallet selection with forced popup
  const handleWalletSelect = async (walletType: SupportedWallet) => {
    if (wallet.selectedWallet === walletType) {
      setIsOpen(false);
      return;
    }

    // Show connecting state immediately
    setIsOpen(false);
    
    try {
      // Show switching message if already connected to another wallet
      if (wallet.connected && wallet.selectedWallet) {
        toast({
          title: "Switching Wallets",
          description: `Switching from ${walletOptions.find(w => w.type === wallet.selectedWallet)?.name} to ${walletOptions.find(w => w.type === walletType)?.name}`,
        });
      }
      
      // Direct wallet connection through our hook only - avoid double connection
      await wallet.connectWallet(walletType);
      
      toast({
        title: "Wallet Connected",
        description: `Successfully connected to ${walletOptions.find(w => w.type === walletType)?.name}`,
      });
    } catch (error: any) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || `Please approve the connection in your ${walletOptions.find(w => w.type === walletType)?.name} extension popup`,
        variant: "destructive",
      });
    }
  };

  // Show connect button if not connected
  if (!wallet.connected) {
    return (
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline"
            disabled={wallet.connecting}
            className="chainzoku-btn bg-gray-700 hover:bg-gray-600 text-white font-semibold border-none shadow-lg hover:scale-[1.02] transition-all duration-300 font-['Inter'] tracking-wide"
          >
            <Wallet className="w-4 h-4 mr-2" />
            {wallet.connecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          align="end" 
          className="w-80 bg-black/95 border-white/20 backdrop-blur-xl z-50 shadow-2xl shadow-white/10 rounded-xl"
        >
          <DropdownMenuLabel className="text-white px-4 py-3 font-['Space_Grotesk'] font-bold text-base tracking-tight">Connect Your Wallet</DropdownMenuLabel>
          
          <div className="p-2 space-y-1">
            {walletOptions.map((walletOption) => {
              const isAvailable = availableWallets.includes(walletOption.type);
              
              return (
                <DropdownMenuItem
                  key={walletOption.type}
                  onClick={() => isAvailable && handleWalletSelect(walletOption.type)}
                  className={`
                    text-white hover:bg-white/10 hover:border-white/20 cursor-pointer p-4 rounded-xl transition-all duration-300 border border-transparent
                    ${!isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02]'}
                  `}
                  disabled={!isAvailable}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8">
                        <img 
                          src={WalletImages[walletOption.icon as keyof typeof WalletImages]} 
                          alt={walletOption.name} 
                          className="w-6 h-6 rounded-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const emojiSpan = document.createElement('span');
                            emojiSpan.textContent = WalletEmojis[walletOption.icon as keyof typeof WalletEmojis] || '💼';
                            emojiSpan.className = 'text-xl';
                            target.parentNode?.appendChild(emojiSpan);
                          }}
                        />
                      </div>
                      <div>
                        <div className="font-medium">{walletOption.name}</div>
                        <div className="text-xs text-slate-400">{walletOption.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {isAvailable ? (
                        <span className="text-xs text-white px-2 py-1 bg-white/20 rounded">
                          Available
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 px-2 py-1 bg-slate-700/50 rounded">
                          Not Found
                        </span>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </div>

          {availableWallets.length === 0 && (
            <div className="p-4 text-center text-sm text-white/70 border-t border-white/20 mt-2">
              <p className="mb-2">No wallet extensions found.</p>
              <p className="text-xs">Please install and refresh the page:</p>
              <div className="text-xs mt-1 space-y-1">
                <div>• Phantom Wallet</div>
                <div>• Solflare Wallet</div>
                <div>• Backpack Wallet</div>
                <div>• Trust Wallet</div>
              </div>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Show connected wallet info
  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline"
          className="bg-black backdrop-blur-xl border-white/20 hover:border-white/40 text-white hover:shadow-lg hover:shadow-white/10 transition-all duration-300"
        >
          <div className="mr-2 flex items-center justify-center w-5 h-5">
            {currentWallet ? (
                <img 
                  src={WalletImages[currentWallet.icon as keyof typeof WalletImages]} 
                  alt={currentWallet.name} 
                  className="w-5 h-5 rounded-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/${currentWallet.icon}/icon.png`;
                  }}
                />
              ) : (
                <Wallet className="w-4 h-4" />
              )}
          </div>
          <span className="hidden sm:inline">
            {wallet.address ? `${wallet.address.slice(0, 4)}...${wallet.address.slice(-4)}` : 'Wallet'}
          </span>
          <span className="sm:hidden">{currentWallet?.name || 'Connected'}</span>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-black border-white/20"
      >
        {/* Connected Wallet Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-white">Connected Wallet</span>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-white rounded-full" />
              <span className="text-xs text-white">Active</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Wallet:</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-4 h-4">
                  {currentWallet ? (
                  <img 
                    src={WalletImages[currentWallet.icon as keyof typeof WalletImages]} 
                    alt={currentWallet.name} 
                    className="w-5 h-5 rounded-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const emojiSpan = document.createElement('span');
                      emojiSpan.textContent = WalletEmojis[currentWallet.icon as keyof typeof WalletEmojis] || '💼';
                      emojiSpan.className = 'text-lg';
                      target.parentNode?.appendChild(emojiSpan);
                    }}
                  />
                ) : (
                  <Wallet className="w-3 h-3" />
                )}
                </div>
                <span className="text-xs text-white">{currentWallet?.name || 'Unknown Wallet'}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">Address:</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-white">
                  {wallet.address ? `${wallet.address.slice(0, 8)}...${wallet.address.slice(-8)}` : 'N/A'}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0 hover:bg-white/20"
                  disabled={!wallet.address}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/60">SOL Balance:</span>
              <span className="text-xs font-medium text-white">
                {wallet.balance.toFixed(4)} SOL
              </span>
            </div>
            
            <div className="flex items-center justify-between">
               <span className="text-xs text-white/60">GOLD Balance:</span>
               <span className="text-xs font-medium text-white">
                 {goldBalance.isLoading ? 'Loading...' : `${goldBalance.balance.toFixed(2)} GOLD`}
               </span>
             </div>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-white/20" />

        {/* Switch Wallet */}
        <DropdownMenuLabel className="text-white px-4">Switch Wallet</DropdownMenuLabel>
        
        <div className="p-2 space-y-1">
          {walletOptions.map((walletOption) => {
            const isAvailable = availableWallets.includes(walletOption.type);
            const isSelected = wallet.selectedWallet === walletOption.type;
            
            return (
              <DropdownMenuItem
                key={walletOption.type}
                onClick={() => isAvailable && !isSelected && handleWalletSelect(walletOption.type)}
                className={`
                  text-white hover:bg-white/10 cursor-pointer p-3 rounded-md
                  ${isSelected ? 'bg-white/20' : ''}
                  ${!isAvailable ? 'opacity-50' : ''}
                `}
                disabled={!isAvailable || isSelected}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      <img 
                        src={WalletImages[walletOption.icon as keyof typeof WalletImages]} 
                        alt={walletOption.name} 
                        className="w-6 h-6 rounded-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/${walletOption.icon}/icon.png`;
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{walletOption.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <span className="text-xs text-white/60">{walletOption.description}</span>
                    </div>
                  </div>
                  {!isAvailable && (
                    <span className="text-xs text-white/60">Not Detected</span>
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator className="bg-white/20" />

        {/* Wallet Actions */}
        <div className="p-2">
          <DropdownMenuItem 
            onClick={copyAddress}
            className="text-white hover:bg-white/10 cursor-pointer"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={viewOnSolscan}
            className="text-white hover:bg-white/10 cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Solscan
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={wallet.disconnectWallet}
            className="text-white hover:bg-white/10 cursor-pointer"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </div>

        {/* Network Info */}
        <DropdownMenuSeparator className="bg-white/20" />
        <div className="p-4">
          <div className="text-center">
            <div className="inline-flex items-center px-3 py-1 bg-white/10 rounded-full border border-white/20">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse mr-2" />
          <span className="text-xs font-medium text-white">Solana Mainnet</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}