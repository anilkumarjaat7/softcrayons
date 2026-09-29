"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2 } from "lucide-react";
import { type User } from "./UserRow";

interface DeleteUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string) => void;
  isLoading?: boolean;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteUserDialogProps) {
  const [confirmText, setConfirmText] = React.useState("");
  const isConfirmed = confirmText === "DELETE";

  const handleOpenChange = (value: boolean) => {
    if (!value) setConfirmText("");
    onOpenChange(value);
  };

  const handleConfirm = () => {
    if (isConfirmed && user) {
      onConfirm(user.id);
      setConfirmText("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-2">
            <Trash2 className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center">Delete User</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-foreground">
              {user?.name || user?.email}
            </span>
            ? This action cannot be undone. All data associated with this user
            will be permanently removed.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="confirm-delete-user" className="text-sm font-medium">
            Type <span className="font-bold text-destructive">DELETE</span> to confirm
          </Label>
          <Input
            id="confirm-delete-user"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE here"
            className="font-mono"
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Enter" && isConfirmed) handleConfirm();
            }}
          />
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed || isLoading}
          >
            {isLoading ? "Deleting..." : "Delete User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface BanUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string, reason: string, expiresIn?: number) => void;
  isLoading?: boolean;
}

export function BanUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: BanUserDialogProps) {
  const [reason, setReason] = React.useState("");
  const [duration, setDuration] = React.useState<string>("permanent");

  const handleConfirm = () => {
    if (!user) return;
    let expiresIn: number | undefined;
    switch (duration) {
      case "1day":
        expiresIn = 60 * 60 * 24;
        break;
      case "7days":
        expiresIn = 60 * 60 * 24 * 7;
        break;
      case "30days":
        expiresIn = 60 * 60 * 24 * 30;
        break;
      default:
        expiresIn = undefined;
    }
    onConfirm(user.id, reason, expiresIn);
  };

  React.useEffect(() => {
    if (!open) {
      setReason("");
      setDuration("permanent");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ban User</DialogTitle>
          <DialogDescription>
            Ban{" "}
            <span className="font-semibold text-foreground">
              {user?.name || user?.email}
            </span>{" "}
            from accessing the platform. They will be signed out and unable to
            sign in.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="ban-reason">Reason (optional)</Label>
            <Textarea
              id="ban-reason"
              placeholder="Enter the reason for banning this user..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ban-duration">Duration</Label>
            <select
              id="ban-duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="permanent">Permanent</option>
              <option value="1day">1 Day</option>
              <option value="7days">7 Days</option>
              <option value="30days">30 Days</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Banning..." : "Ban User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface UnbanUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string) => void;
  isLoading?: boolean;
}

export function UnbanUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: UnbanUserDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unban User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to unban{" "}
            <span className="font-semibold text-foreground">
              {user?.name || user?.email}
            </span>
            ? They will be able to sign in and access the platform again.
            {user?.banReason && (
              <span className="block mt-2 text-sm">
                <strong>Ban Reason:</strong> {user.banReason}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => user && onConfirm(user.id)}
            disabled={isLoading}
          >
            {isLoading ? "Unbanning..." : "Unban User"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ChangePasswordDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (userId: string, newPassword: string) => void;
  isLoading?: boolean;
}

export function ChangePasswordDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: ChangePasswordDialogProps) {
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleConfirm = () => {
    if (!user) return;
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    onConfirm(user.id, password);
  };

  React.useEffect(() => {
    if (!open) {
      setPassword("");
      setConfirmPassword("");
      setError("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Set a new password for{" "}
            <span className="font-semibold text-foreground">
              {user?.name || user?.email}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface ViewProfileDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewProfileDialog({
  user,
  open,
  onOpenChange,
}: ViewProfileDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {user.name
                ? user.name
                    .split(" ")
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join("")
                    .toUpperCase()
                : user.email.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{user.name || "No Name"}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="grid gap-3">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium">{user.role}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Phone</span>
              <span className="font-medium">{user.phone || "—"}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Status</span>
              <span className={user.banned ? "text-destructive font-medium" : "text-primary font-medium"}>
                {user.banned ? "Banned" : "Active"}
              </span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-muted-foreground">Email Verified</span>
              <span className="font-medium">{user.emailVerified ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Joined</span>
              <span className="font-medium">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
