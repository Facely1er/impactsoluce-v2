import { useState, useEffect, useRef } from 'react';

interface UseAnimatedCounterOptions {
  duration?: number;
  startValue?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
}

export function useAnimatedCounter(
  targetValue: number,
  options: UseAnimatedCounterOptions = {}
) {
  const {
    duration = 2000,
    startValue = 0,
    decimals = 0,
    suffix = '',
    prefix = '',
  } = options;

  const [count, setCount] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (targetValue === count) {
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    startTimeRef.current = null;

    const animate = (currentTime: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = currentTime;
      }

      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      const currentValue = startValue + (targetValue - startValue) * easeOut;
      setCount(currentValue);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(targetValue);
        setIsAnimating(false);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [targetValue, duration, startValue]);

  const formattedValue = count.toFixed(decimals);
  const displayValue = `${prefix}${formattedValue}${suffix}`;

  return {
    count: parseFloat(formattedValue),
    displayValue,
    isAnimating,
  };
}

