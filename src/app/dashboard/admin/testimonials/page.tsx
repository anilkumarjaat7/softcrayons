"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  MessageSquare,
  CheckCircle,
  Clock,
  Star,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

type Testimonial = {
  id: number;
  studentName: string;
  avatar: string | null;
  rating: number;
  feedback: string;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const totalTestimonials = testimonials.length;
  const publishedTestimonials = testimonials.filter((t) => t.isPublic).length;
  const draftTestimonials = testimonials.filter((t) => !t.isPublic).length;
  const featuredTestimonials = testimonials.filter((t) => t.isFeatured).length;

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/testimonials");
      const data = await response.json();
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: number, field: "isPublic" | "isFeatured", currentValue: boolean) => {
    setTestimonials((prev) =>
      prev.map((testimonial) =>
        testimonial.id === id ? { ...testimonial, [field]: !currentValue } : testimonial
      )
    );

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Update failed:", error);
      setTestimonials((prev) =>
        prev.map((testimonial) =>
          testimonial.id === id ? { ...testimonial, [field]: currentValue } : testimonial
        )
      );
    }
  };

  const handleDeleteTestimonial = (id: number) => {
    setDeleteItemId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteTestimonial = async () => {
    if (!deleteItemId) return;
    try {
      const response = await fetch(`/api/admin/testimonials/${deleteItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTestimonials(testimonials.filter((t) => t.id !== deleteItemId));
      }
    } catch (error) {
      console.error("Failed to delete testimonial:", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteItemId(null);
    }
  };

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      testimonial.feedback.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && testimonial.isPublic) ||
      (statusFilter === "draft" && !testimonial.isPublic);

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-[98%] mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Testimonials</h1>
          <p className="text-muted-foreground">
            Manage student testimonials and reviews
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/testimonials/new">
            <Plus className="mr-2 h-4 w-4" />
            New Testimonial
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Testimonials
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTestimonials}</div>
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
            <div className="text-2xl font-bold">{publishedTestimonials}</div>
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
            <div className="text-2xl font-bold">{draftTestimonials}</div>
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
            <div className="text-2xl font-bold">{featuredTestimonials}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search testimonials..."
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
                <TableHead className="w-[30%]">Student</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="w-[30%]">Feedback</TableHead>
                <TableHead>Public</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredTestimonials.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No testimonials found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTestimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={testimonial.avatar || ""} alt={testimonial.studentName} />
                          <AvatarFallback>{getInitials(testimonial.studentName)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{testimonial.studentName}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(testimonial.createdAt)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{renderStars(testimonial.rating)}</TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                        {testimonial.feedback.substring(0, 100)}
                        {testimonial.feedback.length > 100 && "..."}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={testimonial.isPublic}
                        onCheckedChange={() => handleToggle(testimonial.id, "isPublic", testimonial.isPublic)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={testimonial.isFeatured}
                        onCheckedChange={() => handleToggle(testimonial.id, "isFeatured", testimonial.isFeatured)}
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
                            <Link href={`/reviews`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/testimonials/${testimonial.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
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
        onConfirm={confirmDeleteTestimonial}
        title="Delete Testimonial"
        description="This action cannot be undone. This will permanently delete this testimonial."
      />
    </div>
  );
}
