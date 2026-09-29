'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpNumberProps {
  value: string;
  className?: string;
}

function parseValue(value: string): { number: number; prefix: string; suffix: string } {
  const match = value.match(/^([^0-9]*)([0-9,]+)([^0-9]*)$/);
  if (!match) return { number: 0, prefix: '', suffix: value };
  const number = parseInt(match[2].replace(/,/g, ''), 10);
  return { number, prefix: match[1], suffix: match[3] };
}

function formatNumber(num: number, original: number): string {
  if (original >= 1000) {
    return num.toLocaleString('en-US');
  }
  return String(num);
}

export function CountUpNumber({ value, className }: CountUpNumberProps) {
  const { number: target, prefix, suffix } = parseValue(value);
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();

          const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = easeOutQuart(progress);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className={className}>
      {prefix}{formatNumber(count, target)}{suffix}
    </div>
  );
}
