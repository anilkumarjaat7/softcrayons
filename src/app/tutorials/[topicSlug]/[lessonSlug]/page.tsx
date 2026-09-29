import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TutorialSidebar } from "@/components/tutorials/TutorialSidebar";
import { TutorialContent } from "@/components/tutorials/TutorialContent";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home, Sparkles } from "lucide-react";
import { fetchServerApi } from "@/lib/server-api";

export const revalidate = 600;

type TocItem = { id: string; text: string };

type LessonPageParams = {
  params: Promise<{ topicSlug: string; lessonSlug: string }>;
};

type TopicLesson = { id: number; title: string; slug: string; position?: number | null };

type TopicSubtopic = {
  id: number;
  title: string;
  slug: string;
  position?: number | null;
  lessons: TopicLesson[];
};

type TopicData = {
  id: number;
  title: string;
  slug: string;
  subtopics: TopicSubtopic[];
};

type TopicResponse = {
  success: boolean;
  data?: TopicData;
  error?: string;
};

type LessonData = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  content: string;
  tableOfContent?: unknown;
  nextLink?: string | null;
  previousLink?: string | null;
  homeLink?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaKeywords?: unknown;
  subtopic?: {
    id: number;
    title: string;
    slug: string;
    topic?: {
      id: number;
      title: string;
      slug: string;
    } | null;
  } | null;
};

type LessonResponse = {
  success: boolean;
  data?: LessonData;
  error?: string;
};

type NavTarget = { href: string; title: string };

type NavComputation = {
  previous?: NavTarget;
  next?: NavTarget;
};

async function getLesson(slug: string) {
  try {
    const response = await fetchServerApi<LessonResponse>(`/api/tutorial-lessons/${encodeURIComponent(slug)}`, {
      next: { revalidate: 600 },
    });

    if (!response.success || !response.data) {
      return null;
    }

    return response.data;
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

async function getTopicWithNav(slug: string) {
  try {
    const response = await fetchServerApi<TopicResponse>(`/api/tutorial-topics/${encodeURIComponent(slug)}`, {
      next: { revalidate: 600 },
    });

    if (!response.success || !response.data) {
      return null;
    }

    return {
      ...response.data,
      subtopics: [...response.data.subtopics]
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((subtopic) => ({
          ...subtopic,
          lessons: [...subtopic.lessons].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
        })),
    };
  } catch (error: unknown) {
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

function isNotFoundError(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error && error.status === 404;
}

function toTableOfContent(value: unknown): TocItem[] {
  if (!value) return [];

  let parsed = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return [];
    }
  }

  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item) => {
      const record = typeof item === "object" && item !== null ? item as Record<string, unknown> : {};
      return { id: String(record.id ?? "").trim(), text: String(record.text ?? "").trim() };
    })
    .filter((item) => item.id && item.text);
}

function toKeywords(value: unknown): string[] | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value.map((keyword) => String(keyword));
  if (typeof value === "string") return value.split(",").map((keyword) => keyword.trim()).filter(Boolean);
  return undefined;
}

export async function generateMetadata({ params }: LessonPageParams): Promise<Metadata> {
  const { topicSlug, lessonSlug } = await params;
  const lesson = await getLesson(lessonSlug);

  if (!lesson || lesson.subtopic?.topic?.slug !== topicSlug) return {};

  const title = lesson.metaTitle || `${lesson.title} | ${lesson.subtopic.topic.title}`;
  const description = lesson.metaDescription || lesson.description || "Tutorial lesson";
  const keywords = toKeywords(lesson.metaKeywords);
  const url = `/tutorials/${lesson.subtopic.topic.slug}/${lesson.slug}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    twitter: { title, description, card: "summary_large_image" },
  };
}

export default async function LessonPage({ params }: LessonPageParams) {
  const { topicSlug, lessonSlug } = await params;
  const [lesson, topic] = await Promise.all([getLesson(lessonSlug), getTopicWithNav(topicSlug)]);

  if (!lesson || !topic || lesson.subtopic?.topic?.slug !== topicSlug) {
    notFound();
  }

  if (!lesson.subtopic?.topic) {
    notFound();
  }

  const navSubtopics = topic.subtopics.map((subtopic) => ({
    id: subtopic.id,
    title: subtopic.title,
    slug: subtopic.slug,
    lessons: subtopic.lessons,
  }));

  const toc = toTableOfContent(lesson.tableOfContent);
  const { previous, next } = computePrevNext(navSubtopics, lesson.slug, topic.slug);

  const previousHref = lesson.previousLink || previous?.href;
  const nextHref = lesson.nextLink || next?.href;
  const homeHref = lesson.homeLink || "/tutorials";
  const hasToc = toc.length > 0;

  return (
    <div className="brand-section pt-20 md:pt-24 overflow-x-hidden">
      <div className="flex min-h-[calc(100vh-5rem)] flex-col lg:h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-6rem)] lg:flex-row lg:overflow-hidden">
        <TutorialSidebar topicSlug={topic.slug} subtopics={navSubtopics} currentLessonSlug={lesson.slug} />

        <main className="flex-1 min-w-0 lg:h-full lg:overflow-y-auto lg:overscroll-contain">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-10 pb-12 pt-6 space-y-8">
            <header className="space-y-5">
              <div className={hasToc ? "grid gap-5 xl:grid-cols-[minmax(0,1fr)_280px]" : "space-y-5"}>
                <div className="brand-panel rounded-md p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    <Link href="/tutorials" className="hover:text-primary">Tutorials</Link>
                    <span>/</span>
                    <Link href={`/tutorials/${topic.slug}`} className="hover:text-primary">{topic.title}</Link>
                    <span>/</span>
                    <span className="text-secondary">{lesson.subtopic.title}</span>
                  </div>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-secondary/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-secondary">
                    <Sparkles className="h-3.5 w-3.5" />
                    Lesson
                  </div>
                  <div className="mt-4 space-y-3">
                    <h1 className="text-4xl font-black leading-tight md:text-5xl">{lesson.title}</h1>
                    {lesson.description && (
                      <p className="max-w-3xl text-lg leading-8 text-muted-foreground">{lesson.description}</p>
                    )}
                  </div>
                  <div className="mt-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <span className="rounded-md bg-primary/10 px-3 py-1 text-primary">{lesson.subtopic.title}</span>
                    <span>/</span>
                    <span>{topic.title}</span>
                  </div>
                  <div className="mt-6">
                    <NavButtons previousHref={previousHref} nextHref={nextHref} homeHref={homeHref} />
                  </div>
                </div>

                {hasToc && (
                  <aside className="brand-panel rounded-md p-4 text-sm xl:sticky xl:top-28 xl:max-h-[calc(100vh-8rem)] xl:overflow-y-auto">
                    <p className="mb-3 text-xs font-black uppercase tracking-wide text-secondary">
                      Contents
                    </p>
                    <ul className="space-y-1.5">
                      {toc.map((item) => (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className="block rounded-md px-3 py-2 font-semibold text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                          >
                            {item.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </div>
            </header>

            <article className="brand-panel rounded-md p-5 md:p-8">
              <TutorialContent content={lesson.content} />
            </article>

            <div className="brand-panel rounded-md p-4">
              <NavButtons previousHref={previousHref} nextHref={nextHref} homeHref={homeHref} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function computePrevNext(subtopics: { lessons: { slug: string; title: string }[] }[], currentSlug: string, topicSlug: string): NavComputation {
  const sequence: NavTarget[] = subtopics
    .flatMap((subtopic) => subtopic.lessons)
    .map((lesson) => ({ href: `/tutorials/${topicSlug}/${lesson.slug}`, title: lesson.title }));

  const currentIndex = sequence.findIndex((item) => item.href.endsWith(`/${currentSlug}`));

  if (currentIndex === -1) return {};

  const previous = currentIndex > 0 ? sequence[currentIndex - 1] : undefined;
  const next = currentIndex < sequence.length - 1 ? sequence[currentIndex + 1] : undefined;

  return { previous, next };
}

function NavButtons({ previousHref, nextHref, homeHref }: { previousHref?: string; nextHref?: string; homeHref?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {previousHref && (
        <Button asChild variant="secondary">
          <Link href={previousHref} className="inline-flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Previous
          </Link>
        </Button>
      )}
      {homeHref && (
        <Button asChild variant="outline">
          <Link href={homeHref} className="inline-flex items-center gap-2">
            <Home className="h-4 w-4" /> Tutorials
          </Link>
        </Button>
      )}
      {nextHref && (
        <Button asChild>
          <Link href={nextHref} className="inline-flex items-center gap-2">
            Next <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
