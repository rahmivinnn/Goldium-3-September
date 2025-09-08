import React, { useState, useEffect } from 'react';
import { useSolanaWallet } from '@/components/solana-wallet-provider';
import { useSolGoldIntegration } from '@/components/real-sol-gold-integration';

interface Character {
  id: string;
  name: string;
  level: number;
  exp: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  skin: string;
  skinLevel: number;
  image: string;
  price: number; // in GOLD tokens
}

interface GameState {
  selectedCharacter: Character | null;
  battleEnemy: any;
  battleLog: string[];
  isInBattle: boolean;
  goldBalance: number;
}

export function RPGGame() {
  const wallet = useSolanaWallet();
  const solGoldIntegration = useSolGoldIntegration();
  const [demoMode, setDemoMode] = useState(true); // Demo mode by default
  const [gameState, setGameState] = useState<GameState>({
    selectedCharacter: null,
    battleEnemy: null,
    battleLog: [],
    isInBattle: false,
    goldBalance: demoMode ? 1000 : 0 // Demo starts with 1000 GOLD
  });

  const [characters, setCharacters] = useState<Character[]>([
    {
      id: 'K1',
      name: 'K1 Warrior',
      level: 1,
      exp: 0,
      hp: 100,
      maxHp: 100,
      attack: 25,
      defense: 15,
      speed: 20,
      skin: 'Basic',
      skinLevel: 1,
      image: '/K1.png',
      price: 100
    },
    {
      id: 'K2',
      name: 'K2 Mage',
      level: 1,
      exp: 0,
      hp: 80,
      maxHp: 80,
      attack: 35,
      defense: 10,
      speed: 25,
      skin: 'Basic',
      skinLevel: 1,
      image: '/K2.png',
      price: 150
    },
    {
      id: 'K3',
      name: 'K3 Archer',
      level: 1,
      exp: 0,
      hp: 90,
      maxHp: 90,
      attack: 30,
      defense: 12,
      speed: 30,
      skin: 'Basic',
      skinLevel: 1,
      image: '/K3.png',
      price: 120
    },
    {
      id: 'K4',
      name: 'K4 Tank',
      level: 1,
      exp: 0,
      hp: 150,
      maxHp: 150,
      attack: 20,
      defense: 25,
      speed: 10,
      skin: 'Basic',
      skinLevel: 1,
      image: '/K4.png',
      price: 200
    },
    {
      id: 'K5',
      name: 'K5 Assassin',
      level: 1,
      exp: 0,
      hp: 70,
      maxHp: 70,
      attack: 40,
      defense: 8,
      speed: 35,
      skin: 'Basic',
      skinLevel: 1,
      image: '/K5.png',
      price: 180
    },
    {
      id: 'K6',
      name: 'K6 Healer',
      level: 1,
      exp: 0,
      hp: 85,
      maxHp: 85,
      attack: 15,
      defense: 18,
      speed: 22,
      skin: 'Basic',
      skinLevel: 1,
      image: '/K6.png',
      price: 160
    },
    {
      id: 'K7',
      name: 'K7 Berserker',
      level: 1,
      exp: 0,
      hp: 120,
      maxHp: 120,
      attack: 45,
      defense: 5,
      speed: 15,
      skin: 'Basic',
      skinLevel: 1,
      image: '/K7.png',
      price: 250
    },
    {
      id: 'K8',
      name: 'K8 Paladin',
      level: 1,
      exp: 0,
      hp: 110,
      maxHp: 110,
      attack: 28,
      defense: 20,
      speed: 18,
      skin: 'Basic',
      skinLevel: 1,
      image: '/K8.png',
      price: 220
    }
  ]);

  const [ownedCharacters, setOwnedCharacters] = useState<Character[]>([]);
  const [showShop, setShowShop] = useState(false);

  // Load GOLD balance
  useEffect(() => {
    if (!demoMode && solGoldIntegration.goldBalance) {
      setGameState(prev => ({ ...prev, goldBalance: solGoldIntegration.goldBalance }));
    }
  }, [solGoldIntegration.goldBalance, demoMode]);

  const buyCharacter = async (character: Character) => {
    if (demoMode) {
      // Demo mode - just simulate purchase
      if (gameState.goldBalance >= character.price) {
        const newCharacter = { ...character };
        setOwnedCharacters(prev => [...prev, newCharacter]);
        setGameState(prev => ({ 
          ...prev, 
          goldBalance: prev.goldBalance - character.price 
        }));
        addBattleLog(`Purchased ${character.name} for ${character.price} GOLD!`);
      } else {
        addBattleLog(`Not enough GOLD! Need ${character.price} GOLD.`);
      }
    } else {
      // Real mode - use actual blockchain transaction
      try {
        await solGoldIntegration.buyCharacterWithGold(character.price);
        const newCharacter = { ...character };
        setOwnedCharacters(prev => [...prev, newCharacter]);
        addBattleLog(`Purchased ${character.name} for ${character.price} GOLD!`);
      } catch (error) {
        addBattleLog(`Purchase failed: ${error.message}`);
      }
    }
  };

  const selectCharacter = (character: Character) => {
    setGameState(prev => ({ ...prev, selectedCharacter: character }));
    addBattleLog(`Selected ${character.name} for battle!`);
  };

  const upgradeSkin = async (character: Character) => {
    const upgradeCost = character.skinLevel * 50;
    
    if (demoMode) {
      // Demo mode - just simulate upgrade
      if (gameState.goldBalance >= upgradeCost) {
        const updatedCharacter = {
          ...character,
          skinLevel: character.skinLevel + 1,
          skin: `Level ${character.skinLevel + 1}`,
          attack: character.attack + 5,
          defense: character.defense + 3,
          hp: character.hp + 10,
          maxHp: character.maxHp + 10
        };
        
        setOwnedCharacters(prev => 
          prev.map(c => c.id === character.id ? updatedCharacter : c)
        );
        
        setGameState(prev => ({ 
          ...prev, 
          goldBalance: prev.goldBalance - upgradeCost,
          selectedCharacter: prev.selectedCharacter?.id === character.id ? updatedCharacter : prev.selectedCharacter
        }));
        
        addBattleLog(`${character.name} skin upgraded to Level ${character.skinLevel + 1}!`);
      } else {
        addBattleLog(`Not enough GOLD! Need ${upgradeCost} GOLD for upgrade.`);
      }
    } else {
      // Real mode - use actual blockchain transaction
      try {
        await solGoldIntegration.buyCharacterWithGold(upgradeCost);
        const updatedCharacter = {
          ...character,
          skinLevel: character.skinLevel + 1,
          skin: `Level ${character.skinLevel + 1}`,
          attack: character.attack + 5,
          defense: character.defense + 3,
          hp: character.hp + 10,
          maxHp: character.maxHp + 10
        };
        
        setOwnedCharacters(prev => 
          prev.map(c => c.id === character.id ? updatedCharacter : c)
        );
        
        setGameState(prev => ({ 
          ...prev, 
          selectedCharacter: prev.selectedCharacter?.id === character.id ? updatedCharacter : prev.selectedCharacter
        }));
        
        addBattleLog(`${character.name} skin upgraded to Level ${character.skinLevel + 1}!`);
      } catch (error) {
        addBattleLog(`Upgrade failed: ${error.message}`);
      }
    }
  };

  const startBattle = () => {
    if (!gameState.selectedCharacter) {
      addBattleLog("Please select a character first!");
      return;
    }

    const enemies = [
      { name: "Goblin", hp: 50, attack: 15, defense: 5, exp: 25, gold: 10 },
      { name: "Orc", hp: 80, attack: 25, defense: 10, exp: 40, gold: 20 },
      { name: "Dragon", hp: 150, attack: 40, defense: 20, exp: 100, gold: 50 }
    ];

    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    setGameState(prev => ({ 
      ...prev, 
      battleEnemy: randomEnemy,
      isInBattle: true,
      battleLog: [`Battle started against ${randomEnemy.name}!`]
    }));
  };

  const attackEnemy = () => {
    if (!gameState.selectedCharacter || !gameState.battleEnemy) return;

    const player = gameState.selectedCharacter;
    const enemy = gameState.battleEnemy;

    // Player attacks enemy
    const playerDamage = Math.max(1, player.attack - enemy.defense);
    const newEnemyHp = Math.max(0, enemy.hp - playerDamage);
    
    let newLog = [...gameState.battleLog, `${player.name} attacks for ${playerDamage} damage!`];

    if (newEnemyHp <= 0) {
      // Enemy defeated
      const expGain = enemy.exp;
      const goldGain = enemy.gold;
      
      const updatedCharacter = {
        ...player,
        exp: player.exp + expGain,
        hp: Math.min(player.maxHp, player.hp + 10) // Heal a bit
      };

      setOwnedCharacters(prev => 
        prev.map(c => c.id === player.id ? updatedCharacter : c)
      );

      setGameState(prev => ({ 
        ...prev, 
        selectedCharacter: updatedCharacter,
        battleEnemy: null,
        isInBattle: false,
        goldBalance: prev.goldBalance + goldGain,
        battleLog: [...newLog, `Enemy defeated! Gained ${expGain} EXP and ${goldGain} GOLD!`]
      }));
    } else {
      // Enemy attacks back
      const enemyDamage = Math.max(1, enemy.attack - player.defense);
      const newPlayerHp = Math.max(0, player.hp - enemyDamage);
      
      const updatedCharacter = { ...player, hp: newPlayerHp };
      
      setOwnedCharacters(prev => 
        prev.map(c => c.id === player.id ? updatedCharacter : c)
      );

      setGameState(prev => ({ 
        ...prev, 
        selectedCharacter: updatedCharacter,
        battleEnemy: { ...enemy, hp: newEnemyHp },
        battleLog: [...newLog, `${enemy.name} attacks for ${enemyDamage} damage!`]
      }));

      if (newPlayerHp <= 0) {
        setGameState(prev => ({ 
          ...prev, 
          isInBattle: false,
          battleEnemy: null,
          battleLog: [...prev.battleLog, "You were defeated! Better luck next time."]
        }));
      }
    }
  };

  const addBattleLog = (message: string) => {
    setGameState(prev => ({ 
      ...prev, 
      battleLog: [...prev.battleLog.slice(-4), message] // Keep last 5 messages
    }));
  };

  return (
    <div className="min-h-screen bg-black text-white py-24 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-6xl font-bold text-white mb-6 tracking-tight animate-fade-in-up">
              🎮 Goldium RPG
            </h1>
            <div className="absolute -top-2 -right-2 text-4xl animate-bounce">✨</div>
            <div className="absolute -bottom-2 -left-2 text-3xl animate-bounce animation-delay-200">🌟</div>
          </div>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            🏰 Embark on epic adventures with K1-K8 characters! Battle monsters, collect treasures, and earn GOLD tokens! 🏆
          </p>
          <div className="mt-6 flex justify-center gap-4 flex-wrap">
            <div className="bg-gray-800/50 border border-amber-500/20 rounded-xl px-6 py-3">
              <span className="text-white font-bold text-lg">{gameState.goldBalance} GOLD</span>
              {demoMode && <span className="text-xs text-gray-400 ml-2">(DEMO)</span>}
              {solGoldIntegration.isLoading && <span className="text-xs text-gray-400 ml-2">(Loading...)</span>}
              {solGoldIntegration.transactionStatus === 'pending' && <span className="text-xs text-gray-400 ml-2">(Pending...)</span>}
              {solGoldIntegration.transactionStatus === 'success' && <span className="text-xs text-gray-400 ml-2">(Success!)</span>}
              {solGoldIntegration.transactionStatus === 'error' && <span className="text-xs text-gray-400 ml-2">(Error)</span>}
            </div>
            <button
              onClick={() => setShowShop(!showShop)}
              className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 border border-gray-600"
            >
              {showShop ? 'Hide Shop' : 'Character Shop'}
            </button>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                demoMode 
                  ? 'bg-gray-800 border border-gray-600 text-white' 
                  : 'bg-gray-700 border border-gray-500 text-gray-300'
              }`}
            >
              {demoMode ? 'Demo Mode ON' : 'Demo Mode OFF'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Character Selection */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-white mb-6">Your Characters</h2>
              
              {ownedCharacters.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-8xl mb-6 animate-bounce">🏰</div>
                  <p className="text-gray-200 text-xl mb-6 font-semibold">No heroes in your party yet!</p>
                  <p className="text-gray-400 text-lg mb-8">Recruit your first champion to start your adventure! 🗡️</p>
                  <button
                    onClick={() => setShowShop(true)}
                    className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl border border-gray-600"
                  >
                    🛒 Recruit Hero
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ownedCharacters.map((character) => (
                    <div
                      key={character.id}
                      className={`relative bg-gray-900/50 border-2 rounded-3xl p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                        gameState.selectedCharacter?.id === character.id
                          ? 'border-white bg-gray-800/50 shadow-lg shadow-white/20'
                          : 'border-gray-600 hover:border-gray-500 hover:shadow-lg hover:shadow-gray-500/20'
                      }`}
                      onClick={() => selectCharacter(character)}
                    >
                      {/* Character Avatar with Glow */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative">
                          <div className="w-20 h-20 bg-gray-800 rounded-2xl flex items-center justify-center text-4xl shadow-lg">
                            <img 
                              src={character.image} 
                              alt={character.name}
                              className="w-full h-full object-cover rounded-2xl"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            <div className="text-4xl hidden">
                              {character.id === 'K1' && '⚔️'}
                              {character.id === 'K2' && '🧙‍♂️'}
                              {character.id === 'K3' && '🏹'}
                              {character.id === 'K4' && '🛡️'}
                              {character.id === 'K5' && '🗡️'}
                              {character.id === 'K6' && '✨'}
                              {character.id === 'K7' && '🔥'}
                              {character.id === 'K8' && '⚡'}
                            </div>
                          </div>
                          {gameState.selectedCharacter?.id === character.id && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm animate-bounce text-black">
                              ✓
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white">{character.name}</h3>
                          <p className="text-gray-300 font-semibold">Level {character.level} • {character.skin}</p>
                          <div className="flex gap-2 mt-1">
                            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full border border-gray-600">❤️ {character.hp}</span>
                            <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full border border-gray-600">⚔️ {character.attack}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-400">HP:</span>
                          <span className="text-white ml-2">{character.hp}/{character.maxHp}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Attack:</span>
                          <span className="text-white ml-2">{character.attack}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Defense:</span>
                          <span className="text-white ml-2">{character.defense}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Speed:</span>
                          <span className="text-white ml-2">{character.speed}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            upgradeSkin(character);
                          }}
                          className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 text-sm border border-gray-600"
                        >
                          Upgrade ({character.skinLevel * 50} GOLD)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Battle Area */}
          <div className="space-y-6">
            {/* Battle Controls */}
            <div className="bg-gray-900/50 backdrop-blur-xl border-2 border-gray-600 rounded-3xl p-6 shadow-lg shadow-gray-600/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-3xl animate-pulse">⚔️</div>
                <h3 className="text-2xl font-bold text-white">Battle Arena</h3>
                <div className="text-2xl animate-bounce">🏟️</div>
              </div>
              
              {gameState.selectedCharacter && (
                <div className="mb-4 p-4 bg-gray-800/50 rounded-2xl border border-gray-600">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">🛡️</div>
                    <p className="text-white font-bold">Hero: {gameState.selectedCharacter.name}</p>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2 shadow-inner">
                    <div 
                      className="bg-white h-3 rounded-full transition-all duration-500 shadow-lg"
                      style={{ width: `${(gameState.selectedCharacter.hp / gameState.selectedCharacter.maxHp) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-white font-semibold">❤️ {gameState.selectedCharacter.hp}/{gameState.selectedCharacter.maxHp} HP</p>
                </div>
              )}

              {gameState.isInBattle && gameState.battleEnemy && (
                <div className="mb-4 p-4 bg-gray-800/50 border-2 border-gray-600 rounded-2xl shadow-lg shadow-gray-600/20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl animate-pulse">👹</div>
                    <p className="text-white font-bold">Enemy: {gameState.battleEnemy.name}</p>
                    <div className="text-xl animate-bounce">💀</div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 mb-2 shadow-inner">
                    <div 
                      className="bg-gray-500 h-3 rounded-full transition-all duration-500 shadow-lg animate-pulse"
                      style={{ width: `${(gameState.battleEnemy.hp / 150) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-300 font-semibold">💀 {gameState.battleEnemy.hp} HP</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={startBattle}
                  disabled={!gameState.selectedCharacter || gameState.isInBattle}
                  className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none shadow-lg hover:shadow-xl border border-gray-600"
                >
                  {gameState.isInBattle ? '⚔️ Battle in Progress...' : '🚀 Start Epic Battle!'}
                </button>

                {gameState.isInBattle && (
                  <button
                    onClick={attackEnemy}
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl animate-pulse border border-gray-600"
                  >
                    ⚡ ATTACK! ⚡
                  </button>
                )}
              </div>
            </div>

            {/* Battle Log */}
            <div className="bg-gray-900/50 backdrop-blur-xl border-2 border-gray-600 rounded-3xl p-6 shadow-lg shadow-gray-600/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl animate-bounce">📜</div>
                <h3 className="text-2xl font-bold text-white">Battle Chronicle</h3>
                <div className="text-xl animate-pulse">✨</div>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto bg-black/20 rounded-2xl p-4 border border-gray-600">
                {gameState.battleLog.map((log, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg border border-gray-600">
                    <div className="text-white animate-pulse">⚡</div>
                    <p className="text-gray-200 text-sm font-medium">{log}</p>
                  </div>
                ))}
                {gameState.battleLog.length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">📖</div>
                    <p className="text-gray-400">No battles yet. Start your first adventure!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Character Shop Modal */}
        {showShop && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900/90 border-2 border-gray-600 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-gray-600/20">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                  <div className="text-4xl animate-bounce">🛒</div>
                  <h2 className="text-3xl font-bold text-white">Hero Recruitment Center</h2>
                  <div className="text-3xl animate-pulse">🏰</div>
                </div>
                <button
                  onClick={() => setShowShop(false)}
                  className="text-gray-400 hover:text-white transition-colors bg-red-500/20 hover:bg-red-500/30 p-2 rounded-full"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {characters.map((character) => (
                  <div key={character.id} className="bg-gray-800/50 border-2 border-gray-600 rounded-3xl p-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-gray-600/20">
                    {/* Character Avatar */}
                    <div className="text-center mb-4">
                      <div className="w-24 h-24 bg-gray-800 rounded-2xl flex items-center justify-center text-5xl shadow-lg mx-auto">
                        <img 
                          src={character.image} 
                          alt={character.name}
                          className="w-full h-full object-cover rounded-2xl"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div className="text-5xl hidden">
                          {character.id === 'K1' && '⚔️'}
                          {character.id === 'K2' && '🧙‍♂️'}
                          {character.id === 'K3' && '🏹'}
                          {character.id === 'K4' && '🛡️'}
                          {character.id === 'K5' && '🗡️'}
                          {character.id === 'K6' && '✨'}
                          {character.id === 'K7' && '🔥'}
                          {character.id === 'K8' && '⚡'}
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 text-center">{character.name}</h3>
                    
                    {/* Stats */}
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between items-center bg-red-500/20 rounded-lg px-3 py-2">
                        <span className="text-red-300">❤️ HP:</span>
                        <span className="text-white font-bold">{character.hp}</span>
                      </div>
                      <div className="flex justify-between items-center bg-blue-500/20 rounded-lg px-3 py-2">
                        <span className="text-blue-300">⚔️ Attack:</span>
                        <span className="text-white font-bold">{character.attack}</span>
                      </div>
                      <div className="flex justify-between items-center bg-green-500/20 rounded-lg px-3 py-2">
                        <span className="text-green-300">🛡️ Defense:</span>
                        <span className="text-white font-bold">{character.defense}</span>
                      </div>
                      <div className="flex justify-between items-center bg-yellow-500/20 rounded-lg px-3 py-2">
                        <span className="text-yellow-300">💨 Speed:</span>
                        <span className="text-white font-bold">{character.speed}</span>
                      </div>
                    </div>
                    
                    {/* Buy Button */}
                    <button
                      onClick={() => buyCharacter(character)}
                      disabled={gameState.goldBalance < character.price || ownedCharacters.some(c => c.id === character.id)}
                      className={`w-full px-4 py-3 rounded-2xl font-bold text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none ${
                        ownedCharacters.some(c => c.id === character.id)
                          ? 'bg-gray-700 text-white border border-gray-600'
                          : gameState.goldBalance < character.price
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-500'
                          : 'bg-gray-800 hover:bg-gray-700 text-white shadow-lg hover:shadow-xl border border-gray-600'
                      }`}
                    >
                      {ownedCharacters.some(c => c.id === character.id) 
                        ? '✅ Recruited!' 
                        : `💰 Recruit ${character.price} GOLD`
                      }
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}