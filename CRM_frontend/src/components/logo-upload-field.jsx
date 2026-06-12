import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Landmark } from "lucide-react";
import { useRef, forwardRef } from "react";
import { useFilePreview } from "@/hooks/useFilePreview";

export const LogoUploadField = forwardRef(
  ({ value, onChange, ...fieldProps }, ref) => {
    const file = value && value.length > 0 ? value[0] : null;
    const previewUrl = useFilePreview(file);
    const inputRef = useRef(null);

    return (
      <FormItem className="grid grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1">
        <FormLabel className="col-span-2 text-end mt-2">Logo</FormLabel>
        <FormControl>
          <div className="col-span-4 flex flex-col items-start gap-2">
            <div className="inline-flex items-center gap-2 align-top">
              <div
                className="border-input bg-muted/20 rounded-md relative flex size-10 shrink-0 items-center justify-center overflow-hidden border"
                aria-label={
                  previewUrl
                    ? "Preview of uploaded image"
                    : "Default user avatar"
                }
              >
                {previewUrl ? (
                  <img
                    className="size-full object-cover"
                    src={previewUrl}
                    alt="Preview of uploaded image"
                  />
                ) : (
                  <Landmark
                    className="opacity-60"
                    width="20"
                    height="20"
                    aria-hidden="true"
                  />
                )}
              </div>
              <div className="relative inline-block">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  aria-haspopup="dialog"
                >
                  {file ? "Change image" : "Upload image"}
                </Button>
                <Input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  tabIndex={-1}
                  ref={(e) => {
                    // Connect both our internal ref and react-hook-form's ref
                    if (typeof ref === "function") {
                      ref(e);
                    } else if (ref) {
                      ref.current = e;
                    }
                    inputRef.current = e;
                  }}
                  onChange={(event) => onChange(event.target.files)}
                  {...fieldProps}
                />
              </div>
            </div>
            {file ? (
              <div className="inline-flex gap-2 text-xs">
                <p
                  className="text-muted-foreground truncate max-w-[150px]"
                  aria-live="polite"
                >
                  {file.name}
                </p>{" "}
                <button
                  type="button"
                  onClick={() => {
                    onChange(undefined);
                    if (inputRef.current) inputRef.current.value = "";
                  }}
                  className="text-destructive cursor-pointer font-medium hover:underline"
                  aria-label={`Remove ${file.name}`}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="inline-flex gap-2 text-xs">
                <p
                  className="text-muted-foreground truncate"
                  aria-live="polite"
                >
                  No image attached
                </p>
              </div>
            )}
          </div>
        </FormControl>
        <FormMessage className="col-span-4 col-start-3" />
      </FormItem>
    );
  },
);

LogoUploadField.displayName = "LogoUploadField";
