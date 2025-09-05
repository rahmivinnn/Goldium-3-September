import React from 'react';
import { AlertTriangle, ExternalLink, RefreshCw, Info } from 'lucide-react';

interface SwapStatusAlertProps {
  isVisible: boolean;
  onClose: () => void;
  errorMessage?: string;
}

const SwapStatusAlert: React.FC<SwapStatusAlertProps> = ({ isVisible, onClose, errorMessage }) => {
  if (!isVisible) return null;

  const GOLD_CONTRACT_ADDRESS = 'GDfnEsia2WLAW5t8yx2X5j2mkfA74i5kwGdDuZHt7XmG';

  const dexLinks = [
    {
      name: 'pump.fun',
      url: `https://pump.fun/${GOLD_CONTRACT_ADDRESS}`,
      description: 'Primary GOLDIUM trading platform'
    },
    {
      name: 'Raydium',
      url: 'https://raydium.io/swap',
      description: 'Solana DEX aggregator'
    },
    {
      name: 'Jupiter',
      url: 'https://jup.ag',
      description: 'Multi-DEX aggregator'
    },
    {
      name: 'Orca',
      url: 'https://www.orca.so',
      description: 'User-friendly Solana DEX'
    }
  ];

  const infoLinks = [
    {
      name: 'Solscan',
      url: `https://solscan.io/token/${GOLD_CONTRACT_ADDRESS}`,
      description: 'Token information and transactions'
    },
    {
      name: 'DexScreener',
      url: `https://dexscreener.com/solana/${GOLD_CONTRACT_ADDRESS}`,
      description: 'Price charts and trading data'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900">GOLDIUM Swap Unavailable</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Info className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700 whitespace-pre-line">
                  {errorMessage}
                </div>
              </div>
            </div>
          )}

          {/* Manual Swap Options */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <ExternalLink className="h-5 w-5 mr-2" />
              Manual Swap Options
            </h3>
            <div className="grid gap-3">
              {dexLinks.map((dex, index) => (
                <a
                  key={index}
                  href={dex.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                >
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-blue-600">
                      {dex.name}
                    </div>
                    <div className="text-sm text-gray-500">{dex.description}</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500" />
                </a>
              ))}
            </div>
          </div>

          {/* Token Information */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Token Information
            </h3>
            <div className="grid gap-3">
              {infoLinks.map((info, index) => (
                <a
                  key={index}
                  href={info.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors group"
                >
                  <div>
                    <div className="font-medium text-gray-900 group-hover:text-green-600">
                      {info.name}
                    </div>
                    <div className="text-sm text-gray-500">{info.description}</div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-green-500" />
                </a>
              ))}
            </div>
          </div>

          {/* Retry Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
              <RefreshCw className="h-5 w-5 mr-2" />
              Retry Strategy
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Wait 5-10 minutes for API recovery</li>
              <li>• Check token migration status on Solscan</li>
              <li>• Try different DEX platforms manually</li>
              <li>• Contact support if issue persists</li>
            </ul>
          </div>

          {/* Contract Address */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">GOLDIUM Contract Address</h3>
            <div className="flex items-center space-x-2">
              <code className="text-xs bg-white px-2 py-1 rounded border font-mono text-gray-700 flex-1">
                {GOLD_CONTRACT_ADDRESS}
              </code>
              <button
                onClick={() => navigator.clipboard.writeText(GOLD_CONTRACT_ADDRESS)}
                className="text-xs bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SwapStatusAlert;