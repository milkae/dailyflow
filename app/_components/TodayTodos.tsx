import Link from "next/link";
import { ArrowRight, CircleAlert, ListTodo } from "lucide-react";
import type { Todo } from "@/generated/prisma/client";
import { Heading } from "@/app/_components/ui/typography";
import { buttonVariants } from "@/app/_components/ui/buttonVariants";
import { Badge } from "@/app/_components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/app/_components/ui/empty";

export function TodayTodos({
  todos,
  pendingTodosCount,
}: {
  todos: Todo[];
  pendingTodosCount: number;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <Heading as="h2" className="text-2xl font-bold">
          Todos
        </Heading>
        <Link
          href="/todos"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          View All
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>

      {todos.length > 0 ? (
        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="rounded-xl border border-border/70 bg-card/60 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="truncate font-medium text-foreground">
                    {todo.name}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {todo.description || "No notes added yet."}
                  </p>
                </div>
                {todo.urgent ? (
                  <Badge variant="destructive" className="shrink-0 gap-1.5">
                    <CircleAlert className="size-3.5" />
                    Urgent
                  </Badge>
                ) : (
                  <Badge variant="outline" className="shrink-0">
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          ))}

          {pendingTodosCount > todos.length ? (
            <p className="text-sm text-muted-foreground">
              {pendingTodosCount - todos.length} more open{" "}
              {pendingTodosCount - todos.length === 1 ? "todo" : "todos"} in
              your list.
            </p>
          ) : null}
        </div>
      ) : (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ListTodo className="h-8 w-8 text-primary" />
            </EmptyMedia>
            <EmptyTitle>No open todos</EmptyTitle>
            <EmptyDescription>
              Capture your next task to keep today focused.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  );
}
