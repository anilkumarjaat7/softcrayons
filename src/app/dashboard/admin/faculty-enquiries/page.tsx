"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FacultyEnquiryList,
  FacultyEnquiryListHeader,
  ViewFacultyDetailsDialog,
  AssignHRDialog,
  EditFacultyNotesDialog,
  DeleteFacultyEnquiryDialog,
  type FacultyEnquiry,
  type FacultyEnquiryStatus,
} from "@/components/dashboard/faculty-enquiries";
import { Search, RefreshCw } from "lucide-react";
import { toast } from "sonner";

type StatusTab = FacultyEnquiryStatus | "ALL" | "ASSIGNED";

const STATUS_TABS: { label: string; value: StatusTab }[] = [
  { label: "All", value: "ALL" },
  { label: "New", value: "NEW" },
  { label: "Assigned", value: "ASSIGNED" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Hired", value: "HIRED" },
  { label: "Closed", value: "CLOSED" },
  { label: "Archived", value: "ARCHIVED" },
];

export default function FacultyEnquiriesPage() {
  const [activeTab, setActiveTab] = React.useState<StatusTab>("ALL");
  const [enquiries, setEnquiries] = React.useState<FacultyEnquiry[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [counts, setCounts] = React.useState<Record<string, number>>({});
  const pageSize = 20;

  const [selectedEnquiry, setSelectedEnquiry] = React.useState<FacultyEnquiry | null>(null);
  const [viewDetailsOpen, setViewDetailsOpen] = React.useState(false);
  const [assignHROpen, setAssignHROpen] = React.useState(false);
  const [editNotesOpen, setEditNotesOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [actionLoading, setActionLoading] = React.useState(false);

  const fetchCounts = React.useCallback(async () => {
    try {
      const response = await fetch("/api/admin/faculty-enquiries?counts=true");
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

      if (activeTab === "NEW") {
        params.set("status", "NEW");
        params.set("subStatus", "unassigned");
      } else if (activeTab === "ASSIGNED") {
        params.set("status", "NEW");
        params.set("subStatus", "assigned");
      } else if (activeTab !== "ALL") {
        params.set("status", activeTab);
      }

      const response = await fetch(`/api/admin/faculty-enquiries?${params.toString()}`);
      const data = await response.json();

      if (!data.success) {
        toast.error("Failed to fetch faculty enquiries");
        return;
      }

      setEnquiries(data.data);
      setTotal(data.total);
    } catch {
      toast.error("Failed to fetch faculty enquiries");
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

  const handleViewDetails = (enquiry: FacultyEnquiry) => {
    setSelectedEnquiry(enquiry);
    setViewDetailsOpen(true);
  };

  const handleAssignHR = (enquiry: FacultyEnquiry) => {
    setSelectedEnquiry(enquiry);
    setAssignHROpen(true);
  };

  const handleStatusChange = async (enquiry: FacultyEnquiry, status: FacultyEnquiryStatus) => {
    try {
      const response = await fetch(`/api/admin/faculty-enquiries/${enquiry.id}`, {
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

  const handleEditNotes = (enquiry: FacultyEnquiry) => {
    setSelectedEnquiry(enquiry);
    setEditNotesOpen(true);
  };

  const handleDelete = (enquiry: FacultyEnquiry) => {
    setSelectedEnquiry(enquiry);
    setDeleteOpen(true);
  };

  const confirmAssignHR = async (enquiryId: number, hrId: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/faculty-enquiries/${enquiryId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: hrId }),
      });

      const data = await response.json();
      if (!data.success) {
        toast.error(data.error || "Failed to assign HR");
        return;
      }

      toast.success("HR assigned successfully");
      setAssignHROpen(false);
      fetchEnquiries();
      fetchCounts();
    } catch {
      toast.error("Failed to assign HR");
    } finally {
      setActionLoading(false);
    }
  };

  const confirmEditNotes = async (enquiryId: number, note: string, remark: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/faculty-enquiries/${enquiryId}`, {
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

  const confirmDelete = async (enquiryId: number) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/faculty-enquiries/${enquiryId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!data.success) {
        toast.error(data.error || "Failed to delete enquiry");
        return;
      }

      toast.success("Enquiry deleted successfully");
      setDeleteOpen(false);
      fetchEnquiries();
      fetchCounts();
    } catch {
      toast.error("Failed to delete enquiry");
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / pageSize);

  const getTabCount = (tab: StatusTab): number | undefined => {
    if (tab === "ALL") return counts.TOTAL;
    if (tab === "NEW") return counts.NEW_UNASSIGNED;
    if (tab === "ASSIGNED") return counts.NEW_ASSIGNED;
    return counts[tab];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Faculty Enquiries</h1>
          <p className="text-sm text-muted-foreground">
            Manage faculty applications and hiring enquiries
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or phone..."
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
        <FacultyEnquiryListHeader />
        <FacultyEnquiryList
          enquiries={enquiries}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onAssignHR={handleAssignHR}
          onStatusChange={handleStatusChange}
          onEditNotes={handleEditNotes}
          onDelete={handleDelete}
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

      <ViewFacultyDetailsDialog
        enquiry={selectedEnquiry}
        open={viewDetailsOpen}
        onOpenChange={setViewDetailsOpen}
      />
      <AssignHRDialog
        enquiry={selectedEnquiry}
        open={assignHROpen}
        onOpenChange={setAssignHROpen}
        onConfirm={confirmAssignHR}
        isLoading={actionLoading}
      />
      <EditFacultyNotesDialog
        enquiry={selectedEnquiry}
        open={editNotesOpen}
        onOpenChange={setEditNotesOpen}
        onConfirm={confirmEditNotes}
        isLoading={actionLoading}
      />
      <DeleteFacultyEnquiryDialog
        enquiry={selectedEnquiry}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        isLoading={actionLoading}
      />
    </div>
  );
}
