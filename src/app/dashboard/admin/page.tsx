"use client";

import { useEffect, useState } from "react";
import {
  KPICards,
  EnquiryFunnel,
  UnassignedLeads,
  TopAgents,
  LeadSourceChart,
  PopularCourses,
  RevenueByCategory,
  CourseDifficultyDistribution,
  HiringPipeline,
  TopFaculty,
  BlogActivity,
  ContentStats,
  LiveSessions,
  UserRegistrationTrend,
  UsersByRole,
} from "@/components/dashboard/admin";
import type { DashboardData } from "@/components/dashboard/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCcw, LayoutDashboard } from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/dashboard");
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load");
      setData(json.data);
      setLastUpdated(new Date());
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-lg font-semibold text-destructive">
            Failed to load dashboard
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Button
            onClick={fetchData}
            variant="outline"
            className="mt-4"
            size="sm"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <LayoutDashboard className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Admin Dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              Real-time business overview
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={fetchData}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <KPICards kpi={data.kpi} />

      <SectionHeader
        title="CRM & Sales"
        description="Enquiry pipeline & agent performance"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <EnquiryFunnel crm={data.crm} />
        <UnassignedLeads crm={data.crm} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <TopAgents crm={data.crm} />
        <LeadSourceChart crm={data.crm} />
      </div>

      <SectionHeader
        title="Course & Product Performance"
        description="What's driving the business"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <PopularCourses data={data.coursePerformance} />
        <RevenueByCategory data={data.coursePerformance} />
      </div>
      <div className="grid gap-6 lg:grid-cols-1">
        <CourseDifficultyDistribution data={data.coursePerformance} />
      </div>

      <SectionHeader
        title="HR & Faculty Management"
        description="Recruitment pipeline & faculty performance"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <HiringPipeline hr={data.hr} />
        <TopFaculty hr={data.hr} />
      </div>

      <SectionHeader
        title="Content & Marketing"
        description="Blog & testimonial activity"
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <BlogActivity content={data.content} />
        <ContentStats content={data.content} />
      </div>

      <SectionHeader
        title="System Health & Security"
        description="Live sessions & user trends"
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <LiveSessions system={data.system} />
        <div className="lg:col-span-2">
          <UserRegistrationTrend system={data.system} />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-1">
        <UsersByRole system={data.system} />
      </div>
    </div>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="pt-2">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/60 bg-card/80 p-4"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
            <Skeleton className="mt-3 h-5 w-16" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border/60 bg-card/80 p-5"
          >
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-4 w-28" />
            <Skeleton className="mt-4 h-48 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
