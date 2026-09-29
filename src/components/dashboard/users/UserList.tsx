"use client";

import * as React from "react";
import { UserRow, type User, type UserRole } from "./UserRow";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface UserListProps {
  users: User[];
  isLoading?: boolean;
  showRole?: boolean;
  onViewProfile?: (user: User) => void;
  onEdit?: (user: User) => void;
  onBan?: (user: User) => void;
  onUnban?: (user: User) => void;
  onDelete?: (user: User) => void;
  onChangePassword?: (user: User) => void;
  className?: string;
}

export function UserList({
  users,
  isLoading = false,
  showRole = false,
  onViewProfile,
  onEdit,
  onBan,
  onUnban,
  onDelete,
  onChangePassword,
  className,
}: UserListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <UserRowSkeleton key={i} showRole={showRole} />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className={cn("py-12 text-center", className)}>
        <div className="text-muted-foreground">No users found</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          showRole={showRole}
          onViewProfile={onViewProfile}
          onEdit={onEdit}
          onBan={onBan}
          onUnban={onUnban}
          onDelete={onDelete}
          onChangePassword={onChangePassword}
        />
      ))}
    </div>
  );
}

function UserRowSkeleton({ showRole }: { showRole?: boolean }) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card md:flex-row md:items-center md:gap-6">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-32" />
      {showRole && <Skeleton className="h-5 w-20" />}
      <Skeleton className="h-4 w-48 hidden md:block" />
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-8 w-24 ml-auto" />
    </div>
  );
}

interface UserListHeaderProps {
  showRole?: boolean;
  className?: string;
}

export function UserListHeader({ showRole = false, className }: UserListHeaderProps) {
  return (
    <div
      className={cn(
        "hidden md:flex items-center gap-6 px-4 py-2 text-sm font-medium text-muted-foreground",
        className
      )}
    >
      <div className="w-10" /> {/* Avatar placeholder */}
      <div className="min-w-[150px]">Name</div>
      {showRole && <div className="min-w-[120px]">Role</div>}
      <div className="flex-1 min-w-[200px]">Email</div>
      <div className="min-w-[130px]">Phone</div>
      <div className="min-w-[100px]">Status</div>
      <div className="w-[160px] text-right">Actions</div>
    </div>
  );
}
