import { CheckCircle2, Target, TrendingUp } from "lucide-react";
import { StatCard } from "./StatCard";

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
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-success to-accent transition-all duration-700 ease-out"
            style={{ width: `${rate}%` }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
