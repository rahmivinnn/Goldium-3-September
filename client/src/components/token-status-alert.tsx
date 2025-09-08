import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ExternalLink, AlertTriangle, Info } from 'lucide-react';
import { GOLDIUM_TOKEN_ADDRESS } from '@/lib/constants';

interface TokenStatusAlertProps {
  onShowManualGuide: () => void;
}

export const TokenStatusAlert: React.FC<TokenStatusAlertProps> = ({ onShowManualGuide }) => {
  const openSolscan = () => {
    window.open(`https://solscan.io/token/${GOLDIUM_TOKEN_ADDRESS}`, '_blank');
  };

  const openJupiter = () => {
    window.open('https://jup.ag/', '_blank');
  };

  const openRaydium = () => {
    window.open('https://raydium.io/swap/', '_blank');
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Main Alert */}
      <Alert className="border-yellow-500/50 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-500" />
        <AlertTitle className="text-yellow-500">Status Token GOLDIUM</AlertTitle>
        <AlertDescription className="text-yellow-200 mt-2">
          Token GOLDIUM (APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump) saat ini tidak tersedia 
          di platform DEX utama (Jupiter, Raydium, pump.fun). Ini menyebabkan transaksi swap otomatis gagal.
        </AlertDescription>
      </Alert>

      {/* Solution Alert */}
      <Alert className="border-blue-500/50 bg-blue-500/10">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertTitle className="text-blue-500">Solusi Alternatif</AlertTitle>
        <AlertDescription className="text-blue-200 mt-2">
          <div className="space-y-3">
            <p>Untuk saat ini, Anda dapat melakukan trading GOLDIUM secara manual melalui:</p>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openJupiter}
                className="text-blue-300 border-blue-500/50 hover:bg-blue-500/20"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Jupiter DEX
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openRaydium}
                className="text-blue-300 border-blue-500/50 hover:bg-blue-500/20"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Raydium
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openSolscan}
                className="text-blue-300 border-blue-500/50 hover:bg-blue-500/20"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Lihat di Solscan
              </Button>
            </div>
            
            <Button 
              onClick={onShowManualGuide}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white"
            >
              📖 Lihat Panduan Trading Manual
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Deployment Info */}
      <Alert className="border-green-500/50 bg-green-500/10">
        <Info className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-500">Status Deployment</AlertTitle>
        <AlertDescription className="text-green-200 mt-2">
          <div className="space-y-2">
            <p>✅ Aplikasi sudah ter-deploy di mainnet Solana</p>
            <p>✅ Transaksi akan muncul di Solscan setelah berhasil</p>
            <p>✅ Contract address: {GOLDIUM_TOKEN_ADDRESS.slice(0, 8)}...{GOLDIUM_TOKEN_ADDRESS.slice(-8)}</p>
            
            <div className="mt-3 p-3 bg-green-500/20 rounded-lg">
              <p className="text-sm text-green-100">
                <strong>Catatan:</strong> Untuk muncul di DeFi activities Solscan, token perlu memiliki 
                likuiditas aktif di DEX. Saat ini GOLDIUM belum memiliki pool likuiditas yang aktif.
              </p>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TokenStatusAlert;