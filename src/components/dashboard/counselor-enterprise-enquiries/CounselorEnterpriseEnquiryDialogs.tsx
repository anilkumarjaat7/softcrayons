"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { type EnterpriseEnquiry, type EnterpriseEnquiryStatus } from "./CounselorEnterpriseEnquiryRow";
import { cn } from "@/lib/utils";
import { Phone, Mail, Building2, Clock, Calendar } from "lucide-react";

interface ViewDetailsDialogProps {
  enquiry: EnterpriseEnquiry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CounselorEnterpriseViewDetailsDialog({
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

          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Status</h4>
            <Badge variant="outline" className={cn("font-medium", statusColors[enquiry.status])}>
              {enquiry.status}
            </Badge>
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

interface EditNotesDialogProps {
  enquiry: EnterpriseEnquiry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (enquiryId: number, note: string, remark: string) => void;
  isLoading?: boolean;
}

export function CounselorEnterpriseEditNotesDialog({
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
