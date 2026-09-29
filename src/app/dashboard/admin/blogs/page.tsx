"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  FileText,
  CheckCircle,
  Clock,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

type Blog = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  categoryId: number;
  authorId: number;
  dateOfPublish: string | null;
  readTime: string | null;
  isPublic: boolean;
  isFeatured: boolean;
  thumbnailImage: string | null;
  createdAt: string;
  updatedAt: string;
  category?: { id: string; name: string }; 
  author?: { id: string; name: string };
};

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const totalBlogs = blogs.length;
  const publishedBlogs = blogs.filter((b) => b.isPublic).length;
  const draftBlogs = blogs.filter((b) => !b.isPublic).length;
  const featuredBlogs = blogs.filter((b) => b.isFeatured).length;

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/blogs");
      const data = await response.json();
      if (data.success) {
        setBlogs(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: number, field: "isPublic" | "isFeatured", currentValue: boolean) => {
    setBlogs((prev) =>
      prev.map((blog) =>
        blog.id === id ? { ...blog, [field]: !currentValue } : blog
      )
    );

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Update failed:", error);
      setBlogs((prev) =>
        prev.map((blog) =>
          blog.id === id ? { ...blog, [field]: currentValue } : blog
        )
      );
    }
  };

  const handleDeleteBlog = (id: number) => {
    setDeleteItemId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteBlog = async () => {
    if (!deleteItemId) return;
    try {
      const response = await fetch(`/api/admin/blogs/${deleteItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBlogs(blogs.filter((b) => b.id !== deleteItemId));
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteItemId(null);
    }
  };

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && blog.isPublic) ||
      (statusFilter === "draft" && !blog.isPublic);
    const matchesCategory =
      categoryFilter === "all" || blog.categoryId.toString() === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const formatDate = (date: string | null) => {
    if (!date) return "—";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="w-full max-w-[98%] mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">
            Manage your blog posts and articles
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Blog
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Blogs
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBlogs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Published
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedBlogs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftBlogs}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Featured
            </CardTitle>
            <Star className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredBlogs}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">Title</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Public</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                 <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredBlogs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No blogs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs.map((blog) => (
                  <TableRow key={blog.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {blog.thumbnailImage ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
                             <img
                              src={blog.thumbnailImage}
                              alt={blog.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium truncate">{blog.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{blog.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(blog.dateOfPublish)}</TableCell>
                    <TableCell>
                      <Switch 
                        checked={blog.isPublic}
                        onCheckedChange={(val) => handleToggle(blog.id, "isPublic", blog.isPublic)}
                      />
                    </TableCell>
                    <TableCell>
                       <Switch 
                        checked={blog.isFeatured}
                        onCheckedChange={(val) => handleToggle(blog.id, "isFeatured", blog.isFeatured)}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/blogs/${blog.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/blogs/${blog.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteBlog(blog.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) setDeleteItemId(null);
        }}
        onConfirm={confirmDeleteBlog}
        title="Delete Blog"
        description="This action cannot be undone. This will permanently delete this blog post."
      />
    </div>
  );
}
