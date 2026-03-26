import { Heading } from "../ui/typography";

export const DashboardHeader = () => {
  const today = new Date();

  return (
    <div className="space-y-1">
      <Heading>
        {today.toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </Heading>
      <p className="text-lg text-muted-foreground">
        Here&apos;s your day at a glance.
      </p>
    </div>
  );
};
