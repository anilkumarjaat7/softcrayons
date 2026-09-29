"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/components/providers";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import {
  Save,
  Loader2,
  ImagePlus,
  X,
  Eye,
  EyeOff,
  Monitor,
  Smartphone,
  Globe,
  LogOut,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

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

interface ProfileSectionProps {
  title?: string;
  description?: string;
}

export function ProfileSection({ 
  title = "Profile Settings", 
  description = "Manage your account settings and preferences" 
}: ProfileSectionProps) {
  const { user, isLoading: authLoading, refresh } = useAuth();

  const [isUpdatingProfile, setIsUpdatingProfile] = React.useState(false);
  const [profileForm, setProfileForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    image: "",
  });
  const [profileErrors, setProfileErrors] = React.useState<Record<string, string>>({});

  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false);
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = React.useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [sessions, setSessions] = React.useState<Session[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = React.useState(true);
  const [revokingSessionId, setRevokingSessionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        email: user.email,
        phone: user.phone || "",
        image: user.image || "",
      });
    }
  }, [user]);

  const fetchSessions = React.useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoadingSessions(true);
    try {
      const { data, error } = await authClient.listSessions();

      if (error) {
        toast.error("Failed to fetch sessions");
        return;
      }

      setSessions((data || []) as Session[]);
    } catch {
      toast.error("Failed to fetch sessions");
    } finally {
      setIsLoadingSessions(false);
    }
  }, [user?.id]);

  React.useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const validateProfileForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profileForm.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!profileForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      newErrors.email = "Invalid email format";
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm() || !user) return;

    setIsUpdatingProfile(true);
    try {
      const { error } = await authClient.updateUser({
        name: profileForm.name,
        image: profileForm.image || undefined,
      });

      if (error) {
        toast.error(error.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully");
      refresh();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validatePasswordForm = () => {
    const newErrors: Record<string, string> = {};

    if (!passwordForm.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!passwordForm.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    }

    if (!passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) return;

    setIsUpdatingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });

      if (error) {
        toast.error(error.message || "Failed to change password");
        return;
      }

      toast.success("Password changed successfully");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch {
      toast.error("Failed to change password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleRevokeSession = async (sessionToken: string) => {
    setRevokingSessionId(sessionToken);
    try {
      const { error } = await authClient.revokeSession({
        token: sessionToken,
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

  const handleRevokeAllOtherSessions = async () => {
    try {
      const { error } = await authClient.revokeSessions();

      if (error) {
        toast.error(error.message || "Failed to revoke sessions");
        return;
      }

      toast.success("All other sessions revoked successfully");
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

  const isCurrentSession = (session: Session) => {
    return sessions.length > 0 && session.id === sessions[0]?.id;
  };

  if (authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your profile details and avatar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Image</Label>
                <div className="flex items-center gap-4">
                  {profileForm.image ? (
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={profileForm.image} alt="Profile" />
                        <AvatarFallback className="bg-primary/10 text-primary text-xl">
                          {profileForm.name ? profileForm.name.slice(0, 2).toUpperCase() : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <button
                        type="button"
                        onClick={() => handleProfileChange("image", "")}
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
                          handleProfileChange("image", result.info.secure_url as string);
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
                    <p>Click to upload</p>
                    <p className="text-xs">Square image recommended</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={profileForm.name}
                  onChange={(e) => handleProfileChange("name", e.target.value)}
                  className={profileErrors.name ? "border-destructive" : ""}
                />
                {profileErrors.name && (
                  <p className="text-sm text-destructive">{profileErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Contact support to change your email address
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your phone number"
                  value={profileForm.phone}
                  onChange={(e) => handleProfileChange("phone", e.target.value)}
                  disabled
                  className="bg-muted"
                />
              </div>

              <Button type="submit" disabled={isUpdatingProfile} className="gap-2">
                {isUpdatingProfile ? (
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
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">
                  Current Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    placeholder="Enter current password"
                    value={passwordForm.currentPassword}
                    onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
                    className={passwordErrors.currentPassword ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">
                  New Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    placeholder="Enter new password"
                    value={passwordForm.newPassword}
                    onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
                    className={passwordErrors.newPassword ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm New Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
                    className={passwordErrors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              <Button type="submit" disabled={isUpdatingPassword} className="gap-2">
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions across devices
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
              {sessions.length > 1 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="gap-2">
                      <LogOut className="h-4 w-4" />
                      Revoke All Other Sessions
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Revoke all other sessions?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will log you out from all other devices. You will remain logged in on this device.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleRevokeAllOtherSessions}>
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
              {Array.from({ length: 3 }).map((_, i) => (
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
                        {isCurrentSession(session) && (
                          <Badge variant="secondary" className="text-xs">
                            Current
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
                  {!isCurrentSession(session) && (
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
                            This will log out this device. The user will need to sign in again to access their account.
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
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
