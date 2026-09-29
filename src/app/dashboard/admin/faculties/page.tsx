"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  CheckCircle,
  Clock,
  Star,
  Loader2,
  User,
  Briefcase,
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
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

type Faculty = {
  id: number;
  name: string;
  designation: string | null;
  domain: string | null;
  avatar: string | null;
  bio: string | null;
  experience: string | null;
  ProjectsHandled: string | null;
  studentsMentored: string | null;
  ratings: number | null;
  technologies: string[] | null;
  locations: string | null;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function FacultiesPage() {
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const totalFaculties = faculties.length;
  const publishedFaculties = faculties.filter((f) => f.isPublic).length;
  const draftFaculties = faculties.filter((f) => !f.isPublic).length;
  const featuredFaculties = faculties.filter((f) => f.isFeatured).length;

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/faculties");
      const data = await response.json();
      if (data.success) {
        setFaculties(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch faculties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: number, field: "isPublic" | "isFeatured", currentValue: boolean) => {
    setFaculties((prev) =>
      prev.map((faculty) =>
        faculty.id === id ? { ...faculty, [field]: !currentValue } : faculty
      )
    );

    try {
      const response = await fetch(`/api/admin/faculties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Update failed:", error);
      setFaculties((prev) =>
        prev.map((faculty) =>
          faculty.id === id ? { ...faculty, [field]: currentValue } : faculty
        )
      );
    }
  };

  const handleDeleteFaculty = (id: number) => {
    setDeleteItemId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteFaculty = async () => {
    if (!deleteItemId) return;
    try {
      const response = await fetch(`/api/admin/faculties/${deleteItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setFaculties(faculties.filter((f) => f.id !== deleteItemId));
      }
    } catch (error) {
      console.error("Failed to delete faculty:", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteItemId(null);
    }
  };

  const filteredFaculties = faculties.filter((faculty) => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.domain?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.technologies?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && faculty.isPublic) ||
      (statusFilter === "draft" && !faculty.isPublic);

    return matchesSearch && matchesStatus;
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="w-full p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Faculties</h1>
          <p className="text-muted-foreground">
            Manage faculty members and their profiles
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/faculties/new">
            <Plus className="mr-2 h-4 w-4" /> Add Faculty
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculties</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFaculties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedFaculties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftFaculties}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured</CardTitle>
            <Star className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredFaculties}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name, designation, domain, or technology..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Faculties</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Faculty</TableHead>
                <TableHead className="hidden md:table-cell">Designation</TableHead>
                <TableHead className="hidden lg:table-cell">Technologies</TableHead>
                <TableHead className="hidden sm:table-cell">Rating</TableHead>
                <TableHead>Public</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaculties.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {searchQuery || statusFilter !== "all"
                      ? "No faculties found matching your criteria."
                      : "No faculties found. Add your first faculty member!"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredFaculties.map((faculty) => (
                  <TableRow key={faculty.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={faculty.avatar || ""} alt={faculty.name} />
                          <AvatarFallback>
                            {getInitials(faculty.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{faculty.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {faculty.domain || "No domain"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {faculty.designation || "-"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {faculty.technologies?.slice(0, 3).map((tech, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {faculty.technologies && faculty.technologies.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{faculty.technologies.length - 3}
                          </Badge>
                        )}
                        {!faculty.technologies?.length && "-"}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {faculty.ratings ? (
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{faculty.ratings.toFixed(1)}</span>
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={faculty.isPublic}
                        onCheckedChange={() =>
                          handleToggle(faculty.id, "isPublic", faculty.isPublic)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={faculty.isFeatured}
                        onCheckedChange={() =>
                          handleToggle(faculty.id, "isFeatured", faculty.isFeatured)
                        }
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
                            <Link href={`/dashboard/admin/faculties/${faculty.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteFaculty(faculty.id)}
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
        onOpenChange={(open) => {
          setDeleteModalOpen(open);
          if (!open) setDeleteItemId(null);
        }}
        onConfirm={confirmDeleteFaculty}
        title="Delete Faculty"
        description="This action cannot be undone. This will permanently delete this faculty member."
      />
    </div>
  );
}
