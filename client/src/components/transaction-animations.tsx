import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSoundSystem } from '@/lib/sound-system';
import { usePerformanceMode } from '@/lib/settings-store';

interface TransactionAnimationProps {
  type: 'swap' | 'stake' | 'unstake' | 'send';
  isActive: boolean;
  onComplete?: () => void;
  fromToken?: string;
  toToken?: string;
  amount?: number;
}

export function TransactionAnimation({ 
  type, 
  isActive, 
  onComplete,
  fromToken,
  toToken,
  amount 
}: TransactionAnimationProps) {
  const { playVault, playCoin, playSuccess } = useSoundSystem();
  const { enableAnimations } = usePerformanceMode();
  const [stage, setStage] = useState<'vault' | 'coin' | 'success'>('vault');

  useEffect(() => {
    if (!isActive || !enableAnimations) return;

    const sequence = async () => {
      // Stage 1: Vault door opens
      setStage('vault');
      playVault();
      
      setTimeout(() => {
        // Stage 2: Coin animation
        setStage('coin');
        playCoin();
        
        setTimeout(() => {
          // Stage 3: Success
          setStage('success');
          playSuccess();
          
          setTimeout(() => {
            onComplete?.();
          }, 1000);
        }, 1500);
      }, 1000);
    };

    sequence();
  }, [isActive, enableAnimations, playVault, playCoin, playSuccess, onComplete]);

  if (!isActive || !enableAnimations) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="glass-card p-12 rounded-2xl max-w-md w-full mx-4 text-center">
          
          {/* VAULT ANIMATION */}
          {stage === 'vault' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <motion.div
                className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-amber-600 rounded-2xl flex items-center justify-center"
                animate={{ 
                  rotateY: [0, 180, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <svg className="w-12 h-12 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </motion.div>
              <motion.h3 
                className="font-card-title text-white"
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Opening Vault...
              </motion.h3>
              <div className="font-small text-white/70">
                {type === 'swap' && `Preparing ${fromToken} → ${toToken} exchange`}
                {type === 'stake' && `Securing ${amount} GOLD in vault`}
                {type === 'unstake' && `Retrieving ${amount} GOLD from vault`}
                {type === 'send' && `Preparing ${amount} ${fromToken} transfer`}
              </div>
            </motion.div>
          )}

          {/* COIN ANIMATION */}
          {stage === 'coin' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <motion.div
                className="w-24 h-24 mx-auto"
                animate={{ 
                  rotateY: [0, 360],
                  y: [0, -20, 0]
                }}
                transition={{ 
                  rotateY: { duration: 0.8, repeat: Infinity },
                  y: { duration: 1.2, repeat: Infinity }
                }}
              >
                <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-2xl font-bold text-black">
                    {fromToken === 'SOL' ? '◎' : '🥇'}
                  </span>
                </div>
              </motion.div>
              <motion.h3 
                className="font-card-title text-white"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Processing Transaction...
              </motion.h3>
              <div className="font-small text-white/70">
                Executing on Solana blockchain
              </div>
            </motion.div>
          )}

          {/* SUCCESS ANIMATION */}
          {stage === 'success' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-6"
            >
              <motion.div
                className="relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <motion.div
                  className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center"
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(34, 197, 94, 0.7)",
                      "0 0 0 20px rgba(34, 197, 94, 0)",
                      "0 0 0 0 rgba(34, 197, 94, 0)"
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                
                {/* CONFETTI PARTICLES */}
                {Array.from({ length: 12 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{ 
                      scale: 0,
                      x: 0,
                      y: 0
                    }}
                    animate={{ 
                      scale: [0, 1, 0],
                      x: (Math.random() - 0.5) * 200,
                      y: (Math.random() - 0.5) * 200,
                      rotate: 360
                    }}
                    transition={{ 
                      duration: 2,
                      delay: i * 0.1,
                      ease: "easeOut"
                    }}
                    style={{
                      left: '50%',
                      top: '50%'
                    }}
                  />
                ))}
              </motion.div>
              
              <motion.h3 
                className="font-card-title text-white"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Transaction Successful!
              </motion.h3>
              
              <motion.div 
                className="font-small text-white/70"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {type === 'swap' && `Successfully swapped ${amount} ${fromToken} to ${toToken}`}
                {type === 'stake' && `Successfully staked ${amount} GOLD`}
                {type === 'unstake' && `Successfully unstaked ${amount} GOLD`}
                {type === 'send' && `Successfully sent ${amount} ${fromToken}`}
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Confetti component for success animations
export function SuccessConfetti({ trigger }: { trigger: boolean }) {
  const { enableAnimations } = usePerformanceMode();
  
  if (!trigger || !enableAnimations) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {Array.from({ length: 50 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
          initial={{
            x: '50vw',
            y: '50vh',
            scale: 0,
            rotate: 0
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [0, 1, 0],
            rotate: 360
          }}
          transition={{
            duration: 3,
            delay: i * 0.05,
            ease: "easeOut"
          }}
        />
      ))}
    </div>
  );
}