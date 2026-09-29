"use client";

import { ArrowRight, CheckCircle2, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const points = ["Live projects", "Expert trainers", "Placement support"];

export function CTASection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="relative overflow-hidden rounded-lg bg-[hsl(var(--brand-navy))] px-6 py-16 text-center text-white shadow-[0_24px_70px_hsl(222_47%_11%/0.22)] md:px-12 md:py-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--secondary)/0.22),transparent_24rem),radial-gradient(circle_at_80%_30%,hsl(var(--primary)/0.24),transparent_26rem)]" />
          <div className="relative mx-auto max-w-4xl">
            <span className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/75">
              Start with guidance
            </span>
            <h2 className="mt-5 text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
              Do not just learn. Build a career path.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/72">
              Talk to our counsellors, choose the right course, and join a practical program built around projects, mentorship, and hiring readiness.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/query" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90">
                  Get Free Guidance
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="tel:+918545012345" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-white/20 bg-white/10 text-white hover:bg-white hover:text-primary">
                  <PhoneCall className="h-5 w-5" />
                  Call Now
                </Button>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-sm font-bold text-white/72">
              {points.map((point) => (
                <div key={point} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
