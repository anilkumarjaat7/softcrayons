"use client";

import * as React from "react";
import { HREnterpriseEnquiryRow, type EnterpriseEnquiry } from "./HREnterpriseEnquiryRow";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HREnterpriseEnquiryListProps {
  enquiries: EnterpriseEnquiry[];
  isLoading?: boolean;
  onViewDetails?: (enquiry: EnterpriseEnquiry) => void;
  onStatusChange?: (enquiry: EnterpriseEnquiry, status: EnterpriseEnquiry["status"]) => void;
  onEditNotes?: (enquiry: EnterpriseEnquiry) => void;
  className?: string;
}

export function HREnterpriseEnquiryList({
  enquiries,
  isLoading = false,
  onViewDetails,
  onStatusChange,
  onEditNotes,
  className,
}: HREnterpriseEnquiryListProps) {
  if (isLoading) {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <HREnterpriseEnquiryRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Building2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold text-foreground">No enterprise enquiries found</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enterprise enquiries assigned to you will appear here
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-3", className)}>
      {enquiries.map((enquiry) => (
        <HREnterpriseEnquiryRow
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

function HREnterpriseEnquiryRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card md:flex-row md:items-center md:gap-6">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 w-32" />
      <div className="space-y-1">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-4 w-20 hidden md:block" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-4 w-24 hidden md:block" />
      <Skeleton className="h-8 w-24 ml-auto" />
    </div>
  );
}

interface HREnterpriseEnquiryListHeaderProps {
  className?: string;
}

export function HREnterpriseEnquiryListHeader({ className }: HREnterpriseEnquiryListHeaderProps) {
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
      <div className="w-[100px] text-right">Actions</div>
    </div>
  );
}
