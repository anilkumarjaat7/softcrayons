"use client";

import {
  Card,
  Metric,
  Text,
  Flex,
  BadgeDelta,
} from "@tremor/react";
import {
  Users,
  AlertTriangle,
  IndianRupee,
  Trophy,
} from "lucide-react";
import type { DashboardData } from "./types";

interface KPICardsProps {
  kpi: DashboardData["kpi"];
}

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toFixed(0)}`;
};

export function KPICards({ kpi }: KPICardsProps) {
  const conversionRate = kpi.totalEnquiries > 0
    ? ((kpi.enrolledEnquiries / kpi.totalEnquiries) * 100).toFixed(1)
    : "0";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Card decoration="top" decorationColor="blue" className="!bg-card !ring-border/60">
        <Flex justifyContent="between" alignItems="center">
          <Text className="!text-muted-foreground">Active Students</Text>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-200 dark:bg-blue-500/30">
            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
        </Flex>
        <Metric className="mt-2 !text-foreground">{kpi.totalStudents.toLocaleString("en-IN")}</Metric>
        <Flex justifyContent="start" className="mt-3 gap-2">
          <BadgeDelta deltaType={parseFloat(kpi.studentGrowth) >= 0 ? "moderateIncrease" : "moderateDecrease"} size="xs">
            {kpi.studentGrowth}
          </BadgeDelta>
        </Flex>
      </Card>

      <Card decoration="top" decorationColor="orange" className="!bg-card !ring-border/60">
        <Flex justifyContent="between" alignItems="center">
          <Text className="!text-muted-foreground">Pending Enquiries</Text>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-200 dark:bg-orange-500/30">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
        </Flex>
        <Metric className="mt-2 !text-foreground">{kpi.pendingEnquiries}</Metric>
        <Flex justifyContent="start" className="mt-3 gap-2">
          <BadgeDelta deltaType={kpi.pendingEnquiries > 10 ? "increase" : "unchanged"} size="xs">
            Action Required
          </BadgeDelta>
        </Flex>
      </Card>

      <Card decoration="top" decorationColor="emerald" className="!bg-card !ring-border/60">
        <Flex justifyContent="between" alignItems="center">
          <Text className="!text-muted-foreground">Total Revenue (Est.)</Text>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-200 dark:bg-emerald-500/30">
            <IndianRupee className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </Flex>
        <Metric className="mt-2 !text-foreground">{formatCurrency(kpi.totalRevenue)}</Metric>
        <Flex justifyContent="start" className="mt-3 gap-2">
          <BadgeDelta deltaType="moderateIncrease" size="xs">
            {kpi.enrolledEnquiries} enrolled
          </BadgeDelta>
        </Flex>
      </Card>

      <Card decoration="top" decorationColor="fuchsia" className="!bg-card !ring-border/60">
        <Flex justifyContent="between" alignItems="center">
          <Text className="!text-muted-foreground">Placements</Text>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-200 dark:bg-purple-500/30">
            <Trophy className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </Flex>
        <Metric className="mt-2 !text-foreground">{kpi.totalPlacements}</Metric>
        <Flex justifyContent="start" className="mt-3 gap-2">
          <BadgeDelta deltaType={parseFloat(conversionRate) > 50 ? "moderateIncrease" : "unchanged"} size="xs">
            {conversionRate}% conversion
          </BadgeDelta>
        </Flex>
      </Card>
    </div>
  );
}
