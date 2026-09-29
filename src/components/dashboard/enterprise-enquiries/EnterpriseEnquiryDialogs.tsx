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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserSelector } from "@/components/ui/user-selector";
import { type EnterpriseEnquiry, type EnterpriseEnquiryStatus } from "./EnterpriseEnquiryRow";
import { cn } from "@/lib/utils";
import { Phone, Mail, Building2, Clock, Calendar, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ViewDetailsDialogProps {
  enquiry: EnterpriseEnquiry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewEnterpriseDetailsDialog({
  enquiry,
  open,
  onOpenChange,
}: ViewDetailsDialogProps) {
  if (!enquiry) return null;

  const statusColors: Record<EnterpriseEnquiryStatus, string> = {
    NEW: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    CONTACTED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    CLOSED: "bg-red-500/10 text-red-600 border-red-500/20",
    ARCHIVED: "bg-muted text-muted-foreground border-muted",
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Enterprise Enquiry Details</DialogTitle>
          <DialogDescription>
            Complete information about this enterprise enquiry
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-muted-foreground">Company Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{enquiry.companyName}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${enquiry.email}`} className="text-primary hover:underline">
                  {enquiry.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a href={`tel:${enquiry.phone}`} className="text-primary hover:underline">
                  {enquiry.phone}
                </a>
              </div>
            </div>
          </div>

          {enquiry.duration && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Training Duration</h4>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{enquiry.duration}</span>
              </div>
            </div>
          )}

          {enquiry.message && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Message</h4>
              <p className="text-sm bg-muted/50 p-3 rounded-lg">{enquiry.message}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Status</h4>
              <Badge variant="outline" className={cn("font-medium", statusColors[enquiry.status])}>
                {enquiry.status}
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-muted-foreground">Assigned To</h4>
              {enquiry.assignedTo ? (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={enquiry.assignedTo.image || undefined} />
                    <AvatarFallback className="text-[10px]">
                      {(enquiry.assignedTo.name || enquiry.assignedTo.email).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <span className="text-sm">{enquiry.assignedTo.name || enquiry.assignedTo.email}</span>
                    <span className="text-xs text-muted-foreground block">{enquiry.assignedTo.role}</span>
                  </div>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Unassigned</span>
              )}
            </div>
          </div>

          {(enquiry.note || enquiry.remark) && (
            <div className="space-y-3">
              {enquiry.note && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Internal Note</h4>
                  <p className="text-sm bg-amber-50 dark:bg-amber-950/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                    {enquiry.note}
                  </p>
                </div>
              )}
              {enquiry.remark && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-muted-foreground">Remark</h4>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg">{enquiry.remark}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Created: {formatDate(enquiry.createdAt)}</span>
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

interface AssignUserDialogProps {
  enquiry: EnterpriseEnquiry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (enquiryId: number, userId: string) => void;
  isLoading?: boolean;
}

export function AssignEnterpriseUserDialog({
  enquiry,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: AssignUserDialogProps) {
  const [userId, setUserId] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<"HR" | "COUNSELOR">("COUNSELOR");

  React.useEffect(() => {
    if (open && enquiry?.assignedTo) {
      setUserId(enquiry.assignedTo.id);
      setSelectedRole((enquiry.assignedTo.role === "HR" ? "HR" : "COUNSELOR") as "HR" | "COUNSELOR");
    } else if (!open) {
      setUserId("");
      setSelectedRole("COUNSELOR");
    }
  }, [open, enquiry]);

  const handleConfirm = () => {
    if (enquiry) {
      onConfirm(enquiry.id, userId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign User</DialogTitle>
          <DialogDescription>
            Assign a Counselor or HR to handle the enterprise enquiry from{" "}
            <span className="font-semibold text-foreground">{enquiry?.companyName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={selectedRole} onValueChange={(value) => {
              setSelectedRole(value as "HR" | "COUNSELOR");
              setUserId("");
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select role..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COUNSELOR">Counselor</SelectItem>
                <SelectItem value="HR">HR</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Select {selectedRole === "HR" ? "HR" : "Counselor"}</Label>
            <UserSelector
              key={selectedRole}
              value={userId}
              onChange={(id) => setUserId(id)}
              role={selectedRole}
              placeholder={`Select ${selectedRole === "HR" ? "an HR" : "a counselor"}...`}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Saving..." : "Assign User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface EditNotesDialogProps {
  enquiry: EnterpriseEnquiry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (enquiryId: number, note: string, remark: string) => void;
  isLoading?: boolean;
}

export function EditEnterpriseNotesDialog({
  enquiry,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: EditNotesDialogProps) {
  const [note, setNote] = React.useState("");
  const [remark, setRemark] = React.useState("");

  React.useEffect(() => {
    if (open && enquiry) {
      setNote(enquiry.note || "");
      setRemark(enquiry.remark || "");
    }
  }, [open, enquiry]);

  const handleConfirm = () => {
    if (enquiry) {
      onConfirm(enquiry.id, note, remark);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Notes</DialogTitle>
          <DialogDescription>
            Add internal notes and remarks for the enterprise enquiry from{" "}
            <span className="font-semibold text-foreground">{enquiry?.companyName}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="note">Internal Note</Label>
            <Textarea
              id="note"
              placeholder="Add internal notes about this enquiry..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Internal notes are only visible to staff members
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="remark">Remark</Label>
            <Textarea
              id="remark"
              placeholder="Add any additional remarks..."
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Notes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteEnterpriseEnquiryDialogProps {
  enquiry: EnterpriseEnquiry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (enquiryId: number) => void;
  isLoading?: boolean;
}

export function DeleteEnterpriseEnquiryDialog({
  enquiry,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
}: DeleteEnterpriseEnquiryDialogProps) {
  const [confirmText, setConfirmText] = React.useState("");
  const isConfirmed = confirmText === "DELETE";

  const handleOpenChange = (value: boolean) => {
    if (!value) setConfirmText("");
    onOpenChange(value);
  };

  const handleConfirm = () => {
    if (isConfirmed && enquiry) {
      onConfirm(enquiry.id);
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
          <DialogTitle className="text-center">Delete Enterprise Enquiry</DialogTitle>
          <DialogDescription className="text-center">
            Are you sure you want to delete the enterprise enquiry from{" "}
            <span className="font-semibold text-foreground">{enquiry?.companyName}</span>?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="confirm-delete-enterprise-enquiry" className="text-sm font-medium">
            Type <span className="font-bold text-destructive">DELETE</span> to confirm
          </Label>
          <Input
            id="confirm-delete-enterprise-enquiry"
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
            {isLoading ? "Deleting..." : "Delete Enquiry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
