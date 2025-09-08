import React, { useState } from 'react';

export function GamingHub() {
  const [selectedGame, setSelectedGame] = useState(null);

  const games = [
    {
      id: 'solflip',
      name: 'SolFlip Memory',
      description: 'Test your memory with Solana-themed cards',
      icon: '🧠',
      color: 'from-blue-500 to-cyan-500',
      status: 'Available'
    },
    {
      id: 'shard-chase',
      name: 'Shard Chase',
      description: 'Collect golden shards in this exciting adventure',
      icon: '💎',
      color: 'from-amber-500 to-orange-500',
      status: 'Available'
    },
    {
      id: 'token-race',
      name: 'Token Race',
      description: 'Race your tokens to the finish line',
      icon: '🏁',
      color: 'from-green-500 to-emerald-500',
      status: 'Coming Soon'
    },
    {
      id: 'defi-battle',
      name: 'DeFi Battle',
      description: 'Battle with DeFi strategies and earn rewards',
      icon: '⚔️',
      color: 'from-purple-500 to-pink-500',
      status: 'Coming Soon'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Gaming Hub
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Play crypto games, earn rewards, and compete with other players in our integrated gaming ecosystem
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {games.map((game) => (
            <div
              key={game.id}
              className={`group bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-${game.color.split(' ')[0].split('-')[1]}-500/50 transition-all duration-500 cursor-pointer hover:scale-105 hover:shadow-2xl ${
                game.status === 'Coming Soon' ? 'opacity-60' : ''
              }`}
              onClick={() => game.status === 'Available' && setSelectedGame(game)}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-800/50 border border-gray-600/30 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-4xl">{game.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{game.name}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{game.description}</p>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  game.status === 'Available' 
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {game.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">🏆 Leaderboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥇</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Top Player</h3>
              <p className="text-gray-300">CryptoMaster123</p>
              <p className="text-amber-400 font-bold">2,450 GOLD</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥈</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Second Place</h3>
              <p className="text-gray-300">DeFiWarrior</p>
              <p className="text-gray-400 font-bold">1,890 GOLD</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥉</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Third Place</h3>
              <p className="text-gray-300">SolanaPro</p>
              <p className="text-orange-400 font-bold">1,320 GOLD</p>
            </div>
          </div>
        </div>

        {/* Game Modal */}
        {selectedGame && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-2xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">{selectedGame.name}</h2>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gray-800/50 border border-gray-600/30 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-6xl">{selectedGame.icon}</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">{selectedGame.description}</p>
                <div className="bg-green-500/20 text-green-400 border border-green-500/30 rounded-full px-6 py-3 inline-block mb-6">
                  Available to Play
                </div>
              </div>
              <div className="flex gap-4">
                <button className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Start Playing
                </button>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="px-8 py-4 border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white rounded-xl font-semibold transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}