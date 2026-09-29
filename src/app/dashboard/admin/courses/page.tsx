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
  BookOpen,
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

type Course = {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  categoryId: number;
  fees: number | null;
  discount: number | null;
  duration: string | null;
  difficulty: string;
  isPublic: boolean;
  isFeatured: boolean;
  thumbnailImage: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const totalCourses = courses.length;
  const publishedCourses = courses.filter((c) => c.isPublic).length;
  const draftCourses = courses.filter((c) => !c.isPublic).length;
  const featuredCourses = courses.filter((c) => c.isFeatured).length;

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/courses");
      const data = await response.json();
      if (data.success) {
        setCourses(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: number, field: "isPublic" | "isFeatured", currentValue: boolean) => {
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id ? { ...course, [field]: !currentValue } : course
      )
    );

    try {
      const response = await fetch(`/api/admin/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Update failed:", error);
      setCourses((prev) =>
        prev.map((course) =>
          course.id === id ? { ...course, [field]: currentValue } : course
        )
      );
    }
  };

  const handleDeleteCourse = (id: number) => {
    setDeleteItemId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCourse = async () => {
    if (!deleteItemId) return;
    try {
      const response = await fetch(`/api/admin/courses/${deleteItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCourses(courses.filter((c) => c.id !== deleteItemId));
      }
    } catch (error) {
      console.error("Failed to delete course:", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteItemId(null);
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && course.isPublic) ||
      (statusFilter === "draft" && !course.isPublic);
    const matchesDifficulty =
      difficultyFilter === "all" || course.difficulty === difficultyFilter;

    return matchesSearch && matchesStatus && matchesDifficulty;
  });

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return "—";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDifficultyBadge = (difficulty: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      BEGINNER: "default",
      INTERMEDIATE: "secondary",
      ADVANCED: "destructive",
    };
    return (
      <Badge variant={variants[difficulty] || "default"}>
        {difficulty.charAt(0) + difficulty.slice(1).toLowerCase()}
      </Badge>
    );
  };

  return (
    <div className="w-full max-w-[98%] mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">
            Manage your courses and training programs
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/courses/new">
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Courses
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
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
            <div className="text-2xl font-bold">{publishedCourses}</div>
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
            <div className="text-2xl font-bold">{draftCourses}</div>
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
            <div className="text-2xl font-bold">{featuredCourses}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
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
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
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
                <TableHead>Difficulty</TableHead>
                <TableHead>Fees</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Public</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredCourses.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No courses found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCourses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {course.thumbnailImage ? (
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
                            <img
                              src={course.thumbnailImage}
                              alt={course.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-muted">
                            <BookOpen className="h-5 w-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="font-medium truncate">{course.title}</div>
                          <div className="text-xs text-muted-foreground truncate">{course.slug}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getDifficultyBadge(course.difficulty)}</TableCell>
                    <TableCell>{formatCurrency(course.fees)}</TableCell>
                    <TableCell>{course.duration || "—"}</TableCell>
                    <TableCell>
                      <Switch
                        checked={course.isPublic}
                        onCheckedChange={() => handleToggle(course.id, "isPublic", course.isPublic)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={course.isFeatured}
                        onCheckedChange={() => handleToggle(course.id, "isFeatured", course.isFeatured)}
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
                            <Link href={`/courses/${course.slug}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/courses/${course.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteCourse(course.id)}
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
        onConfirm={confirmDeleteCourse}
        title="Delete Course"
        description="This action cannot be undone. This will permanently delete this course."
      />
    </div>
  );
}
