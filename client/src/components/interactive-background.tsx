import React, { useMemo } from 'react';
import { usePerformanceMode } from '@/lib/settings-store';

interface InteractiveBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export function InteractiveBackground({ 
  intensity = 'medium', 
  className = '' 
}: InteractiveBackgroundProps) {
  const { enableParticles } = usePerformanceMode();

  const particleConfig = useMemo(() => {
    const counts = {
      low: 30,
      medium: 50,
      high: 80
    };

    return {
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
        modes: {
          push: {
            quantity: 4,
          },
          repulse: {
            distance: 100,
            duration: 0.4,
          },
        },
      },
      particles: {
        color: {
          value: ["#FFD966", "#E6B800", "#8C6A00"],
        },
        links: {
          color: "#E6B800",
          distance: 150,
          enable: true,
          opacity: 0.1,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: false,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 1000,
          },
          value: counts[intensity],
        },
        opacity: {
          value: { min: 0.1, max: 0.3 },
          animation: {
            enable: true,
            speed: 1,
            minimumValue: 0.1,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 0.5,
          },
        },
      },
      detectRetina: true,
    };
  }, [intensity]);

  if (!enableParticles) {
    return null;
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      <div className="w-full h-full bg-gradient-to-br from-black/20 via-transparent to-black/20 animate-pulse" />
    </div>
  );
}

// Lazy loaded version for performance
export const LazyInteractiveBackground = React.lazy(() => 
  import('./interactive-background').then(module => ({ 
    default: module.InteractiveBackground 
  }))
);