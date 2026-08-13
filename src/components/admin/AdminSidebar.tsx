import { Link, useRouterState } from "@tanstack/react-router";
import Icon from "@/components/kit/Icon";
import { navGroups } from "./nav";

function isActivePath(path: string, current: string) {
  return path === "/admin" ? current === "/admin" : current.startsWith(path);
}

export function AdminSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 flex-shrink-0 items-center gap-3 border-b border-white/10 px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-blue">
          <Icon name="hub" size={18} className="text-white" />
        </span>
        <span className="text-[16px] font-bold tracking-tight text-white">
          Tech<span className="text-blue">Hub</span>
          <span className="ml-1.5 text-[12px] font-medium text-white/35">Admin</span>
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-5 last:mb-0">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/30">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const active = isActivePath(item.path, pathname);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onNavigate}
                    className={`group relative flex min-h-[44px] items-center gap-3 rounded-[12px] pl-4 pr-3 text-[14px] font-medium transition-colors ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 h-5 -translate-y-1/2 rounded-r-full bg-blue" style={{ width: 3 }} />
                    )}
                    <Icon name={item.icon} size={19} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge ? (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                          active ? "bg-white/25 text-white" : "bg-blue/25 text-blue"
                        }`}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="flex flex-shrink-0 flex-col gap-0.5 border-t border-white/10 px-3 py-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="flex min-h-[44px] items-center gap-3 rounded-[12px] px-4 text-[14px] font-medium text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <Icon name="arrow_outward" size={18} />
          Back to site
        </Link>
      </div>
    </div>
  );
}

export default AdminSidebarContent;
