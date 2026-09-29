"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Edit,
  Ban,
  Trash2,
  KeyRound,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type UserRole =
  | "ADMIN"
  | "STUDENT"
  | "INSTRUCTOR"
  | "COUNSELOR"
  | "HR"
  | "CONTENT_WRITER"
  | "AGENT";

export interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  role: UserRole;
  banned: boolean;
  banReason: string | null;
  banExpires: Date | null;
  emailVerified: boolean;
  createdAt: Date;
}

interface UserRowProps {
  user: User;
  showRole?: boolean;
  onViewProfile?: (user: User) => void;
  onEdit?: (user: User) => void;
  onBan?: (user: User) => void;
  onUnban?: (user: User) => void;
  onDelete?: (user: User) => void;
  onChangePassword?: (user: User) => void;
}

const roleColors: Record<UserRole, string> = {
  ADMIN: "bg-primary/10 text-primary border-primary/20",
  STUDENT: "bg-secondary/10 text-secondary-foreground border-secondary/20",
  INSTRUCTOR: "bg-primary/10 text-primary border-primary/20",
  COUNSELOR: "bg-muted text-muted-foreground border-muted",
  HR: "bg-muted text-muted-foreground border-muted",
  CONTENT_WRITER: "bg-muted text-muted-foreground border-muted",
  AGENT: "bg-muted text-muted-foreground border-muted",
};

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Admin",
  STUDENT: "Student",
  INSTRUCTOR: "Instructor",
  COUNSELOR: "Counselor",
  HR: "HR",
  CONTENT_WRITER: "Content Writer",
  AGENT: "Agent",
};

function getInitials(name: string | null, email: string): string {
  if (name) {
    const parts = name.split(" ");
    return parts
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function UserRow({
  user,
  showRole = false,
  onViewProfile,
  onEdit,
  onBan,
  onUnban,
  onDelete,
  onChangePassword,
}: UserRowProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow md:flex-row md:items-center md:gap-6">
      <div className="flex items-center gap-4 md:w-auto">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.image || undefined} alt={user.name || user.email} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(user.name, user.email)}
          </AvatarFallback>
        </Avatar>

        <div className="md:hidden">
          <div className="font-semibold text-foreground">{user.name || "No Name"}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
        </div>
      </div>

      <div className="hidden md:block md:min-w-[150px]">
        <div className="font-semibold text-foreground">{user.name || "No Name"}</div>
      </div>

      {showRole && (
        <div className="md:min-w-[120px]">
          <Badge
            variant="outline"
            className={cn("font-medium", roleColors[user.role])}
          >
            {roleLabels[user.role]}
          </Badge>
        </div>
      )}

      <div className="hidden md:block md:flex-1 md:min-w-[200px]">
        <span className="text-sm text-muted-foreground">{user.email}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground md:min-w-[130px]">
        <span className="text-muted-foreground md:hidden">Phone:</span>
        <span>{user.phone || "—"}</span>
      </div>

      <div className="md:min-w-[100px]">
        {user.banned ? (
          <Badge variant="destructive" className="gap-1">
            <Ban className="h-3 w-3" />
            Banned
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="gap-1 bg-primary/10 text-primary border-primary/20"
          >
            <ShieldCheck className="h-3 w-3" />
            Active
          </Badge>
        )}
      </div>

      <div className="flex items-center gap-2 md:ml-auto">
        <div className="hidden lg:flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onViewProfile?.(user)}
            title="View Profile"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onEdit?.(user)}
            title="Edit User"
          >
            <Edit className="h-4 w-4" />
          </Button>
          {user.banned ? (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onUnban?.(user)}
              title="Unban User"
              className="text-primary hover:text-primary"
            >
              <ShieldCheck className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onBan?.(user)}
              title="Ban User"
              className="text-destructive hover:text-destructive"
            >
              <Ban className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onChangePassword?.(user)}
            title="Change Password"
          >
            <KeyRound className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onDelete?.(user)}
            title="Delete User"
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="lg:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewProfile?.(user)}>
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(user)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit User
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChangePassword?.(user)}>
                <KeyRound className="h-4 w-4 mr-2" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.banned ? (
                <DropdownMenuItem
                  onClick={() => onUnban?.(user)}
                  className="text-primary focus:text-primary"
                >
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Unban User
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onClick={() => onBan?.(user)}
                  className="text-destructive focus:text-destructive"
                >
                  <Ban className="h-4 w-4 mr-2" />
                  Ban User
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onDelete?.(user)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
