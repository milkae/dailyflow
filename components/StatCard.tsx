import { ReactNode } from "react";
import { Card } from "./ui/card";

export const StatCard = ({
  label,
  icon,
  stat,
}: {
  label: string;
  icon: ReactNode;
  stat: number | string;
}) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-3">
        {icon}
        <h4>{label}</h4>
      </div>
      <div className="text-5xl text-center text-emerald-600 dark:text-emerald-400">
        {stat}
      </div>
    </Card>
  );
};
