import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/kit/Icon";
import { Button } from "@/components/kit/Button";
import { Field, inputClass } from "@/components/kit";
import { readImageFile } from "@/lib/admin-store";

/** Centered modal used by every admin create/edit form. */
export function EntityModal({
  open,
  title,
  subtitle,
  onClose,
  onSubmit,
  submitLabel = "Save",
  children,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 sm:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/55"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            className="relative z-10 w-full max-w-[680px] rounded-[18px] border border-line bg-white shadow-soft"
          >
            <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
              <div>
                <h2 className="text-[19px] font-semibold tracking-tight text-navy">{title}</h2>
                {subtitle && <p className="mt-1 text-[13.5px] text-muted">{subtitle}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-dirty text-navy hover:bg-tint hover:text-blue"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSubmit();
              }}
              className="flex flex-col"
            >
              <div className="flex flex-col gap-4 px-6 py-6">{children}</div>
              <div className="flex flex-wrap justify-end gap-2 border-t border-line bg-dirty px-6 py-4">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" variant="dark" size="sm" iconLeading="save">
                  {submitLabel}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/** Image upload field: pick a file (stored as a data URL) or paste an image URL. */
export function ImageUploadField({
  label = "Image",
  value,
  onChange,
  hint = "Upload a JPG or PNG (max 2 MB), or paste an image URL.",
}: {
  label?: string;
  value: string;
  onChange: (next: string) => void;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("That image is larger than 2 MB.");
      return;
    }
    try {
      onChange(await readImageFile(file));
      setError(undefined);
    } catch {
      setError("That image could not be read.");
    }
  };

  return (
    <Field label={label} hint={hint} error={error}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center overflow-hidden rounded-[12px] border border-line bg-dirty">
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <Icon name="image" size={22} className="text-faint" />
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://…"
            className={inputClass}
            aria-label={`${label} URL`}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="sm"
              iconLeading="upload"
              onClick={() => fileRef.current?.click()}
            >
              Upload image
            </Button>
            {value && (
              <Button variant="ghost" size="sm" iconLeading="delete" onClick={() => onChange("")}>
                Remove
              </Button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => void pick(e.target.files?.[0])}
          />
        </div>
      </div>
    </Field>
  );
}
