"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, MoreHorizontal, Type, Loader2 } from "lucide-react";
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

type TutorialSubtopic = {
  id: number;
  title: string;
  slug: string;
  topicId: number;
  topic?: { title: string; category?: { title: string } };
  position: number;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
};

function TutorialSubtopicsInner() {
  const searchParams = useSearchParams();

  const [subtopics, setSubtopics] = useState<TutorialSubtopic[]>([]);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [topics, setTopics] = useState<{ label: string; value: string }[]>([]);

  const [filterQuery, setFilterQuery] = useState("");
  const [filterCategoryId, setFilterCategoryId] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "public" | "draft">(
    searchParams.get("status") === "public"
      ? "public"
      : searchParams.get("status") === "draft"
      ? "draft"
      : "all"
  );
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured">(
    searchParams.get("featured") === "true" ? "featured" : "all"
  );
  // Pre-populate from ?topicId= query param (set when clicking from Topics page)
  const [filterTopicId, setFilterTopicId] = useState(searchParams.get("topicId") || "");

  const [isLoading, setIsLoading] = useState(true);
  const [deleteData, setDeleteData] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/tutorial-categories")
      .then((res) => res.json())
      .then((d) => {
        if (d.success)
          setCategories(d.data.map((c: any) => ({ label: c.title, value: c.id.toString() })));
      });
  }, []);

  useEffect(() => {
    if (!filterCategoryId) {
      setTopics([]);
      return;
    }

    fetch(`/api/admin/tutorial-topics?categoryId=${filterCategoryId}`)
      .then((res) => res.json())
      .then((d) => {
        if (!d.success) return;
        const nextTopics = d.data.map((t: any) => ({ label: t.title, value: t.id.toString() }));
        setTopics(nextTopics);
        setFilterTopicId((prev) =>
          prev && nextTopics.some((topic: any) => topic.value === prev) ? prev : ""
        );
      });
  }, [filterCategoryId]);

  useEffect(() => {
    // Keep category/topic filters in sync when opening directly with ?topicId
    if (!filterTopicId || filterCategoryId) return;
    fetch(`/api/admin/tutorial-topics/${filterTopicId}`)
      .then((res) => res.json())
      .then((d) => {
        if (!d.success || !d.data?.categoryId) return;
        setFilterCategoryId(d.data.categoryId.toString());
      });
  }, [filterTopicId, filterCategoryId]);

  const fetchSubtopics = async () => {
    try {
      setIsLoading(true);
      const url = filterTopicId
        ? `/api/admin/tutorial-subtopics?topicId=${filterTopicId}`
        : `/api/admin/tutorial-subtopics`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) setSubtopics(data.data);
    } catch {
      toast.error("Failed to load subtopics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubtopics();
  }, [filterTopicId]);

  const handleToggle = async (id: number, field: "isPublic" | "isFeatured", currentValue: boolean) => {
    setSubtopics((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: !currentValue } : s))
    );
    try {
      const response = await fetch(`/api/admin/tutorial-subtopics/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      if (!response.ok) throw new Error("Failed to update");
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
      setSubtopics((prev) =>
        prev.map((s) => (s.id === id ? { ...s, [field]: currentValue } : s))
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteData) return;
    try {
      const response = await fetch(`/api/admin/tutorial-subtopics/${deleteData}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setSubtopics(subtopics.filter((s) => s.id !== deleteData));
        toast.success("Subtopic deleted");
      } else throw new Error(data.error);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteData(null);
    }
  };

  const filtered = subtopics.filter((s) => {
    const q = filterQuery.toLowerCase();
    const matchesSearch = s.title.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "public" && s.isPublic) ||
      (statusFilter === "draft" && !s.isPublic);
    const matchesFeatured = featuredFilter === "all" || s.isFeatured;

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  return (
    <div className="w-full max-w-[98%] mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tutorial Subtopics</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/tutorials/subtopics/new">
            <Plus className="mr-2 h-4 w-4" /> New Subtopic
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search subtopics by title or slug..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div>
            <SearchableSelect
              items={categories}
              value={filterCategoryId}
              onValueChange={setFilterCategoryId}
              placeholder="Filter Category..."
            />
          </div>
          <div>
            <SearchableSelect
              items={topics}
              value={filterTopicId}
              onValueChange={setFilterTopicId}
              placeholder="Filter Topic..."
              disabled={!filterCategoryId}
            />
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Subtopic</TableHead>
                <TableHead>Parent Topic</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Public</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No subtopics found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((subtopic) => (
                  <TableRow key={subtopic.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-muted">
                          <Type className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          {/* Clicking title goes to lessons filtered by this subtopic */}
                          <Link
                            href={`/dashboard/admin/tutorials/lessons?subtopicId=${subtopic.id}`}
                            className="font-medium truncate hover:underline text-primary"
                          >
                            {subtopic.title}
                          </Link>
                          <div className="text-xs text-muted-foreground truncate">{subtopic.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {subtopic.topic?.title || <span className="text-muted-foreground">Unknown</span>}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {subtopic.topic?.category?.title || "No Category"}
                      </div>
                    </TableCell>
                    <TableCell>Pos: {subtopic.position}</TableCell>
                    <TableCell>
                      <Switch
                        checked={subtopic.isPublic}
                        onCheckedChange={() => handleToggle(subtopic.id, "isPublic", subtopic.isPublic)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={subtopic.isFeatured}
                        onCheckedChange={() => handleToggle(subtopic.id, "isFeatured", subtopic.isFeatured)}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/tutorials/subtopics/${subtopic.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => setDeleteData(subtopic.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
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

      <DeleteConfirmModal
        open={!!deleteData}
        onOpenChange={(v) => !v && setDeleteData(null)}
        onConfirm={handleDelete}
        title="Delete Subtopic"
        description="Are you sure? All lessons within this subtopic will be permanently deleted."
      />
    </div>
  );
}

export default function TutorialSubtopicsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <TutorialSubtopicsInner />
    </Suspense>
  );
}