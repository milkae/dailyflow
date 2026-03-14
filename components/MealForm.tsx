"use client";

import { useActionState, useState } from "react";
import { createMeal } from "@/lib/actions";
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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MealType } from "@/generated/prisma/enums";
import { capitalize } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const mealTypes = Object.values(MealType).map((v) => ({
  value: v,
  label: capitalize(v),
}));

export const MealForm = () => {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createMeal, {
    formErrors: [],
    fieldErrors: {},
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        <Button variant="outline">
          <span>Create new Meal</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Meal</DialogTitle>
        </DialogHeader>

        <form action={formAction}>
          <FieldGroup>
            <TextInput
              name="name"
              placeholder="Meal name"
              required
              errors={state.fieldErrors.name}
            />
            <Input name="date" type="date" />
            <FieldSet>
              <FieldLegend variant="label">Meal type</FieldLegend>
              <RadioGroup name="type" defaultValue={mealTypes[0].value}>
                {mealTypes.map((type) => (
                  <Field orientation="horizontal" key={type.value}>
                    <RadioGroupItem value={type.value} id={type.value} />
                    <FieldLabel htmlFor={type.value} className="font-normal">
                      {type.label}
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
