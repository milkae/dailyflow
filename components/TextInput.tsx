import { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  errors?: string[];
}

export const TextInput = ({ name, placeholder, required, errors }: Props) => (
  <>
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      required={required}
      className="border border-teal-400 rounded-sm text-teal-400 p-2"
    />
    {!!errors &&
      errors.map((e, i) => (
        <p aria-live="polite" key={i}>
          {e}
        </p>
      ))}
  </>
);
