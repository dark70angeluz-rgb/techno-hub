import { useRouterState } from "@tanstack/react-router";
import Icon from "@/components/kit/Icon";
import { pageTitles } from "./nav";

export function AdminTopbar({ onMenu }: { onMenu: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = pageTitles[pathname] ?? "Admin";

  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 items-center justify-between border-b border-line bg-white px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={onMenu}
          aria-label="Open menu"
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[12px] bg-dirty text-navy lg:hidden"
        >
          <Icon name="menu" size={20} />
        </button>
        <h1 className="truncate text-[18px] font-bold tracking-tight text-navy">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative hidden sm:block">
          <Icon name="search" size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-faint" />
          <input
            placeholder="Search members, events…"
            className="h-11 w-64 rounded-[12px] border border-line bg-dirty pl-9 pr-3 text-[14px] text-navy outline-none transition-colors placeholder:text-faint focus:border-blue"
          />
        </div>
        <button
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-[12px] bg-dirty text-muted"
        >
          <Icon name="notifications" size={18} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-blue" />
        </button>
        <div className="flex items-center gap-2.5 border-l border-line pl-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-[13px] font-bold text-white">
            AM
          </span>
          <div className="hidden md:block">
            <p className="text-[13px] font-semibold leading-tight text-navy">Alex Morgan</p>
            <p className="text-[12px] leading-tight text-faint">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminTopbar;
