"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

type Blog = {
  id: number;
  title: string;
  slug: string;
  thumbnailImage: string | null;
  isPublic: boolean;
  isFeatured: boolean;
  dateOfPublish: string;
  category: {
    id: number;
    title: string;
  } | null;
};

export default function ContentWriterBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await fetch("/api/content-writer/blogs");
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

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/content-writer/blogs/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setBlogs((prev) => prev.filter((blog) => blog.id !== id));
      } else {
        const error = await response.json();
        console.error(error.error || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteItemId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Blog Posts</h1>
          <p className="text-muted-foreground">
            Manage your blog articles and content
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/content-writer/blogs/new">
            <Plus className="mr-2 h-4 w-4" />
            New Post
          </Link>
        </Button>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          Your blog posts will be reviewed by an administrator before being published.
          You can only see and edit your own posts. Status and Featured settings are managed by admins.
        </AlertDescription>
      </Alert>

      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/content-writer/blogs/new">Create your first post</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Published Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell>
                    {blog.thumbnailImage ? (
                      <Image
                        src={blog.thumbnailImage}
                        alt={blog.title}
                        width={64}
                        height={48}
                        className="rounded object-cover"
                      />
                    ) : (
                      <div className="w-16 h-12 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{blog.title}</TableCell>
                  <TableCell>
                    {blog.category ? (
                      <Badge variant="outline">{blog.category.title}</Badge>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {new Date(blog.dateOfPublish).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={blog.isPublic ? "default" : "secondary"}>
                      {blog.isPublic ? "Published" : "Pending"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={blog.isFeatured ? "default" : "outline"}>
                      {blog.isFeatured ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/content-writer/blogs/${blog.id}/edit`}>
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteItemId(blog.id);
                          setDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) setDeleteItemId(null);
        }}
        onConfirm={() => deleteItemId && handleDelete(deleteItemId)}
        title="Delete Blog Post"
        description="This action cannot be undone. This will permanently delete this blog post."
      />
    </div>
  );
}
