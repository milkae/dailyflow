"use client";

import { useActionState } from "react";
import { createHabit } from "@/lib/actions";
import { TextInput } from "./TextInput";

export const CreateHabitForm = () => {
  const [state, formAction, pending] = useActionState(createHabit, {
    formErrors: [],
    fieldErrors: {},
  });

  return (
    <form action={formAction} className="flex justify-center gap-2">
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
      <button
        type="submit"
        disabled={pending}
        className="text-red-400 border-red-400 p-2"
      >
        Add
      </button>
    </form>
  );
};
