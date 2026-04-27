import { Card } from "@/components/ui/card";
import { Check, MessageSquare } from "lucide-react";
import { TypedHabitWithEntries } from "@/features/habits/types";
import { Heading } from "../../../components/ui/typography";
import { Entry } from "@/generated/prisma/browser";
import { Empty, EmptyDescription } from "@/components/ui/empty";

export const HabitTimeline = ({ habit }: { habit: TypedHabitWithEntries }) => {
  const entriesByMonth = habit.entries.reduce(
    (acc, entry) => {
      const date = new Date(entry.date);
      const key = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!acc[key]) acc[key] = [];
      acc[key].push(entry);
      return acc;
    },
    {} as Record<string, Entry[]>,
  );

  return (
    <Card className="p-6">
      <Heading as="h3">History</Heading>

      {habit.entries.length === 0 ? (
        <Empty>
          <EmptyDescription>
            No entries yet. Start tracking this habit!
          </EmptyDescription>
        </Empty>
      ) : (
        <div className="space-y-4">
          {Object.entries(entriesByMonth).map(([month, entries]) => (
            <div key={month}>
              <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                {month}
              </h4>

              <div className="space-y-3">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-success/5 border-success/20"
                  >
                    <div className="rounded-full bg-success p-1.5 mt-0.5">
                      <Check className="h-3 w-3 text-white" strokeWidth={3} />
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        {entry.note && (
                          <MessageSquare className="h-3.5 w-3.5 text-primary fill-current" />
                        )}
                      </div>

                      {entry.note && (
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap mt-0">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
