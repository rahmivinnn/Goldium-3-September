import React, { useState, useEffect, useCallback } from 'react';
import { useSolanaWallet } from '@/components/solana-wallet-provider';
import { useSolGoldIntegration } from '@/components/real-sol-gold-integration';

interface Position {
  x: number;
  y: number;
}

interface Coin {
  id: string;
  x: number;
  y: number;
  value: number;
  collected: boolean;
  animation: 'idle' | 'spinning' | 'collected';
}

interface Character {
  id: string;
  name: string;
  position: Position;
  direction: 'left' | 'right';
  animation: 'idle' | 'walking' | 'jumping' | 'collecting';
  speed: number;
  jumpPower: number;
  isGrounded: boolean;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  level: number;
  exp: number;
  goldCollected: number;
}

interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export function PlayableRPGGame() {
  const wallet = useSolanaWallet();
  const solGoldIntegration = useSolGoldIntegration();
  const [demoMode, setDemoMode] = useState(true);
  
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [score, setScore] = useState(0);
  const [gameTime, setGameTime] = useState(0);
  
  // Character state
  const [character, setCharacter] = useState<Character>({
    id: 'K1',
    name: 'K1 Warrior',
    position: { x: 100, y: 400 },
    direction: 'right',
    animation: 'idle',
    speed: 5,
    jumpPower: 15,
    isGrounded: false,
    hp: 100,
    maxHp: 100,
    attack: 25,
    defense: 15,
    level: 1,
    exp: 0,
    goldCollected: 0
  });

  // Coins
  const [coins, setCoins] = useState<Coin[]>([]);
  
  // Platforms (Metaverse environment)
  const [platforms] = useState<Platform[]>([
    { id: 'ground', x: 0, y: 500, width: 1200, height: 100, color: 'from-purple-600 to-blue-600' },
    { id: 'platform1', x: 200, y: 400, width: 150, height: 20, color: 'from-pink-500 to-purple-500' },
    { id: 'platform2', x: 400, y: 350, width: 120, height: 20, color: 'from-blue-500 to-cyan-500' },
    { id: 'platform3', x: 600, y: 300, width: 100, height: 20, color: 'from-green-500 to-emerald-500' },
    { id: 'platform4', x: 800, y: 250, width: 80, height: 20, color: 'from-yellow-500 to-orange-500' },
    { id: 'platform5', x: 1000, y: 200, width: 60, height: 20, color: 'from-red-500 to-pink-500' },
  ]);

  // Keyboard controls
  const [keys, setKeys] = useState({
    left: false,
    right: false,
    up: false,
    space: false
  });

  // Generate coins
  const generateCoins = useCallback(() => {
    const newCoins: Coin[] = [];
    for (let i = 0; i < 20; i++) {
      newCoins.push({
        id: `coin-${i}`,
        x: Math.random() * 1000 + 100,
        y: Math.random() * 300 + 100,
        value: Math.floor(Math.random() * 10) + 1,
        collected: false,
        animation: 'idle'
      });
    }
    setCoins(newCoins);
  }, []);

  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setKeys(prev => ({ ...prev, left: true }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setKeys(prev => ({ ...prev, right: true }));
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          e.preventDefault();
          setKeys(prev => ({ ...prev, up: true, space: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'KeyA':
          setKeys(prev => ({ ...prev, left: false }));
          break;
        case 'ArrowRight':
        case 'KeyD':
          setKeys(prev => ({ ...prev, right: false }));
          break;
        case 'ArrowUp':
        case 'KeyW':
        case 'Space':
          setKeys(prev => ({ ...prev, up: false, space: false }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gamePaused) return;

    const gameLoop = setInterval(() => {
      setGameTime(prev => prev + 1);
      
      // Update character position
      setCharacter(prev => {
        let newX = prev.position.x;
        let newY = prev.position.y;
        let newDirection = prev.direction;
        let newAnimation = prev.animation;
        let newIsGrounded = prev.isGrounded;

        // Horizontal movement
        if (keys.left) {
          newX = Math.max(0, prev.position.x - prev.speed);
          newDirection = 'left';
          newAnimation = 'walking';
        } else if (keys.right) {
          newX = Math.min(1100, prev.position.x + prev.speed);
          newDirection = 'right';
          newAnimation = 'walking';
        } else {
          newAnimation = 'idle';
        }

        // Jumping
        if (keys.up && prev.isGrounded) {
          newY = prev.position.y - prev.jumpPower;
          newAnimation = 'jumping';
          newIsGrounded = false;
        }

        // Gravity
        if (!prev.isGrounded) {
          newY = Math.min(400, prev.position.y + 2);
        }

        // Ground collision
        if (newY >= 400) {
          newY = 400;
          newIsGrounded = true;
        }

        // Platform collisions
        platforms.forEach(platform => {
          if (newX + 40 >= platform.x && 
              newX <= platform.x + platform.width &&
              newY + 40 >= platform.y && 
              newY + 40 <= platform.y + platform.height + 10) {
            newY = platform.y - 40;
            newIsGrounded = true;
          }
        });

        return {
          ...prev,
          position: { x: newX, y: newY },
          direction: newDirection,
          animation: newAnimation,
          isGrounded: newIsGrounded
        };
      });

      // Check coin collection
      setCoins(prev => {
        return prev.map(coin => {
          if (coin.collected) return coin;

          const distance = Math.sqrt(
            Math.pow(coin.x - character.position.x, 2) + 
            Math.pow(coin.y - character.position.y, 2)
          );

          if (distance < 30) {
            setCharacter(char => ({
              ...char,
              goldCollected: char.goldCollected + coin.value,
              exp: char.exp + coin.value
            }));
            setScore(prev => prev + coin.value * 10);
            return { ...coin, collected: true, animation: 'collected' };
          }

          return { ...coin, animation: 'spinning' };
        });
      });

    }, 16); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [gameStarted, gamePaused, keys, character.position, platforms]);

  // Claim GOLD function
  const claimGold = async () => {
    if (character.goldCollected === 0) return;

    try {
      if (demoMode) {
        // Demo mode - just add to balance
        setCharacter(prev => ({ ...prev, goldCollected: 0 }));
        alert(`Claimed ${character.goldCollected} GOLD! (Demo Mode)`);
      } else {
        // Real mode - blockchain transaction
        await solGoldIntegration.swapSolToGold(character.goldCollected / 100); // Convert to SOL amount
        setCharacter(prev => ({ ...prev, goldCollected: 0 }));
        alert(`Claimed ${character.goldCollected} GOLD tokens!`);
      }
    } catch (error) {
      console.error('Failed to claim GOLD:', error);
      alert('Failed to claim GOLD. Please try again.');
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setGamePaused(false);
    setGameTime(0);
    setScore(0);
    generateCoins();
  };

  const pauseGame = () => {
    setGamePaused(!gamePaused);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGamePaused(false);
    setGameTime(0);
    setScore(0);
    setCharacter(prev => ({
      ...prev,
      position: { x: 100, y: 400 },
      goldCollected: 0,
      exp: 0
    }));
    setCoins([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-24 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400/20 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-pink-400/20 rounded-full animate-bounce animation-delay-200"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-400/20 rounded-full animate-bounce animation-delay-400"></div>
        <div className="absolute bottom-20 right-10 w-18 h-18 bg-orange-400/20 rounded-full animate-bounce animation-delay-600"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
                🎮 Metaverse RPG Adventure
              </span>
            </h1>
            <div className="absolute -top-2 -right-2 text-4xl animate-bounce">✨</div>
            <div className="absolute -bottom-2 -left-2 text-3xl animate-bounce animation-delay-200">🌟</div>
          </div>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            🏰 Explore the metaverse, collect GOLD coins, and battle monsters! Use arrow keys to move! 🏆
          </p>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <div className="bg-gray-800/50 border border-amber-500/20 rounded-xl px-6 py-3">
            <span className="text-amber-400 font-bold text-lg">{character.goldCollected} GOLD</span>
            {demoMode && <span className="text-xs text-gray-400 ml-2">(DEMO)</span>}
          </div>
          <button
            onClick={() => setDemoMode(!demoMode)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              demoMode 
                ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                : 'bg-blue-500/20 border border-blue-500/30 text-blue-400'
            }`}
          >
            {demoMode ? 'Demo Mode ON' : 'Demo Mode OFF'}
          </button>
          {character.goldCollected > 0 && (
            <button
              onClick={claimGold}
              className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 hover:from-yellow-500 hover:via-pink-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
            >
              💰 Claim {character.goldCollected} GOLD
            </button>
          )}
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">❤️</div>
            <div className="text-white font-bold">{character.hp}/{character.maxHp}</div>
            <div className="text-red-300 text-sm">Health</div>
          </div>
          <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-400/50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">⭐</div>
            <div className="text-white font-bold">Level {character.level}</div>
            <div className="text-blue-300 text-sm">Experience</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <div className="text-white font-bold">{score}</div>
            <div className="text-green-300 text-sm">Score</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-white font-bold">{Math.floor(gameTime / 60)}s</div>
            <div className="text-yellow-300 text-sm">Time</div>
          </div>
        </div>

        {/* Game Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              🚀 Start Adventure
            </button>
          ) : (
            <>
              <button
                onClick={pauseGame}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {gamePaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                🔄 Reset
              </button>
            </>
          )}
        </div>

        {/* Game Instructions */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 rounded-2xl p-6 mb-8">
          <h3 className="text-xl font-bold text-white mb-4 text-center">🎮 Controls</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl mb-2">⬅️</div>
              <div className="text-white font-semibold">Move Left</div>
              <div className="text-gray-400 text-sm">A or ←</div>
            </div>
            <div>
              <div className="text-2xl mb-2">➡️</div>
              <div className="text-white font-semibold">Move Right</div>
              <div className="text-gray-400 text-sm">D or →</div>
            </div>
            <div>
              <div className="text-2xl mb-2">⬆️</div>
              <div className="text-white font-semibold">Jump</div>
              <div className="text-gray-400 text-sm">W or ↑ or Space</div>
            </div>
            <div>
              <div className="text-2xl mb-2">💰</div>
              <div className="text-white font-semibold">Collect Coins</div>
              <div className="text-gray-400 text-sm">Walk into them</div>
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        {gameStarted && (
          <div className="relative bg-gradient-to-b from-purple-900/50 to-blue-900/50 border-2 border-purple-400/50 rounded-3xl p-4 shadow-2xl shadow-purple-400/20">
            <div className="relative w-full h-96 bg-gradient-to-b from-indigo-900/30 to-purple-900/30 rounded-2xl overflow-hidden">
              {/* Metaverse Environment - Platforms */}
              {platforms.map(platform => (
                <div
                  key={platform.id}
                  className={`absolute bg-gradient-to-r ${platform.color} rounded-lg shadow-lg`}
                  style={{
                    left: platform.x,
                    top: platform.y,
                    width: platform.width,
                    height: platform.height,
                  }}
                />
              ))}

              {/* Coins */}
              {coins.map(coin => (
                !coin.collected && (
                  <div
                    key={coin.id}
                    className={`absolute w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-lg shadow-lg ${
                      coin.animation === 'spinning' ? 'animate-spin' : 'animate-bounce'
                    }`}
                    style={{
                      left: coin.x,
                      top: coin.y,
                    }}
                  >
                    💰
                  </div>
                )
              ))}

              {/* Character */}
              <div
                className={`absolute w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-100 ${
                  character.animation === 'walking' ? 'animate-pulse' : ''
                } ${character.animation === 'jumping' ? 'animate-bounce' : ''}`}
                style={{
                  left: character.position.x,
                  top: character.position.y,
                  transform: character.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)',
                }}
              >
                {character.id === 'K1' && '⚔️'}
                {character.id === 'K2' && '🧙‍♂️'}
                {character.id === 'K3' && '🏹'}
                {character.id === 'K4' && '🛡️'}
                {character.id === 'K5' && '🗡️'}
                {character.id === 'K6' && '✨'}
                {character.id === 'K7' && '🔥'}
                {character.id === 'K8' && '⚡'}
              </div>

              {/* Game Overlay */}
              {gamePaused && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">⏸️</div>
                    <div className="text-2xl font-bold text-white">Game Paused</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}