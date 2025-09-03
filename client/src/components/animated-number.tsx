import React, { useEffect, useState } from 'react';
import CountUp from 'react-countup';

interface AnimatedNumberProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  enableAnimation?: boolean;
}

export function AnimatedNumber({ 
  value, 
  decimals = 0, 
  prefix = '', 
  suffix = '', 
  className = '',
  duration = 1.5,
  enableAnimation = true
}: AnimatedNumberProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [previousValue, setPreviousValue] = useState(value);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    if (value !== previousValue) {
      setPreviousValue(value);
    }
  }, [value, previousValue]);

  if (!enableAnimation) {
    return (
      <span className={`odometer-number ${className}`}>
        {prefix}{value.toFixed(decimals)}{suffix}
      </span>
    );
  }

  return (
    <span className={`odometer-number number-glow ${className}`}>
      {isVisible && (
        <CountUp
          start={0}
          end={value}
          duration={duration}
          decimals={decimals}
          prefix={prefix}
          suffix={suffix}
          preserveValue
          useEasing
          easingFn={(t, b, c, d) => {
            // Custom easing function for smooth animation
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
          }}
        />
      )}
    </span>
  );
}