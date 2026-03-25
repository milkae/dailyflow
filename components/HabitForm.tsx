"use client";

import {
  ReactElement,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from "react";
import { createOrUpdateHabit } from "@/lib/actions";
import { TextInput } from "./TextInput";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
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
import { Checkbox } from "./ui/checkbox";
import { Plus } from "lucide-react";
import { TypedHabit } from "@/lib/types";

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

export const HabitForm = ({
  habit,
  trigger,
}: {
  habit?: TypedHabit;
  trigger?: ReactElement;
}) => {
  const [state, formAction, pending] = useActionState(createOrUpdateHabit, {
    formErrors: [],
    fieldErrors: {},
    success: false,
  });
  const [selectedFrequency, setFrequency] = useState<Frequency>(
    habit?.frequency || Frequency.DAILY,
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    (habit?.frequency === Frequency.SPECIFIC_DAYS &&
      habit.frequencyConfig.days) ||
      [],
  );
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
          setSelectedDays([]);
        }
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button>
              <Plus className="h-4 w-4 md:mr-2" />
              Create new Habit
            </Button>
          )
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {habit ? "Edit habit" : "Create a new Habit"}
          </DialogTitle>
        </DialogHeader>

        <form
          action={(formData) => {
            if (habit) {
              formData.append("id", habit.id);
            }
            if (selectedDays) {
              formData.append("config", JSON.stringify(selectedDays));
            }
            formAction(formData);
          }}
        >
          <FieldSet>
            <FieldGroup>
              <Field>
                <TextInput
                  name="name"
                  defaultValue={habit?.name}
                  placeholder="Habit name"
                  required
                  errors={state.fieldErrors.name}
                />
              </Field>
              <Field>
                <TextInput
                  name="description"
                  defaultValue={habit?.description || ""}
                  placeholder="Habit description"
                  errors={state.fieldErrors.description}
                />
              </Field>
              <Field>
                <FieldLabel>Frequency</FieldLabel>
                <Select
                  name="frequency"
                  defaultValue={habit?.frequency || frequencies[0].value}
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
              </Field>

              {selectedFrequency === Frequency.WEEKLY && (
                <Field>
                  <FieldLabel>Day of week</FieldLabel>
                  <Select
                    defaultValue={
                      habit?.frequency === Frequency.WEEKLY
                        ? habit?.frequencyConfig?.day
                        : 1
                    }
                    name="config"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dayNames.map((day) => (
                        <SelectItem
                          key={day.value}
                          value={day.value.toString()}
                        >
                          {day.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}

              {selectedFrequency === Frequency.SPECIFIC_DAYS && (
                <Field>
                  <FieldLabel>Select days</FieldLabel>
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
                </Field>
              )}

              {selectedFrequency === Frequency.INTERVAL && (
                <Field>
                  <FieldLabel>Repeat every (days)</FieldLabel>
                  <Input
                    type="number"
                    min="1"
                    max="30"
                    name="config"
                    defaultValue={
                      habit?.frequency === Frequency.INTERVAL
                        ? habit?.frequencyConfig?.interval
                        : 1
                    }
                  />
                </Field>
              )}

              {selectedFrequency === Frequency.MONTHLY && (
                <Field>
                  <FieldLabel>Day of the month</FieldLabel>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    name="config"
                    defaultValue={
                      habit?.frequency === Frequency.MONTHLY
                        ? habit?.frequencyConfig?.day
                        : 1
                    }
                  />
                </Field>
              )}
              {state.fieldErrors.config && (
                <p className="text-sm text-destructive">
                  {state.fieldErrors.config}
                </p>
              )}
            </FieldGroup>
          </FieldSet>

          {state.formErrors.map((e, i) => (
            <p aria-live="polite" key={i}>
              {e}
            </p>
          ))}

          <DialogFooter className="flex justify-between gap-4 mt-4">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={pending}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
