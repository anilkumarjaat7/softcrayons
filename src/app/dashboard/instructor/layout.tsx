"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  LayoutDashboard,
  UserCircle,
  BookOpen,
  Users,
  Calendar,
  FileText,
} from "lucide-react";
import { DashboardSidePanel, type DashboardNavItem, type DashboardUser } from "@/components/dashboard/SidePanel";
import { useAuth } from "@/components/providers";
import { Skeleton } from "@/components/ui/skeleton";

const navItems: DashboardNavItem[] = [
  { title: "Overview", href: "/dashboard/instructor", icon: LayoutDashboard },
  { title: "My Courses", href: "/dashboard/instructor/courses", icon: BookOpen },
  { title: "My Students", href: "/dashboard/instructor/students", icon: Users },
  { title: "Schedule", href: "/dashboard/instructor/schedule", icon: Calendar },
  { title: "My Blogs", href: "/dashboard/instructor/blogs", icon: FileText },
  { title: "Profile", href: "/dashboard/instructor/profile", icon: UserCircle },
];

export default function InstructorLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/sign-in");
      } else if (user?.role !== "INSTRUCTOR") {
        const roleRoutes: Record<string, string> = {
          ADMIN: "/dashboard/admin",
          STUDENT: "/dashboard/student",
          COUNSELOR: "/dashboard/counselor",
          HR: "/dashboard/hr",
          CONTENT_WRITER: "/dashboard/content-writer",
          AGENT: "/dashboard/agent",
        };
        router.replace(roleRoutes[user?.role || ""] || "/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <div className="w-[280px] border-r border-border bg-card p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <main className="flex-1 bg-muted/30 p-6">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-64 w-full" />
        </main>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "INSTRUCTOR") {
    return null;
  }

  const dashboardUser: DashboardUser = {
    name: user.name || "Instructor",
    email: user.email,
    role: user.role,
    status: user.banned ? "inactive" : "active",
    image: user.image || undefined,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidePanel
        brand={{ name: "SoftCrayons", logo: "https://i.ibb.co/bMMh6s8F/new-logo-png-Copy.png", href: "/", label: "Instructor" }}
        navItems={navItems}
        user={dashboardUser}
      />
      <main className="flex-1 bg-muted/30 overflow-auto">
        <div className="p-4 lg:p-6">
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
