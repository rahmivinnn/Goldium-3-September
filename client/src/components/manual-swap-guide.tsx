import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, ExternalLink, Copy, Check } from 'lucide-react';

interface ManualSwapGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ManualSwapGuide({ isOpen, onClose }: ManualSwapGuideProps) {
  const [copiedAddress, setCopiedAddress] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/95 border border-gray-800/50 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/95 border-b border-gray-800/50 p-6 rounded-t-3xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl">🔄</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Manual Swap Guide</h2>
                <p className="text-gray-400 text-sm">Step-by-step guide to swap SOL for GOLD tokens</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-xl"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* GOLD Token Info */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <img src="/goldium-logo.png" alt="GOLD" className="w-6 h-6" />
              GOLD Token Information
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-sm">Contract Address:</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-gray-900/50 text-amber-400 px-3 py-2 rounded-lg text-sm font-mono flex-1 break-all">
                    APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump
                  </code>
                  <Button
                    onClick={() => copyToClipboard('APkBg8kzMBpVKxvgrw67vkd5KuGWqSu2GVb19eK4pump')}
                    size="sm"
                    variant="outline"
                    className="text-gray-400 hover:text-white border-gray-600"
                  >
                    {copiedAddress ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm">Network:</label>
                <div className="flex items-center gap-2 mt-1">
                  <img src="/solana-logo-official.png" alt="Solana" className="w-5 h-5" />
                  <span className="text-white font-medium">Solana Mainnet</span>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Methods */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Swap Methods</h3>
            
            {/* Method 1: Jupiter */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">🪐</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Jupiter DEX</h4>
                  <p className="text-gray-400 text-sm">Recommended - Best rates and liquidity</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Go to <a href="https://jup.ag" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">jup.ag</a></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Connect your Solana wallet (Phantom, Solflare, etc.)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Select SOL as "From" token</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Paste GOLD contract address as "To" token</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                  <span>Enter amount and confirm swap</span>
                </div>
              </div>
              <Button
                onClick={() => window.open('https://jup.ag', '_blank')}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Jupiter DEX
              </Button>
            </div>

            {/* Method 2: Raydium */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Raydium DEX</h4>
                  <p className="text-gray-400 text-sm">Alternative DEX with good liquidity</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                  <span>Go to <a href="https://raydium.io" target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:text-amber-300 underline">raydium.io</a></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                  <span>Connect your wallet</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                  <span>Go to Swap section</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                  <span>Add GOLD token using contract address</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-6 h-6 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                  <span>Execute swap</span>
                </div>
              </div>
              <Button
                onClick={() => window.open('https://raydium.io', '_blank')}
                className="w-full mt-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Raydium DEX
              </Button>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-amber-400 mb-3 flex items-center gap-2">
              <span>⚠️</span>
              Important Notes
            </h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Always verify the contract address before swapping</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Keep some SOL for transaction fees (0.001-0.01 SOL)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Check slippage tolerance (1-5% recommended)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 mt-1">•</span>
                <span>Transactions are irreversible once confirmed</span>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center">
            <p className="text-gray-400 text-sm mb-4">Need help? Contact our support team</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => window.open('https://twitter.com/goldiumofficial', '_blank')}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Twitter Support
              </Button>
              <Button
                onClick={() => window.open('https://t.me/goldiumofficial', '_blank')}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Telegram
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}