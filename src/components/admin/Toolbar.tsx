import type { ReactNode } from "react";
import Icon from "@/components/kit/Icon";
import { inputClass } from "@/components/kit";

export function Toolbar({
  query,
  onQuery,
  placeholder = "Search…",
  children,
}: {
  query: string;
  onQuery: (v: string) => void;
  placeholder?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-[20px] border border-line bg-white p-3 shadow-soft">
      <div className="relative min-w-[220px] flex-1">
        <Icon name="search" size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} h-11 pl-10`}
        />
      </div>
      {children}
    </div>
  );
}

export function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-11 items-center rounded-full px-4 text-[13px] font-semibold tracking-tight transition-colors ${
        active ? "bg-navy text-white" : "bg-dirty text-muted hover:bg-tint hover:text-blue"
      }`}
    >
      {label}
    </button>
  );
}

export default Toolbar;
