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
import { AlertCircleIcon } from "lucide-react";
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
    <form className="space-y-4 flex gap-4 max-w-sm mx-auto" action={formAction}>
      {state?.formErrors.map((e, i) => (
        <Alert
          variant="destructive"
          className="max-w-md"
          aria-live="polite"
          key={i}
        >
          <AlertCircleIcon />
          <AlertTitle>An Error Occured</AlertTitle>
          <AlertDescription>{e}</AlertDescription>
        </Alert>
      ))}
      <FieldGroup>
        <Field data-invalid={!!state?.fieldErrors.name?.length}>
          <Input
            name="name"
            placeholder="Todo name"
            required
            disabled={pending}
            aria-invalid={!!state?.fieldErrors.name?.length}
          />
          {!!state?.fieldErrors.name?.length && (
            <FieldError aria-live="polite" errors={state.fieldErrors.name} />
          )}
        </Field>
        <Field data-invalid={!!state?.fieldErrors.name?.length}>
          <Input
            name="description"
            placeholder="Todo description"
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
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel htmlFor="urgent">Urgent</FieldLabel>
          <Checkbox
            id="urgent"
            name="urgent"
            aria-invalid={!!state?.fieldErrors.urgent?.length}
          />
        </Field>
      </FieldGroup>
      <Button type="submit" disabled={pending}>
        Create Todo
      </Button>
    </form>
  );
};
