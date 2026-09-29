"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, BookOpen, List, X } from "lucide-react";
import { cn } from "@/lib/utils";

type TopicResult = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  category?: { title: string | null; slug: string | null } | null;
};

type LessonResult = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  position?: number | null;
  subtopic?: {
    title: string | null;
    slug: string | null;
    topic?: { title: string | null; slug: string | null } | null;
  } | null;
};

type SearchResponse = {
  topics: TopicResult[];
  lessons: LessonResult[];
};

export function TutorialSearch({ variant = "default" }: { variant?: "default" | "navbar" }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResponse>({ topics: [], lessons: [] });
  const [error, setError] = useState<string | null>(null);

  const canSearch = query.trim().length >= 2;

  useEffect(() => {
    if (!canSearch) {
      setResults({ topics: [], lessons: [] });
      setError(null);
      return;
    }

    const controller = new AbortController();
    const runSearch = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/tutorials/search?q=${encodeURIComponent(query.trim())}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Failed to search tutorials");
        const data = await res.json();
        if (data.success) {
          setResults(data.data as SearchResponse);
        } else {
          setError(data.error || "Search failed");
          setResults({ topics: [], lessons: [] });
        }
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Search failed");
        setResults({ topics: [], lessons: [] });
      } finally {
        setLoading(false);
      }
    };

    runSearch();
    return () => controller.abort();
  }, [query, canSearch]);

  const totalResults = useMemo(
    () => results.topics.length + results.lessons.length,
    [results.topics.length, results.lessons.length],
  );

  return (
    <div className={cn("relative w-full", variant === "default" && "max-w-3xl")}>
      <div className="relative">
        <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground", variant === "navbar" ? "hidden" : "h-4 w-4")} />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tutorials, topics, or lessons"
          className={cn(
            variant === "default"
              ? "pl-10 pr-10 rounded-md border border-border bg-card shadow-sm focus-visible:ring-primary/20"
              : "bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 shadow-none h-8 text-sm"
          )}
          autoFocus={variant === "navbar"}
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground",
              variant === "navbar" ? "right-2" : "right-3"
            )}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {(canSearch || loading || error) && (
        <div className={cn(
          "absolute z-20 mt-2 w-full rounded-md border border-border bg-card shadow-[0_18px_45px_hsl(222_47%_11%/0.14)]",
          variant === "navbar" && "w-80 -right-4"
        )}>
          <div className="max-h-96 overflow-y-auto p-4 space-y-4">
            {loading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Searching tutorials...
              </div>
            )}

            {!loading && error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            {!loading && !error && totalResults === 0 && canSearch && (
              <p className="text-sm text-muted-foreground">No tutorials found for &quot;{query}&quot;.</p>
            )}

            {!loading && results.topics.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <List className="h-4 w-4" /> Topics
                </div>
                <div className="space-y-2">
                  {results.topics.map((topic) => (
                    <Link
                      key={`topic-${topic.id}`}
                      href={`/tutorials/${topic.slug}`}
                      className="flex items-start gap-3 rounded-md border border-transparent px-3 py-2 hover:border-border hover:bg-accent"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{topic.title}</p>
                        {topic.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">{topic.description}</p>
                        )}
                        {topic.category?.title && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {topic.category.title}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loading && results.lessons.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                  <BookOpen className="h-4 w-4" /> Lessons
                </div>
                <div className="space-y-2">
                  {results.lessons.map((lesson) => {
                    const topicSlug = lesson.subtopic?.topic?.slug;
                    if (!topicSlug) return null;
                    return (
                      <Link
                        key={`lesson-${lesson.id}`}
                        href={`/tutorials/${topicSlug}/${lesson.slug}`}
                        className="flex items-start gap-3 rounded-md border border-transparent px-3 py-2 hover:border-border hover:bg-accent"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{lesson.title}</p>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">{lesson.description}</p>
                          )}
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                            {lesson.subtopic?.title && <Badge variant="secondary">{lesson.subtopic.title}</Badge>}
                            {lesson.subtopic?.topic?.title && (
                              <Badge variant="outline">{lesson.subtopic.topic.title}</Badge>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
