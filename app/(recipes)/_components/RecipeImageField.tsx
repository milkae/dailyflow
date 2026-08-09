"use client";

import { Input } from "@/app/_components/ui/input";
import { Field, FieldError, FieldLabel } from "@/app/_components/ui/field";
import { getRecipeImageUrl } from "@/lib/recipe-image";
import Image from "next/image";
import { ACCEPTED_TYPES } from "../types";
import { useRecipeImageUpload } from "../hooks";
import { Loader2 } from "lucide-react";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/app/_components/ui/progress";

type Props = {
  existingImageUrl?: string | null;
  disabled?: boolean;
  formErrors?: string[];
  value?: string | null;
  onChange: (s: string) => void;
};

export function RecipeImageField({
  disabled,
  formErrors,
  value,
  onChange,
}: Props) {
  const { upload, uploadProgress, uploading, uploadError } =
    useRecipeImageUpload();

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file || !file.size) {
      return;
    }

    const imageKey = await upload(file);
    if (imageKey) {
      onChange(imageKey);
    }
  }

  const errors = uploadError ? [uploadError] : formErrors;

  return (
    <Field data-invalid={!!errors?.length}>
      <FieldLabel htmlFor="recipe-image">Image</FieldLabel>
      <input value={value ?? ""} accept="image/*" className="hidden" readOnly />
      {uploading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <Progress value={uploadProgress} className="w-full max-w-sm">
            <ProgressLabel>Upload image...</ProgressLabel>
            <ProgressValue />
          </Progress>
        </>
      ) : (
        <>
          {value &&
            (["http", "blob"].some((str) => value.startsWith(str)) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt="recipe image preview"
                className="max-w-1/2 mx-auto rounded-md"
              />
            ) : (
              <Image
                src={getRecipeImageUrl(value) ?? "/placeholder.png"}
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
          {!!errors?.length && (
            <FieldError aria-live="polite" errors={errors} />
          )}
        </>
      )}
    </Field>
  );
}
