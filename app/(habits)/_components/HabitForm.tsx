"use client";

import { ReactElement, useActionState, useState } from "react";
import { createOrUpdateHabit } from "@/app/(habits)/actions";
import { Button } from "@/app/_components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/app/_components/ui/field";
import { Frequency } from "@/generated/prisma/enums";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { capitalize } from "@/utils/string";
import { Input } from "@/app/_components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { Checkbox } from "@/app/_components/ui/checkbox";
import { AlertCircleIcon, Plus } from "lucide-react";
import { TypedHabit } from "@/app/(habits)/types";
import { withCallbacks } from "@/utils/action-state";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/app/_components/ui/alert";
import { toast } from "sonner";

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
  const [state, formAction, pending] = useActionState(
    withCallbacks(createOrUpdateHabit, {
      onSuccess: () => {
        setOpen(false);
        toast.success(
          habit ? "Habit updated successfully!" : "Habit created successfully!",
        );
      },
      onError: () => {
        toast.error("Failed to save habit. Please try again.");
      },
    }),
    null,
  );
  const [selectedFrequency, setFrequency] = useState<Frequency>(
    habit?.frequency || Frequency.DAILY,
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    (habit?.frequency === Frequency.SPECIFIC_DAYS &&
      habit.frequencyConfig.days) ||
      [],
  );
  const [open, setOpen] = useState(false);

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

        <form
          className="space-y-4"
          action={(formData) => {
            if (habit) {
              formData.append("id", habit.id);
            }
            if (!!selectedDays.length) {
              formData.append("frequencyConfig", JSON.stringify(selectedDays));
            }
            formAction(formData);
          }}
        >
          <Field data-invalid={!!state?.fieldErrors.name?.length}>
            <Input
              name="name"
              defaultValue={habit?.name}
              placeholder="Habit name"
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
              defaultValue={habit?.description || ""}
              placeholder="Habit description"
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
          <FieldGroup>
            <Field data-invalid={!!state?.fieldErrors.frequency?.length}>
              <FieldLabel htmlFor="frequency">Frequency</FieldLabel>
              <Select
                id="frenquency"
                name="frequency"
                defaultValue={habit?.frequency || frequencies[0].value}
                onValueChange={(value) => setFrequency(value as Frequency)}
              >
                <SelectTrigger
                  aria-invalid={!!state?.fieldErrors.frequency?.length}
                >
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
              {!!state?.fieldErrors.frequency?.length && (
                <FieldError
                  aria-live="polite"
                  errors={state.fieldErrors.frequency}
                />
              )}
            </Field>

            {selectedFrequency === Frequency.WEEKLY && (
              <Field
                data-invalid={!!state?.fieldErrors.frequencyConfig?.length}
              >
                <FieldLabel htmlFor="frequencyConfig">Day of week</FieldLabel>
                <Select
                  id="frequencyConfig"
                  name="frequencyConfig"
                  defaultValue={
                    habit?.frequency === Frequency.WEEKLY
                      ? habit?.frequencyConfig?.day
                      : 1
                  }
                >
                  <SelectTrigger
                    aria-invalid={!!state?.fieldErrors.frequencyConfig?.length}
                  >
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
              </Field>
            )}

            {selectedFrequency === Frequency.SPECIFIC_DAYS && (
              <FieldSet
                data-invalid={!!state?.fieldErrors.frequencyConfig?.length}
              >
                <FieldLegend>Select days</FieldLegend>
                <FieldGroup className="grid grid-cols-4">
                  {dayNames.map((day) => {
                    return (
                      <Field
                        key={day.value}
                        orientation="horizontal"
                        data-invalid={
                          !!state?.fieldErrors.frequencyConfig?.length
                        }
                      >
                        <Checkbox
                          id={`config-${day.short}`}
                          checked={!!selectedDays?.includes(day.value)}
                          aria-invalid={
                            !!state?.fieldErrors.frequencyConfig?.length
                          }
                          onCheckedChange={(checked) => {
                            const newDays = checked
                              ? [...(selectedDays || []), day.value].sort()
                              : (selectedDays || []).filter(
                                  (d) => d !== day.value,
                                );
                            setSelectedDays(newDays);
                          }}
                        />
                        <FieldLabel htmlFor={`config-${day.short}`}>
                          {day.short}
                        </FieldLabel>
                      </Field>
                    );
                  })}
                </FieldGroup>
              </FieldSet>
            )}

            {selectedFrequency === Frequency.INTERVAL && (
              <Field
                data-invalid={!!state?.fieldErrors.frequencyConfig?.length}
              >
                <FieldLabel htmlFor="frequencyConfig">
                  Repeat every (days)
                </FieldLabel>
                <Input
                  id="frequencyConfig"
                  type="number"
                  min="1"
                  max="30"
                  name="frequencyConfig"
                  defaultValue={
                    habit?.frequency === Frequency.INTERVAL
                      ? habit?.frequencyConfig?.interval
                      : 1
                  }
                  aria-invalid={!!state?.fieldErrors.frequencyConfig?.length}
                />
              </Field>
            )}

            {selectedFrequency === Frequency.MONTHLY && (
              <Field
                data-invalid={!!state?.fieldErrors.frequencyConfig?.length}
              >
                <FieldLabel htmlFor="frequencyConfig">
                  Day of the month
                </FieldLabel>
                <Input
                  id="frequencyConfig"
                  type="number"
                  min="1"
                  max="31"
                  name="frequencyConfig"
                  defaultValue={
                    habit?.frequency === Frequency.MONTHLY
                      ? habit?.frequencyConfig?.day
                      : 1
                  }
                  aria-invalid={!!state?.fieldErrors.frequencyConfig?.length}
                />
              </Field>
            )}
            {state?.fieldErrors.frequencyConfig && (
              <FieldError errors={state.fieldErrors.frequencyConfig} />
            )}
          </FieldGroup>

          <DialogFooter className="flex justify-between gap-4 mt-4">
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" disabled={pending}>
              {habit ? "Edit" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
