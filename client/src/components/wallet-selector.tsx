import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface WalletOption {
  name: string;
  icon: string;
  description: string;
  installed: boolean;
  connect: () => Promise<void>;
}

interface WalletSelectorProps {
  onConnect: (walletName: string) => Promise<void>;
  connecting: boolean;
  connected: boolean;
  currentWallet?: string;
}

export function WalletSelector({ onConnect, connecting, connected, currentWallet }: WalletSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  // Wallet Logo Images (official URLs from trusted sources)
  const WalletImages = {
    phantom: 'https://phantom.app/img/phantom-logo.png',
    solflare: 'https://solflare.com/img/logo.png',
    backpack: 'https://backpack.app/logo.png',
    trust: 'https://trustwallet.com/assets/images/media/assets/trust_platform.png'
  };

  const wallets: WalletOption[] = [
    {
      name: 'Phantom',
      icon: 'phantom',
      description: 'Connect using Phantom wallet',
      installed: !!(window as any).solana?.isPhantom,
      connect: async () => {
        if ((window as any).solana?.isPhantom) {
          await onConnect('Phantom');
          setOpen(false);
        } else {
          window.open('https://phantom.app/', '_blank');
        }
      }
    },
    {
      name: 'Solflare',
      icon: 'solflare',
      description: 'Connect using Solflare wallet',
      installed: !!(window as any).solflare?.isSolflare,
      connect: async () => {
        if ((window as any).solflare?.isSolflare) {
          await onConnect('Solflare');
          setOpen(false);
        } else {
          window.open('https://solflare.com/', '_blank');
        }
      }
    },
    {
      name: 'Backpack',
      icon: 'backpack',
      description: 'Connect using Backpack wallet',
      installed: !!(window as any).backpack?.isBackpack,
      connect: async () => {
        if ((window as any).backpack?.isBackpack) {
          await onConnect('Backpack');
          setOpen(false);
        } else {
          window.open('https://backpack.app/', '_blank');
        }
      }
    },
    {
      name: 'Trust Wallet',
      icon: '🛡️',
      description: 'Connect using Trust Wallet',
      installed: !!(window as any).trustwallet || 
                  !!(window as any).trust ||
                  (!!(window as any).solana && ((window as any).solana.isTrust || (window as any).solana.isTrustWallet)),
      connect: async () => {
        let hasAdapter = false;
        
        // Check various Trust Wallet injection methods
        if ((window as any).trustwallet || 
            (window as any).trust || 
            ((window as any).solana?.isTrust) || 
            ((window as any).solana?.isTrustWallet)) {
          hasAdapter = true;
        }
        
        if (hasAdapter) {
          await onConnect('Trust Wallet');
          setOpen(false);
        } else {
          window.open('https://trustwallet.com/', '_blank');
        }
      }
    }
  ];

  if (connected) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-300">Connected: {currentWallet}</span>
        <Button 
          onClick={() => onConnect('disconnect')}
          className="bg-black hover:bg-black text-white"
          size="sm"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-black to-gray-900 hover:from-black hover:to-gray-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          disabled={connecting}
        >
          {connecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-defi-secondary border-defi-accent max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-xl font-bold">
            Connect Your Wallet
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-6">
          {wallets.map((wallet) => (
            <Card 
              key={wallet.name}
              className={`bg-defi-accent/50 border-defi-accent hover:border-yellow-primary/60 transition-all duration-200 cursor-pointer ${
                selectedWallet === wallet.name ? 'border-yellow-primary' : ''
              }`}
              onClick={() => setSelectedWallet(wallet.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={WalletImages[wallet.icon as keyof typeof WalletImages]} 
                      alt={wallet.name}
                      className="w-8 h-8 rounded-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://raw.githubusercontent.com/solana-labs/wallet-adapter/master/packages/wallets/${wallet.icon}/icon.png`;
                      }}
                    />
                    <div>
                      <h3 className="font-medium text-white">{wallet.name}</h3>
                      <p className="text-sm text-gray-400">{wallet.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {wallet.installed ? (
                      <span className="text-xs text-white bg-black/20 px-2 py-1 rounded">
                        Installed
                      </span>
                    ) : (
                      <span className="text-xs text-white bg-black/20 px-2 py-1 rounded">
                        Not Installed
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            New to Solana wallets?{' '}
            <a 
              href="https://docs.solana.com/wallet-guide" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-yellow-primary hover:underline"
            >
              Learn more
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}