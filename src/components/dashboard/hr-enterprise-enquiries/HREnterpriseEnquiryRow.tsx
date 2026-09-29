"use client";

import * as React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Mail,
  Building2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type EnterpriseEnquiryStatus = "NEW" | "CONTACTED" | "COMPLETED" | "CLOSED" | "ARCHIVED";

export interface EnterpriseEnquiryUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
}

export interface EnterpriseEnquiry {
  id: number;
  companyName: string;
  email: string;
  phone: string;
  duration: string | null;
  message: string | null;
  note: string | null;
  remark: string | null;
  status: EnterpriseEnquiryStatus;
  assignedTo: EnterpriseEnquiryUser | null;
  createdAt: Date;
  updatedAt: Date;
}

interface HREnterpriseEnquiryRowProps {
  enquiry: EnterpriseEnquiry;
  onViewDetails?: (enquiry: EnterpriseEnquiry) => void;
  onStatusChange?: (enquiry: EnterpriseEnquiry, status: EnterpriseEnquiryStatus) => void;
  onEditNotes?: (enquiry: EnterpriseEnquiry) => void;
}

const statusColors: Record<EnterpriseEnquiryStatus, string> = {
  NEW: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  CONTACTED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  COMPLETED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  CLOSED: "bg-red-500/10 text-red-600 border-red-500/20",
  ARCHIVED: "bg-muted text-muted-foreground border-muted",
};

const statusLabels: Record<EnterpriseEnquiryStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  COMPLETED: "Completed",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
};

const STATUS_OPTIONS: EnterpriseEnquiryStatus[] = ["NEW", "CONTACTED", "COMPLETED", "CLOSED", "ARCHIVED"];

function getInitials(name: string): string {
  const parts = name.split(" ");
  return parts
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function HREnterpriseEnquiryRow({
  enquiry,
  onViewDetails,
  onStatusChange,
  onEditNotes,
}: HREnterpriseEnquiryRowProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-4 md:hidden">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(enquiry.companyName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground truncate">{enquiry.companyName}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Badge variant="outline" className={cn("text-xs cursor-pointer", statusColors[enquiry.status])}>
                    {statusLabels[enquiry.status]}
                  </Badge>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36">
                {STATUS_OPTIONS.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => onStatusChange?.(enquiry, status)}
                    className={cn(enquiry.status === status && "bg-primary/10")}
                  >
                    <Badge variant="outline" className={cn("font-medium text-xs", statusColors[status])}>
                      {statusLabels[status]}
                    </Badge>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-3 w-3" />
            <a href={`tel:${enquiry.phone}`} className="hover:text-primary">{enquiry.phone}</a>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{enquiry.email}</span>
          </div>
          {enquiry.duration && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Clock className="h-3 w-3" />
              <span className="truncate">{enquiry.duration}</span>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex md:items-center md:gap-6">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            <Building2 className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-[180px]">
          <div className="font-semibold text-foreground">{enquiry.companyName}</div>
        </div>

        <div className="min-w-[180px]">
          <div className="text-sm text-muted-foreground">{enquiry.email}</div>
          <a href={`tel:${enquiry.phone}`} className="text-sm text-muted-foreground hover:text-primary">{enquiry.phone}</a>
        </div>

        <div className="min-w-[120px] flex-1">
          {enquiry.duration ? (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {enquiry.duration}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>

        <div className="min-w-[90px]">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded">
                <Badge 
                  variant="outline" 
                  className={cn("font-medium cursor-pointer hover:opacity-80 transition-opacity", statusColors[enquiry.status])}
                >
                  {statusLabels[enquiry.status]}
                </Badge>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36">
              {STATUS_OPTIONS.map((status) => (
                <DropdownMenuItem
                  key={status}
                  onClick={() => onStatusChange?.(enquiry, status)}
                  className={cn(
                    "cursor-pointer",
                    enquiry.status === status && "bg-primary/10"
                  )}
                >
                  <Badge 
                    variant="outline" 
                    className={cn("font-medium text-xs", statusColors[status])}
                  >
                    {statusLabels[status]}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="min-w-[100px] text-sm text-muted-foreground">
          {formatDate(enquiry.createdAt)}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onViewDetails?.(enquiry)}
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onEditNotes?.(enquiry)}
              title="Edit Notes"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>

          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewDetails?.(enquiry)}>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditNotes?.(enquiry)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Edit Notes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 md:hidden">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onViewDetails?.(enquiry)}
        >
          <Eye className="h-4 w-4 mr-2" />
          View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditNotes?.(enquiry)}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
