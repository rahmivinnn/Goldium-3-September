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
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400 text-xl">🚨</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    <strong>Token Status:</strong> GOLDIUM saat ini tidak tersedia di platform DEX utama 
                    (Jupiter, Raydium, pump.fun). Token mungkin belum memiliki likuiditas yang cukup atau 
                    sedang dalam proses migrasi. Silakan coba metode manual di bawah ini.
                  </p>
                </div>
              </div>
            </div>

            {/* Status Update */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-blue-400 text-xl">ℹ️</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <strong>Update Terbaru:</strong> Berdasarkan testing, semua platform DEX (Jupiter, pump.fun, Raydium) 
                    menunjukkan bahwa token GOLDIUM tidak memiliki pool likuiditas aktif. Ini normal untuk token baru 
                    yang belum listing resmi di exchange.
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
            <div className="border rounded-lg p-4 opacity-60">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm mr-2">Method 1</span>
                🚀 pump.fun (Tidak Tersedia)
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> pump.fun mengembalikan error 530 (server tidak tersedia). 
                  Platform sedang mengalami masalah teknis.
                </p>
                <div className="bg-red-50 p-3 rounded">
                  <h4 className="font-medium text-red-700 mb-2">Error yang Ditemukan:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                    <li>HTTP 530 - Service Temporarily Unavailable</li>
                    <li>Server pump.fun sedang maintenance atau overload</li>
                    <li>Tidak dapat mengakses data token GOLDIUM</li>
                  </ul>
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
            <div className="border rounded-lg p-4 opacity-60">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm mr-2">Method 2</span>
                🪐 Jupiter DEX (Tidak Tersedia)
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> Jupiter tidak dapat menemukan route untuk token GOLDIUM. 
                  Kemungkinan tidak ada likuiditas di platform yang terintegrasi.
                </p>
                <div className="bg-red-50 p-3 rounded">
                  <h4 className="font-medium text-red-700 mb-2">Masalah yang Ditemukan:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                    <li>Tidak ada route swap yang tersedia</li>
                    <li>Token GOLDIUM tidak ditemukan di aggregator</li>
                    <li>Kemungkinan belum ada pool likuiditas</li>
                  </ul>
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
            <div className="border rounded-lg p-4 opacity-60">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm mr-2">Method 3</span>
                ⚡ Raydium DEX (Tidak Tersedia)
              </h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  <strong>Status:</strong> Raydium tidak memiliki pool likuiditas untuk token GOLDIUM. 
                  Tidak ada data harga atau volume trading yang tersedia.
                </p>
                <div className="bg-red-50 p-3 rounded">
                  <h4 className="font-medium text-red-700 mb-2">Hasil Testing:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                    <li>Tidak ada pool GOLDIUM yang ditemukan</li>
                    <li>Tidak ada data harga di Raydium API</li>
                    <li>Token belum listing di platform ini</li>
                  </ul>
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

            {/* Rekomendasi Solusi */}
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <h3 className="font-semibold text-green-800 mb-2">💡 Rekomendasi Solusi</h3>
              <div className="space-y-3">
                <div className="bg-green-100 p-3 rounded">
                  <h4 className="font-medium text-green-800 mb-2">Opsi 1: Tunggu Listing Resmi</h4>
                  <p className="text-sm text-green-700">
                    Token GOLDIUM mungkin sedang dalam proses listing di exchange. 
                    Pantau pengumuman resmi dari tim developer.
                  </p>
                </div>
                
                <div className="bg-green-100 p-3 rounded">
                  <h4 className="font-medium text-green-800 mb-2">Opsi 2: Cek Platform Alternatif</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                    <li>DexScreener - untuk monitoring token baru</li>
                    <li>Birdeye - analytics dan trading data</li>
                    <li>Photon SOL - platform trading alternatif</li>
                  </ul>
                </div>
                
                <div className="bg-green-100 p-3 rounded">
                  <h4 className="font-medium text-green-800 mb-2">Opsi 3: Direct Transfer</h4>
                  <p className="text-sm text-green-700">
                    Jika Anda sudah memiliki token GOLDIUM, gunakan fitur Send/Transfer 
                    di aplikasi untuk mengirim ke wallet lain.
                  </p>
                </div>
              </div>
            </div>

            {/* Troubleshooting */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
              <h3 className="font-semibold text-orange-800 mb-2">🔧 Troubleshooting</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-orange-700">
                <li><strong>Token tidak ditemukan:</strong> Pastikan contract address benar dan lengkap</li>
                <li><strong>Tidak ada likuiditas:</strong> Token belum memiliki pool trading aktif</li>
                <li><strong>Slippage tinggi:</strong> Normal untuk token dengan likuiditas rendah</li>
                <li><strong>Transaksi gagal:</strong> Periksa saldo SOL untuk biaya gas</li>
                <li><strong>Platform error:</strong> Coba lagi nanti atau gunakan platform lain</li>
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