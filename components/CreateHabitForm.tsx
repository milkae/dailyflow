"use client";

import { useActionState } from "react";
import { createHabit } from "@/lib/actions";
import { TextInput } from "./TextInput";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const CreateHabitForm = () => {
  const [state, formAction, pending] = useActionState(createHabit, {
    formErrors: [],
    fieldErrors: {},
  });

  return (
    <form
      action={formAction}
      className="flex flex-col md:flex-row justify-center gap-2"
    >
      <TextInput
        name="name"
        placeholder="Habit name"
        required
        errors={state.fieldErrors.name}
      />
      <TextInput
        name="description"
        placeholder="Habit description"
        required
        errors={state.fieldErrors.description}
      />
      {state.formErrors.map((e, i) => (
        <p aria-live="polite" key={i}>
          {e}
        </p>
      ))}
      <Button
        type="submit"
        disabled={pending}
        className={cn(
          "bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white",
          { "opacity-50 cursor-not-allowed": pending },
        )}
      >
        Add
      </Button>
    </form>
  );
};
