"use client";

import { useState, useEffect, useRef } from "react";
import { Search, User, Loader2, X, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type UserData = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  banned: boolean;
};

type UserSelectorProps = {
  value?: string;
  onChange: (userId: string, user?: UserData) => void;
  placeholder?: string;
  isActive?: boolean;
  role?: string;
  className?: string;
  disabled?: boolean;
};

export function UserSelector({
  value,
  onChange,
  placeholder = "Select a user...",
  isActive = true,
  role,
  className,
  disabled = false,
}: UserSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [search, isOpen, isActive, role]);

  useEffect(() => {
    if (value && !selectedUser) {
      fetchSelectedUser();
    }
  }, [value]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (isActive !== undefined) params.set("isActive", String(isActive));
      if (role) params.set("role", role);
      params.set("limit", "20");

      const response = await fetch(`/api/admin/users?${params.toString()}`);
      const data = await response.json();

      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSelectedUser = async () => {
    try {
      const found = users.find((u) => u.id === value);
      if (found) {
        setSelectedUser(found);
        return;
      }
      
      const response = await fetch(`/api/admin/users?limit=100`);
      const data = await response.json();
      
      if (data.success) {
        const user = data.data.find((u: UserData) => u.id === value);
        if (user) {
          setSelectedUser(user);
        }
      }
    } catch (error) {
      console.error("Failed to fetch selected user:", error);
    }
  };

  const handleSelect = (user: UserData) => {
    setSelectedUser(user);
    onChange(user.id, user);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = () => {
    setSelectedUser(null);
    onChange("", undefined);
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {selectedUser ? (
        <div
          className={cn(
            "flex items-center justify-between gap-2 rounded-md border bg-background px-3 py-2",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Avatar className="h-7 w-7">
              <AvatarImage src={selectedUser.image || undefined} alt={selectedUser.name || ""} />
              <AvatarFallback className="text-xs bg-primary/10 text-primary">
                {getInitials(selectedUser.name, selectedUser.email)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{selectedUser.name || selectedUser.email}</p>
              {selectedUser.name && (
                <p className="text-xs text-muted-foreground truncate">{selectedUser.email}</p>
              )}
            </div>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "flex items-center gap-2 rounded-md border bg-background px-3 py-2 text-muted-foreground",
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50"
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <User className="h-4 w-4" />
          <span className="text-sm">{placeholder}</span>
        </div>
      )}

      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border bg-popover shadow-lg">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-9"
                autoFocus
              />
            </div>
          </div>

          <div className="max-h-[250px] overflow-y-auto p-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              </div>
            ) : users.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No users found
              </div>
            ) : (
              users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleSelect(user)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors",
                    "hover:bg-muted",
                    value === user.id && "bg-primary/10"
                  )}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.image || undefined} alt={user.name || ""} />
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(user.name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {user.name || user.email}
                      </p>
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {user.role}
                      </Badge>
                    </div>
                    {user.name && (
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    )}
                  </div>
                  {value === user.id && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
