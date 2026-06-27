"use client";

import { Activity, BarChart3, Podcast, Users } from "lucide-react";

const stats = [
  {
    title: "Total Projects",
    value: "3",
    description: "Active podcast channels",
    icon: Podcast,
    trend: "+1 this month",
  },
  {
    title: "Total Episodes",
    value: "24",
    description: "Across all projects",
    icon: Activity,
    trend: "+4 this week",
  },
  {
    title: "Total Listeners",
    value: "1,234",
    description: "Across all platforms",
    icon: BarChart3,
    trend: "+12% vs last month",
  },
  {
    title: "Team Members",
    value: "5",
    description: "Across organizations",
    icon: Users,
    trend: "2 active now",
  },
];

export default function ProjectsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl md:text-3xl font-display font-bold tracking-tighter mt-2">
            Dashboard
          </h1>
          <p className="text-foreground/70 text-xs md:text-sm font-mono uppercase tracking-widest mt-3">
            Overview of your podcast projects and performance
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-px md:grid-cols-2 lg:grid-cols-4 bg-muted">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-background p-6 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/50 font-semibold">
                {stat.title}
              </span>
              <stat.icon className="size-3.5 text-foreground/40" />
            </div>
            <div className="text-2xl md:text-3xl font-display font-bold tracking-tight text-foreground">
              {stat.value}
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-border/40 pt-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-foreground/50">
                {stat.description}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid gap-px md:grid-cols-2 lg:grid-cols-7 bg-muted mt-8">
        <div className="bg-background lg:col-span-4 p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                01 / ACTIVITY
              </span>
              <h3 className="text-sm font-display font-bold tracking-tight text-foreground mt-1">
                Recent Activity
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Activity className="size-6 text-foreground/30 mb-4" />
            <p className="text-xs font-mono uppercase tracking-widest text-foreground/50 font-semibold">
              No recent activity
            </p>
            <p className="text-[10px] font-mono text-foreground/40 mt-2">
              Activity from your projects will appear here
            </p>
          </div>
        </div>

        <div className="bg-background lg:col-span-3 p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                02 / SCHEDULE
              </span>
              <h3 className="text-sm font-display font-bold tracking-tight text-foreground mt-1">
                Upcoming Episodes
              </h3>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Podcast className="size-6 text-foreground/30 mb-4" />
            <p className="text-xs font-mono uppercase tracking-widest text-foreground/50 font-semibold">
              No upcoming episodes
            </p>
            <p className="text-[10px] font-mono text-foreground/40 mt-2">
              Create your first episode to get started
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
