"use client";

import {
  Card,
  Title,
  Text,
  Flex,
  BarChart,
  DonutChart,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Badge,
  BarList,
} from "@tremor/react";
import { Clock, UserX } from "lucide-react";
import type { DashboardData } from "./types";

interface CRMWidgetsProps {
  crm: DashboardData["crm"];
}

export function EnquiryFunnel({ crm }: CRMWidgetsProps) {
  const colors = ["blue", "cyan", "emerald", "rose", "slate"];

  return (
    <Card className="!bg-card !ring-border/60">
      <Title className="!text-foreground">Enquiry Conversion Funnel</Title>
      <Text className="!text-muted-foreground">
        Pipeline breakdown by status
      </Text>
      <BarChart
        className="mt-4 h-64"
        data={crm.enquiryFunnel}
        index="stage"
        categories={["value"]}
        colors={["orange"]}
        yAxisWidth={40}
        showAnimation
        showGridLines={false}
      />
    </Card>
  );
}

export function UnassignedLeads({ crm }: CRMWidgetsProps) {
  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <Card className="!bg-card !ring-border/60">
      <Flex justifyContent="between" alignItems="center">
        <div>
          <Title className="!text-foreground">Unassigned Leads</Title>
          <Text className="!text-muted-foreground">
            Needs immediate assignment
          </Text>
        </div>
        <Badge color="red" icon={UserX}>
          {crm.unassignedLeads.length}
        </Badge>
      </Flex>

      {crm.unassignedLeads.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center py-8 text-center">
          <div className="rounded-full bg-emerald-200 dark:bg-emerald-500/30 p-3">
            <UserX className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <Text className="mt-3 !text-muted-foreground">
            All leads are assigned!
          </Text>
        </div>
      ) : (
        <Table className="mt-4">
          <TableHead>
            <TableRow>
              <TableHeaderCell className="!text-muted-foreground">
                Name
              </TableHeaderCell>
              <TableHeaderCell className="!text-muted-foreground">
                Course
              </TableHeaderCell>
              <TableHeaderCell className="!text-muted-foreground">
                Time
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {crm.unassignedLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div>
                    <Text className="!text-foreground font-medium">
                      {lead.name}
                    </Text>
                    <Text className="!text-muted-foreground text-xs">
                      {lead.email}
                    </Text>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge color="blue" size="xs">
                    {lead.course}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Flex justifyContent="start" className="gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <Text className="!text-muted-foreground text-xs">
                      {timeAgo(lead.createdAt)}
                    </Text>
                  </Flex>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

export function TopAgents({ crm }: CRMWidgetsProps) {
  const data = crm.topAgents.map((a) => ({
    name: a.agent.name || a.agent.email,
    value: a.enrollments,
  }));

  return (
    <Card className="!bg-card !ring-border/60">
      <Title className="!text-foreground">Top Performing Agents</Title>
      <Text className="!text-muted-foreground">By successful enrollments</Text>
      {data.length === 0 ? (
        <div className="mt-6 py-8 text-center">
          <Text className="!text-muted-foreground">No agent data yet</Text>
        </div>
      ) : (
        <BarList data={data} className="mt-4" color="orange" />
      )}
    </Card>
  );
}

export function LeadSourceChart({ crm }: CRMWidgetsProps) {
  const data = [
    { name: "Student Enquiries", value: crm.leadSource.student },
    { name: "Enterprise Enquiries", value: crm.leadSource.enterprise },
  ];

  return (
    <Card className="!bg-card !ring-border/60">
      <Title className="!text-foreground">Lead Source Distribution</Title>
      <Text className="!text-muted-foreground">
        Student vs Enterprise enquiries
      </Text>
      <DonutChart
        className="mt-4 h-48"
        data={data}
        category="value"
        index="name"
        colors={["blue", "violet"]}
        variant="pie"
        showAnimation
      />
    </Card>
  );
}
