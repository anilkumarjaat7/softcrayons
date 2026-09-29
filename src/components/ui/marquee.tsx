"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  duration?: number;
}

export function Marquee({
  children,
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  duration = 40,
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group flex overflow-hidden [--gap:1rem] gap-[var(--gap)]",
        vertical ? "flex-col py-[var(--gap)]" : "flex-row px-[var(--gap)]",
        className
      )}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "flex shrink-0 justify-around gap-[var(--gap)]",
            vertical ? "flex-col animate-marquee-vertical" : "flex-row animate-marquee",
            reverse && (vertical ? "animate-marquee-vertical-reverse" : "animate-marquee-reverse"),
            pauseOnHover && "group-hover:[animation-play-state:paused]"
          )}
          style={{
            animationDuration: `${duration}s`,
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
