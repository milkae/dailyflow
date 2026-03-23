"use client";

import { startTransition, useActionState, useEffect, useState } from "react";
import { createHabit } from "@/lib/actions";
import { TextInput } from "./TextInput";
import { Button } from "@/components/ui/button";
import { FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
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
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Plus } from "lucide-react";

const frequencies = Object.values(Frequency).map((v) => ({
  value: v,
  label: capitalize(v),
}));

const dayNames = [
  { value: 1, label: "Monday", short: "Mon" },
  { value: 2, label: "Tuesday", short: "Tue" },
  { value: 3, label: "Wednesday", short: "Wed" },
  { value: 4, label: "Thursday", short: "Thu" },
  { value: 5, label: "Friday", short: "Fri" },
  { value: 6, label: "Saturday", short: "Sat" },
  { value: 7, label: "Sunday", short: "Sun" },
];

export const HabitForm = () => {
  const [state, formAction, pending] = useActionState(createHabit, {
    formErrors: [],
    fieldErrors: {},
    success: false,
  });
  const [selectedFrequency, setFrequency] = useState<Frequency>(
    Frequency.DAILY,
  );
  const [selectedDays, setSelectedDays] = useState<number[]>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      startTransition(() => setOpen(false));
    }
  }, [state.success]);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setFrequency(Frequency.DAILY);
          setSelectedDays(undefined);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create new Habit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new Habit</DialogTitle>
        </DialogHeader>

        <form
          action={(formData) => {
            if (selectedDays) {
              formData.append("config", JSON.stringify(selectedDays));
            }
            formAction(formData);
          }}
        >
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
              <Select
                name="frequency"
                defaultValue={frequencies[0].value}
                onValueChange={(value) => setFrequency(value as Frequency)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((frequency) => (
                    <SelectItem value={frequency.value} key={frequency.value}>
                      {frequency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldSet>

            {selectedFrequency === Frequency.WEEKLY && (
              <div className="space-y-2">
                <Label>Day of week</Label>
                <Select defaultValue="1" name="config">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dayNames.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedFrequency === Frequency.SPECIFIC_DAYS && (
              <div className="space-y-2">
                <Label>Select days</Label>
                <div>
                  {dayNames.map((day) => {
                    return (
                      <div key={day.value} className="flex items-center gap-2">
                        <Checkbox
                          id={`config-${day.short}`}
                          checked={!!selectedDays?.includes(day.value)}
                          onCheckedChange={(checked) => {
                            const newDays = checked
                              ? [...(selectedDays || []), day.value].sort()
                              : (selectedDays || []).filter(
                                  (d) => d !== day.value,
                                );
                            setSelectedDays(newDays);
                          }}
                        />
                        <label htmlFor={`config-${day.short}`}>
                          {day.short}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedFrequency === Frequency.INTERVAL && (
              <div>
                <Label>Repeat every (days)</Label>
                <Input type="number" min="1" max="30" name="config" />
              </div>
            )}

            {selectedFrequency === Frequency.MONTHLY && (
              <div>
                <Label>Day of the month</Label>
                <Input type="number" min="1" max="31" name="config" />
              </div>
            )}
            {state.fieldErrors.config && (
              <p className="text-sm text-destructive">
                {state.fieldErrors.config}
              </p>
            )}
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
