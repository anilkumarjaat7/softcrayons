"use client";

import * as React from "react";
import { HRFacultyEnquiryRow, type FacultyEnquiry, type FacultyEnquiryStatus } from "./HRFacultyEnquiryRow";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface HRFacultyEnquiryListProps {
  enquiries: FacultyEnquiry[];
  isLoading?: boolean;
  onViewDetails?: (enquiry: FacultyEnquiry) => void;
  onStatusChange?: (enquiry: FacultyEnquiry, status: FacultyEnquiryStatus) => void;
  onEditNotes?: (enquiry: FacultyEnquiry) => void;
  className?: string;
}

export function HRFacultyEnquiryList({
  enquiries,
  isLoading = false,
  onViewDetails,
  onStatusChange,
  onEditNotes,
  className,
}: HRFacultyEnquiryListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <HRFacultyEnquiryRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className={cn("py-12 text-center", className)}>
        <div className="text-muted-foreground">No faculty enquiries assigned to you</div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {enquiries.map((enquiry) => (
        <HRFacultyEnquiryRow
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

function HRFacultyEnquiryRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card md:flex-row md:items-center md:gap-6">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-32" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-4 w-20 hidden md:block" />
      <Skeleton className="h-4 w-24 hidden md:block" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-4 w-24 hidden md:block" />
      <Skeleton className="h-8 w-24 ml-auto" />
    </div>
  );
}

interface HRFacultyEnquiryListHeaderProps {
  className?: string;
}

export function HRFacultyEnquiryListHeader({ className }: HRFacultyEnquiryListHeaderProps) {
  return (
    <div
      className={cn(
        "hidden md:flex items-center gap-6 px-4 py-2 text-sm font-medium text-muted-foreground",
        className
      )}
    >
      <div className="w-10" /> {/* Avatar placeholder */}
      <div className="min-w-[150px]">Name</div>
      <div className="min-w-[180px]">Contact</div>
      <div className="min-w-[80px]">Resume</div>
      <div className="min-w-[100px] flex-1">Available</div>
      <div className="min-w-[90px]">Status</div>
      <div className="min-w-[100px]">Date</div>
      <div className="w-[100px] text-right">Actions</div>
    </div>
  );
}
