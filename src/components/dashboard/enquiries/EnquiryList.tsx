"use client";

import * as React from "react";
import { EnquiryRow, type Enquiry, type EnquiryStatus } from "./EnquiryRow";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EnquiryListProps {
  enquiries: Enquiry[];
  isLoading?: boolean;
  onViewDetails?: (enquiry: Enquiry) => void;
  onAssignCounselor?: (enquiry: Enquiry) => void;
  onAddAgent?: (enquiry: Enquiry) => void;
  onStatusChange?: (enquiry: Enquiry, status: EnquiryStatus) => void;
  onEditNotes?: (enquiry: Enquiry) => void;
  onDelete?: (enquiry: Enquiry) => void;
  className?: string;
}

export function EnquiryList({
  enquiries,
  isLoading = false,
  onViewDetails,
  onAssignCounselor,
  onAddAgent,
  onStatusChange,
  onEditNotes,
  onDelete,
  className,
}: EnquiryListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <EnquiryRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className={cn("py-12 text-center", className)}>
        <div className="text-muted-foreground">No enquiries found</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {enquiries.map((enquiry) => (
        <EnquiryRow
          key={enquiry.id}
          enquiry={enquiry}
          onViewDetails={onViewDetails}
          onAssignCounselor={onAssignCounselor}
          onAddAgent={onAddAgent}
          onStatusChange={onStatusChange}
          onEditNotes={onEditNotes}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function EnquiryRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card md:flex-row md:items-center md:gap-6">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-32" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-4 w-32 hidden md:block" />
      <Skeleton className="h-6 w-20 hidden md:block" />
      <Skeleton className="h-6 w-20 hidden md:block" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-4 w-24 hidden md:block" />
      <Skeleton className="h-8 w-32 ml-auto" />
    </div>
  );
}

interface EnquiryListHeaderProps {
  className?: string;
}

export function EnquiryListHeader({ className }: EnquiryListHeaderProps) {
  return (
    <div
      className={cn(
        "hidden md:flex md:min-w-[1272px] items-center gap-6 px-4 py-2 text-sm font-medium text-muted-foreground",
        className
      )}
    >
      <div className="w-10" /> {/* Avatar placeholder */}
      <div className="min-w-[150px]">Name</div>
      <div className="min-w-[180px]">Contact</div>
      <div className="min-w-[150px] flex-1">Course</div>
      <div className="min-w-[130px]">Counselor</div>
      <div className="min-w-[100px]">Agent</div>
      <div className="min-w-[90px]">Status</div>
      <div className="min-w-[100px]">Date</div>
      <div className="w-[140px] text-right">Actions</div>
    </div>
  );
}
