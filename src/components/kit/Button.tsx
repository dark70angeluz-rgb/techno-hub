import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import Icon from "./Icon";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "link";
type Size = "md" | "sm" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[10px] font-medium tracking-tight transition-[background-color,color,border-color,box-shadow] duration-150 select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:opacity-45 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary: "bg-blue text-white hover:bg-blue-press active:bg-blue-press",
  secondary: "bg-white text-navy border border-line-strong hover:bg-dirty active:bg-dirty",
  ghost: "bg-transparent text-navy hover:bg-dirty active:bg-dirty",
  dark: "bg-navy text-white hover:bg-ink active:bg-ink",
  link: "bg-transparent text-blue hover:underline underline-offset-4 px-0",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13.5px]",
  md: "h-11 px-4.5 text-[14.5px]",
  lg: "h-12 px-6 text-[15px]",
};

export type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  icon?: string;
  iconLeading?: string;
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconLeading,
  fullWidth,
  className = "",
  type = "button",
  onClick,
  disabled,
  loading,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${variant === "link" ? "" : sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent opacity-80"
        />
      ) : (
        iconLeading && <Icon name={iconLeading} size={18} />
      )}
      {children}
      {icon && !loading && <Icon name={icon} size={18} />}
    </button>
  );
}

export function ButtonLink({
  to,
  hash,
  search,
  ...props
}: ButtonProps & { to: string; hash?: string; search?: Record<string, string> }) {
  return (
    <Link
      to={to}
      {...(hash ? { hash } : {})}
      {...(search ? { search } : {})}
      className={`${props.fullWidth ? "block w-full" : "inline-block"} rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue`}
      tabIndex={-1}
    >
      <Button {...props} />
    </Link>
  );
}


export default Button;
