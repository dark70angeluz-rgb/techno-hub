import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import SiteShell from "@/components/layout/SiteShell";
import Icon from "@/components/kit/Icon";
import { ButtonLink } from "@/components/kit/Button";
import { Card, Eyebrow, Reveal, SectionHeading } from "@/components/kit";
import ProductCard from "@/components/products/ProductCard";
import ContactForm from "@/components/ContactForm";
import { usePublicEvents, usePublicProducts } from "@/lib/content-store";
import heroDevices from "@/assets/hero-devices.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "TechHub — Gadgets From The Brands Professionals Trust" },
      {
        name: "description",
        content:
          "Browse a curated catalogue of smartphones, laptops, audio, wearables and imaging gear from leading brands. Request a quote on any product — no account, no checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "TechHub — Gadgets From The Brands Professionals Trust" },
      {
        property: "og:description",
        content:
          "Browse a curated catalogue of smartphones, laptops, audio, wearables and imaging gear from leading brands. Request a quote on any product — no account, no checkout.",
      },
    ],
  }),
});

const benefits = [
  {
    icon: "verified",
    title: "Sourced from authorised brands",
    desc: "Every unit ships with full manufacturer warranty and regional support.",
  },
  {
    icon: "request_quote",
    title: "Quotes, not checkouts",
    desc: "Tell us quantities and timelines; we price the configuration you actually need.",
  },
  {
    icon: "support_agent",
    title: "Specialists, not scripts",
    desc: "Product specialists answer spec questions in under four hours on business days.",
  },
  {
    icon: "inventory_2",
    title: "Curated, not endless",
    desc: "A short catalogue we can stand behind, reviewed with each partner every quarter.",
  },
];

function HomePage() {
  const [activeBrand, setActiveBrand] = useState("All");
  const products = usePublicProducts();
  const events = usePublicEvents();

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort((a, b) => a.localeCompare(b)),
    [products]
  );

  const showcase = useMemo(() => {
    return activeBrand === "All" ? products : products.filter((p) => p.brand === activeBrand);
  }, [products, activeBrand]);

  const upcoming = [...events]
    .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
    .slice(0, 3);

  return (
    <SiteShell>
      {/* ---------- HERO ---------- */}
      <section className="border-b border-line bg-white">
        <div className="shell grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
          <div className="flex flex-col items-start gap-7 lg:col-span-6">
            <Eyebrow icon="devices">Multi-brand gadget catalogue</Eyebrow>
            <h1 className="max-w-[560px] text-[44px] leading-[1.02] tracking-[-0.03em] md:text-[58px] lg:text-[66px]">
              The gadgets professionals choose, from the brands they trust.
            </h1>
            <p className="max-w-[500px] text-[16px] leading-[1.65] text-muted">
              Browse smartphones, laptops, audio, wearables and imaging gear side by side. When
              something fits, request a quote — no cart, no account, no pressure.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#products"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[10px] bg-blue px-6 text-[15px] font-medium tracking-tight text-white transition-colors hover:bg-blue-press focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              >
                Browse products
                <Icon name="arrow_downward" size={18} />
              </a>
              <ButtonLink to="/contact" size="lg" variant="secondary" iconLeading="forum">
                Talk to a specialist
              </ButtonLink>
            </div>

            <div className="mt-2 grid w-full max-w-[520px] grid-cols-1 divide-y divide-[color:var(--color-line)] overflow-hidden rounded-[14px] border border-line bg-dirty sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {[
                { icon: "storefront", value: `${brands.length} brands`, label: "In the catalogue" },
                { icon: "inventory_2", value: `${products.length} products`, label: "Fully specified" },
                { icon: "schedule", value: "Under 4h", label: "Quote response" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-3 px-5 py-4">
                  <Icon name={s.icon} size={20} className="text-blue" />
                  <div className="leading-tight">
                    <p className="text-[15px] font-bold tracking-tight text-ink">{s.value}</p>
                    <p className="text-[13px] text-faint">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[14px] border border-line bg-dirty shadow-soft">
              <img
                src={heroDevices}
                alt="Studio arrangement of a laptop, smartphone, headphones and smartwatch"
                width={1008}
                height={1264}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 border-t border-line bg-white/90 px-5 py-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Icon name="request_quote" size={20} className="text-blue" />
                  <div className="leading-tight">
                    <p className="text-[13px] text-faint">Every product</p>
                    <p className="text-[15px] font-semibold text-navy">Quote in three fields</p>
                  </div>
                </div>
                <a href="#products" className="flex items-center gap-1.5 text-[14px] font-semibold text-blue">
                  Browse <Icon name="arrow_downward" size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PRODUCT SHOWCASE ---------- */}
      <section id="products" className="section-y">
        <div className="shell flex flex-col gap-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Product showcase"
              title="Compare across brands, not catalogues"
              description="A cross-section of what we carry right now. Filter by brand, open any product for full specifications, or request a quote directly."
            />
          </div>

          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter showcase by brand">
            {["All", ...brands].map((brand) => {
              const active = brand === activeBrand;
              return (
                <button
                  key={brand}
                  type="button"
                  onClick={() => setActiveBrand(brand)}
                  aria-pressed={active}
                  className={`inline-flex h-9 items-center rounded-full border px-3.5 text-[13.5px] font-semibold tracking-tight transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue ${
                    active
                      ? "border-navy bg-navy text-white"
                      : "border-line-strong bg-white text-navy hover:border-line-blue"
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {showcase.map((product, i) => (
              <Reveal key={product.slug} delay={Math.min(i * 0.03, 0.18)} className="h-full">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- BRANDS ---------- */}
      <section id="brands" className="border-y border-line bg-dirty section-y">
        <div className="shell flex flex-col gap-10">
          <SectionHeading
            align="center"
            eyebrow="Brands"
            title="Fifteen-plus partners, one place to compare"
            description="We carry a focused selection from each brand rather than every SKU they publish."
          />
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-line bg-line sm:grid-cols-3 lg:grid-cols-5">
            {brands.map((brand) => {
              const count = products.filter((p) => p.brand === brand).length;
              return (
                <a
                  key={brand}
                  href="#products"
                  onClick={() => setActiveBrand(brand)}
                  className="flex flex-col items-center justify-center gap-1 bg-white px-4 py-8 transition-colors hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-navy">
                    {brand}
                  </span>
                  <span className="text-[12.5px] text-faint">
                    {count} product{count !== 1 ? "s" : ""}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- BENEFITS ---------- */}
      <section id="benefits" className="section-y">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Why TechHub"
              title="A calmer way to buy hardware."
              description="No cart, no upsells, no account wall. Four commitments that shape how we work."
            />
            <div className="mt-8">
              <ButtonLink to="/benefits" variant="dark" icon="arrow_forward">
                View all benefits
              </ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-7">
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.04} className="h-full">
                <Card className="flex h-full flex-col gap-3 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-tint">
                    <Icon name={b.icon} size={22} className="text-blue" />
                  </span>
                  <h3 className="text-[18px] font-semibold tracking-tight">{b.title}</h3>
                  <p className="text-[15px] leading-[1.6] text-muted">{b.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- MEMBERSHIP ---------- */}
      <section id="membership" className="border-y border-line bg-dirty section-y">
        <div className="shell grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              eyebrow="Membership"
              title="Browsing is free. Membership is optional."
              description="Everything on this page — the catalogue, the quotes, the events — is open to guests. Membership is a free application, reviewed by a specialist, that adds priority and member-only access."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink to="/membership/apply" size="lg" icon="arrow_forward">
                Apply for membership
              </ButtonLink>
              <ButtonLink to="/membership" size="lg" variant="secondary" iconLeading="info">
                How it works
              </ButtonLink>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-6">
            {[
              {
                icon: "public",
                label: "Open to everyone",
                items: ["Full product showcase", "Quote requests", "Event listings"],
              },
              {
                icon: "workspace_premium",
                label: "Member-exclusive",
                items: ["Priority quote turnaround", "Early access to arrivals", "Member gatherings"],
              },
            ].map((column, i) => (
              <Reveal key={column.label} delay={i * 0.05} className="h-full">
                <Card className="flex h-full flex-col gap-3 p-6">
                  <span
                    className={`flex h-11 w-11 items-center justify-center rounded-[10px] ${
                      i === 0 ? "bg-tint" : "bg-navy"
                    }`}
                  >
                    <Icon
                      name={column.icon}
                      size={21}
                      className={i === 0 ? "text-blue" : "text-white"}
                    />
                  </span>
                  <h3 className="text-[17px] font-semibold tracking-tight">{column.label}</h3>
                  <ul className="flex flex-col gap-2">
                    {column.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[14.5px] leading-[1.55] text-muted"
                      >
                        <Icon name="check" size={16} className="mt-0.5 shrink-0 text-blue" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- EVENTS ---------- */}
      <section id="events" className="section-y">
        <div className="shell flex flex-col gap-10">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Events"
              title="Where you can see the gear in person"
              description="Summits, workshops and expos we attend or host. Informational only — open any event for its details page."
            />
            <ButtonLink to="/events" variant="secondary" icon="arrow_forward">
              All events
            </ButtonLink>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {upcoming.map((event, i) => (
              <Reveal key={event.slug} delay={i * 0.04} className="h-full">
                <Link
                  to="/events/$slug"
                  params={{ slug: event.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-white transition-[box-shadow,border-color] duration-200 hover:border-line-strong hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  <div className="relative overflow-hidden bg-dirty">
                    <img
                      src={event.image}
                      alt={event.imageAlt}
                      width={1600}
                      height={912}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute left-4 top-4 flex h-14 w-14 flex-col items-center justify-center rounded-[10px] bg-white/95 backdrop-blur-sm">
                      <span className="text-[18px] font-bold leading-none text-navy">{event.day}</span>
                      <span className="text-[11px] uppercase tracking-[0.1em] text-faint">
                        {event.month}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="text-[17px] font-semibold leading-snug tracking-tight">
                      {event.title}
                    </h3>
                    <p className="flex items-center gap-1.5 text-[13.5px] text-muted">
                      <Icon name="location_on" size={16} className="text-faint" />
                      {event.location}
                    </p>
                    <p className="line-clamp-2 text-[14.5px] leading-[1.6] text-muted">{event.desc}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CONTACT ---------- */}
      <section id="contact" className="border-t border-line bg-dirty section-y">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Contact"
              title="Tell us what you're sourcing."
              description="Send a message and a product specialist replies by email — usually within four hours on business days."
            />
            <div className="mt-8 flex flex-col gap-3">
              {[
                { icon: "mail", label: "hello@techhub.io" },
                { icon: "call", label: "+1 (888) 555-TECH" },
                { icon: "schedule", label: "Mon–Fri, 9:00 AM – 6:00 PM PST" },
              ].map((item) => (
                <p key={item.label} className="flex items-center gap-2.5 text-[15px] text-muted">
                  <Icon name={item.icon} size={19} className="text-blue" />
                  {item.label}
                </p>
              ))}
            </div>
          </div>
          <div className="lg:col-span-7">
            <Card className="p-6 lg:p-8">
              <ContactForm idPrefix="home-contact" />
            </Card>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
