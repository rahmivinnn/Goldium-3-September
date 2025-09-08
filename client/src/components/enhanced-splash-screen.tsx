import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

const EnhancedSplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [characterSlideProgress, setCharacterSlideProgress] = useState(0);
  const hasCompleted = useRef(false);
  const animationFrameRef = useRef<number>();
  const particleIdRef = useRef(0);

  // Advanced particle system
  const createParticle = (): Particle => {
    const colors = ['#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e'];
    return {
      id: particleIdRef.current++,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080),
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 4 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 300 + 200
    };
  };

  const updateParticles = () => {
    setParticles(prev => {
      let newParticles = prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        life: particle.life + 1,
        opacity: particle.opacity * (1 - particle.life / particle.maxLife),
        size: particle.size * (1 - particle.life / particle.maxLife * 0.5)
      })).filter(particle => particle.life < particle.maxLife && particle.opacity > 0.01);

      // Add new particles
      if (newParticles.length < 150 && Math.random() < 0.3) {
        newParticles.push(createParticle());
      }

      return newParticles;
    });
  };

  // Character sliding animation
  const animateCharacters = () => {
    setCharacterSlideProgress(prev => {
      const newProgress = prev + 0.02;
      return newProgress > 1 ? 1 : newProgress;
    });
  };

  useEffect(() => {
    if (hasCompleted.current) return;

    // Initialize particles
    const initialParticles = Array.from({ length: 50 }, () => createParticle());
    setParticles(initialParticles);

    // Animation loop
    const animate = () => {
      updateParticles();
      animateCharacters();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (!hasCompleted.current) {
            hasCompleted.current = true;
            setTimeout(() => {
              setIsVisible(false);
              setTimeout(onComplete, 300);
            }, 500);
          }
          return 100;
        }
        return prev + 1.5;
      });
    }, 30);

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        setIsVisible(false);
        onComplete();
      }
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fallbackTimeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onComplete]);

  // Character slide animation values
  const getCharacterTransform = (index: number) => {
    const delay = index * 0.1;
    const progress = Math.max(0, Math.min(1, (characterSlideProgress - delay) / 0.3));
    
    return {
      x: (1 - progress) * -200 + progress * 0,
      y: (1 - progress) * 100 + progress * 0,
      scale: 0.5 + progress * 0.5,
      rotate: (1 - progress) * -180 + progress * 0,
      opacity: progress
    };
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Advanced Particle System */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map(particle => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full"
                style={{
                  left: particle.x,
                  top: particle.y,
                  width: particle.size,
                  height: particle.size,
                  backgroundColor: particle.color,
                  opacity: particle.opacity,
                  boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [particle.opacity, particle.opacity * 0.5, particle.opacity]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Dynamic Background Effects */}
          <div className="absolute inset-0">
            {/* Floating Orbs */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`orb-${i}`}
                className="absolute rounded-full opacity-20"
                style={{
                  width: `${Math.random() * 100 + 50}px`,
                  height: `${Math.random() * 100 + 50}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: `radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%)`
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.1, 0.3, 0.1],
                  x: [0, Math.random() * 100 - 50, 0],
                  y: [0, Math.random() * 100 - 50, 0]
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5
                }}
              />
            ))}

            {/* Energy Waves */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={`wave-${i}`}
                className="absolute border border-amber-400/30 rounded-full"
                style={{
                  width: `${200 + i * 200}px`,
                  height: `${200 + i * 200}px`,
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                animate={{
                  scale: [0.5, 2, 0.5],
                  opacity: [0.8, 0, 0.8]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 1.5
                }}
              />
            ))}

            {/* Shooting Stars */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={`star-${i}`}
                className="absolute"
                style={{
                  top: `${Math.random() * 50 + 10}%`,
                  width: `${Math.random() * 150 + 100}px`,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #fbbf24, #f59e0b, transparent)',
                  borderRadius: '2px'
                }}
                initial={{ x: -200, opacity: 0 }}
                animate={{
                  x: typeof window !== 'undefined' ? window.innerWidth + 200 : 1300,
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 3 + 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 6 + i * 2
                }}
              />
            ))}
          </div>

          {/* Logo with Enhanced Animation */}
          <motion.div
            className="mb-8 relative"
            initial={{ opacity: 0, y: -50, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.5, duration: 1, type: "spring", stiffness: 200 }}
          >
            <motion.img
              src="/logo goldium.png"
              alt="Goldium Logo"
              className="w-20 h-20 md:w-24 md:h-24 mx-auto relative z-10"
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Logo Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-xl opacity-50"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Main Title with Advanced Effects */}
          <motion.div
            className="text-center mb-8 relative"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 1, type: "spring", stiffness: 150 }}
          >
            <motion.h1
              className="text-7xl md:text-9xl font-bold holographic-gold golden-3d relative z-10"
              animate={{
                textShadow: [
                  "0 0 20px rgba(251, 191, 36, 0.5)",
                  "0 0 40px rgba(251, 191, 36, 0.8)",
                  "0 0 20px rgba(251, 191, 36, 0.5)"
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              GOLDIUM
            </motion.h1>
            
            {/* Title Background Effects */}
            <div className="absolute inset-0 -z-10">
              {/* Matrix Rain Effect */}
              {Array.from({ length: 20 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-amber-400/20 text-2xl font-mono"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`
                  }}
                  animate={{
                    y: [0, 100],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 5,
                    ease: "linear"
                  }}
                >
                  {['•', '·', '○', '◊', '◆'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sliding Characters Animation */}
          <motion.div
            className="flex justify-center gap-6 mb-8 relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            {[1, 2, 3, 4, 5].map((num, index) => {
              const transform = getCharacterTransform(index);
              return (
                <motion.div
                  key={num}
                  className="relative"
                  style={{
                    transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotate}deg)`,
                    opacity: transform.opacity
                  }}
                  whileHover={{ 
                    scale: 1.2, 
                    y: -10,
                    rotate: [0, -10, 10, 0],
                    transition: { duration: 0.3 }
                  }}
                >
                  <motion.img
                    src={`/K${num}.png`}
                    alt={`K${num}`}
                    className="w-16 h-16 md:w-20 md:h-20 shadow-2xl rounded-full border-2 border-amber-400/50"
                    animate={{
                      boxShadow: [
                        "0 0 20px rgba(251, 191, 36, 0.3)",
                        "0 0 40px rgba(251, 191, 36, 0.6)",
                        "0 0 20px rgba(251, 191, 36, 0.3)"
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  />
                  
                  {/* Character Glow */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-lg opacity-30"
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>

          {/* Loading Text with Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="text-center mb-8"
          >
            <motion.p
              className="text-yellow-400 text-xl md:text-2xl font-medium"
              animate={{ 
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.02, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading DeFi Platform...
            </motion.p>
          </motion.div>

          {/* Enhanced Progress Bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '400px', opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="relative h-3 bg-gray-800 rounded-full overflow-hidden border border-gray-700"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-full relative"
              initial={{ width: '0%' }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {/* Progress Bar Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-full opacity-50 blur-sm"
                animate={{
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Progress Bar Shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 rounded-full"
                animate={{
                  x: ['-100%', '100%']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </motion.div>

          {/* Progress Percentage with Enhanced Styling */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-6"
          >
            <motion.span
              className="text-yellow-400 text-lg font-mono font-bold"
              animate={{
                textShadow: [
                  "0 0 10px rgba(251, 191, 36, 0.5)",
                  "0 0 20px rgba(251, 191, 36, 0.8)",
                  "0 0 10px rgba(251, 191, 36, 0.5)"
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {Math.round(loadingProgress)}%
            </motion.span>
          </motion.div>

          {/* Bottom Decorative Elements */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
          >
            <div className="flex space-x-3">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-4 h-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                    y: [0, -5, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EnhancedSplashScreen;