import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/kit/Icon";
import { Card, Eyebrow, Reveal, SectionHeading, StatusChip } from "@/components/kit";
import ContactForm from "@/components/ContactForm";
import SiteShell from "@/components/layout/SiteShell";
import { usePublicProducts } from "@/lib/admin-store";

export const Route = createFileRoute("/contact")({
  // "Get a Quote" links arrive as /contact?product=<slug>.
  validateSearch: (search: Record<string, unknown>): { product?: string } => {
    const product = search["product"];
    return typeof product === "string" ? { product } : {};
  },

  component: Page,
  head: () => ({
    meta: [
      { title: "Contact TechHub — Product & Quote Enquiries" },
      {
        name: "description",
        content:
          "Ask a product specialist about specifications, availability or volume pricing. Average response under four hours on business days — no account needed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Contact TechHub — Product & Quote Enquiries" },
      {
        property: "og:description",
        content: "Talk to a TechHub product specialist about specifications, availability or volume pricing.",
      },
    ],
  }),
});


const methods = [
  { icon: "mail", label: "Email us", value: "hello@techhub.io", sub: "Replies within 4 hours" },
  { icon: "call", label: "Call us", value: "+1 (888) 555-TECH", sub: "Mon–Fri, 9am–6pm PST" },
  { icon: "request_quote", label: "Quotes", value: "Any product page", sub: "Three fields, no account" },
];

const officeHours = [
  { day: "Monday – Friday", hours: "9:00 AM – 6:00 PM PST" },
  { day: "Saturday", hours: "10:00 AM – 4:00 PM PST" },
  { day: "Sunday", hours: "Closed" },
];

const faqs = [
  {
    q: "How fast will I hear back?",
    a: "We reply to every message within four hours on business days, and usually sooner.",
  },
  {
    q: "Do I need an account to request a quote?",
    a: "No. Browsing and quote requests are open to guests — use the Get a Quote button on any product.",
  },
  {
    q: "Can you price bulk or fleet orders?",
    a: "Yes. Include quantities and timelines in your message and we'll return configuration options with the quote.",
  },
  {
    q: "Do you handle partnership or brand enquiries?",
    a: "We do. Choose \"Partnership Opportunity\" as the subject and our partnerships lead will follow up.",
  },
];

function Page() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { product: productSlug } = Route.useSearch();
  const products = usePublicProducts();
  const selected = productSlug ? products.find((p) => p.slug === productSlug) : undefined;
  const quoteProduct = selected
    ? { name: selected.name, brand: selected.brand, slug: selected.slug }
    : undefined;


  return (
    <SiteShell>
      {/* Header */}
      <section className="border-b border-line section-y">
        <div className="shell">
          <Reveal className="max-w-[720px]">
            <Eyebrow icon="forum">Contact</Eyebrow>
            <h1 className="mt-4 text-[40px] leading-[1.05] tracking-[-0.03em] lg:text-[48px]">
              Tell us what you're sourcing.
            </h1>
            <p className="mt-5 max-w-[560px] text-[16px] leading-[1.65] text-muted">
              Specifications, availability, volume pricing or partnerships — a product specialist
              will pick it up and reply by email.
            </p>
            <div className="mt-6">
              <StatusChip tone="blue" icon="schedule" label="Average response under 4 hours" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Contact methods */}
      <section className="section-y pb-0">
        <div className="shell grid grid-cols-1 gap-6 md:grid-cols-3">
          {methods.map((m, i) => (
            <Reveal key={m.label} delay={i * 0.05} className="h-full">
              <Card className="flex h-full flex-col gap-4 p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-tint">
                  <Icon name={m.icon} size={21} className="text-blue" />
                </span>
                <div>
                  <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-faint">
                    {m.label}
                  </p>
                  <p className="mt-1 text-[17px] font-semibold tracking-tight">{m.value}</p>
                  <p className="mt-1 text-[14px] text-muted">{m.sub}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Form + hours */}
      <section className="section-y">
        <div className="shell grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Card className="h-full p-6 md:p-8">
              <h2 className="mb-6 text-[20px] font-semibold tracking-tight">
                {quoteProduct ? `Request a quote for ${quoteProduct.name}` : "Send a message"}
              </h2>
              <ContactForm idPrefix="contact-page" product={quoteProduct} />

            </Card>
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <Reveal delay={0.05}>
              <Card className="relative aspect-[16/9] w-full overflow-hidden bg-dirty p-0">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.06) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                  }}
                />
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
                  <span className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue">
                    <Icon name="location_on" size={20} className="text-white" fill />
                  </span>
                  <p className="text-[15px] font-semibold">185 Berry St, Suite 300</p>
                  <p className="text-[13px] text-muted">San Francisco, CA 94107</p>
                </div>
              </Card>
            </Reveal>

            <Reveal delay={0.1}>
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-tint">
                    <Icon name="schedule" size={18} className="text-blue" />
                  </span>
                  <h2 className="text-[16px] font-semibold tracking-tight">Office hours</h2>
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  {officeHours.map((o) => (
                    <div
                      key={o.day}
                      className="flex items-center justify-between border-b border-line pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-[14px] text-muted">{o.day}</span>
                      <span className="text-[14px] font-semibold">{o.hours}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-line bg-dirty section-y">
        <div className="shell">
          <SectionHeading eyebrow="Quick answers" title="Frequently asked questions" align="center" />
          <div className="mx-auto mt-10 flex max-w-[760px] flex-col gap-4">
            {faqs.map((f, i) => {
              const open = openFaq === i;
              return (
                <Card key={f.q} className="overflow-hidden p-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : i)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-[16px] font-semibold tracking-tight">{f.q}</span>
                    <Icon
                      name="expand_more"
                      size={22}
                      className={`flex-shrink-0 text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: open ? "auto" : 0 }}
                    transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-[15px] leading-[1.6] text-muted">{f.a}</p>
                  </motion.div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
