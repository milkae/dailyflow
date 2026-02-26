import { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errors?: string[];
}

export const TextInput = ({ name, placeholder, required, errors }: Props) => {
  const hasErrors = errors && !!errors.length;
  return (
    <Field data-invalid={hasErrors}>
      <Input
        type="text"
        name={name}
        placeholder={placeholder}
        required={required}
        aria-invalid={hasErrors}
        className={cn(
          "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500",
          "focus:border-emerald-500 dark:focus:border-emerald-500  focus:ring-emerald-500 dark:focus:ring-emerald-500",
          {
            "border-red-500 dark:border-red-400 focus:border-red-500 focus:ring-red-500 dark:focus:border-red-500 dark:focus:ring-red-500":
              hasErrors,
          },
        )}
      />
      {hasErrors && (
        <div>
          {errors.map((e, i) => (
            <FieldError
              aria-live="polite"
              key={i}
              className="text-sm text-red-600 dark:text-red-400"
            >
              {e}
            </FieldError>
          ))}
        </div>
      )}
    </Field>
  );
};
