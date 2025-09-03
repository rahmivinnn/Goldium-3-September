import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

interface PowerfulAnimatedCardProps {
  children: React.ReactNode;
  delay: number;
  borderColor: string;
  hoverColor: string;
  glowColor: string;
}

export function PowerfulAnimatedCard({ 
  children, 
  delay, 
  borderColor, 
  hoverColor, 
  glowColor 
}: PowerfulAnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateY: -45, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
      transition={{ 
        duration: 1, 
        delay, 
        type: "spring", 
        stiffness: 80,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.15, 
        rotateY: 8,
        rotateX: 5,
        z: 100,
        boxShadow: `0 30px 60px -12px ${glowColor}`,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className={`bg-black/70 backdrop-blur-xl border ${borderColor} hover:${hoverColor} transition-all duration-500 group cursor-pointer relative overflow-hidden transform-gpu`}>
        {/* Animated Background Overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-yellow-400/5"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Scanning Line Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: '100%', opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        
        <CardContent className="p-6 text-center relative z-10">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
}