"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CounselorEnterpriseEnquiryList,
  CounselorEnterpriseEnquiryListHeader,
  CounselorEnterpriseViewDetailsDialog,
  CounselorEnterpriseEditNotesDialog,
  type EnterpriseEnquiry,
  type EnterpriseEnquiryStatus,
} from "@/components/dashboard/counselor-enterprise-enquiries";
import { Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type StatusTab = EnterpriseEnquiryStatus | "ALL";

const STATUS_TABS: { label: string; value: StatusTab }[] = [
  { label: "All", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Closed", value: "CLOSED" },
  { label: "Archived", value: "ARCHIVED" },
];

export default function CounselorEnterpriseEnquiriesPage() {
  const [activeTab, setActiveTab] = React.useState<StatusTab>("ALL");
  const [enquiries, setEnquiries] = React.useState<EnterpriseEnquiry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const pageSize = 20;

  const [selectedEnquiry, setSelectedEnquiry] = React.useState<EnterpriseEnquiry | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = React.useState(false);
  const [editNotesOpen, setEditNotesOpen] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);

  const fetchCounts = React.useCallback(async () => {
    try {
      const response = await fetch("/api/counselor/enterprise-enquiries?counts=true");
      const data = await response.json();
      if (data.success) {
        setCounts(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch counts:", error);
    }
  }, []);

  const fetchEnquiries = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(currentPage));
      params.set("limit", String(pageSize));

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      if (activeTab !== "ALL") {
        params.set("status", activeTab);
      }

      const response = await fetch(`/api/counselor/enterprise-enquiries?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        toast.error("Failed to fetch enterprise enquiries");
        return;
      }

      setEnquiries(data.data);
      setTotal(data.total);
    } catch {
      toast.error("Failed to fetch enterprise enquiries");
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, searchQuery, currentPage]);

  React.useEffect(() => {
    fetchEnquiries();
    fetchCounts();
  }, [fetchEnquiries, fetchCounts]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const handleViewDetails = (enquiry: EnterpriseEnquiry) => {
    setSelectedEnquiry(enquiry);
    setViewDetailsOpen(true);
  };

  const handleStatusChange = async (enquiry: EnterpriseEnquiry, status: EnterpriseEnquiryStatus) => {
    try {
      const response = await fetch(`/api/counselor/enterprise-enquiries/${enquiry.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();
      if (!data.success) {
        toast.error(data.error || "Failed to update status");
        return;
      }

      toast.success("Status updated successfully");
      fetchEnquiries();
      fetchCounts();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleEditNotes = (enquiry: EnterpriseEnquiry) => {
    setSelectedEnquiry(enquiry);
    setEditNotesOpen(true);
  };

  const confirmEditNotes = async (enquiryId: number, note: string, remark: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/counselor/enterprise-enquiries/${enquiryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, remark }),
      });

      const data = await response.json();
      if (!data.success) {
        toast.error(data.error || "Failed to save notes");
        return;
      }

      toast.success("Notes saved successfully");
      setEditNotesOpen(false);
      fetchEnquiries();
    } catch {
      toast.error("Failed to save notes");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const getTabCount = (tab: StatusTab): number | undefined => {
    if (tab === "ALL") return counts.TOTAL;
    return counts[tab];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Enterprise Enquiries</h1>
          <p className="text-sm text-muted-foreground">
            Manage corporate training and enterprise enquiries assigned to you
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by company, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            fetchEnquiries();
            fetchCounts();
          }}
          disabled={isLoading}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </div>

      <div className="border-b border-border overflow-x-auto">
        <div className="flex min-w-max">
          {STATUS_TABS.map((tab) => {
            const count = getTabCount(tab.value);
            return (
              <button
                key={tab.value}
                className={cn(
                  "px-4 py-2 font-semibold text-sm transition-colors duration-200 border-b-2 -mb-px whitespace-nowrap flex items-center gap-2",
                  activeTab === tab.value
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-primary/80"
                )}
                onClick={() => setActiveTab(tab.value)}
                type="button"
              >
                {tab.label}
                {count !== undefined && (
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded-full",
                    activeTab === tab.value
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <CounselorEnterpriseEnquiryListHeader />
        <CounselorEnterpriseEnquiryList
          enquiries={enquiries}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onStatusChange={handleStatusChange}
          onEditNotes={handleEditNotes}
        />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      )}

      <CounselorEnterpriseViewDetailsDialog
        enquiry={selectedEnquiry}
        open={viewDetailsOpen}
        onOpenChange={setViewDetailsOpen}
      />
      <CounselorEnterpriseEditNotesDialog
        enquiry={selectedEnquiry}
        open={editNotesOpen}
        onOpenChange={setEditNotesOpen}
        onConfirm={confirmEditNotes}
        isLoading={actionLoading}
      />
    </div>
  );
}
