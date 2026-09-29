"use client";

import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

export function Loader({
  text = "content",
  size = "md",
  className,
  fullScreen = false,
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-3",
    lg: "h-16 w-16 border-4",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    : "flex items-center justify-center py-12";

  return (
    <div className={cn(containerClasses, className)}>
      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            "rounded-full border-primary/30 border-t-primary animate-spin",
            sizeClasses[size]
          )}
          style={{
            borderStyle: "solid",
          }}
        />
        
        <p
          className={cn(
            "text-muted-foreground font-medium animate-pulse",
            textSizeClasses[size]
          )}
        >
          Loading <span className="text-primary">{text}</span>
        </p>
      </div>
    </div>
  );
}

export function PageLoader({ text = "page" }: { text?: string }) {
  return <Loader text={text} size="lg" fullScreen />;
}

export function SectionLoader({ text = "content" }: { text?: string }) {
  return <Loader text={text} size="md" />;
}

export function InlineLoader({ text = "data" }: { text?: string }) {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="h-4 w-4 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
      <span className="text-sm text-muted-foreground">
        Loading <span className="text-primary">{text}</span>
      </span>
    </div>
  );
}
