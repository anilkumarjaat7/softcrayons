"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, MoreHorizontal, BookOpen, Loader2 } from "lucide-react";
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
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TutorialCategory = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  logo: string | null;
  position: number;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
};

export default function TutorialCategoriesPage() {
  const [categories, setCategories] = useState<TutorialCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "public" | "draft">("all");
  const [featuredFilter, setFeaturedFilter] = useState<"all" | "featured">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const totalCategories = categories.length;
  const publicCategories = categories.filter((c) => c.isPublic).length;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextStatus = params.get("status");
    const nextFeatured = params.get("featured");

    if (nextStatus === "public" || nextStatus === "draft") {
      setStatusFilter(nextStatus);
    }
    if (nextFeatured === "true") {
      setFeaturedFilter("featured");
    }

    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/tutorial-categories");
      const data = await response.json();
      if (data.success) setCategories(data.data);
    } catch {
      toast.error("Failed to load categories.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: number, field: "isPublic" | "isFeatured", currentValue: boolean) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: !currentValue } : c))
    );
    try {
      const response = await fetch(`/api/admin/tutorial-categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });
      if (!response.ok) throw new Error("Failed to update");
      toast.success("Updated");
    } catch {
      toast.error("Update failed");
      setCategories((prev) =>
        prev.map((c) => (c.id === id ? { ...c, [field]: currentValue } : c))
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteItemId) return;
    try {
      const response = await fetch(`/api/admin/tutorial-categories/${deleteItemId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        setCategories(categories.filter((c) => c.id !== deleteItemId));
        toast.success("Category deleted");
      } else {
        throw new Error(data.error || "Failed to delete");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteModalOpen(false);
      setDeleteItemId(null);
    }
  };

  const filteredCategories = categories.filter((category) => {
    const s = searchQuery.toLowerCase();
    const matchesSearch = (
      category.title.toLowerCase().includes(s) ||
      category.slug.toLowerCase().includes(s)
    );
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "public" && category.isPublic) ||
      (statusFilter === "draft" && !category.isPublic);
    const matchesFeatured = featuredFilter === "all" || category.isFeatured;

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <div className="w-full max-w-[98%] mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tutorial Categories</h1>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/tutorials/categories/new">
            <Plus className="mr-2 h-4 w-4" /> New Category
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-[170px]">
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
        <div className="w-full sm:w-[190px]">
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

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[35%]">Category</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Created</TableHead>
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
              ) : filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted overflow-hidden">
                          {category.logo ? (
                            <Image
                              src={category.logo}
                              alt={category.title}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="min-w-0">
                          {/* Clicking the title navigates to Topics filtered by this category */}
                          <Link
                            href={`/dashboard/admin/tutorials/topics?categoryId=${category.id}`}
                            className="font-medium truncate hover:underline text-primary"
                          >
                            {category.title}
                          </Link>
                          <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                            {category.slug}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>Pos: {category.position}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(category.createdAt)}</TableCell>
                    <TableCell>
                      <Switch
                        checked={category.isPublic}
                        onCheckedChange={() => handleToggle(category.id, "isPublic", category.isPublic)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={category.isFeatured}
                        onCheckedChange={() => handleToggle(category.id, "isFeatured", category.isFeatured)}
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
                            <Link href={`/dashboard/admin/tutorials/categories/${category.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => { setDeleteItemId(category.id); setDeleteModalOpen(true); }}
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
        title="Delete Category"
        description="Are you sure you want to delete this category? All nested topics, subtopics, and lessons will be affected."
      />
    </div>
  );
}