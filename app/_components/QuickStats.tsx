import { CheckCircle2, ListTodo, Target, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";
import { DashboardStats } from "@/app/actions";

export function QuickStats({ stats }: { stats: DashboardStats }) {
  const { total, completed, rate, pendingTodos } = stats;

  const statCards = [
    {
      label: "Active Today",
      value: total,
      icon: Target,
      iconColor: "bg-primary/10 ring-primary/20 text-primary",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      iconColor: "bg-success/10 ring-success/20 text-success",
    },
    {
      label: "Completion",
      value: `${rate}%`,
      icon: TrendingUp,
      iconColor: "bg-accent/10 ring-accent/20 text-accent",
      footer: total > 0 && (
        <div
          role="progressbar"
          aria-label="Completion rate"
          aria-valuenow={rate}
          aria-valuemin={0}
          aria-valuemax={100}
          className="h-1 bg-muted rounded-full overflow-hidden"
        >
          <div
            className="h-full bg-linear-to-r from-success to-accent transition-all duration-700 ease-out"
            style={{ width: `${rate}%` }}
          />
        </div>
      ),
    },
    {
      label: "Open Todos",
      value: pendingTodos,
      icon: ListTodo,
      iconColor: "bg-tertiary/10 ring-tertiary/20 text-tertiary",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
