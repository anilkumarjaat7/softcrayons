"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  HelpCircle,
  LayoutDashboard,
  MessageSquare,
  MessagesSquare,
  PenBox,
  Settings,
  ShieldHalf,
  Users,
  UserCog,
  UserCircle,
  ClipboardList,
  GraduationCap,
} from "lucide-react";
import { DashboardSidePanel, type DashboardNavItem, type DashboardUser } from "@/components/dashboard/SidePanel";
import { useAuth } from "@/components/providers";
import { Skeleton } from "@/components/ui/skeleton";

const navItems: DashboardNavItem[] = [
  { title: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Enquiries", href: "/dashboard/admin/enquiries", icon: ClipboardList },
  { title: "Faculty Enquiries", href: "/dashboard/admin/faculty-enquiries", icon: GraduationCap },
  { title: "Enterprise Enquiries", href: "/dashboard/admin/enterprise-enquiries", icon: Building2 },
  { 
    title: "Blogs", 
    href: "/dashboard/admin/blogs", 
    icon: PenBox,
    subItems: [
      { title: "All Blogs", href: "/dashboard/admin/blogs" },
      { title: "Categories", href: "/dashboard/admin/blogs/categories" },
    ]
  },
  { 
    title: "Courses", 
    href: "/dashboard/admin/courses", 
    icon: BookOpen,
    subItems: [
      { title: "All Courses", href: "/dashboard/admin/courses" },
      { title: "Categories", href: "/dashboard/admin/courses/categories" },
    ]
  },
  { 
    title: "Tutorials", 
    href: "/dashboard/admin/tutorials", 
    icon: BookOpen,
    subItems: [
      { title: "Overview", href: "/dashboard/admin/tutorials" },
      { title: "Categories", href: "/dashboard/admin/tutorials/categories" },
      { title: "Topics", href: "/dashboard/admin/tutorials/topics" },
      { title: "Subtopics", href: "/dashboard/admin/tutorials/subtopics" },
      { title: "Lessons", href: "/dashboard/admin/tutorials/lessons" },
    ]
  },
  { 
    title: "FAQs", 
    href: "/dashboard/admin/faqs", 
    icon: HelpCircle,
    subItems: [
      { title: "All FAQs", href: "/dashboard/admin/faqs" },
      { title: "Categories", href: "/dashboard/admin/faqs/categories" },
    ]
  },
  { 
    title: "Placements", 
    href: "/dashboard/admin/placements", 
    icon: Award,
  },
  { 
    title: "Testimonials", 
    href: "/dashboard/admin/testimonials", 
    icon: MessageSquare,
  },
  { title: "Faculties", href: "/dashboard/admin/faculties", icon: Briefcase },
  { title: "Users", href: "/dashboard/admin/users", icon: UserCog },
  { title: "Profile", href: "/dashboard/admin/profile", icon: UserCircle },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/sign-in");
      } else if (user?.role !== "ADMIN") {
        router.replace("/dashboard");
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
            {Array.from({ length: 6 }).map((_, i) => (
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

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  const dashboardUser: DashboardUser = {
    name: user.name || "Admin User",
    email: user.email,
    role: user.role,
    status: user.banned ? "inactive" : "active",
    image: user.image || undefined,
  };

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidePanel
        brand={{ name: "SoftCrayons", logo: "https://i.ibb.co/bMMh6s8F/new-logo-png-Copy.png", href: "/", label: "Admin" }}
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
