import React, { useState, useEffect } from 'react';
import { useSolanaWallet } from '@/components/solana-wallet-provider';

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
  const [gameState, setGameState] = useState<GameState>({
    selectedCharacter: null,
    battleEnemy: null,
    battleLog: [],
    isInBattle: false,
    goldBalance: 0
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
    if (wallet.balance) {
      setGameState(prev => ({ ...prev, goldBalance: wallet.balance }));
    }
  }, [wallet.balance]);

  const buyCharacter = (character: Character) => {
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
  };

  const selectCharacter = (character: Character) => {
    setGameState(prev => ({ ...prev, selectedCharacter: character }));
    addBattleLog(`Selected ${character.name} for battle!`);
  };

  const upgradeSkin = (character: Character) => {
    const upgradeCost = character.skinLevel * 50;
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
    <div className="min-h-screen bg-black text-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-amber-400 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Goldium RPG
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Battle with K1-K8 characters, upgrade skins, and earn GOLD tokens!
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <div className="bg-gray-800/50 border border-amber-500/20 rounded-xl px-6 py-3">
              <span className="text-amber-400 font-bold text-lg">{gameState.goldBalance} GOLD</span>
            </div>
            <button
              onClick={() => setShowShop(!showShop)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300"
            >
              {showShop ? 'Hide Shop' : 'Character Shop'}
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
                  <p className="text-gray-400 text-lg mb-6">No characters owned yet!</p>
                  <button
                    onClick={() => setShowShop(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                  >
                    Buy Your First Character
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {ownedCharacters.map((character) => (
                    <div
                      key={character.id}
                      className={`bg-gray-800/50 border rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                        gameState.selectedCharacter?.id === character.id
                          ? 'border-amber-500/50 bg-amber-500/10'
                          : 'border-gray-700/50 hover:border-amber-500/30'
                      }`}
                      onClick={() => selectCharacter(character)}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={character.image}
                          alt={character.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="text-xl font-bold text-white">{character.name}</h3>
                          <p className="text-amber-400">Level {character.level} • {character.skin}</p>
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
                          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm"
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
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Battle</h3>
              
              {gameState.selectedCharacter && (
                <div className="mb-4">
                  <p className="text-gray-300 mb-2">Selected: {gameState.selectedCharacter.name}</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(gameState.selectedCharacter.hp / gameState.selectedCharacter.maxHp) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">{gameState.selectedCharacter.hp}/{gameState.selectedCharacter.maxHp} HP</p>
                </div>
              )}

              {gameState.isInBattle && gameState.battleEnemy && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-white font-bold mb-2">Enemy: {gameState.battleEnemy.name}</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(gameState.battleEnemy.hp / 150) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-400">{gameState.battleEnemy.hp} HP</p>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={startBattle}
                  disabled={!gameState.selectedCharacter || gameState.isInBattle}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  {gameState.isInBattle ? 'Battle in Progress...' : 'Start Battle'}
                </button>

                {gameState.isInBattle && (
                  <button
                    onClick={attackEnemy}
                    className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                  >
                    Attack!
                  </button>
                )}
              </div>
            </div>

            {/* Battle Log */}
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-6">
              <h3 className="text-2xl font-bold text-white mb-4">Battle Log</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {gameState.battleLog.map((log, index) => (
                  <p key={index} className="text-gray-300 text-sm">{log}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Character Shop Modal */}
        {showShop && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-white">Character Shop</h2>
                <button
                  onClick={() => setShowShop(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {characters.map((character) => (
                  <div key={character.id} className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-6">
                    <img
                      src={character.image}
                      alt={character.name}
                      className="w-full h-32 object-cover rounded-xl mb-4"
                    />
                    <h3 className="text-xl font-bold text-white mb-2">{character.name}</h3>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-400">HP:</span>
                        <span className="text-white">{character.hp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Attack:</span>
                        <span className="text-white">{character.attack}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Defense:</span>
                        <span className="text-white">{character.defense}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Speed:</span>
                        <span className="text-white">{character.speed}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => buyCharacter(character)}
                      disabled={gameState.goldBalance < character.price || ownedCharacters.some(c => c.id === character.id)}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-black px-4 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      {ownedCharacters.some(c => c.id === character.id) 
                        ? 'Owned' 
                        : `Buy ${character.price} GOLD`
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