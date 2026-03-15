"use client";

import { useActionState, useState } from "react";
import { createHabit } from "@/lib/actions";
import { TextInput } from "./TextInput";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Frequency } from "@/generated/prisma/enums";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { capitalize } from "@/lib/utils";

const frequencies = Object.values(Frequency).map((v) => ({
  value: v,
  label: capitalize(v),
}));

export const HabitForm = () => {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createHabit, {
    formErrors: [],
    fieldErrors: {},
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button variant="outline">
          <span>Create new Habit</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Habit</DialogTitle>
        </DialogHeader>

        <form action={formAction}>
          <FieldGroup>
            <TextInput
              name="name"
              placeholder="Habit name"
              required
              errors={state.fieldErrors.name}
            />
            <TextInput
              name="description"
              placeholder="Habit description"
              errors={state.fieldErrors.description}
            />
            <FieldSet>
              <FieldLegend variant="label">Frequency</FieldLegend>
              <RadioGroup name="frequency" defaultValue={frequencies[0].value}>
                {frequencies.map((frequency) => (
                  <Field orientation="horizontal" key={frequency.value}>
                    <RadioGroupItem
                      value={frequency.value}
                      id={frequency.value}
                    />
                    <FieldLabel
                      htmlFor={frequency.value}
                      className="font-normal"
                    >
                      {frequency.label}
                    </FieldLabel>
                  </Field>
                ))}
              </RadioGroup>
            </FieldSet>
          </FieldGroup>

          {state.formErrors.map((e, i) => (
            <p aria-live="polite" key={i}>
              {e}
            </p>
          ))}

          <DialogFooter className="flex justify-between gap-4">
            <DialogClose asChild>
              <Button variant="outline" size="lg">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
