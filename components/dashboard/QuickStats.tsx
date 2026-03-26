import { Card } from "@/components/ui/card";
import { TypedHabitWithEntries } from "@/lib/types";
import { CheckCircle2, Target, TrendingUp } from "lucide-react";

export function QuickStats({ habits }: { habits: TypedHabitWithEntries[] }) {
  const total = habits.length;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const completed = habits.filter((h) => {
    return h.entries.some((e) => {
      const d = new Date(e.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    });
  }).length;

  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: "Active Today",
      icon: <Target className="h-5 w-5 text-primary" />,
      stat: total,
    },
    {
      label: "Completed",
      icon: <CheckCircle2 className="h-5 w-5 text-success" />,
      stat: completed,
    },
    {
      label: "Completion",
      icon: <TrendingUp className="h-5 w-5 text-accent" />,
      stat: `${rate}%`,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">{stat.icon}</div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stat.stat}</p>
              <p className="text-xs mt-0 text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
