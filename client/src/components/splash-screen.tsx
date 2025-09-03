import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const hasCompleted = useRef(false);

  useEffect(() => {
    if (hasCompleted.current) return;

    // Simulate loading progress with smoother animation
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (!hasCompleted.current) {
            hasCompleted.current = true;
            // Smooth transition to main app
            setTimeout(() => {
              setIsVisible(false);
              setTimeout(onComplete, 200);
            }, 300);
          }
          return 100;
        }
        return prev + 2; // Smoother progress increment
      });
    }, 50); // Smoother interval

    // Fallback timeout
    const fallbackTimeout = setTimeout(() => {
      if (!hasCompleted.current) {
        hasCompleted.current = true;
        setIsVisible(false);
        onComplete();
      }
    }, 4000); // Reduced to 4 seconds

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fallbackTimeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Simplified background particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-40"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
                  scale: 0
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.6, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Logo Goldium */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <img
              src="/logo goldium.png"
              alt="Goldium Logo"
              className="w-16 h-16 md:w-20 md:h-20 mx-auto"
            />
          </motion.div>

          {/* Main Title GOLDIUM */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1,
              scale: 1
            }}
            transition={{
              opacity: { duration: 0.8, delay: 0.5 },
              scale: { duration: 0.8, delay: 0.5, type: "spring", stiffness: 260, damping: 20 }
            }}
          >
            <motion.h1
              className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 bg-clip-text text-transparent filter drop-shadow-2xl"
              whileHover={{ scale: 1.05 }}
            >
              GOLDIUM
            </motion.h1>
            
            {/* Simplified title glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 opacity-10 blur-lg"
              animate={{
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* Happy K1-K5 Characters */}
          <motion.div
            className="flex justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {[1, 2, 3, 4, 5].map((num) => (
              <motion.div
                key={num}
                className="relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 1.2 + (num * 0.1), 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                whileHover={{ scale: 1.1, y: -5 }}
              >
                <img
                  src={`/K${num}.png`}
                  alt={`K${num}`}
                  className="w-12 h-12 md:w-16 md:h-16 shadow-lg"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mb-6"
          >
            <motion.p
              className="text-yellow-400 text-lg md:text-xl font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading DeFi Platform...
            </motion.p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '300px', opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="relative h-2 bg-gray-800 rounded-full overflow-hidden"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            
            {/* Progress bar glow */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-50 blur-sm"
              initial={{ width: '0%' }}
              animate={{ width: `${loadingProgress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </motion.div>

          {/* Progress Percentage */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mt-4"
          >
            <span className="text-yellow-400 text-sm font-mono">
              {Math.round(loadingProgress)}%
            </span>
          </motion.div>

          {/* Bottom decorative elements */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
          >
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-3 h-3 bg-white rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2
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

export default SplashScreen;