"use client";

import * as React from "react";
import { CounselorEnterpriseEnquiryRow, type EnterpriseEnquiry, type EnterpriseEnquiryStatus } from "./CounselorEnterpriseEnquiryRow";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CounselorEnterpriseEnquiryListProps {
  enquiries: EnterpriseEnquiry[];
  isLoading?: boolean;
  onViewDetails?: (enquiry: EnterpriseEnquiry) => void;
  onStatusChange?: (enquiry: EnterpriseEnquiry, status: EnterpriseEnquiryStatus) => void;
  onEditNotes?: (enquiry: EnterpriseEnquiry) => void;
  className?: string;
}

export function CounselorEnterpriseEnquiryList({
  enquiries,
  isLoading = false,
  onViewDetails,
  onStatusChange,
  onEditNotes,
  className,
}: CounselorEnterpriseEnquiryListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <CounselorEnterpriseEnquiryRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className={cn("py-12 text-center", className)}>
        <div className="text-muted-foreground">No enterprise enquiries assigned to you</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {enquiries.map((enquiry) => (
        <CounselorEnterpriseEnquiryRow
          key={enquiry.id}
          enquiry={enquiry}
          onViewDetails={onViewDetails}
          onStatusChange={onStatusChange}
          onEditNotes={onEditNotes}
        />
      ))}
    </div>
  );
}

function CounselorEnterpriseEnquiryRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card md:flex-row md:items-center md:gap-6">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-40" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-4 w-24 hidden md:block" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-4 w-24 hidden md:block" />
      <Skeleton className="h-8 w-24 ml-auto" />
    </div>
  );
}

interface CounselorEnterpriseEnquiryListHeaderProps {
  className?: string;
}

export function CounselorEnterpriseEnquiryListHeader({ className }: CounselorEnterpriseEnquiryListHeaderProps) {
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
      <div className="min-w-[90px]">Status</div>
      <div className="min-w-[100px]">Date</div>
      <div className="w-[80px]">Actions</div>
    </div>
  );
}
