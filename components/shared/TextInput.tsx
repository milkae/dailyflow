import { InputHTMLAttributes } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errors?: string[];
}

export const TextInput = ({
  name,
  placeholder,
  required,
  errors,
  defaultValue,
}: Props) => {
  const hasErrors = errors && !!errors.length;
  return (
    <Field data-invalid={hasErrors}>
      <Input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        aria-invalid={hasErrors}
      />
      {hasErrors && (
        <div>
          {errors.map((e, i) => (
            <FieldError
              aria-live="polite"
              key={i}
              className="text-sm text-destructive"
            >
              {e}
            </FieldError>
          ))}
        </div>
      )}
    </Field>
  );
};
