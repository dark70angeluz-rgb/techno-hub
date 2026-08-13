import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Icon from "./Icon";

export function Card({
  children,
  className = "",
  interactive = false,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  as?: "div" | "article";
}) {
  const Tag = as;
  return (
    <Tag
      className={`surface ${
        interactive
          ? "transition-[box-shadow,border-color] duration-150 hover:border-line-strong hover:shadow-soft"
          : ""
      } ${className}`}
    >
      {children}
    </Tag>
  );
}

export function Eyebrow({ children, icon }: { children: ReactNode; icon?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-blue">
      {icon && <Icon name={icon} size={15} className="text-blue" />}
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col gap-3 ${align === "center" ? "mx-auto max-w-[680px] items-center text-center" : "items-start"} ${className}`}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-[27px] leading-[1.12] tracking-[-0.02em] sm:text-[32px] lg:text-[38px]">
        {title}
      </h2>
      {description && (
        <p className="max-w-[600px] text-[15.5px] leading-[1.65] font-normal text-muted">
          {description}
        </p>
      )}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.25, delay, ease: [0.22, 0.61, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StatusChip({
  label,
  tone = "neutral",
  icon,
}: {
  label: string;
  tone?: "neutral" | "blue" | "navy" | "outline" | undefined;
  icon?: string | undefined;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-dirty text-muted border-line",
    blue: "bg-tint text-blue border-line-blue",
    navy: "bg-navy text-white border-navy",
    outline: "bg-white text-navy border-line-strong",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold tracking-tight ${tones[tone]}`}
    >
      {icon && <Icon name={icon} size={14} />}
      {label}
    </span>
  );
}

export function EmptyState({
  icon = "inbox",
  title,
  message,
  action,
}: {
  icon?: string;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-[14px] border border-dashed border-line-strong bg-dirty px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-[12px] border border-line bg-white">
        <Icon name={icon} size={24} className="text-blue" />
      </span>
      <h3 className="text-[17px] font-semibold">{title}</h3>
      <p className="max-w-[380px] text-[14.5px] text-muted">{message}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}

/**
 * Accessible form field. Pass `htmlFor` + the matching input `id` to link the
 * label; errors are announced via role="alert" and referenced with
 * aria-describedby on the control.
 */
export function Field({
  label,
  hint,
  required,
  error,
  htmlFor,
  children,
}: {
  label: string;
  hint?: string | undefined;
  required?: boolean | undefined;
  error?: string | undefined;
  htmlFor?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[13px] font-semibold tracking-tight text-navy">
        {label}
        {required && (
          <span className="ml-1 text-danger" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <span
          id={htmlFor ? `${htmlFor}-error` : undefined}
          role="alert"
          className="flex items-center gap-1.5 text-[13px] text-danger"
        >
          <Icon name="error" size={15} />
          {error}
        </span>
      ) : (
        hint && (
          <span id={htmlFor ? `${htmlFor}-hint` : undefined} className="text-[13px] text-faint">
            {hint}
          </span>
        )
      )}
    </div>
  );
}

const controlBase =
  "w-full rounded-[10px] border bg-white text-[15px] text-navy placeholder:text-faint outline-none transition-[border-color,box-shadow] duration-150 focus:ring-2";

export const inputClass = `${controlBase} h-11 px-3.5 border-line-strong focus:border-blue focus:ring-blue/18`;

export const textareaClass = `${controlBase} min-h-[128px] p-3.5 leading-[1.6] border-line-strong focus:border-blue focus:ring-blue/18`;

/** Appended to inputClass/textareaClass when a field has a validation error. */
export const invalidClass = "!border-danger focus:!border-danger focus:!ring-danger/20";
