"use client";

import { useActionState } from "react";
import { createHabit } from "@/lib/actions";

export const CreateHabitForm = () => {
  const [state, formAction, pending] = useActionState(createHabit, {
    formErrors: [],
    fieldErrors: {},
  });

  return (
    <form action={formAction}>
      <input type="text" name="name" placeholder="Habit name" required />
      {state.fieldErrors.name && (
        <p aria-live="polite">{state.fieldErrors.name}</p>
      )}
      <input type="text" name="description" placeholder="Habit description" />
      {state.fieldErrors.description && (
        <p aria-live="polite">{state.fieldErrors.description}</p>
      )}
      {state.formErrors.map((e, i) => (
        <p aria-live="polite" key={i}>
          {e}
        </p>
      ))}
      <button type="submit" disabled={pending}>
        Add
      </button>
    </form>
  );
};
