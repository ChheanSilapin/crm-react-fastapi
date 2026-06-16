import { useMemo, useEffect } from "react";
import { getImageUrl } from "@/lib/utils";

export function useFilePreview(file) {
  const previewUrl = useMemo(() => {
    if (!file) return null;
    if (typeof file === "string") {
      return getImageUrl(file);
    }
    if (file instanceof File || file instanceof Blob) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return previewUrl;
}
