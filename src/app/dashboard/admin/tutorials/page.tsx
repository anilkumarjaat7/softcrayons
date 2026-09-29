"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Layers,
  Type,
  FileText,
  ArrowRight,
  Plus,
  Globe,
  EyeOff,
  Star,
  Clock,
  TrendingUp,
  ChevronRight,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = {
  id: number; title: string; slug: string;
  isPublic: boolean; isFeatured: boolean; createdAt: string;
};
type Topic = {
  id: number; title: string; slug: string; categoryId: number;
  category?: { title: string };
  isPublic: boolean; isFeatured: boolean; createdAt: string;
};
type Subtopic = {
  id: number; title: string; slug: string; topicId: number;
  topic?: { title: string; category?: { title: string } };
  isPublic: boolean; isFeatured: boolean; createdAt: string;
};
type Lesson = {
  id: number; title: string; slug: string; subtopicId: number;
  subtopic?: { title: string };
  isPublic: boolean; isFeatured: boolean; createdAt: string;
};

type RecentItem = {
  id: number; title: string; createdAt: string;
  level: "Category" | "Topic" | "Subtopic" | "Lesson";
  isPublic: boolean;
  href: string;
  color: string;
  parent?: string;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label, level, count, publicCount, featuredCount, href, newHref, color, icon: Icon,
}: {
  label: string; level: string; count: number; publicCount: number;
  featuredCount: number; href: string; newHref: string;
  color: string; icon: React.ElementType;
}) {
  const draftCount = count - publicCount;
  const publishRate = count === 0 ? 0 : Math.round((publicCount / count) * 100);
  const withQuery = (params: Record<string, string>) => {
    const query = new URLSearchParams(params).toString();
    return query ? `${href}?${query}` : href;
  };

  return (
    <Card className={`border-t-4 ${color} flex flex-col`}>
      <CardHeader className="flex flex-row items-start justify-between pb-2 gap-2">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{level}</p>
          <CardTitle className="text-3xl font-bold mt-0.5">{count}</CardTitle>
        </div>
        <Icon className="h-5 w-5 text-muted-foreground mt-1 shrink-0" />
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {/* Publish progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Published</span>
            <span className="font-medium">{publishRate}%</span>
          </div>
          <Progress value={publishRate} className="h-1.5" />
        </div>

        {/* Counts row */}
        <div className="flex gap-3 text-xs">
          <Link href={withQuery({ status: "public" })} className="flex items-center gap-1 text-green-600 hover:underline">
            <Globe className="h-3 w-3" /> {publicCount} public
          </Link>
          <Link href={withQuery({ status: "draft" })} className="flex items-center gap-1 text-yellow-600 hover:underline">
            <EyeOff className="h-3 w-3" /> {draftCount} draft
          </Link>
          {featuredCount > 0 && (
            <Link href={withQuery({ featured: "true" })} className="flex items-center gap-1 text-blue-600 hover:underline">
              <Star className="h-3 w-3" /> {featuredCount} featured
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button asChild variant="outline" size="sm" className="flex-1 h-8 text-xs">
            <Link href={href}>View all <ArrowRight className="ml-1 h-3 w-3" /></Link>
          </Button>
          <Button asChild size="sm" className="h-8 px-3">
            <Link href={newHref}><Plus className="h-3 w-3" /></Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentItemRow({ item }: { item: RecentItem }) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const levelColors: Record<string, string> = {
    Category: "bg-blue-100 text-blue-700",
    Topic: "bg-green-100 text-green-700",
    Subtopic: "bg-orange-100 text-orange-700",
    Lesson: "bg-purple-100 text-purple-700",
  };

  return (
    <Link href={item.href} className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-muted/50 transition-colors group">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${levelColors[item.level]}`}>
          {item.level}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate group-hover:text-primary">{item.title}</p>
          {item.parent && (
            <p className="text-xs text-muted-foreground truncate">in {item.parent}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <span className={`text-xs px-1.5 py-0.5 rounded ${item.isPublic ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
          {item.isPublic ? "Public" : "Draft"}
        </span>
        <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo(item.createdAt)}</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}

export default function TutorialsDashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [subtopics, setSubtopics] = useState<Subtopic[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [recentLimit, setRecentLimit] = useState<"5" | "10" | "25">("10");
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/tutorial-categories").then((r) => r.json()),
      fetch("/api/admin/tutorial-topics").then((r) => r.json()),
      fetch("/api/admin/tutorial-subtopics").then((r) => r.json()),
      fetch("/api/admin/tutorial-lessons").then((r) => r.json()),
    ])
      .then(([cats, tops, subs, less]) => {
        if (cats.success) setCategories(cats.data);
        if (tops.success) setTopics(tops.data);
        if (subs.success) setSubtopics(subs.data);
        if (less.success) setLessons(less.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const stats = [
    {
      label: "Categories",
      level: "Categories",
      count: categories.length,
      publicCount: categories.filter((c) => c.isPublic).length,
      featuredCount: categories.filter((c) => c.isFeatured).length,
      href: "/dashboard/admin/tutorials/categories",
      newHref: "/dashboard/admin/tutorials/categories/new",
      color: "border-t-blue-500",
      icon: BookOpen,
    },
    {
      label: "Topics",
      level: "Topics",
      count: topics.length,
      publicCount: topics.filter((t) => t.isPublic).length,
      featuredCount: topics.filter((t) => t.isFeatured).length,
      href: "/dashboard/admin/tutorials/topics",
      newHref: "/dashboard/admin/tutorials/topics/new",
      color: "border-t-green-500",
      icon: Layers,
    },
    {
      label: "Subtopics",
      level: "Subtopics",
      count: subtopics.length,
      publicCount: subtopics.filter((s) => s.isPublic).length,
      featuredCount: subtopics.filter((s) => s.isFeatured).length,
      href: "/dashboard/admin/tutorials/subtopics",
      newHref: "/dashboard/admin/tutorials/subtopics/new",
      color: "border-t-orange-500",
      icon: Type,
    },
    {
      label: "Lessons",
      level: "Lessons",
      count: lessons.length,
      publicCount: lessons.filter((l) => l.isPublic).length,
      featuredCount: lessons.filter((l) => l.isFeatured).length,
      href: "/dashboard/admin/tutorials/lessons",
      newHref: "/dashboard/admin/tutorials/lessons/new",
      color: "border-t-purple-500",
      icon: FileText,
    },
  ];

  const totalItems = categories.length + topics.length + subtopics.length + lessons.length;
  const totalPublic =
    categories.filter((c) => c.isPublic).length +
    topics.filter((t) => t.isPublic).length +
    subtopics.filter((s) => s.isPublic).length +
    lessons.filter((l) => l.isPublic).length;
  const overallPublishRate = totalItems === 0 ? 0 : Math.round((totalPublic / totalItems) * 100);

  const recentItems: RecentItem[] = [
    ...categories.map((c) => ({
      id: c.id, title: c.title, createdAt: c.createdAt,
      level: "Category" as const, isPublic: c.isPublic,
      href: `/dashboard/admin/tutorials/categories/${c.id}/edit`,
      color: "blue", parent: undefined,
    })),
    ...topics.map((t) => ({
      id: t.id, title: t.title, createdAt: t.createdAt,
      level: "Topic" as const, isPublic: t.isPublic,
      href: `/dashboard/admin/tutorials/topics/${t.id}/edit`,
      color: "green", parent: t.category?.title,
    })),
    ...subtopics.map((s) => ({
      id: s.id, title: s.title, createdAt: s.createdAt,
      level: "Subtopic" as const, isPublic: s.isPublic,
      href: `/dashboard/admin/tutorials/subtopics/${s.id}/edit`,
      color: "orange", parent: s.topic?.title,
    })),
    ...lessons.map((l) => ({
      id: l.id, title: l.title, createdAt: l.createdAt,
      level: "Lesson" as const, isPublic: l.isPublic,
      href: `/dashboard/admin/tutorials/lessons/${l.id}/edit`,
      color: "purple", parent: l.subtopic?.title,
    })),
  ]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const visibleRecentItems = showAllRecent
    ? recentItems
    : recentItems.slice(0, parseInt(recentLimit, 10));

  const categoryBreakdown = categories.map((cat) => {
    const catTopics = topics.filter((t) => t.categoryId === cat.id);
    const topicIds = catTopics.map((t) => t.id);
    const catSubtopics = subtopics.filter((s) => topicIds.includes(s.topicId));
    const subtopicIds = catSubtopics.map((s) => s.id);
    const catLessons = lessons.filter((l) => subtopicIds.includes(l.subtopicId));
    return {
      ...cat,
      topicCount: catTopics.length,
      subtopicCount: catSubtopics.length,
      lessonCount: catLessons.length,
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[98%] mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tutorials</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Overall publish rate</p>
            <p className="text-2xl font-bold">{overallPublishRate}%</p>
          </div>
          <div className="w-px h-10 bg-border hidden sm:block" />
          <Button asChild>
            <Link href="/dashboard/admin/tutorials/lessons/new">
              <Plus className="h-4 w-4 mr-2" /> New Lesson
            </Link>
          </Button>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* ── Middle row: Recent activity + Category breakdown ── */}
      <div className="grid gap-4 lg:grid-cols-5">

        {/* Recent Activity — 3/5 width */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">Recent Additions</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {showAllRecent
                  ? `${recentItems.length} total`
                  : `${Math.min(recentItems.length, parseInt(recentLimit, 10))} latest`}
              </Badge>
              <Select value={recentLimit} onValueChange={(v) => setRecentLimit(v as "5" | "10" | "25")}>
                <SelectTrigger className="h-8 w-[88px]">
                  <SelectValue placeholder="Limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                </SelectContent>
              </Select>
              {recentItems.length > parseInt(recentLimit, 10) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => setShowAllRecent((prev) => !prev)}
                >
                  {showAllRecent ? "Show less" : "View all recent"}
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-2">
            {recentItems.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No content yet. Start by creating a category.
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {visibleRecentItems.map((item) => (
                  <RecentItemRow key={`${item.level}-${item.id}`} item={item} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown — 2/5 width */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-base">By Category</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            {categoryBreakdown.length === 0 ? (
              <div className="text-center py-10 text-sm text-muted-foreground">
                No categories yet.{" "}
                <Link href="/dashboard/admin/tutorials/categories/new" className="underline text-primary">
                  Create one
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {categoryBreakdown.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/dashboard/admin/tutorials/topics?categoryId=${cat.id}`}
                    className="flex items-start justify-between py-3 px-3 rounded-md hover:bg-muted/50 transition-colors group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate group-hover:text-primary">
                          {cat.title}
                        </p>
                        {cat.isFeatured && (
                          <Star className="h-3 w-3 text-yellow-500 shrink-0" />
                        )}
                        {!cat.isPublic && (
                          <Badge variant="outline" className="text-[10px] h-4 px-1 shrink-0">Draft</Badge>
                        )}
                      </div>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{cat.topicCount} topics</span>
                        <span>{cat.subtopicCount} subtopics</span>
                        <span>{cat.lessonCount} lessons</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Actions row ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "New Category", href: "/dashboard/admin/tutorials/categories/new", icon: BookOpen, color: "text-blue-500 bg-blue-50 hover:bg-blue-100" },
              { label: "New Topic", href: "/dashboard/admin/tutorials/topics/new", icon: Layers, color: "text-green-500 bg-green-50 hover:bg-green-100" },
              { label: "New Subtopic", href: "/dashboard/admin/tutorials/subtopics/new", icon: Type, color: "text-orange-500 bg-orange-50 hover:bg-orange-100" },
              { label: "New Lesson", href: "/dashboard/admin/tutorials/lessons/new", icon: FileText, color: "text-purple-500 bg-purple-50 hover:bg-purple-100" },
            ].map(({ label, href, icon: Icon, color }) => (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${color}`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}