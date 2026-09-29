"use client";

import * as React from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, Save, Loader2, ImagePlus, X, Monitor, Smartphone, Globe, LogOut, RefreshCw } from "lucide-react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Link from "next/link";
import { type UserRole } from "@/components/dashboard/users";

const ROLES: { label: string; value: UserRole }[] = [
  { label: "Admin", value: "ADMIN" },
  { label: "Student", value: "STUDENT" },
  { label: "Instructor", value: "INSTRUCTOR" },
  { label: "Counselor", value: "COUNSELOR" },
  { label: "HR", value: "HR" },
  { label: "Content Writer", value: "CONTENT_WRITER" },
  { label: "Agent", value: "AGENT" },
];

interface UserData {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  image: string | null;
  role: UserRole;
  banned: boolean;
  emailVerified: boolean;
}

interface Session {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [originalRole, setOriginalRole] = React.useState<UserRole>("STUDENT");

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    image: "",
    role: "STUDENT" as UserRole,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = React.useState(true);
  const [revokingSessionId, setRevokingSessionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await authClient.admin.listUsers({
          query: {
            limit: 1,
            filterField: "id",
            filterValue: userId,
            filterOperator: "eq",
          },
        });

        if (error || !data?.users?.length) {
          toast.error("User not found");
          router.push("/dashboard/admin/users");
          return;
        }

        const user = data.users[0] as unknown as UserData;
        setFormData({
          name: user.name || "",
          email: user.email,
          phone: (user as { phone?: string }).phone || "",
          image: user.image || "",
          role: user.role as UserRole,
        });
        setOriginalRole(user.role as UserRole);
      } catch {
        toast.error("Failed to fetch user");
        router.push("/dashboard/admin/users");
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId, router]);

  const fetchSessions = React.useCallback(async () => {
    if (!userId) return;
    
    setIsLoadingSessions(true);
    try {
      const { data, error } = await authClient.admin.listUserSessions({
        userId,
      });

      if (error) {
        console.error("Failed to fetch sessions:", error);
        return;
      }

      setSessions((data?.sessions || []) as Session[]);
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [userId]);

  React.useEffect(() => {
    if (userId) {
      fetchSessions();
    }
  }, [userId, fetchSessions]);

  const handleRevokeSession = async (sessionToken: string) => {
    setRevokingSessionId(sessionToken);
    try {
      const { error } = await authClient.admin.revokeUserSession({
        sessionToken,
      });

      if (error) {
        toast.error(error.message || "Failed to revoke session");
        return;
      }

      toast.success("Session revoked successfully");
      fetchSessions();
    } catch {
      toast.error("Failed to revoke session");
    } finally {
      setRevokingSessionId(null);
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      const { error } = await authClient.admin.revokeUserSessions({
        userId,
      });

      if (error) {
        toast.error(error.message || "Failed to revoke sessions");
        return;
      }

      toast.success("All sessions revoked successfully");
      fetchSessions();
    } catch {
      toast.error("Failed to revoke sessions");
    }
  };

  const getDeviceIcon = (userAgent: string | null | undefined) => {
    if (!userAgent) return <Globe className="h-5 w-5" />;
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      return <Smartphone className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const getDeviceName = (userAgent: string | null | undefined) => {
    if (!userAgent) return "Unknown Device";
    
    const ua = userAgent.toLowerCase();
    let device = "Desktop";
    let browser = "Unknown Browser";

    if (ua.includes("iphone")) device = "iPhone";
    else if (ua.includes("ipad")) device = "iPad";
    else if (ua.includes("android")) device = "Android";
    else if (ua.includes("macintosh")) device = "Mac";
    else if (ua.includes("windows")) device = "Windows";
    else if (ua.includes("linux")) device = "Linux";

    if (ua.includes("chrome") && !ua.includes("edg")) browser = "Chrome";
    else if (ua.includes("firefox")) browser = "Firefox";
    else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
    else if (ua.includes("edg")) browser = "Edge";

    return `${device} • ${browser}`;
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { error: updateError } = await authClient.admin.updateUser({
        userId,
        data: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          image: formData.image || null,
        },
      });

      if (updateError) {
        toast.error(updateError.message || "Failed to update user");
        return;
      }

      if (formData.role !== originalRole) {
        const { error: roleError } = await authClient.admin.setRole({
          userId,
          role: formData.role as unknown as "user" | "admin",
        });

        if (roleError) {
          toast.error(roleError.message || "Failed to update role");
          return;
        }
      }

      toast.success("User updated successfully");
      router.push("/dashboard/admin/users");
    } catch {
      toast.error("Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="max-w-2xl">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/admin/users">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Edit User</h1>
          <p className="text-sm text-muted-foreground">
            Update user information
          </p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-6">
            <div className="space-y-2">
              <Label>Profile Image</Label>
              <div className="flex items-center gap-4">
                {formData.image ? (
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={formData.image} alt="Profile" />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {formData.name ? formData.name.slice(0, 2).toUpperCase() : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => handleChange("image", "")}
                      className="absolute -right-1 -top-1 rounded-full bg-destructive p-1 text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <CldUploadWidget
                    uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "blog_unsigned"}
                    options={{
                      folder: "user-avatars",
                      maxFiles: 1,
                      resourceType: "image",
                      cropping: true,
                      croppingAspectRatio: 1,
                    }}
                    onSuccess={(result: CloudinaryUploadWidgetResults) => {
                      if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
                        handleChange("image", result.info.secure_url as string);
                      }
                      document.body.style.overflow = "";
                      document.body.style.pointerEvents = "";
                    }}
                    onClose={() => {
                      setTimeout(() => {
                        document.body.style.overflow = "";
                        document.body.style.pointerEvents = "";
                      }, 100);
                    }}
                    onError={() => {
                      document.body.style.overflow = "";
                      document.body.style.pointerEvents = "";
                    }}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          open();
                        }}
                        className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-full border-2 border-dashed border-muted-foreground/25 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <ImagePlus className="h-6 w-6" />
                      </button>
                    )}
                  </CldUploadWidget>
                )}
                <div className="text-sm text-muted-foreground">
                  <p>Upload a profile picture</p>
                  <p className="text-xs">Recommended: Square image, at least 200x200px</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter user's full name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number (optional)"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">
                Role <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleChange("role", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formData.role !== originalRole && (
                <p className="text-sm text-muted-foreground">
                  Role will be changed from{" "}
                  <span className="font-medium text-foreground">{originalRole}</span> to{" "}
                  <span className="font-medium text-primary">{formData.role}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
            <Link href="/dashboard/admin/users">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Sessions</CardTitle>
              <CardDescription>
                Active sessions for this user
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchSessions}
                disabled={isLoadingSessions}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isLoadingSessions ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              {sessions.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <LogOut className="h-4 w-4" />
                      Revoke All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke all sessions?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will log the user out from all devices. They will need to sign in again.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRevokeAllSessions}>
                        Revoke All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingSessions ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No active sessions found
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {getDeviceIcon(session.userAgent)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{getDeviceName(session.userAgent)}</span>
                        {sessions.length > 0 && session.id === sessions[0]?.id && (
                          <Badge variant="secondary" className="text-xs">
                            Latest
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        {session.ipAddress && <span>{session.ipAddress}</span>}
                        <span>•</span>
                        <span>Created {formatDate(session.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={revokingSessionId === session.token}
                        className="gap-2"
                      >
                        {revokingSessionId === session.token ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <LogOut className="h-4 w-4" />
                        )}
                        Revoke
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke this session?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will log out this device. The user will need to sign in again.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleRevokeSession(session.token)}>
                          Revoke Session
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
