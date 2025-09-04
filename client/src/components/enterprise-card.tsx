import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface EnterpriseCardProps {
  children: React.ReactNode;
  delay: number;
  index: number;
}

export function EnterpriseCard({ children, delay, index }: EnterpriseCardProps) {
  return (
    <motion.div
      className="group perspective-1000"
      initial={{ 
        opacity: 0, 
        y: 100, 
        rotateY: -60,
        rotateX: 30,
        scale: 0.7
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateY: 0,
        rotateX: 0,
        scale: 1
      }}
      transition={{ 
        duration: 1.5, 
        delay,
        type: "spring", 
        stiffness: 60,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.08, 
        rotateY: 10,
        rotateX: -5,
        z: 100,
        transition: { 
          duration: 0.4,
          type: "spring",
          stiffness: 300
        }
      }}
    >
      <Card className="bg-black/80 backdrop-blur-2xl border border-gray-700/50 hover:border-yellow-400/60 transition-all duration-700 cursor-pointer relative overflow-hidden transform-gpu">
        {/* Premium Holographic Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-400/5"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Sophisticated Scan Line */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/15 to-transparent"
          initial={{ x: '-100%', skewX: -20 }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        
        {/* Enterprise Border Glow */}
        <motion.div
          className="absolute inset-0 rounded-lg"
          initial={{ 
            boxShadow: "inset 0 0 0 1px rgba(255,215,0,0.1)" 
          }}
          whileHover={{ 
            boxShadow: [
              "inset 0 0 0 1px rgba(255,215,0,0.1)",
              "inset 0 0 0 2px rgba(255,215,0,0.3)",
              "inset 0 0 0 1px rgba(255,215,0,0.2)"
            ]
          }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
        
        {/* Data Visualization Lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
        
        <CardContent className="p-8 text-center relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: delay + 0.3 }}
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.3 }
            }}
          >
            {children}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}