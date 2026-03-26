import { CheckCircle2, Target, TrendingUp } from "lucide-react";
import { StatCard } from "../StatCard";

type Props = {
  total: number;
  completed: number;
  rate: number;
};

export function QuickStats({ total, completed, rate }: Props) {
  const stats = [
    {
      label: "Active Today",
      value: total,
      icon: Target,
      colorClass: "bg-primary/10 text-primary",
    },
    {
      label: "Completed",
      value: completed,
      icon: CheckCircle2,
      colorClass: "bg-success/10 text-success",
    },
    {
      label: "Completion",
      value: `${rate}%`,
      icon: TrendingUp,
      colorClass: "bg-accent/10 text-accent",
      footer: total > 0 && (
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-success transition-all duration-500 ease-out"
            style={{ width: `${rate}%` }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
