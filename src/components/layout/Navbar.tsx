import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "../kit/Icon";
import { Button, ButtonLink } from "../kit/Button";

const links: { label: string; to: string; hash?: string }[] = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Products", to: "/", hash: "products" },
  { label: "Benefits", to: "/benefits" },
  { label: "Events", to: "/events" },
  { label: "Contact Us", to: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const active = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled ? "border-b border-line bg-white/80 backdrop-blur-xl" : "border-b border-transparent bg-white/60 backdrop-blur-md"
      }`}
    >
      <div className="shell flex h-[72px] items-center justify-between gap-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="TechHub home">
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-navy">
            <Icon name="hub" size={20} fill className="text-white" />
          </span>
          <span className="text-[19px] font-bold tracking-tight text-ink">
            Tech<span className="text-blue">Hub</span>
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              {...(l.hash ? { hash: l.hash } : {})}
              className={`relative rounded-[12px] px-3.5 py-2 text-[14.5px] font-medium transition-colors ${
                active(l.to) ? "text-navy" : "text-muted hover:text-navy"
              }`}
            >
              {l.label}
              {active(l.to) && (
                <motion.span
                  layoutId="nav-underline"
                  transition={{ duration: 0.2 }}
                  className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-blue"
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            to="/login"
            className={`flex h-11 items-center gap-1.5 rounded-[12px] px-3.5 text-[14.5px] font-semibold transition-colors ${
              active("/login") ? "text-navy" : "text-muted hover:text-navy"
            }`}
          >
            <Icon name="login" size={18} />
            Login
          </Link>
          <ButtonLink to="/get-started" size="sm" icon="arrow_forward">
            Get Started
          </ButtonLink>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-line bg-dirty text-navy lg:hidden"
        >
          <Icon name={open ? "close" : "menu"} size={20} />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <div className="shell flex flex-col gap-1 py-4">
              {links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  {...(l.hash ? { hash: l.hash } : {})}
                  className={`flex min-h-[44px] items-center rounded-[12px] px-4 text-[15px] font-medium ${
                    active(l.to) ? "bg-tint text-blue" : "text-muted"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-line pt-3">
                <Link
                  to="/login"
                  className="flex min-h-[44px] items-center gap-2 rounded-[12px] px-4 text-[15px] font-semibold text-navy"
                >
                  <Icon name="login" size={18} /> Login
                </Link>
                <Link to="/get-started">
                  <Button fullWidth icon="arrow_forward">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
