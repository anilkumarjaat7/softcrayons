import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-10 max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && <span className="brand-eyebrow mb-4">{eyebrow}</span>}
      <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

interface PageHeroProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
  align = "left",
  className,
}: PageHeroProps) {
  return (
    <section className={cn("brand-section pt-32 pb-14 md:pt-36 md:pb-20", className)}>
      <div className="container relative z-10">
        <div
          className={cn(
            "max-w-4xl",
            align === "center" ? "mx-auto text-center" : "text-left"
          )}
        >
          {eyebrow && <span className="brand-eyebrow mb-5">{eyebrow}</span>}
          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {description}
            </p>
          )}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
}

interface StatTileProps {
  icon: ElementType;
  value: ReactNode;
  label: string;
  dark?: boolean;
}

export function StatTile({ icon: Icon, value, label, dark = false }: StatTileProps) {
  return (
    <div
      className={cn(
        "rounded-md border p-5 text-center transition-all duration-300 hover:-translate-y-1",
        dark
          ? "border-white/10 bg-white/10 text-white"
          : "brand-panel bg-card"
      )}
    >
      <div
        className={cn(
          "mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-md",
          dark ? "bg-secondary text-white" : "bg-secondary/10 text-secondary"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className={cn("text-2xl font-black", dark ? "text-white" : "text-foreground")}>
        {value}
      </div>
      <div
        className={cn(
          "mt-1 text-xs font-bold uppercase tracking-[0.14em]",
          dark ? "text-white/65" : "text-muted-foreground"
        )}
      >
        {label}
      </div>
    </div>
  );
}
