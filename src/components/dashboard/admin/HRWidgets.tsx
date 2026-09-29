"use client";

import {
  Card,
  Title,
  Text,
  Flex,
  BarChart,
  Badge,
  ProgressBar,
} from "@tremor/react";
import { Star, Users as UsersIcon } from "lucide-react";
import type { DashboardData } from "./types";

interface HRWidgetsProps {
  hr: DashboardData["hr"];
}

export function HiringPipeline({ hr }: HRWidgetsProps) {
  const stageColors: Record<string, string> = {
    New: "blue",
    Contacted: "cyan",
    Hired: "emerald",
    Closed: "slate",
    Archived: "gray",
  };

  const total = hr.hiringPipeline.reduce((s, h) => s + h.value, 0);

  return (
    <Card className="!bg-card !ring-border/60">
      <Flex justifyContent="between" alignItems="center">
        <div>
          <Title className="!text-foreground">Hiring Pipeline</Title>
          <Text className="!text-muted-foreground">
            Faculty recruitment funnel
          </Text>
        </div>
        <Badge color="blue">{total} total</Badge>
      </Flex>

      {total === 0 ? (
        <div className="mt-6 py-8 text-center">
          <Text className="!text-muted-foreground">
            No faculty enquiries yet
          </Text>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {hr.hiringPipeline.map((stage) => {
            const pct = total > 0 ? (stage.value / total) * 100 : 0;
            return (
              <div key={stage.stage}>
                <Flex justifyContent="between" className="mb-1">
                  <Text className="!text-foreground font-medium">
                    {stage.stage}
                  </Text>
                  <Text className="!text-muted-foreground">
                    {stage.value}{" "}
                    <span className="text-xs">({pct.toFixed(0)}%)</span>
                  </Text>
                </Flex>
                <ProgressBar
                  value={pct}
                  color={
                    (stageColors[stage.stage] || "gray") as any
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export function TopFaculty({ hr }: HRWidgetsProps) {
  return (
    <Card className="!bg-card !ring-border/60">
      <Title className="!text-foreground">Top Faculty</Title>
      <Text className="!text-muted-foreground">By rating</Text>

      {hr.topFaculty.length === 0 ? (
        <div className="mt-6 py-8 text-center">
          <Text className="!text-muted-foreground">No faculty data yet</Text>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {hr.topFaculty.map((f, idx) => (
            <div
              key={f.id}
              className="flex items-center gap-3 rounded-xl border border-border/60 bg-background/60 p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-200 dark:bg-orange-500/30 text-sm font-bold text-orange-600 dark:text-orange-400">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <Text className="!text-foreground font-medium truncate">
                  {f.name}
                </Text>
                <Text className="!text-muted-foreground text-xs truncate">
                  {f.designation || f.domain || "Faculty"}
                </Text>
              </div>
              <div className="flex flex-col items-end gap-1">
                {f.ratings !== null && (
                  <Flex justifyContent="end" className="gap-1">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    <Text className="!text-foreground text-sm font-semibold">
                      {f.ratings.toFixed(1)}
                    </Text>
                  </Flex>
                )}
                {f.studentsMentored && (
                  <Flex justifyContent="end" className="gap-1">
                    <UsersIcon className="h-3 w-3 text-muted-foreground" />
                    <Text className="!text-muted-foreground text-xs">
                      {f.studentsMentored}
                    </Text>
                  </Flex>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
