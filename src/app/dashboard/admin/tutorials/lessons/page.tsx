"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, MoreHorizontal, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { toast } from "sonner";
import { SearchableSelect } from "@/components/dashboard/admin/tutorials/SearchableSelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TutorialLesson = {
  id: number;
  title: string;
  slug: string;
  subtopicId: number;
  subtopic?: {
    id: number;
    title: string;
    slug: string;
    topicId: number;
    topic?: { id: number; title: string; category?: { id: number; title: string } };
  };
  position: number;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
};

type BulkAction = "publish" | "unpublish" | "feature" | "unfeature" | "delete" | null;

export default function TutorialLessonsPage() {
  const [lessons, setLessons] = useState<TutorialLesson[]>([]);
  
  // Cascading Filter State
  const [topics, setTopics] = useState<{ label: string; value: string }[]>([]);
  const [subtopics, setSubtopics] = useState<{ label: string; value: string }[]>([]);
  
  const [filterQuery, setFilterQuery] = useState("");
  const [filterTopicId, setFilterTopicId] = useState("");
  const [filterSubtopicId, setFilterSubtopicId] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "public" | "draft">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured">("all");

  const [isLoading, setIsLoading] = useState(true);
  const [bulkActionLoading, setBulkActionLoading] = useState<BulkAction>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deleteData, setDeleteData] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topicId = params.get("topicId");
    const subtopicId = params.get("subtopicId");
    const status = params.get("status");
    const featured = params.get("featured");

    if (topicId) setFilterTopicId(topicId);
    if (subtopicId) setFilterSubtopicId(subtopicId);
    if (status === "public" || status === "draft") setStatusFilter(status);
    if (featured === "true") setFeaturedFilter("featured");
  }, []);

  useEffect(() => {
    fetch("/api/admin/tutorial-topics")
      .then((res) => res.json())
      .then((d) => {
        if (d.success) {
          setTopics(
            d.data.map((topic: any) => ({
              label: topic.category?.title ? `${topic.title} - ${topic.category.title}` : topic.title,
              value: topic.id.toString(),
            }))
          );
        }
      });
  }, []);

  useEffect(() => {
    if (!filterTopicId) {
      setSubtopics([]);
      setFilterSubtopicId("");
      return;
    }

    fetch(`/api/admin/tutorial-subtopics?topicId=${filterTopicId}`)
      .then((res) => res.json())
      .then((d) => {
        if (!d.success) return;
        const nextSubtopics = d.data.map((subtopic: any) => ({
          label: subtopic.topic?.title
            ? `${subtopic.title} - ${subtopic.topic.title}${subtopic.topic.category?.title ? ` - ${subtopic.topic.category.title}` : ""}`
            : subtopic.title,
          value: subtopic.id.toString(),
        }));
        setSubtopics(nextSubtopics);
        setFilterSubtopicId((prev) =>
          prev && nextSubtopics.some((sub: any) => sub.value === prev) ? prev : ""
        );
      });
  }, [filterTopicId]);

  useEffect(() => {
    // Keep topic/subtopic selectors in sync when opening with ?subtopicId only.
    if (!filterSubtopicId || filterTopicId) return;
    fetch(`/api/admin/tutorial-subtopics/${filterSubtopicId}`)
      .then((res) => res.json())
      .then((d) => {
        if (!d.success || !d.data?.topicId) return;
        setFilterTopicId(d.data.topicId.toString());
      });
  }, [filterSubtopicId, filterTopicId]);

  const fetchLessons = async () => {
    try {
      setIsLoading(true);
      const url = filterSubtopicId
        ? `/api/admin/tutorial-lessons?subtopicId=${filterSubtopicId}`
        : `/api/admin/tutorial-lessons`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setLessons(data.data);
      }
    } catch {
      toast.error("Failed to load lessons.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, [filterSubtopicId]);

  const handleToggle = async (
    id: number,
    field: "isPublic" | "isFeatured",
    currentValue: boolean
  ) => {
    setLessons((prev) =>
      prev.map((lesson) =>
        lesson.id === id ? { ...lesson, [field]: !currentValue } : lesson
      )
    );

    try {
      const response = await fetch(`/api/admin/tutorial-lessons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }

      toast.success("Updated");
    } catch {
      toast.error("Update failed");
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson.id === id ? { ...lesson, [field]: currentValue } : lesson
        )
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      const response = await fetch(`/api/admin/tutorial-lessons/${deleteData}`, { method: "DELETE" });
      const data = await response.json();
      if (data.success) {
        setLessons(lessons.filter((l) => l.id !== deleteData));
        toast.success("Lesson deleted");
      } else throw new Error(data.error);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteData(null);
    }
  };

  const filtered = lessons.filter((l) => {
    const q = filterQuery.toLowerCase();
    const matchesSearch = l.title.toLowerCase().includes(q) || l.slug.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "public" && l.isPublic) ||
      (statusFilter === "draft" && !l.isPublic);
    const matchesFeatured = featuredFilter === "all" || l.isFeatured;

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((lesson) => selectedIds.includes(lesson.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const visibleIds = filtered.map((lesson) => lesson.id);
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
      return;
    }

    const next = new Set(selectedIds);
    filtered.forEach((lesson) => next.add(lesson.id));
    setSelectedIds(Array.from(next));
  };

  const toggleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
    );
  };

  const runBulkUpdate = async (
    action: Exclude<BulkAction, "delete" | null>,
    payload: { isPublic?: boolean; isFeatured?: boolean },
    successLabel: string
  ) => {
    if (selectedIds.length === 0) return;
    const ids = [...selectedIds];
    setBulkActionLoading(action);

    const results = await Promise.allSettled(
      ids.map(async (id) => {
        const response = await fetch(`/api/admin/tutorial-lessons/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Failed: ${id}`);
        }

        return id;
      })
    );

    const successIds = results
      .filter((result): result is PromiseFulfilledResult<number> => result.status === "fulfilled")
      .map((result) => result.value);
    const failCount = ids.length - successIds.length;

    if (successIds.length > 0) {
      setLessons((prev) =>
        prev.map((lesson) => {
          if (!successIds.includes(lesson.id)) return lesson;
          return {
            ...lesson,
            ...(payload.isPublic !== undefined ? { isPublic: payload.isPublic } : {}),
            ...(payload.isFeatured !== undefined ? { isFeatured: payload.isFeatured } : {}),
          };
        })
      );
      setSelectedIds((prev) => prev.filter((id) => !successIds.includes(id)));
    }

    if (failCount > 0) {
      toast.error(`${successLabel}: ${successIds.length} updated, ${failCount} failed.`);
    } else {
      toast.success(`${successLabel} for ${successIds.length} lesson(s).`);
    }

    setBulkActionLoading(null);
  };

  const runBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    const ids = [...selectedIds];
    setBulkActionLoading("delete");

    const results = await Promise.allSettled(
      ids.map(async (id) => {
        const response = await fetch(`/api/admin/tutorial-lessons/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`Failed: ${id}`);
        }

        return id;
      })
    );

    const successIds = results
      .filter((result): result is PromiseFulfilledResult<number> => result.status === "fulfilled")
      .map((result) => result.value);
    const failCount = ids.length - successIds.length;

    if (successIds.length > 0) {
      setLessons((prev) => prev.filter((lesson) => !successIds.includes(lesson.id)));
      setSelectedIds((prev) => prev.filter((id) => !successIds.includes(id)));
    }

    if (failCount > 0) {
      toast.error(`Deleted ${successIds.length} lesson(s), ${failCount} failed.`);
    } else {
      toast.success(`Deleted ${successIds.length} lesson(s).`);
    }

    setBulkActionLoading(null);
  };

  return (
    <div className="w-full max-w-[98%] mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tutorial Lessons</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/tutorials/lessons/new"><Plus className="mr-2 h-4 w-4" /> New Lesson</Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search lessons..." value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} className="pl-9" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div>
            <SearchableSelect items={topics} value={filterTopicId} onValueChange={setFilterTopicId} placeholder="Filter Topic..." />
          </div>
          <div>
            <SearchableSelect items={subtopics} value={filterSubtopicId} onValueChange={setFilterSubtopicId} placeholder="Filter Subtopic..." disabled={!filterTopicId} />
          </div>
          <div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "public" | "draft")}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={featuredFilter} onValueChange={(v) => setFeaturedFilter(v as "all" | "featured")}>
              <SelectTrigger>
                <SelectValue placeholder="Featured" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="featured">Featured Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {selectedIds.length > 0 && (
        <Card>
          <CardContent className="py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {selectedIds.length} lesson(s) selected
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={bulkActionLoading !== null}
                  onClick={() => runBulkUpdate("publish", { isPublic: true }, "Publish")}
                >
                  Publish
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={bulkActionLoading !== null}
                  onClick={() => runBulkUpdate("unpublish", { isPublic: false }, "Unpublish")}
                >
                  Unpublish
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={bulkActionLoading !== null}
                  onClick={() => runBulkUpdate("feature", { isFeatured: true }, "Feature")}
                >
                  Feature
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={bulkActionLoading !== null}
                  onClick={() => runBulkUpdate("unfeature", { isFeatured: false }, "Unfeature")}
                >
                  Unfeature
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={bulkActionLoading !== null}
                  onClick={runBulkDelete}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[44px]">
                  <input
                    type="checkbox"
                    checked={allVisibleSelected}
                    onChange={toggleSelectAll}
                    aria-label="Select all lessons"
                  />
                </TableHead>
                <TableHead className="w-[30%]">Lesson</TableHead>
                <TableHead>Parent Subtopic</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Public</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No lessons found.</TableCell></TableRow>
              ) : (
                filtered.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(lesson.id)}
                        onChange={() => toggleSelectOne(lesson.id)}
                        aria-label={`Select lesson ${lesson.title}`}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted"><FileText className="h-4 w-4 text-muted-foreground" /></div>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{lesson.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{lesson.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{lesson.subtopic?.title || <span className="text-muted-foreground">Unknown</span>}</div>
                      <div className="text-xs text-muted-foreground">
                        {lesson.subtopic?.topic?.title || "No Topic"}
                        {lesson.subtopic?.topic?.category?.title ? ` - ${lesson.subtopic.topic.category.title}` : ""}
                      </div>
                    </TableCell>
                    <TableCell>Pos: {lesson.position}</TableCell>
                    <TableCell>
                      <Switch
                        checked={lesson.isPublic}
                        onCheckedChange={() => handleToggle(lesson.id, "isPublic", lesson.isPublic)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={lesson.isFeatured}
                        onCheckedChange={() => handleToggle(lesson.id, "isFeatured", lesson.isFeatured)}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Open menu</span><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link href={`/dashboard/admin/tutorials/lessons/${lesson.id}/edit`}><Edit className="mr-2 h-4 w-4" /> Edit</Link></DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => { setDeleteData(lesson.id); }}><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DeleteConfirmModal open={!!deleteData} onOpenChange={(v) => !v && setDeleteData(null)} onConfirm={handleDelete} title="Delete Lesson" description="Are you sure you want to permanently delete this lesson?" />
    </div>
  );
}