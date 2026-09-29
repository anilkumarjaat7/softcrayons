"use client";

import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type EnquiryStatus = "NEW" | "CONTACTED" | "ENROLLED" | "DEAD" | "ARCHIVED";

export interface EnquiryUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
}

export interface EnquiryCourse {
  id: number;
  title: string;
  slug: string;
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  note: string | null;
  remark: string | null;
  status: EnquiryStatus;
  course: EnquiryCourse | null;
  assignedTo: EnquiryUser | null;
  agent: EnquiryUser | null;
  assignedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CounselorEnquiryRowProps {
  enquiry: Enquiry;
  onViewDetails?: (enquiry: Enquiry) => void;
  onStatusChange?: (enquiry: Enquiry, status: EnquiryStatus) => void;
  onEditNotes?: (enquiry: Enquiry) => void;
}

const statusColors: Record<EnquiryStatus, string> = {
  NEW: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  CONTACTED: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  ENROLLED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  DEAD: "bg-red-500/10 text-red-600 border-red-500/20",
  ARCHIVED: "bg-muted text-muted-foreground border-muted",
};

const statusLabels: Record<EnquiryStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  ENROLLED: "Enrolled",
  DEAD: "Dead",
  ARCHIVED: "Archived",
};

const STATUS_OPTIONS: EnquiryStatus[] = ["NEW", "CONTACTED", "ENROLLED", "DEAD", "ARCHIVED"];

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

export function CounselorEnquiryRow({
  enquiry,
  onViewDetails,
  onStatusChange,
  onEditNotes,
}: CounselorEnquiryRowProps) {
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
            <a href={`tel:${enquiry.phone}`} className="hover:text-primary">{enquiry.phone}</a>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span className="truncate">{enquiry.email}</span>
          </div>
          {enquiry.course && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <BookOpen className="h-3 w-3" />
              <span className="truncate">{enquiry.course.title}</span>
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
          <a href={`tel:${enquiry.phone}`} className="text-sm text-muted-foreground hover:text-primary">{enquiry.phone}</a>
        </div>

        <div className="min-w-[150px] flex-1">
          {enquiry.course ? (
            <span className="text-sm">{enquiry.course.title}</span>
          ) : (
            <span className="text-sm text-muted-foreground">—</span>
          )}
        </div>

        <div className="min-w-[100px]">
          {enquiry.agent ? (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={enquiry.agent.image || undefined} />
                <AvatarFallback className="text-[10px] bg-amber-500/10 text-amber-600">
                  {getInitials(enquiry.agent.name || enquiry.agent.email)}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm truncate">{enquiry.agent.name || enquiry.agent.email}</span>
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
