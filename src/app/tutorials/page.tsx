import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, Code2, Layers, LibraryBig, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TutorialSearch } from "@/components/tutorials/TutorialSearch";
import { fetchServerApi } from "@/lib/server-api";

export const metadata: Metadata = {
  title: "Tutorials | SoftCrayons",
  description: "Explore practical tutorials, topics, and hands-on lessons from SoftCrayons.",
};

export const revalidate = 0;

type TopicLink = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  position?: number | null;
  categoryId: number;
  firstLessonSlug?: string;
};

type CategoryListing = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  position?: number | null;
  topics: TopicLink[];
};

type LandingResponse = {
  success: boolean;
  data: CategoryListing[];
  error?: string;
};

async function getTutorialLanding(): Promise<CategoryListing[]> {
  const response = await fetchServerApi<LandingResponse>("/api/tutorials/landing", {
    next: { revalidate: 0 },
  });

  if (!response.success) {
    throw new Error(response.error || "Failed to fetch tutorials landing data");
  }

  return [...response.data]
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((category) => ({
      ...category,
      topics: [...category.topics].sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    }));
}

function getTopicHref(topic: TopicLink) {
  return topic.firstLessonSlug
    ? `/tutorials/${topic.slug}/${topic.firstLessonSlug}`
    : `/tutorials/${topic.slug}`;
}

export default async function TutorialsLandingPage() {
  const categories = await getTutorialLanding();
  const topics = categories.flatMap((category) => category.topics);
  const featuredTopics = topics.slice(0, 6);
  const totalTopics = topics.length;
  const firstTopic = topics[0];

  return (
    <div className="min-h-screen bg-background brand-section pt-20">
      <section className="relative overflow-hidden border-b border-border/70">
        <div className="container relative z-10 py-16 md:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Softcrayons Tutorials, {" "}
                <span className="text-gradient">Structured Learning</span>
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Browse topic-wise lessons, search instantly, and move from fundamentals to hands-on implementation without losing your place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {firstTopic && (
                  <Link href={getTopicHref(firstTopic)} className="w-full sm:w-auto">
                    <Button size="lg" className="w-full bg-secondary hover:bg-secondary/90">
                      Start Learning
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Link href="/courses" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full">
                    Explore Courses
                  </Button>
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[
                  { icon: LibraryBig, value: categories.length, label: "Categories" },
                  { icon: Layers, value: totalTopics, label: "Topics" },
                  { icon: Code2, value: "Free", label: "Learning" },
                ].map(({ icon: Icon, value, label }) => (
                  <div key={label} className="brand-panel rounded-md p-4">
                    <Icon className="mb-3 h-5 w-5 text-secondary" />
                    <div className="text-2xl font-black text-foreground">{value}</div>
                    <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="brand-panel rounded-lg p-5 md:p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary/10 text-secondary">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black">Search the library</h2>
                  <p className="text-sm text-muted-foreground">Find lessons, topics, and concepts instantly.</p>
                </div>
              </div>
              <TutorialSearch />
              <div className="mt-6 space-y-3">
                {featuredTopics.slice(0, 4).map((topic) => (
                  <Link
                    key={topic.id}
                    href={getTopicHref(topic)}
                    className="group flex items-center justify-between rounded-md border border-border bg-background/70 px-4 py-3 transition-all hover:border-primary/35 hover:bg-accent"
                  >
                    <span className="font-bold text-foreground group-hover:text-primary">{topic.title}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-16 md:py-20">
        <div className="mb-10 max-w-3xl">
          <span className="brand-eyebrow mb-4">Browse by category</span>
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Choose a track and begin with the <span className="text-gradient">right first lesson</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Each category groups related tutorials so learners can scan, compare, and jump into the most useful path quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {categories.map((category, categoryIndex) => {
            const firstCategoryTopic = category.topics[0];
            return (
              <article key={category.id} className="brand-panel brand-card-hover flex h-full flex-col rounded-md p-6">
                <div className="mb-5 flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-secondary">
                      Track {String(categoryIndex + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mt-1 text-2xl font-black">{category.title}</h3>
                    {category.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mb-5 flex items-center gap-2 text-sm font-bold text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-secondary" />
                  {category.topics.length} topic{category.topics.length === 1 ? "" : "s"} available
                </div>

                <div className="flex-1 space-y-2">
                  {category.topics.length === 0 ? (
                    <div className="rounded-md border border-dashed border-border bg-muted/45 px-4 py-5 text-sm font-semibold text-muted-foreground">
                      New topics coming soon.
                    </div>
                  ) : (
                    category.topics.slice(0, 5).map((topic, index) => (
                      <Link
                        key={topic.id}
                        href={getTopicHref(topic)}
                        className="group flex items-center gap-3 rounded-md px-3 py-2.5 transition-colors hover:bg-accent"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-black text-muted-foreground group-hover:bg-secondary group-hover:text-secondary-foreground">
                          {index + 1}
                        </span>
                        <span className="line-clamp-1 font-bold text-foreground group-hover:text-primary">{topic.title}</span>
                      </Link>
                    ))
                  )}
                </div>

                {firstCategoryTopic && (
                  <div className="mt-6 border-t border-border pt-5">
                    <Link href={getTopicHref(firstCategoryTopic)}>
                      <Button variant="outline" className="w-full justify-between">
                        Open track
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
