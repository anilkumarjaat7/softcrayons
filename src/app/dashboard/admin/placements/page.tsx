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
  Award,
  CheckCircle,
  Clock,
  Star,
  Loader2,
  User,
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

type Placement = {
  id: number;
  studentName: string;
  avatar: string | null;
  courseName: string;
  dialogue: string | null;
  packageOffered: string | null;
  companyName: string | null;
  position: string | null;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function PlacementsPage() {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  const totalPlacements = placements.length;
  const publishedPlacements = placements.filter((p) => p.isPublic).length;
  const draftPlacements = placements.filter((p) => !p.isPublic).length;
  const featuredPlacements = placements.filter((p) => p.isFeatured).length;

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/placements");
      const data = await response.json();
      if (data.success) {
        setPlacements(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch placements:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: number, field: "isPublic" | "isFeatured", currentValue: boolean) => {
    setPlacements((prev) =>
      prev.map((placement) =>
        placement.id === id ? { ...placement, [field]: !currentValue } : placement
      )
    );

    try {
      const response = await fetch(`/api/admin/placements/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (!response.ok) {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Update failed:", error);
      setPlacements((prev) =>
        prev.map((placement) =>
          placement.id === id ? { ...placement, [field]: currentValue } : placement
        )
      );
    }
  };

  const handleDeletePlacement = (id: number) => {
    setDeleteItemId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeletePlacement = async () => {
    if (!deleteItemId) return;
    try {
      const response = await fetch(`/api/admin/placements/${deleteItemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPlacements(placements.filter((p) => p.id !== deleteItemId));
      }
    } catch (error) {
      console.error("Failed to delete placement:", error);
    } finally {
      setDeleteModalOpen(false);
      setDeleteItemId(null);
    }
  };

  const filteredPlacements = placements.filter((placement) => {
    const matchesSearch =
      placement.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      placement.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      placement.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      placement.position?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "published" && placement.isPublic) ||
      (statusFilter === "draft" && !placement.isPublic);

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

  return (
    <div className="w-full max-w-[98%] mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Placements</h1>
          <p className="text-muted-foreground">
            Manage student placement records
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/admin/placements/new">
            <Plus className="mr-2 h-4 w-4" />
            New Placement
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Placements
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlacements}</div>
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
            <div className="text-2xl font-bold">{publishedPlacements}</div>
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
            <div className="text-2xl font-bold">{draftPlacements}</div>
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
            <div className="text-2xl font-bold">{featuredPlacements}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search placements..."
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
                <TableHead className="w-[25%]">Student</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Package</TableHead>
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
              ) : filteredPlacements.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No placements found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPlacements.map((placement) => (
                  <TableRow key={placement.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={placement.avatar || ""} alt={placement.studentName} />
                          <AvatarFallback>{getInitials(placement.studentName)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="font-medium truncate">{placement.studentName}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {placement.courseName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {placement.companyName || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {placement.position || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {placement.packageOffered || "—"}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={placement.isPublic}
                        onCheckedChange={() => handleToggle(placement.id, "isPublic", placement.isPublic)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={placement.isFeatured}
                        onCheckedChange={() => handleToggle(placement.id, "isFeatured", placement.isFeatured)}
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
                            <Link href={`/placements`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/admin/placements/${placement.id}/edit`}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeletePlacement(placement.id)}
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
        onConfirm={confirmDeletePlacement}
        title="Delete Placement"
        description="This action cannot be undone. This will permanently delete this placement record."
      />
    </div>
  );
}
