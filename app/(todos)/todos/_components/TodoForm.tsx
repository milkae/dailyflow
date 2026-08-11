"use client";

import { createTodo } from "@/app/(todos)/actions";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { Button } from "@/app/_components/ui/button";
import { Checkbox } from "@/app/_components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/app/_components/ui/field";
import { Input } from "@/app/_components/ui/input";
import { withCallbacks } from "@/utils/action-state";
import { AlertCircleIcon, Sparkles } from "lucide-react";
import { useActionState } from "react";
import { toast } from "sonner";

export const TodoForm = () => {
  const [state, formAction, pending] = useActionState(
    withCallbacks(createTodo, {
      onSuccess: () => {
        toast.success("Todo created successfully!");
      },
      onError: () => {
        toast.error("Failed to save todo. Please try again.");
      },
    }),
    null,
  );

  return (
    <form className="flex flex-col gap-4" action={formAction}>
      {state?.formErrors.map((e, i) => (
        <Alert
          variant="destructive"
          className="max-w-md"
          aria-live="polite"
          key={i}
        >
          <AlertCircleIcon />
          <AlertTitle>An Error Occurred</AlertTitle>
          <AlertDescription>{e}</AlertDescription>
        </Alert>
      ))}

      <div className="rounded-xl border border-border/70 bg-muted/30 p-4">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="size-4 text-primary" />
          Quick capture
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Keep it short, clear, and add urgency only when it really matters.
        </p>

        <FieldGroup className="mt-4 gap-3">
          <Field data-invalid={!!state?.fieldErrors.name?.length}>
            <Input
              name="name"
              placeholder="What needs attention?"
              required
              disabled={pending}
              aria-invalid={!!state?.fieldErrors.name?.length}
            />
            {!!state?.fieldErrors.name?.length && (
              <FieldError aria-live="polite" errors={state.fieldErrors.name} />
            )}
          </Field>
          <Field data-invalid={!!state?.fieldErrors.description?.length}>
            <Input
              name="description"
              placeholder="Optional detail"
              disabled={pending}
              aria-invalid={!!state?.fieldErrors.description?.length}
            />
            {!!state?.fieldErrors.description?.length && (
              <FieldError
                aria-live="polite"
                errors={state.fieldErrors.description}
              />
            )}
          </Field>

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/70 bg-background/70 px-3 py-2">
            <Field orientation="horizontal" className="w-fit">
              <FieldLabel htmlFor="urgent">Urgent</FieldLabel>
              <Checkbox
                id="urgent"
                name="urgent"
                aria-invalid={!!state?.fieldErrors.urgent?.length}
              />
            </Field>
            <Button type="submit" disabled={pending} className="min-w-32">
              {pending ? "Creating..." : "Add todo"}
            </Button>
          </div>
        </FieldGroup>
      </div>
    </form>
  );
};
