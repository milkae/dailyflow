import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  footer?: React.ReactNode;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = "bg-primary/10 ring-primary/20 text-primary",
  footer,
}: Props) {
  return (
    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-4 transition-all hover:border-primary/50 hover:shadow-lg space-y-2">
      <div className="flex items-center gap-3">
        <div className={cn("rounded-lg p-2.5 ring-1", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </p>
          <p className="text-2xl font-bold mt-0.5">{value}</p>
        </div>
      </div>
      {footer}
    </div>
  );
}
