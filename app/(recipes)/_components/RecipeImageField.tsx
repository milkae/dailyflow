"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/app/_components/ui/input";
import { Field, FieldError, FieldLabel } from "@/app/_components/ui/field";
import { getRecipeImageUrl } from "@/lib/recipe-image";
import Image from "next/image";
import { ACCEPTED_TYPES, MAX_SIZE_MB } from "../types";

type Props = {
  existingImageUrl?: string | null;
  disabled?: boolean;
  serverErrors?: string[];
};

export function RecipeImageField({
  existingImageUrl,
  disabled,
  serverErrors,
}: Props) {
  const [preview, setPreview] = useState<string | null>(
    existingImageUrl || null,
  );
  const [clientError, setClientError] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    };
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setClientError(null);
    if (!file) {
      setPreview(existingImageUrl || null);
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setClientError("Please choose a JPEG, PNG, WEBP, or GIF image.");
      e.target.value = "";
      setPreview(existingImageUrl || null);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setClientError(`Image must be under ${MAX_SIZE_MB}MB.`);
      e.target.value = "";
      setPreview(existingImageUrl || null);
      return;
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    const url = URL.createObjectURL(file);
    objectUrlRef.current = url;
    setPreview(url);
  }

  const errors = clientError ? [clientError] : serverErrors;

  return (
    <Field data-invalid={!!errors?.length}>
      <FieldLabel htmlFor="recipe-image">Image</FieldLabel>
      {preview &&
        (["http", "blob"].some((str) => preview.startsWith(str)) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="recipe image preview"
            className="max-w-1/2 mx-auto rounded-md"
          />
        ) : (
          <Image
            src={getRecipeImageUrl(preview) ?? "/placeholder.png"}
            alt="recipe image preview"
            width={400}
            height={400}
          />
        ))}
      <Input
        id="recipe-image"
        name="imageFile"
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileChange}
        disabled={disabled}
      />
      {!!errors?.length && <FieldError aria-live="polite" errors={errors} />}
    </Field>
  );
}
