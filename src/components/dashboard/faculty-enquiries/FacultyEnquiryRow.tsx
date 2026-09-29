"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  UserCheck,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Phone,
  Mail,
  FileText,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type FacultyEnquiryStatus = "NEW" | "CONTACTED" | "HIRED" | "CLOSED" | "ARCHIVED";

export interface FacultyEnquiryUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
}

export interface FacultyEnquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  resume: string | null;
  availableDate: Date | null;
  message: string | null;
  note: string | null;
  remark: string | null;
  status: FacultyEnquiryStatus;
  assignedTo: FacultyEnquiryUser | null;
  assignedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface FacultyEnquiryRowProps {
  enquiry: FacultyEnquiry;
  onViewDetails?: (enquiry: FacultyEnquiry) => void;
  onAssignHR?: (enquiry: FacultyEnquiry) => void;
  onStatusChange?: (enquiry: FacultyEnquiry, status: FacultyEnquiryStatus) => void;
  onEditNotes?: (enquiry: FacultyEnquiry) => void;
  onDelete?: (enquiry: FacultyEnquiry) => void;
}

const statusColors: Record<FacultyEnquiryStatus, string> = {
  NEW: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  CONTACTED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  HIRED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  CLOSED: "bg-red-500/10 text-red-600 border-red-500/20",
  ARCHIVED: "bg-muted text-muted-foreground border-muted",
};

const statusLabels: Record<FacultyEnquiryStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  HIRED: "Hired",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
};

const STATUS_OPTIONS: FacultyEnquiryStatus[] = ["NEW", "CONTACTED", "HIRED", "CLOSED", "ARCHIVED"];

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

export function FacultyEnquiryRow({
  enquiry,
  onViewDetails,
  onAssignHR,
  onStatusChange,
  onEditNotes,
  onDelete,
}: FacultyEnquiryRowProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-xl border border-border bg-card hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-4 md:hidden">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(enquiry.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-foreground truncate">{enquiry.name}</span>
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
            <span>{enquiry.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{enquiry.email}</span>
          </div>
          {enquiry.resume && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <FileText className="h-3 w-3" />
              <a href={enquiry.resume} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                View Resume
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:flex md:items-center md:gap-6">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {getInitials(enquiry.name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-[150px]">
          <div className="font-semibold text-foreground">{enquiry.name}</div>
        </div>

        <div className="min-w-[180px]">
          <div className="text-sm text-muted-foreground">{enquiry.email}</div>
          <div className="text-sm text-muted-foreground">{enquiry.phone}</div>
        </div>

        <div className="min-w-[100px]">
          {enquiry.resume ? (
            <a 
              href={enquiry.resume} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <FileText className="h-3 w-3" />
              Resume
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>

        <div className="min-w-[100px] flex-1">
          {enquiry.availableDate ? (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {formatDate(enquiry.availableDate)}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>

        <div className="min-w-[130px]">
          {enquiry.assignedTo ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={enquiry.assignedTo.image || undefined} />
                <AvatarFallback className="text-[10px] bg-emerald-500/10 text-emerald-600">
                  {getInitials(enquiry.assignedTo.name || enquiry.assignedTo.email)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm truncate">{enquiry.assignedTo.name || enquiry.assignedTo.email}</span>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Unassigned</span>
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
              onClick={() => onAssignHR?.(enquiry)}
              title="Assign HR"
            >
              <UserCheck className="h-4 w-4" />
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
                <DropdownMenuItem onClick={() => onAssignHR?.(enquiry)}>
                  <UserCheck className="h-4 w-4 mr-2" />
                  Assign HR
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEditNotes?.(enquiry)}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Edit Notes
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete?.(enquiry)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onAssignHR?.(enquiry)}>
              <UserCheck className="h-4 w-4 mr-2" />
              Assign HR
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditNotes?.(enquiry)}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Edit Notes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(enquiry)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
