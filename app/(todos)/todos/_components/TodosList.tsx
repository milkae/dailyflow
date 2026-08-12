"use client";

import { Badge } from "@/app/_components/ui/badge";
import { Button } from "@/app/_components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/app/_components/ui/item";
import { Spinner } from "@/app/_components/ui/spinner";
import { cn } from "@/utils/cn";
import { withCallbacks } from "@/utils/action-state";
import type { Todo } from "@/generated/prisma/client";
import { CheckCircle2, CircleAlert, ListTodo } from "lucide-react";
import { startTransition, useActionState } from "react";
import { toast } from "sonner";
import { toggleTodoStatus } from "../../actions";

export const TodosList = ({ todos }: { todos: Todo[] }) => {
  if (!todos.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/35 px-6 py-10 text-center">
        <ListTodo className="size-8 text-muted-foreground" />
        <p className="mt-3 text-sm font-medium">No todos yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your first task to get started.
        </p>
      </div>
    );
  }

  return (
    <ItemGroup className="w-full gap-3">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </ItemGroup>
  );
};

const TodoItem = ({ todo }: { todo: Todo }) => {
  const [, toggleAction, isToggling] = useActionState(
    withCallbacks(toggleTodoStatus, {
      onSuccess: () => {
        toast.success("Todo status updated!");
      },
      onError: () => {
        toast.error("Failed to update todo status. Please try again.");
      },
    }),
    null,
  );

  return (
    <Item
      variant="outline"
      className={cn(
        "border-border/70 bg-background/70 px-3 py-3",
        todo.isDone && "border-success/30 bg-success/5",
      )}
    >
      <ItemMedia
        variant="icon"
        className={cn(
          "rounded-full",
          todo.isDone
            ? "bg-success/10 text-success"
            : "bg-muted text-muted-foreground",
        )}
      >
        {todo.urgent ? (
          <CircleAlert className="size-4" />
        ) : (
          <ListTodo className="size-4" />
        )}
      </ItemMedia>

      <ItemContent>
        <div className="flex flex-wrap items-center gap-2">
          <ItemTitle
            className={cn(todo.isDone && "text-muted-foreground line-through")}
          >
            {todo.name}
          </ItemTitle>
          {todo.urgent ? (
            <Badge variant="destructive" className="h-6 px-2.5">
              Urgent
            </Badge>
          ) : null}
          {todo.isDone ? (
            <Badge variant="secondary" className="h-6 px-2.5">
              Completed
            </Badge>
          ) : (
            <Badge variant="outline" className="h-6 px-2.5">
              Pending
            </Badge>
          )}
        </div>
        {todo.description ? (
          <ItemDescription
            className={cn(todo.isDone && "text-muted-foreground")}
          >
            {todo.description}
          </ItemDescription>
        ) : (
          <ItemDescription className="text-muted-foreground">
            No notes added yet.
          </ItemDescription>
        )}
      </ItemContent>

      <ItemActions>
        <Button
          variant={todo.isDone ? "secondary" : "outline"}
          size="sm"
          onClick={() => {
            startTransition(() =>
              toggleAction({ id: todo.id, completion: !todo.isDone }),
            );
          }}
          disabled={isToggling}
          aria-label={todo.isDone ? "Mark as open" : "Mark as complete"}
          className="gap-2 rounded-full"
        >
          {isToggling ? (
            <Spinner className="size-4" />
          ) : todo.isDone ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <CircleAlert className="size-4" />
          )}
          {todo.isDone ? "Reopen" : "Complete"}
        </Button>
      </ItemActions>
    </Item>
  );
};
