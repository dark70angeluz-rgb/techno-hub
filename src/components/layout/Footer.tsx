import { Link } from "@tanstack/react-router";
import Icon from "../kit/Icon";

const groups: { title: string; links: { label: string; to: string; hash?: string }[] }[] = [
  {
    title: "Platform",
    links: [
      { label: "Products", to: "/", hash: "products" },
      { label: "Benefits", to: "/benefits" },
      { label: "Events", to: "/events" },
      { label: "Membership", to: "/membership" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Login", to: "/login" },
      { label: "Get Started", to: "/get-started" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-dirty">
      <div className="shell grid grid-cols-1 gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5 flex flex-col gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-navy">
              <Icon name="hub" size={20} fill className="text-white" />
            </span>
            <span className="text-[19px] font-bold tracking-tight text-ink">
              Tech<span className="text-blue">Hub</span>
            </span>
          </Link>
          <p className="max-w-[360px] text-[15px] text-muted">
            A multi-brand gadget store. Browse the catalogue, request a quote on anything, and join
            the optional membership when you want the extras.
          </p>
          <div className="flex flex-col gap-1.5 pt-2 text-[14px] text-muted">
            <span className="flex items-center gap-2">
              <Icon name="mail" size={17} className="text-blue" /> members@techhub.io
            </span>
            <span className="flex items-center gap-2">
              <Icon name="call" size={17} className="text-blue" /> +63 2 8123 4567
            </span>
            <span className="flex items-center gap-2">
              <Icon name="location_on" size={17} className="text-blue" /> Bonifacio Global City, Metro Manila
            </span>
          </div>
        </div>

        {groups.map((g) => (
          <div key={g.title} className="md:col-span-2 flex flex-col gap-3">
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">{g.title}</h4>
            {g.links.map((l) => (
              <Link key={l.label} to={l.to} {...(l.hash ? { hash: l.hash } : {})} className="text-[15px] text-muted transition-colors hover:text-navy">
                {l.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="md:col-span-3 flex flex-col gap-3">
          <h4 className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Member support</h4>
          <p className="text-[15px] text-muted">
            Average first response under 4 hours, Monday to Saturday.
          </p>
          <Link
            to="/contact"
            className="inline-flex w-fit items-center gap-1.5 text-[15px] font-semibold text-blue"
          >
            Contact support <Icon name="arrow_forward" size={17} />
          </Link>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-start justify-between gap-2 py-6 text-[13.5px] text-faint md:flex-row md:items-center">
          <span>© {new Date().getFullYear()} TechHub Membership. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <Icon name="verified" size={16} className="text-blue" /> Verified community · ISO-aligned member data handling
          </span>
        </div>
      </div>
    </footer>
  );
}
