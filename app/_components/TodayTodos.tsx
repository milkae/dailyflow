"use client";

import { startTransition, useActionState, useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, ListTodo } from "lucide-react";
import type { Todo } from "@/generated/prisma/client";
import { Heading } from "@/app/_components/ui/typography";
import { buttonVariants } from "@/app/_components/ui/buttonVariants";
import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Spinner } from "@/app/_components/ui/spinner";
import { withCallbacks } from "@/utils/action-state";
import { createTodo, toggleTodoStatus } from "@/app/(todos)/actions";
import { toast } from "sonner";
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
            <TodoPreviewItem key={todo.id} todo={todo} />
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

      <DashboardTodoQuickAdd />
    </section>
  );
}

function DashboardTodoQuickAdd() {
  const [name, setName] = useState("");
  const [state, formAction, pending] = useActionState(
    withCallbacks(createTodo, {
      onSuccess: () => {
        setName("");
        toast.success("Todo created successfully!");
      },
      onError: () => {
        toast.error("Failed to save todo. Please try again.");
      },
    }),
    null,
  );

  return (
    <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-foreground">Quick add</p>
          <p className="text-sm text-muted-foreground">
            Capture the next task without leaving the dashboard.
          </p>
        </div>
      </div>

      <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1 space-y-1">
          <Input
            name="name"
            placeholder="What needs attention?"
            value={name}
            onChange={(event) => setName(event.target.value)}
            disabled={pending}
            aria-invalid={!!state?.fieldErrors?.name?.length}
          />
          {state?.fieldErrors?.name?.[0] ? (
            <p role="alert" className="text-sm text-destructive">
              {state.fieldErrors.name[0]}
            </p>
          ) : null}
        </div>
        <Button type="submit" disabled={pending} className="sm:min-w-28">
          {pending ? "Adding..." : "Add Todo"}
        </Button>
      </form>

      {state?.formErrors?.[0] ? (
        <p role="alert" className="mt-2 text-sm text-destructive">
          {state.formErrors[0]}
        </p>
      ) : null}
    </div>
  );
}

function TodoPreviewItem({ todo }: { todo: Todo }) {
  const [, toggleAction, isToggling] = useActionState(
    withCallbacks(toggleTodoStatus, {
      onSuccess: () => {
        toast.success("Todo completed!");
      },
      onError: () => {
        toast.error("Failed to update todo status. Please try again.");
      },
    }),
    null,
  );

  return (
    <div className="rounded-xl border border-border/70 bg-card/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <p className="truncate font-medium text-foreground">{todo.name}</p>
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
      <div className="mt-3 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="gap-2 rounded-full"
          disabled={isToggling}
          aria-label={`Mark ${todo.name} as complete`}
          onClick={() => {
            startTransition(() =>
              toggleAction({ id: todo.id, completion: true }),
            );
          }}
        >
          {isToggling ? (
            <Spinner className="size-4" />
          ) : (
            <CheckCircle2 className="size-4" />
          )}
          Complete
        </Button>
      </div>
    </div>
  );
}
