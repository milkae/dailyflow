"use client";

import { Todo } from "@/generated/prisma/client";
import { CheckCircle2, CircleAlert } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/app/_components/ui/item";
import { Button } from "@/app/_components/ui/button";
import { cn } from "@/utils/cn";
import { toggleTodoStatus } from "../../actions";
import { withCallbacks } from "@/utils/action-state";
import { startTransition, useActionState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/app/_components/ui/spinner";

export const TodosList = ({ todos }: { todos: Todo[] }) => {
  return (
    <ItemGroup className="max-w-sm mx-auto">
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
    <Item variant="outline">
      {!!todo.urgent && (
        <ItemMedia variant="icon">
          <CircleAlert className="size-5 text-accent" />
        </ItemMedia>
      )}
      <ItemContent>
        <ItemTitle>{todo.name}</ItemTitle>
        {!!todo.description && (
          <ItemDescription>{todo.description}</ItemDescription>
        )}
      </ItemContent>
      <ItemActions>
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => {
            startTransition(() =>
              toggleAction({ id: todo.id, completion: !todo.isDone }),
            );
          }}
          disabled={isToggling}
          aria-label={todo.isDone ? "Mark as incomplete" : "Mark as complete"}
          className={cn(
            "rounded-full border-2 bg-clip-border",
            "hover:scale-110 active:scale-95",
            todo.isDone
              ? "bg-success border-success shadow-sm shadow-success/20 hover:bg-success dark:hover:bg-success"
              : "border-muted-foreground/40 hover:border-primary hover:bg-primary/5",
          )}
        >
          {isToggling ? (
            <Spinner className="size-4" />
          ) : todo.isDone ? (
            <CheckCircle2 className="size-4" />
          ) : null}{" "}
        </Button>
      </ItemActions>
    </Item>
  );
};
