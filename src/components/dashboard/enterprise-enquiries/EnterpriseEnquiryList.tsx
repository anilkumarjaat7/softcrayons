"use client";

import * as React from "react";
import { EnterpriseEnquiryRow, type EnterpriseEnquiry, type EnterpriseEnquiryStatus } from "./EnterpriseEnquiryRow";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EnterpriseEnquiryListProps {
  enquiries: EnterpriseEnquiry[];
  isLoading?: boolean;
  onViewDetails?: (enquiry: EnterpriseEnquiry) => void;
  onAssignUser?: (enquiry: EnterpriseEnquiry) => void;
  onStatusChange?: (enquiry: EnterpriseEnquiry, status: EnterpriseEnquiryStatus) => void;
  onEditNotes?: (enquiry: EnterpriseEnquiry) => void;
  onDelete?: (enquiry: EnterpriseEnquiry) => void;
  className?: string;
}

export function EnterpriseEnquiryList({
  enquiries,
  isLoading = false,
  onViewDetails,
  onAssignUser,
  onStatusChange,
  onEditNotes,
  onDelete,
  className,
}: EnterpriseEnquiryListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <EnterpriseEnquiryRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className={cn("py-12 text-center", className)}>
        <div className="text-muted-foreground">No enterprise enquiries found</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {enquiries.map((enquiry) => (
        <EnterpriseEnquiryRow
          key={enquiry.id}
          enquiry={enquiry}
          onViewDetails={onViewDetails}
          onAssignUser={onAssignUser}
          onStatusChange={onStatusChange}
          onEditNotes={onEditNotes}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function EnterpriseEnquiryRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card md:flex-row md:items-center md:gap-6">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-40" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-4 w-24 hidden md:block" />
      <Skeleton className="h-6 w-28 hidden md:block" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-4 w-24 hidden md:block" />
      <Skeleton className="h-8 w-28 ml-auto" />
    </div>
  );
}

interface EnterpriseEnquiryListHeaderProps {
  className?: string;
}

export function EnterpriseEnquiryListHeader({ className }: EnterpriseEnquiryListHeaderProps) {
  return (
    <div
      className={cn(
        "hidden md:flex items-center gap-6 px-4 py-2 text-sm font-medium text-muted-foreground",
        className
      )}
    >
      <div className="w-10" /> {/* Avatar placeholder */}
      <div className="min-w-[180px]">Company</div>
      <div className="min-w-[180px]">Contact</div>
      <div className="min-w-[120px] flex-1">Duration</div>
      <div className="min-w-[130px]">Assigned To</div>
      <div className="min-w-[90px]">Status</div>
      <div className="min-w-[100px]">Date</div>
      <div className="w-28">Actions</div>
    </div>
  );
}
