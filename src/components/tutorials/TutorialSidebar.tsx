"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type TutorialNavLesson = {
  id?: number | null;
  title: string;
  slug: string;
};

export type TutorialNavSubtopic = {
  id?: number | null;
  title: string;
  slug: string;
  lessons: TutorialNavLesson[];
};

type Props = {
  topicSlug: string;
  subtopics: TutorialNavSubtopic[];
  currentLessonSlug?: string;
};

export function TutorialSidebar({ topicSlug, subtopics, currentLessonSlug }: Props) {
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="space-y-6">
      {subtopics.map((subtopic) => (
        <div key={subtopic.slug} className="space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-secondary">
            {subtopic.title}
          </p>
          <div className="space-y-1">
            {subtopic.lessons.map((lesson) => {
              const active = lesson.slug === currentLessonSlug;
              return (
                <Link
                  key={lesson.slug}
                  href={`/tutorials/${topicSlug}/${lesson.slug}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-2.5 text-sm leading-snug transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground font-bold shadow-[0_8px_18px_hsl(var(--primary)/0.18)]"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <span className="line-clamp-2">{lesson.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <aside className="w-full bg-background lg:h-full lg:w-[300px] lg:flex-none lg:overflow-y-auto lg:overscroll-contain lg:border-r lg:border-border/70 lg:bg-card/70 lg:px-4 lg:py-5">
      <div className="px-4 pt-3 pb-2 lg:hidden">
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="w-10 h-10 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
            aria-label="Toggle lessons menu"
            aria-expanded={open}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <div
          className={cn(
            "transition-all duration-300 overflow-hidden rounded-md border border-border bg-background shadow-lg",
            open ? "mt-2 max-h-[60dvh] overflow-y-auto opacity-100" : "max-h-0 border-transparent opacity-0"
          )}
        >
          <div className="p-4">
            {subtopics.length ? (
              nav
            ) : (
              <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">Lessons will appear here.</p>
            )}
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        {subtopics.length ? (
          nav
        ) : (
          <p className="rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">Lessons will appear here.</p>
        )}
      </div>
    </aside>
  );
}
