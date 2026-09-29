"use client";

import {
  Card,
  Title,
  Text,
  Flex,
  AreaChart,
  Badge,
  Metric,
} from "@tremor/react";
import { FileText, MessageSquare, Eye } from "lucide-react";
import type { DashboardData } from "./types";

interface ContentWidgetsProps {
  content: DashboardData["content"];
}

export function BlogActivity({ content }: ContentWidgetsProps) {
  return (
    <Card className="!bg-card !ring-border/60">
      <Flex justifyContent="between" alignItems="center">
        <div>
          <Title className="!text-foreground">Blog Publishing Activity</Title>
          <Text className="!text-muted-foreground">Last 30 days</Text>
        </div>
        <Badge color="blue" icon={FileText}>
          {content.totalBlogs} total
        </Badge>
      </Flex>
      <AreaChart
        className="mt-4 h-48"
        data={content.blogActivity}
        index="date"
        categories={["count"]}
        colors={["blue"]}
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

export function ContentStats({ content }: ContentWidgetsProps) {
  return (
    <Card className="!bg-card !ring-border/60">
      <Title className="!text-foreground">Content Overview</Title>
      <Text className="!text-muted-foreground">
        Blog & testimonial status
      </Text>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col items-center rounded-xl border border-border/60 bg-background/60 p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-200 dark:bg-blue-500/30">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <Metric className="!text-foreground !text-2xl">
            {content.totalBlogs}
          </Metric>
          <Text className="!text-muted-foreground text-xs mt-1">
            Total Blogs
          </Text>
        </div>

        <div className="flex flex-col items-center rounded-xl border border-border/60 bg-background/60 p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-200 dark:bg-purple-500/30">
            <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <Metric className="!text-foreground !text-2xl">
            {content.totalTestimonials}
          </Metric>
          <Text className="!text-muted-foreground text-xs mt-1">
            Total Reviews
          </Text>
        </div>

        <div className="flex flex-col items-center rounded-xl border border-border/60 bg-background/60 p-4">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-200 dark:bg-amber-500/30">
            <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <Metric className="!text-foreground !text-2xl">
            {content.pendingReviews}
          </Metric>
          <Text className="!text-muted-foreground text-xs mt-1">
            Pending Moderation
          </Text>
        </div>
      </div>
    </Card>
  );
}
