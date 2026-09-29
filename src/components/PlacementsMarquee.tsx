"use client";

import { useState, useEffect } from "react";
import { Marquee } from "@/components/ui/marquee";
import { Building2, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SectionLoader } from "@/components/ui/loader";

interface Placement {
  id: number;
  studentName: string;
  avatar: string | null;
  courseName: string;
  dialogue: string | null;
  packageOffered: string | null;
  companyName: string | null;
  position: string | null;
  isFeatured: boolean;
}

function PlacementMarqueeCard({ placement }: { placement: Placement }) {
  return (
    <div className="relative w-[280px] sm:w-[320px] flex-shrink-0 bg-card border border-primary/25 rounded-2xl overflow-hidden shadow-[0_8px_24px_hsl(var(--primary)/0.14),inset_0_1px_0_hsl(var(--primary)/0.3)] hover:border-primary/45 hover:shadow-[0_12px_30px_hsl(var(--primary)/0.2),inset_0_1px_0_hsl(var(--primary)/0.45)] transition-all duration-300">
      <div className="p-4 flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-muted">
          {placement.avatar ? (
            <img
              src={placement.avatar}
              alt={placement.studentName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-lg">
              {placement.studentName.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm truncate">{placement.studentName}</h4>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
            <GraduationCap className="w-3 h-3 text-primary" />
            <span className="truncate">{placement.courseName}</span>
          </div>
        </div>

        {placement.packageOffered && (
          <div className="bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {placement.packageOffered}
          </div>
        )}
      </div>

      <div className="px-4 pb-4">
        <div className="bg-muted/50 rounded-xl p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Building2 className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{placement.companyName || "Top Company"}</p>
            <p className="text-xs text-muted-foreground truncate">{placement.position || "Software Engineer"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PlacementsMarquee() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        const response = await fetch("/api/placements?limit=50");
        const data = await response.json();
        if (data.success) {
          setPlacements(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch placements:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlacements();
  }, []);

  if (loading) {
    return (
      <section className="py-24 overflow-hidden">
        <div className="container">
          <SectionLoader text="placements" />
        </div>
      </section>
    );
  }

  if (placements.length === 0) {
    return null;
  }

  const midpoint = Math.ceil(placements.length / 2);
  const firstRow = placements.slice(0, midpoint);
  const secondRow = placements.slice(midpoint);

  return (
    <section className="py-24 overflow-hidden">
      <div className="container mb-12">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">
            Recently <span className="text-gradient">Placed </span>Students
          </h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of students who landed their dream jobs at top companies.
          </p>
        </div>
      </div>

      <div className="space-y-6 px-3 sm:px-5 lg:px-6">
        <Marquee pauseOnHover duration={60} className="[--gap:1.5rem]">
          {firstRow.map((placement) => (
            <PlacementMarqueeCard key={placement.id} placement={placement} />
          ))}
        </Marquee>

        <Marquee pauseOnHover reverse duration={60} className="[--gap:1.5rem]">
          {secondRow.map((placement) => (
            <PlacementMarqueeCard key={placement.id} placement={placement} />
          ))}
        </Marquee>
      </div>

      <div className="text-center mt-12">
        <Link href="/placements">
          <Button variant="outline" size="lg">
            View All Placements
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
