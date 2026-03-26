import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass?: string;
  footer?: React.ReactNode;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  colorClass = "bg-primary/10 text-primary",
  footer,
}: Props) {
  return (
    <Card className="p-4 transition-all hover:shadow-md gap-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className={cn("rounded-full p-3", colorClass)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      {footer}
    </Card>
  );
}
