"use client";

import {
  Card,
  Title,
  Text,
  Flex,
  BarChart,
  DonutChart,
  Badge,
} from "@tremor/react";
import type { DashboardData } from "./types";

interface CoursePerformanceProps {
  data: DashboardData["coursePerformance"];
}

const formatCurrency = (value: number) => {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
  return `₹${value.toFixed(0)}`;
};

export function PopularCourses({ data }: CoursePerformanceProps) {
  return (
    <Card className="!bg-card !ring-border/60">
      <Title className="!text-foreground">Most Popular Courses</Title>
      <Text className="!text-muted-foreground">By enquiry volume</Text>
      {data.popularCourses.length === 0 ? (
        <div className="mt-6 py-8 text-center">
          <Text className="!text-muted-foreground">No course data yet</Text>
        </div>
      ) : (
        <BarChart
          className="mt-4 h-64"
          data={data.popularCourses}
          index="course"
          categories={["enquiries"]}
          colors={["blue"]}
          yAxisWidth={40}
          showAnimation
          showGridLines={false}
          layout="vertical"
        />
      )}
    </Card>
  );
}

export function RevenueByCategory({ data }: CoursePerformanceProps) {
  return (
    <Card className="!bg-card !ring-border/60">
      <Title className="!text-foreground">Revenue by Category</Title>
      <Text className="!text-muted-foreground">
        From enrolled enquiries
      </Text>
      {data.revenueByCategory.length === 0 ? (
        <div className="mt-6 py-8 text-center">
          <Text className="!text-muted-foreground">No revenue data yet</Text>
        </div>
      ) : (
        <>
          <DonutChart
            className="mt-4 h-52"
            data={data.revenueByCategory}
            category="revenue"
            index="category"
            colors={["blue", "cyan", "violet", "emerald", "orange", "rose"]}
            valueFormatter={formatCurrency}
            showAnimation
          />
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {data.revenueByCategory.map((item) => (
              <Badge key={item.category} color="blue" size="xs">
                {item.category}: {formatCurrency(item.revenue)}
              </Badge>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

export function CourseDifficultyDistribution({
  data,
}: CoursePerformanceProps) {
  const difficultyLabels: Record<string, string> = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    ADVANCED: "Advanced",
  };

  return (
    <Card className="!bg-card !ring-border/60">
      <Title className="!text-foreground">Course Difficulty Levels</Title>
      <Text className="!text-muted-foreground">Distribution across catalog</Text>
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        {data.courseDifficulty.length === 0 ? (
          <Text className="!text-muted-foreground">No courses yet</Text>
        ) : (
          data.courseDifficulty.map((d) => {
            const bgMap: Record<string, string> = {
              BEGINNER: "bg-emerald-200 dark:bg-emerald-500/30",
              INTERMEDIATE: "bg-amber-200 dark:bg-amber-500/30",
              ADVANCED: "bg-rose-200 dark:bg-rose-500/30",
            };
            const textMap: Record<string, string> = {
              BEGINNER: "text-emerald-700 dark:text-emerald-400",
              INTERMEDIATE: "text-amber-700 dark:text-amber-400",
              ADVANCED: "text-rose-700 dark:text-rose-400",
            };
            return (
              <div
                key={d.difficulty}
                className="flex flex-col items-center rounded-xl border border-border/60 bg-background/60 px-6 py-4"
              >
                <span className="text-3xl font-bold text-foreground">
                  {d.count}
                </span>
                <span
                  className={`mt-2 inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold ${bgMap[d.difficulty] || "bg-gray-200 dark:bg-gray-500/30"} ${textMap[d.difficulty] || "text-gray-700 dark:text-gray-400"}`}
                >
                  {difficultyLabels[d.difficulty] || d.difficulty}
                </span>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
