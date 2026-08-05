import { useState } from "react";
import { ACCEPTED_TYPES, MAX_SIZE_MB } from "./types";
import { getRecipeImageUploadUrl } from "./image";
import { uploadWithProgress } from "@/lib/upload-with-progress";

export function useRecipeImageUpload() {
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploadError(null);

    if (file && file.size > 0) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setUploadError("Please choose a JPEG, PNG, WEBP, or GIF image.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`Image must be under ${MAX_SIZE_MB}MB.`);
        return;
      }

      try {
        setUploadProgress(0);
        const { url, fields, key } = await getRecipeImageUploadUrl(
          file.name,
          file.type,
        );
        await uploadWithProgress(url, fields, file, setUploadProgress);
        return key;
      } catch {
        setUploadError("Image upload failed. Please try again.");
        setUploadProgress(null);
        return;
      }
    }
  }

  return {
    upload,
    uploadProgress,
    uploading: uploadProgress !== null,
    uploadError,
  };
}
