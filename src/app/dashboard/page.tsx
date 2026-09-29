"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/providers";
import { Skeleton } from "@/components/ui/skeleton";

const roleRoutes: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  STUDENT: "/dashboard/student",
  INSTRUCTOR: "/dashboard/instructor",
  COUNSELOR: "/dashboard/counselor",
  HR: "/dashboard/hr",
  CONTENT_WRITER: "/dashboard/content-writer",
  AGENT: "/dashboard/agent",
};

export default function DashboardRedirect() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/sign-in");
      } else if (user?.role) {
        const targetRoute = roleRoutes[user.role] || "/dashboard/student";
        router.replace(targetRoute);
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
        <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
