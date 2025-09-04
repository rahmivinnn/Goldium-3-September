import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function PremiumCinematicBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Advanced particle system
    class PremiumParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      life: number;
      maxLife: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = 0;
        this.maxLife = Math.random() * 200 + 100;
        this.life = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life++;

        // Fade in and out
        if (this.life < this.maxLife * 0.3) {
          this.opacity = this.life / (this.maxLife * 0.3);
        } else if (this.life > this.maxLife * 0.7) {
          this.opacity = 1 - (this.life - this.maxLife * 0.7) / (this.maxLife * 0.3);
        } else {
          this.opacity = 1;
        }

        // Reset if off screen or life ended
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height || this.life >= this.maxLife) {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.life = 0;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.6;
        
        // Premium golden gradient
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
        gradient.addColorStop(0, '#FFD700');
        gradient.addColorStop(0.5, '#FFA500');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Core particle
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      }
    }

    // Create premium particle system
    const particles: PremiumParticle[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push(new PremiumParticle());
    }

    // Animation loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            ctx.save();
            ctx.globalAlpha = (1 - distance / 120) * 0.2;
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      requestAnimationFrame(animate);
    }

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Premium Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 opacity-40"
      />

      {/* Sophisticated K-Elements */}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((num, i) => (
        <motion.img
          key={`k-premium-${num}`}
          src={`/K${num}.png`}
          alt={`K${num}`}
          className="absolute opacity-3 w-24 h-24 object-contain filter grayscale"
          style={{
            left: `${15 + (i * 12)}%`,
            top: `${20 + Math.sin(i) * 30}%`,
          }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            scale: [0.4, 0.6, 0.4],
            opacity: [0, 0.03, 0],
            rotate: [0, 360],
            y: [0, -20, 0]
          }}
          transition={{
            duration: 25 + i * 3,
            repeat: Infinity,
            delay: i * 2,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Premium Geometric Patterns */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 24px, rgba(255, 215, 0, 0.03) 25px, rgba(255, 215, 0, 0.03) 26px, transparent 27px),
            linear-gradient(transparent 24px, rgba(255, 215, 0, 0.03) 25px, rgba(255, 215, 0, 0.03) 26px, transparent 27px)
          `,
          backgroundSize: '100px 100px'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Sophisticated Depth Layers */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`depth-${i}`}
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${30 + i * 20}% ${40 + i * 10}%, rgba(255, 215, 0, ${0.02 + i * 0.01}) 0%, transparent 70%)`
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            delay: i * 3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Enterprise Data Streams */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute w-px h-full bg-gradient-to-b from-transparent via-yellow-400/10 to-transparent"
          style={{
            left: `${12.5 * (i + 1)}%`,
          }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{
            scaleY: [0, 1, 0],
            opacity: [0, 0.4, 0],
            y: ['-50vh', '0vh', '50vh']
          }}
          transition={{
            duration: 8 + i,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}