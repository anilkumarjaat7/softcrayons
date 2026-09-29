import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export type TutorialTopicLite = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  position?: number | null;
};

export type TutorialCategoryWithTopics = {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  logo?: string | null;
  topics: TutorialTopicLite[];
};

export function TutorialCategoryGrid({ categories }: { categories: TutorialCategoryWithTopics[] }) {
  if (!categories.length) {
    return (
      <div className="rounded-md border border-dashed border-border bg-muted/45 p-6 text-sm font-semibold text-muted-foreground">
        No categories found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="brand-panel brand-card-hover group flex h-full flex-col rounded-md p-6"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground font-black">
              {category.title.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-black">{category.title}</h3>
              {category.description && (
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{category.description}</p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {category.topics.length === 0 && (
              <p className="rounded-md border border-dashed border-border bg-muted/45 px-4 py-3 text-sm font-semibold text-muted-foreground">
                Topics coming soon
              </p>
            )}
            {category.topics.map((topic) => (
              <Link key={topic.id} href={`/tutorials/${topic.slug}`}>
                <Badge variant="outline" className="gap-1 rounded-md px-3 py-1 text-xs font-bold hover:bg-secondary/10 hover:text-secondary">
                  {topic.title}
                </Badge>
              </Link>
            ))}
          </div>

          {category.topics.length > 0 && (
            <div className="mt-auto pt-6 text-sm font-bold text-primary">
              <Link
                href={`/tutorials/${category.topics[0].slug}`}
                className="inline-flex items-center gap-2 rounded-md transition-colors hover:text-secondary"
              >
                Explore topics
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
