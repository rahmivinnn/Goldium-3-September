import React, { useState, useEffect, useRef } from 'react';
import { RPGGame } from './rpg-game';

export function GamingHub() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [showRPG, setShowRPG] = useState(false);
  const [showTrailer, setShowTrailer] = useState(true);
  const [trailerTime, setTrailerTime] = useState(0);
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);

  const games = [
    {
      id: 'k1-warrior',
      name: 'Warrior Arena',
      description: 'Battle with the ultimate sword master',
      image: '/K1.png',
      color: 'from-red-500 to-orange-500',
      status: 'Available'
    },
    {
      id: 'k2-mage',
      name: 'Mage Academy',
      description: 'Master magic with the spellcaster',
      image: '/K2.png',
      color: 'from-gray-500 to-gray-600',
      status: 'Available'
    },
    {
      id: 'k3-archer',
      name: 'Archer Range',
      description: 'Perfect your aim with the bow master',
      image: '/K3.png',
      color: 'from-green-500 to-emerald-500',
      status: 'Available'
    },
    {
      id: 'k4-tank',
      name: 'Tank Fortress',
      description: 'Defend with the ultimate shield',
      image: '/K4.png',
      color: 'from-gray-500 to-slate-500',
      status: 'Available'
    },
    {
      id: 'k5-assassin',
      name: 'Assassin Guild',
      description: 'Stealth with the shadow blade',
      image: '/K5.png',
      color: 'from-gray-500 to-gray-600',
      status: 'Available'
    },
    {
      id: 'k6-healer',
      name: 'Healer Temple',
      description: 'Heal with the divine mender',
      image: '/K6.png',
      color: 'from-pink-500 to-rose-500',
      status: 'Available'
    },
    {
      id: 'k7-berserker',
      name: 'Berserker Rage',
      description: 'Rage with the fierce warrior',
      image: '/K7.png',
      color: 'from-red-600 to-orange-600',
      status: 'Available'
    },
    {
      id: 'k8-paladin',
      name: 'Paladin Order',
      description: 'Serve with the holy knight',
      image: '/K8.png',
      color: 'from-yellow-500 to-amber-500',
      status: 'Available'
    }
  ];

  // Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const createParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < 50; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.1,
          color: Math.random() > 0.5 ? '#fbbf24' : '#f59e0b'
        });
      }
    };

    createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Video trailer timer
  useEffect(() => {
    if (showTrailer) {
      const timer = setInterval(() => {
        setTrailerTime(prev => {
          if (prev >= 15) {
            setShowTrailer(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showTrailer]);

  return (
    <div className="min-h-screen bg-black text-white py-24 relative overflow-hidden">
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: 'transparent' }}
      />
      
      {/* Video Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="relative w-full max-w-6xl mx-4">
            {/* Video Container */}
            <div className="relative bg-black rounded-2xl overflow-hidden border border-gray-800/50">
              {/* Video Placeholder - In real app, this would be actual video */}
              <div className="aspect-video bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center relative">
                {/* Character Showcase */}
                <div className="text-center">
                  <div className="flex justify-center space-x-4 mb-8">
                    {games.map((game, index) => (
                      <div key={game.id} className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                        <img 
                          src={game.image} 
                          alt={game.name}
                          className="w-full h-full object-cover animate-pulse"
                          style={{ animationDelay: `${index * 0.1}s` }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-2xl hidden">🥚</div>
                      </div>
                    ))}
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">
                    <span className="text-white">
                      Character Arena
                    </span>
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Epic RPG battles on Solana Network
                  </p>
                  <div className="flex justify-center space-x-4">
                    {games.map((game, index) => (
                      <div key={game.id} className="w-12 h-12 rounded-full overflow-hidden border border-white/30">
                        <img 
                          src={game.image} 
                          alt={game.name}
                          className="w-full h-full object-cover animate-bounce"
                          style={{ animationDelay: `${index * 0.1}s` }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center text-lg hidden">🥚</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Solana Network Badge */}
                <div className="absolute top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 border border-gray-600">
                  <img src="/solana-logo-official.png" alt="Solana" className="w-4 h-4" />
                  <span>Solana Network</span>
                </div>
              </div>
              
              {/* Skip Button */}
              <div className="absolute top-4 left-4">
                <button
                  onClick={() => setShowTrailer(false)}
                  className="bg-gray-800/80 hover:bg-gray-700/80 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-gray-600/50"
                >
                  Skip ({15 - trailerTime}s)
                </button>
              </div>
              
              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                  style={{ width: `${(trailerTime / 15) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gray-800/10 rounded-3xl blur-3xl"></div>
          <div className="relative">
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
              <span className="text-white">
                Character Arena
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Choose your champion and battle in epic RPG adventures! Each character has unique abilities and powers.
            </p>
            <div className="mt-8 flex justify-center space-x-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full animate-ping"></div>
              <div className="w-3 h-3 bg-gray-500 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3 h-3 bg-gray-600 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {games.map((game) => (
            <div
              key={game.id}
              className={`group bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 hover:border-${game.color.split(' ')[0].split('-')[1]}-500/50 transition-all duration-300 cursor-pointer hover:scale-102 hover:shadow-2xl relative overflow-hidden ${
                game.status === 'Coming Soon' ? 'opacity-60' : ''
              }`}
              onClick={() => {
                if (game.status === 'Available') {
                  // All K1-K8 games open the RPG game
                  setShowRPG(true);
                }
              }}
            >
              {/* Subtle Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-800/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="text-center relative z-10">
                <div className="w-20 h-20 bg-gray-800/50 border border-gray-600/30 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden">
                  <img 
                    src={game.image} 
                    alt={game.name}
                    className="w-full h-full object-cover rounded-3xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="text-4xl hidden">🥚</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{game.name}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{game.description}</p>
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  game.status === 'Available' 
                    ? 'bg-gray-800/50 text-gray-300 border border-gray-600' 
                    : 'bg-gray-700/50 text-gray-400 border border-gray-500'
                }`}>
                  {game.status}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leaderboard */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute inset-0 bg-gray-800/5 rounded-3xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              <span className="text-white">
                🏆 Leaderboard
              </span>
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img src="/K1.png" alt="K1 Warrior" className="w-16 h-16 rounded-full border-2 border-yellow-400 mx-auto" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-lg">🏆</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Top Player</h3>
              <p className="text-gray-300">CryptoMaster123</p>
              <p className="text-white font-bold">2,450 GOLD</p>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img src="/K2.png" alt="K2 Mage" className="w-16 h-16 rounded-full border-2 border-gray-400 mx-auto" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-lg">🥈</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Second Place</h3>
              <p className="text-gray-300">DeFiWarrior</p>
              <p className="text-gray-300 font-bold">1,890 GOLD</p>
            </div>
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <img src="/K3.png" alt="K3 Archer" className="w-16 h-16 rounded-full border-2 border-orange-400 mx-auto" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-lg">🥉</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Third Place</h3>
              <p className="text-gray-300">SolanaPro</p>
              <p className="text-gray-300 font-bold">1,320 GOLD</p>
            </div>
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
                <div className="w-24 h-24 bg-gray-800/50 border border-gray-600/30 rounded-3xl flex items-center justify-center mx-auto mb-6 overflow-hidden">
                  <img 
                    src={selectedGame.image} 
                    alt={selectedGame.name}
                    className="w-full h-full object-cover rounded-3xl"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                  <span className="text-6xl hidden">🥚</span>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">{selectedGame.description}</p>
                <div className="bg-gray-800/50 text-gray-300 border border-gray-600 rounded-full px-6 py-3 inline-block mb-6">
                  Available to Play
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    // All K1-K8 games open the RPG game
                    setShowRPG(true);
                    setSelectedGame(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
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

        {/* RPG Game */}
        {showRPG && (
          <div>
            <RPGGame />
            <button
              onClick={() => setShowRPG(false)}
              className="fixed top-6 left-6 z-50 bg-gray-900/80 hover:bg-gray-800/80 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-gray-700/50"
            >
              ← Back to Games
            </button>
          </div>
        )}
      </div>
    </div>
  );
}