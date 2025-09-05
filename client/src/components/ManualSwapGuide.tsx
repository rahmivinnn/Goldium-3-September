import React, { useState } from 'react';
import { GOLD_CONTRACT_ADDRESS } from '../services/gold-token-service';

interface ManualSwapGuideProps {
  isOpen: boolean;
  onClose: () => void;
  solAmount?: number;
}

const ManualSwapGuide: React.FC<ManualSwapGuideProps> = ({ isOpen, onClose, solAmount }) => {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📖 Manual GOLDIUM Swap Guide</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Alert */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400 text-xl">⚠️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>API Temporarily Unavailable:</strong> All DEX APIs are currently experiencing issues. 
                    You can still swap GOLDIUM manually using the methods below.
                  </p>
                </div>
              </div>
            </div>

            {/* Token Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">🪙 GOLDIUM Token Information</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-700">Contract Address:</span>
                  <div className="flex items-center space-x-2">
                    <code className="bg-blue-100 px-2 py-1 rounded text-xs font-mono">
                      {GOLD_CONTRACT_ADDRESS.slice(0, 8)}...{GOLD_CONTRACT_ADDRESS.slice(-8)}
                    </code>
                    <button
                      onClick={() => copyToClipboard(GOLD_CONTRACT_ADDRESS)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {copiedAddress ? '✅' : '📋'}
                    </button>
                  </div>
                </div>
                {solAmount && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700">Swap Amount:</span>
                    <span className="text-sm font-semibold">{solAmount} SOL</span>
                  </div>
                )}
              </div>
            </div>

            {/* Method 1: pump.fun */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm mr-2">Method 1</span>
                🚀 pump.fun (Recommended)
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  pump.fun is the primary platform for GOLDIUM trading. This is usually the most reliable method.
                </p>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-700 mb-2">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Visit <a href={`https://pump.fun/${GOLD_CONTRACT_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">pump.fun/GOLDIUM</a></li>
                    <li>Connect your Solana wallet (Phantom, Solflare, etc.)</li>
                    <li>Enter the amount of SOL you want to swap</li>
                    <li>Click "Buy" and confirm the transaction</li>
                    <li>Wait for transaction confirmation</li>
                  </ol>
                </div>
                <a
                  href={`https://pump.fun/${GOLD_CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm"
                >
                  🚀 Open pump.fun
                </a>
              </div>
            </div>

            {/* Method 2: Jupiter */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2">Method 2</span>
                🪐 Jupiter DEX
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Jupiter aggregates multiple DEXs and may find routes when other platforms fail.
                </p>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-700 mb-2">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Visit <a href="https://jup.ag" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">jup.ag</a></li>
                    <li>Connect your wallet</li>
                    <li>Select SOL as input token</li>
                    <li>Paste GOLDIUM contract address in output token field</li>
                    <li>Enter swap amount and execute</li>
                  </ol>
                </div>
                <a
                  href="https://jup.ag"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  🪐 Open Jupiter
                </a>
              </div>
            </div>

            {/* Method 3: Raydium */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm mr-2">Method 3</span>
                ⚡ Raydium DEX
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Raydium is a major Solana DEX that may have GOLDIUM liquidity pools.
                </p>
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-medium text-gray-700 mb-2">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                    <li>Visit <a href="https://raydium.io/swap" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">raydium.io/swap</a></li>
                    <li>Connect your wallet</li>
                    <li>Select SOL as input</li>
                    <li>Search for GOLDIUM or paste contract address</li>
                    <li>Complete the swap transaction</li>
                  </ol>
                </div>
                <a
                  href="https://raydium.io/swap"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
                >
                  ⚡ Open Raydium
                </a>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <h3 className="font-semibold text-red-800 mb-2">🔧 Troubleshooting</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                <li><strong>Token not found:</strong> Make sure to paste the full contract address</li>
                <li><strong>No liquidity:</strong> Try a different DEX or smaller amount</li>
                <li><strong>High slippage:</strong> GOLDIUM may have limited liquidity, adjust slippage tolerance</li>
                <li><strong>Transaction failed:</strong> Check your SOL balance for gas fees</li>
              </ul>
            </div>

            {/* Verification */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">✅ Verify Your Transaction</h3>
              <p className="text-sm text-green-700 mb-2">
                After completing your swap, verify it on Solscan:
              </p>
              <a
                href={`https://solscan.io/token/${GOLD_CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors text-sm"
              >
                📊 View on Solscan
              </a>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualSwapGuide;