"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UserList,
  UserListHeader,
  DeleteUserDialog,
  BanUserDialog,
  UnbanUserDialog,
  ChangePasswordDialog,
  ViewProfileDialog,
  type User,
  type UserRole,
} from "@/components/dashboard/users";
import { authClient } from "@/lib/auth-client";
import { Plus, Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const ROLES: { label: string; value: UserRole | "ALL" }[] = [
  { label: "All Users", value: "ALL" },
  { label: "Admin", value: "ADMIN" },
  { label: "Student", value: "STUDENT" },
  { label: "Instructor", value: "INSTRUCTOR" },
  { label: "Counselor", value: "COUNSELOR" },
  { label: "HR", value: "HR" },
  { label: "Content Writer", value: "CONTENT_WRITER" },
  { label: "Agent", value: "AGENT" },
];

export default function UsersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<UserRole | "ALL">("ALL");
  const [users, setUsers] = React.useState<User[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 20;

  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [banDialogOpen, setBanDialogOpen] = React.useState(false);
  const [unbanDialogOpen, setUnbanDialogOpen] = React.useState(false);
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = React.useState(false);
  const [viewProfileDialogOpen, setViewProfileDialogOpen] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);

  const fetchUsers = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const query: Record<string, unknown> = {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
      };

      if (searchQuery) {
        query.searchValue = searchQuery;
        query.searchField = "name";
        query.searchOperator = "contains";
      }

      if (activeTab !== "ALL") {
        query.filterField = "role";
        query.filterValue = activeTab;
        query.filterOperator = "eq";
      }

      const { data, error } = await authClient.admin.listUsers({ query });

      if (error) {
        toast.error("Failed to fetch users");
        console.error(error);
        return;
      }

      if (data) {
        setUsers(
          data.users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            phone: (u as unknown as { phone: string | null }).phone || null,
            image: u.image ?? null,
            role: u.role as UserRole,
            banned: u.banned || false,
            banReason: u.banReason || null,
            banExpires: u.banExpires ? new Date(u.banExpires) : null,
            emailVerified: u.emailVerified || false,
            createdAt: new Date(u.createdAt),
          }))
        );
        setTotal(data.total || 0);
      }
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, currentPage]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setViewProfileDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    router.push(`/dashboard/admin/users/${user.id}/edit`);
  };

  const handleBan = (user: User) => {
    setSelectedUser(user);
    setBanDialogOpen(true);
  };

  const handleUnban = (user: User) => {
    setSelectedUser(user);
    setUnbanDialogOpen(true);
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleChangePassword = (user: User) => {
    setSelectedUser(user);
    setChangePasswordDialogOpen(true);
  };

  const confirmDelete = async (userId: string) => {
    setActionLoading(true);
    try {
      const { error } = await authClient.admin.removeUser({ userId });
      if (error) {
        toast.error("Failed to delete user");
        return;
      }
      toast.success("User deleted successfully");
      setDeleteDialogOpen(false);
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmBan = async (userId: string, reason: string, expiresIn?: number) => {
    setActionLoading(true);
    try {
      const { error } = await authClient.admin.banUser({
        userId,
        banReason: reason || undefined,
        banExpiresIn: expiresIn,
      });
      if (error) {
        toast.error("Failed to ban user");
        return;
      }
      toast.success("User banned successfully");
      setBanDialogOpen(false);
      fetchUsers();
    } catch {
      toast.error("Failed to ban user");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmUnban = async (userId: string) => {
    setActionLoading(true);
    try {
      const { error } = await authClient.admin.unbanUser({ userId });
      if (error) {
        toast.error("Failed to unban user");
        return;
      }
      toast.success("User unbanned successfully");
      setUnbanDialogOpen(false);
      fetchUsers();
    } catch {
      toast.error("Failed to unban user");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmChangePassword = async (userId: string, newPassword: string) => {
    setActionLoading(true);
    try {
      const { error } = await authClient.admin.setUserPassword({ userId, newPassword });
      if (error) {
        toast.error("Failed to change password");
        return;
      }
      toast.success("Password changed successfully");
      setChangePasswordDialogOpen(false);
    } catch {
      toast.error("Failed to change password");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage all users across the platform
          </p>
        </div>
        <Link href="/dashboard/admin/users/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon" onClick={fetchUsers} disabled={isLoading}>
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      <div className="border-b border-border overflow-x-auto">
        <div className="flex min-w-max">
          {ROLES.map((role) => (
            <button
              key={role.value}
              className={cn(
                "px-4 py-2 font-semibold text-sm transition-colors duration-200 border-b-2 -mb-px whitespace-nowrap",
                activeTab === role.value
                  ? "border-primary text-primary bg-primary/5"
                  : "border-transparent text-muted-foreground hover:text-primary/80"
              )}
              onClick={() => setActiveTab(role.value)}
              type="button"
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <UserListHeader showRole={activeTab === "ALL"} />
        <UserList
          users={users}
          isLoading={isLoading}
          showRole={activeTab === "ALL"}
          onViewProfile={handleViewProfile}
          onEdit={handleEdit}
          onBan={handleBan}
          onUnban={handleUnban}
          onDelete={handleDelete}
          onChangePassword={handleChangePassword}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}

      <ViewProfileDialog
        user={selectedUser}
        open={viewProfileDialogOpen}
        onOpenChange={setViewProfileDialogOpen}
      />
      <DeleteUserDialog
        user={selectedUser}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        isLoading={actionLoading}
      />
      <BanUserDialog
        user={selectedUser}
        open={banDialogOpen}
        onOpenChange={setBanDialogOpen}
        onConfirm={confirmBan}
        isLoading={actionLoading}
      />
      <UnbanUserDialog
        user={selectedUser}
        open={unbanDialogOpen}
        onOpenChange={setUnbanDialogOpen}
        onConfirm={confirmUnban}
        isLoading={actionLoading}
      />
      <ChangePasswordDialog
        user={selectedUser}
        open={changePasswordDialogOpen}
        onOpenChange={setChangePasswordDialogOpen}
        onConfirm={confirmChangePassword}
        isLoading={actionLoading}
      />
    </div>
  );
}
