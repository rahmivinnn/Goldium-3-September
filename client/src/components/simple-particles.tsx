import React, { useEffect, useState } from 'react';
import { usePerformanceMode } from '@/lib/settings-store';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface SimpleParticlesProps {
  count?: number;
  className?: string;
}

export function SimpleParticles({ count = 50, className = '' }: SimpleParticlesProps) {
  const { enableParticles } = usePerformanceMode();
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!enableParticles) return;

    const createParticle = (id: number): Particle => ({
      id,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.3 + 0.1
    });

    const initialParticles = Array.from({ length: count }, (_, i) => createParticle(i));
    setParticles(initialParticles);

    const animateParticles = () => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: (particle.x + particle.vx + 100) % 100,
          y: (particle.y + particle.vy + 100) % 100,
          opacity: 0.1 + Math.sin(Date.now() * 0.001 + particle.id) * 0.1
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [enableParticles, count]);

  if (!enableParticles) {
    return null;
  }

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-yellow-400 to-amber-500"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            transition: 'opacity 0.5s ease'
          }}
        />
      ))}
    </div>
  );
}