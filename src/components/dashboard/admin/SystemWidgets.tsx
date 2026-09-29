"use client";

import {
  Card,
  Title,
  Text,
  Flex,
  AreaChart,
  Badge,
  DonutChart,
  Metric,
} from "@tremor/react";
import { Activity, UserPlus, Shield } from "lucide-react";
import type { DashboardData } from "./types";

interface SystemWidgetsProps {
  system: DashboardData["system"];
}

export function LiveSessions({ system }: SystemWidgetsProps) {
  return (
    <Card className="!bg-card !ring-border/60" decoration="top" decorationColor="emerald">
      <Flex justifyContent="between" alignItems="center">
        <div>
          <Title className="!text-foreground">Live Users</Title>
          <Text className="!text-muted-foreground">Active sessions now</Text>
        </div>
        <div className="relative flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
          </span>
          <Badge color="emerald" icon={Activity}>
            Live
          </Badge>
        </div>
      </Flex>
      <Metric className="mt-4 !text-foreground !text-5xl text-center">
        {system.activeSessions}
      </Metric>
      <Text className="mt-2 text-center !text-muted-foreground">
        active sessions
      </Text>
    </Card>
  );
}

export function UserRegistrationTrend({ system }: SystemWidgetsProps) {
  const totalNewUsers = system.userRegistrationTrend.reduce(
    (s, d) => s + d.registrations,
    0
  );

  return (
    <Card className="!bg-card !ring-border/60">
      <Flex justifyContent="between" alignItems="center">
        <div>
          <Title className="!text-foreground">User Registrations</Title>
          <Text className="!text-muted-foreground">Last 30 days</Text>
        </div>
        <Badge color="blue" icon={UserPlus}>
          {totalNewUsers} new
        </Badge>
      </Flex>
      <AreaChart
        className="mt-4 h-48"
        data={system.userRegistrationTrend}
        index="date"
        categories={["registrations"]}
        colors={["violet"]}
        showAnimation
        showGridLines={false}
        curveType="monotone"
        showXAxis={false}
        showYAxis={true}
        yAxisWidth={30}
      />
    </Card>
  );
}

export function UsersByRole({ system }: SystemWidgetsProps) {
  const roleLabels: Record<string, string> = {
    ADMIN: "Admin",
    STUDENT: "Student",
    INSTRUCTOR: "Instructor",
    COUNSELOR: "Counselor",
    HR: "HR",
    CONTENT_WRITER: "Content Writer",
    AGENT: "Agent",
  };

  const data = system.usersByRole.map((r) => ({
    name: roleLabels[r.role] || r.role,
    value: r.count,
  }));

  return (
    <Card className="!bg-card !ring-border/60">
      <Flex justifyContent="between" alignItems="center">
        <div>
          <Title className="!text-foreground">Users by Role</Title>
          <Text className="!text-muted-foreground">Role distribution</Text>
        </div>
        <Badge color="slate" icon={Shield}>
          {data.reduce((s, d) => s + d.value, 0)} total
        </Badge>
      </Flex>
      {data.length === 0 ? (
        <div className="mt-6 py-8 text-center">
          <Text className="!text-muted-foreground">No user data</Text>
        </div>
      ) : (
        <DonutChart
          className="mt-4 h-52"
          data={data}
          category="value"
          index="name"
          colors={[
            "rose",
            "blue",
            "amber",
            "cyan",
            "violet",
            "emerald",
            "orange",
          ]}
          showAnimation
        />
      )}
    </Card>
  );
}
