import React from 'react';
import { motion } from 'framer-motion';

export function AnimatedDashboardBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Powerful K-Series Floating Elements */}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((num, i) => (
        <motion.img
          key={`k-element-${num}`}
          src={`/K${num}.png`}
          alt={`K${num}`}
          className="absolute opacity-5 w-32 h-32 object-contain"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            scale: [0.3, 0.8, 0.3],
            opacity: [0, 0.08, 0],
            rotate: [0, 360, 720],
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0]
          }}
          transition={{
            duration: Math.random() * 15 + 20,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Intense Golden Energy Particles */}
      {[...Array(25)].map((_, i) => (
        <motion.div
          key={`energy-${i}`}
          className="absolute golden-sparkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 2, 0],
            opacity: [0, 1, 0],
            rotate: [0, 360, 720]
          }}
          transition={{
            duration: Math.random() * 2 + 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Powerful Matrix Rain Effect */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`matrix-${i}`}
          className="absolute w-px bg-gradient-to-b from-transparent via-yellow-400/30 to-transparent"
          style={{
            left: `${(i + 1) * 8.33}%`,
            height: '100vh',
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            scaleY: [0, 1, 0],
            y: ['-100vh', '0vh', '100vh']
          }}
          transition={{
            duration: Math.random() * 3 + 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear"
          }}
        />
      ))}

      {/* Powerful Energy Waves */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`wave-${i}`}
          className="absolute rounded-full border border-yellow-400/20"
          style={{
            left: '50%',
            top: '50%',
            width: `${(i + 1) * 200}px`,
            height: `${(i + 1) * 200}px`,
            marginLeft: `-${(i + 1) * 100}px`,
            marginTop: `-${(i + 1) * 100}px`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 2, 0],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Lightning Bolts */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`lightning-${i}`}
          className="absolute w-1 bg-gradient-to-b from-yellow-400/60 via-yellow-300/40 to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-10%',
            height: '120%',
            transform: `rotate(${Math.random() * 20 - 10}deg)`
          }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{
            opacity: [0, 1, 0],
            scaleY: [0, 1, 0]
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            delay: Math.random() * 8 + 2,
            repeatDelay: Math.random() * 5 + 3
          }}
        />
      ))}

      {/* Powerful Pulse Rings */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={`pulse-${i}`}
            className="absolute rounded-full border border-yellow-400/10"
            style={{
              width: `${(i + 1) * 300}px`,
              height: `${(i + 1) * 300}px`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>

      {/* Dynamic Code Rain */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={`code-${i}`}
          className="absolute text-yellow-400/20 font-mono text-xs"
          style={{
            left: `${Math.random() * 100}%`,
            top: '-5%',
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: '110vh',
            opacity: [0, 0.8, 0.8, 0]
          }}
          transition={{
            duration: Math.random() * 5 + 8,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "linear"
          }}
        >
          {Math.random().toString(36).substring(2, 8)}
        </motion.div>
      ))}
    </div>
  );
}