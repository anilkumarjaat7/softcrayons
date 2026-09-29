"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, MoreHorizontal, Layers, Loader2 } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type TutorialTopic = {
  id: number;
  title: string;
  slug: string;
  categoryId: number;
  category?: { title: string };
  position: number;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
};

// Inner component so useSearchParams works inside Suspense
function TutorialTopicsInner() {
  const searchParams = useSearchParams();

  const [topics, setTopics] = useState<TutorialTopic[]>([]);
  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
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
  // Pre-populate from ?categoryId= query param (set when clicking from Categories page)
  const [filterCategoryId, setFilterCategoryId] = useState(
    searchParams.get("categoryId") || ""
  );
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const totalTopics = topics.length;
  const publicTopics = topics.filter((t) => t.isPublic).length;

  useEffect(() => {
    fetch("/api/admin/tutorial-categories")
      .then((res) => res.json())
      .then((d) => {
        if (d.success)
          setCategories(d.data.map((c: any) => ({ label: c.title, value: c.id.toString() })));
      });
  }, []);

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      const url = filterCategoryId
        ? `/api/admin/tutorial-topics?categoryId=${filterCategoryId}`
        : `/api/admin/tutorial-topics`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) setTopics(data.data);
    } catch {
      toast.error("Failed to load topics.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [filterCategoryId]);

  const handleToggle = async (id: number, field: "isPublic" | "isFeatured", currentValue: boolean) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: !currentValue } : t))
    );
    try {
      const response = await fetch(`/api/admin/tutorial-topics/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      if (!response.ok) throw new Error("Failed to update");
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
      setTopics((prev) =>
        prev.map((t) => (t.id === id ? { ...t, [field]: currentValue } : t))
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;
    try {
      const response = await fetch(`/api/admin/tutorial-topics/${deleteItemId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setTopics(topics.filter((t) => t.id !== deleteItemId));
        toast.success("Topic deleted");
      } else throw new Error(data.error || "Failed to delete");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteModalOpen(false);
      setDeleteItemId(null);
    }
  };

  const filteredTopics = topics.filter((topic) => {
    const s = searchQuery.toLowerCase();
    const matchesSearch = topic.title.toLowerCase().includes(s) || topic.slug.toLowerCase().includes(s);
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "public" && topic.isPublic) ||
      (statusFilter === "draft" && !topic.isPublic);
    const matchesFeatured = featuredFilter === "all" || topic.isFeatured;

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  return (
    <div className="w-full max-w-[98%] mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tutorial Topics</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/tutorials/topics/new">
            <Plus className="mr-2 h-4 w-4" /> New Topic
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Topics</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalTopics}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Public</CardTitle>
            <Layers className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{publicTopics}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Draft</CardTitle>
            <Layers className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalTopics - publicTopics}</div></CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
          <div>
            <SearchableSelect
              items={categories}
              value={filterCategoryId}
              onValueChange={setFilterCategoryId}
              placeholder="Filter by Category..."
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
        {filterCategoryId && (
          <div className="flex justify-end">
            <Button variant="ghost" onClick={() => setFilterCategoryId("")}>
              Clear
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">Topic</TableHead>
                <TableHead>Parent Category</TableHead>
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
              ) : filteredTopics.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No topics found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTopics.map((topic) => (
                  <TableRow key={topic.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                          <Layers className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          {/* Clicking title goes to subtopics filtered by this topic */}
                          <Link
                            href={`/dashboard/admin/tutorials/subtopics?topicId=${topic.id}`}
                            className="font-medium truncate hover:underline text-primary"
                          >
                            {topic.title}
                          </Link>
                          <div className="text-xs text-muted-foreground truncate">{topic.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {topic.category?.title || (
                        <span className="text-muted-foreground text-xs">
                          Unknown (ID: {topic.categoryId})
                        </span>
                      )}
                    </TableCell>
                    <TableCell>Pos: {topic.position}</TableCell>
                    <TableCell>
                      <Switch
                        checked={topic.isPublic}
                        onCheckedChange={() => handleToggle(topic.id, "isPublic", topic.isPublic)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={topic.isFeatured}
                        onCheckedChange={() => handleToggle(topic.id, "isFeatured", topic.isFeatured)}
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
                            <Link href={`/dashboard/admin/tutorials/topics/${topic.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => { setDeleteItemId(topic.id); setDeleteModalOpen(true); }}
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
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={confirmDelete}
        title="Delete Topic"
        description="Are you sure you want to delete this topic? All nested subtopics and lessons will also be deleted."
      />
    </div>
  );
}

// Wrap in Suspense because useSearchParams requires it in Next.js App Router
export default function TutorialTopicsPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <TutorialTopicsInner />
    </Suspense>
  );
}