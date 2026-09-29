"use client";

import { useEffect, useRef, useState } from "react";
import {
  UserPlus,
  BookOpen,
  FolderCode,
  MessageSquare,
  Trophy,
  CheckCircle2,
  Briefcase
} from "lucide-react";

const milestones = [
  {
    icon: UserPlus,
    title: "Enroll & Onboard",
    label: "PHASE 1",
    side: "top" as const,
    description: "Start your journey.",
    skills: ["Career Counseling", "Batch Allocation", "Tool Setup"],
    isFinish: false,
  },
  {
    icon: BookOpen,
    title: "Master Core Skills",
    label: "PHASE 2",
    side: "bottom" as const,
    description: "Learn from industry experts.",
    skills: ["Hands-on Coding", "Live Assignments", "Doubt Clearing"],
    isFinish: false,
  },
  {
    icon: FolderCode,
    title: "Build Real Projects",
    label: "PHASE 3",
    side: "top" as const,
    description: "Apply your knowledge.",
    skills: ["Industry Use-cases", "GitHub Portfolio", "Code Reviews"],
    isFinish: false,
  },
  {
    icon: MessageSquare,
    title: "Interview Prep",
    label: "PHASE 4",
    side: "bottom" as const,
    description: "Get ready for the real world.",
    skills: ["Resume Polish", "Mock Interviews", "Aptitude Tests"],
    isFinish: false,
  },
  {
    icon: Trophy,
    title: "Get Hired!",
    label: "FINISH",
    side: "top" as const,
    description: "Launch your career.",
    skills: ["Placement Drives", "Offer Negotiation", "Dream Job"],
    isFinish: true,
  },
];

export function LearningPathway() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const wh = window.innerHeight;
      const start = wh * 0.8; // Start filling when section enters 80% of screen
      const end = -rect.height * 0.2; // Finish when section is 20% past top
      
      const newProgress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
      setProgress(newProgress);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-background overflow-hidden"
    >
      {/* Clean, subtle background grid using theme variables */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary) / 0.03) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary) / 0.03) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="container relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-20 md:mb-24">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 text-foreground">
            Path of Your Next{" "}
            <span className="text-gradient">Job</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Follow our structured learning track. Every phase is meticulously designed to transform you from a beginner into a job-ready professional.
          </p>
        </div>

        <div className="hidden md:block max-w-6xl mx-auto relative">
          
          <div className="flex items-end pb-8">
            {milestones.map((m, i) => {
              const isActive = progress >= (i / (milestones.length - 1)) * 0.88;
              return (
                <div key={`top-${i}`} className="flex-1 flex flex-col items-center px-4">
                  {m.side === "top" ? <PathwayCard m={m} isActive={isActive} /> : null}
                </div>
              );
            })}
          </div>

          {/* Central Track & Nodes */}
          <div className="relative flex items-center py-4">
            {/* Background Track */}
            <div className="absolute top-1/2 -translate-y-1/2 left-[10%] right-[10%] h-[2px] bg-border" />
            
            {/* Active Glow Track */}
            <div
              className="absolute top-1/2 -translate-y-1/2 bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)] transition-all duration-300 ease-out"
              style={{ left: "10%", height: "2px", width: `${progress * 80}%` }}
            />

            {/* Nodes */}
            {milestones.map((m, i) => {
              const isActive = progress >= (i / (milestones.length - 1)) * 0.88;
              const Icon = m.icon;
              return (
                <div key={`node-${i}`} className="flex-1 flex justify-center relative z-10">
                  <div
                    className={`relative flex items-center justify-center rounded-full transition-all duration-500 border-[3px] ${
                      isActive 
                        ? "bg-primary border-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.4)] scale-110" 
                        : "bg-card border-border text-muted-foreground"
                    }`}
                    style={{ width: "48px", height: "48px" }}
                  >
                    <Icon className={`w-5 h-5 transition-colors duration-500 ${isActive ? "text-primary-foreground" : ""}`} />
                    
                    {/* Active Tick Indicator */}
                    {isActive && !m.isFinish && (
                      <div className="absolute -top-1 -right-1 bg-background rounded-full">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                    )}
                  </div>

                  {/* Vertical Connectors */}
                  <div 
                    className={`absolute w-[2px] transition-all duration-500 ${m.side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'} ${isActive ? 'bg-primary/50' : 'bg-transparent'}`}
                    style={{ height: "24px" }}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Row Cards */}
          <div className="flex items-start pt-8">
            {milestones.map((m, i) => {
              const isActive = progress >= (i / (milestones.length - 1)) * 0.88;
              return (
                <div key={`bottom-${i}`} className="flex-1 flex flex-col items-center px-4">
                  {m.side === "bottom" ? <PathwayCard m={m} isActive={isActive} /> : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* --- MOBILE LAYOUT --- */}
        <div className="md:hidden max-w-sm mx-auto relative pl-4">
          {/* Vertical Track Background */}
          <div className="absolute top-0 bottom-0 left-[35px] w-[2px] bg-border" />
          
          {/* Vertical Track Fill */}
          <div
            className="absolute top-0 left-[35px] w-[2px] bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)] origin-top transition-all duration-300 ease-out"
            style={{ height: `${progress * 100}%` }}
          />

          {milestones.map((m, i) => {
            const threshold = i / (milestones.length - 1);
            const isActive = progress >= threshold * 0.88;
            const Icon = m.icon;

            return (
              <div
                key={m.title}
                className="relative flex items-start gap-6 pb-12 last:pb-0"
              >
                {/* Mobile Node */}
                <div className="relative z-20 flex-shrink-0 mt-1">
                  <div
                    className={`flex items-center justify-center rounded-full transition-all duration-500 border-[3px] ${
                      isActive 
                        ? "bg-primary border-primary/20 shadow-[0_0_15px_hsl(var(--primary)/0.4)] scale-110" 
                        : "bg-card border-border text-muted-foreground"
                    }`}
                    style={{ width: "40px", height: "40px" }}
                  >
                    <Icon className={`w-4 h-4 transition-colors duration-500 ${isActive ? "text-primary-foreground" : ""}`} />
                  </div>
                </div>

                {/* Mobile Card */}
                <div className="flex-1">
                  <PathwayCard m={m} isActive={isActive} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Sub-component for the cards to keep code clean
type Milestone = (typeof milestones)[number];

function PathwayCard({ m, isActive }: { m: Milestone; isActive: boolean }) {
  return (
    <div
      className={`w-full bg-card rounded-xl border transition-all duration-500 overflow-hidden ${
        isActive 
          ? "border-primary/40 shadow-lg shadow-primary/5 translate-y-0 opacity-100" 
          : "border-border/50 shadow-sm translate-y-4 opacity-40 grayscale-[0.5]"
      }`}
    >
      <div className={`p-4 ${isActive && m.isFinish ? "bg-primary/5" : ""}`}>
        <div className="flex items-center justify-between mb-3">
          <span
            className={`font-mono text-[10px] font-bold tracking-wider uppercase ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {m.label}
          </span>
        </div>

        <h3 className={`font-bold text-base leading-tight mb-1 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
          {m.title}
        </h3>
        
        <p className="text-xs text-muted-foreground mb-4">
          {m.description}
        </p>

        <div className="h-px w-full bg-border/50 mb-3" />

        <ul className="space-y-2">
          {m.skills.map((skill) => (
            <li key={skill} className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <div className={`mt-[3px] w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? "bg-primary" : "bg-muted-foreground/30"}`} />
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}