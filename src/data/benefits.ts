/**
 * Static demo benefit data.
 *
 * `audience` decides what a guest sees: "public" benefits are fully readable by
 * anyone, "member" benefits are listed with a Member Only indicator and prompt
 * for Login / Join Us. Membership is optional — browsing never requires it.
 */
export type BenefitAudience = "public" | "member";

export interface Benefit {
  id: string;
  title: string;
  icon: string;
  summary: string;
  details: string[];
  audience: BenefitAudience;
  featured: boolean;
  image?: string;
}

export const benefits: Benefit[] = [
  {
    id: "specialist-support",
    title: "Specialist support",
    icon: "support_agent",
    summary: "Talk to a product specialist about specs, compatibility and sourcing.",
    details: [
      "Answers on specifications and compatibility",
      "Guidance on which configuration fits your use case",
      "Replies by email within four hours on business days",
    ],
    audience: "public",
    featured: true,
  },
  {
    id: "open-quotes",
    title: "Quotes on any product",
    icon: "request_quote",
    summary: "Request a quote on anything in the showcase — no account required.",
    details: [
      "No cart and no checkout, ever",
      "Quantities and timelines priced per request",
      "Open to guests and members alike",
    ],
    audience: "public",
    featured: true,
  },
  {
    id: "event-access",
    title: "Open event listings",
    icon: "event",
    summary: "Every summit, workshop and expo we host or attend is published openly.",
    details: [
      "Dates, locations and descriptions for each event",
      "Informational listings, nothing to register for",
      "Ask the team about any event by message",
    ],
    audience: "public",
    featured: true,
  },
  {
    id: "brand-catalogue",
    title: "Multi-brand comparison",
    icon: "storefront",
    summary: "Compare products from every brand we carry side by side on one page.",
    details: [
      "A curated selection per brand, not every SKU",
      "Full descriptions on the home showcase",
      "Reviewed with each partner every quarter",
    ],
    audience: "public",
    featured: false,
  },
  {
    id: "priority-quotes",
    title: "Priority quote turnaround",
    icon: "bolt",
    summary: "Member requests are placed at the front of the specialist queue.",
    details: [
      "Quote requests reviewed ahead of the general queue",
      "A named specialist follows your open requests",
      "Consolidated summaries for multi-product requests",
    ],
    audience: "member",
    featured: true,
  },
  {
    id: "early-access",
    title: "Early access to new arrivals",
    icon: "new_releases",
    summary: "See new catalogue additions before they appear on the public showcase.",
    details: [
      "Advance notice on incoming brands and products",
      "First look at replacement models",
      "Early quote windows on limited stock",
    ],
    audience: "member",
    featured: false,
  },
  {
    id: "member-events",
    title: "Member gatherings",
    icon: "groups",
    summary: "Invitations to member meetups alongside the events we already publish.",
    details: [
      "Invitations to member-only gatherings",
      "Reserved seats at hosted sessions",
      "Introductions to the specialists behind each brand",
    ],
    audience: "member",
    featured: false,
  },
  {
    id: "account-history",
    title: "Account & request history",
    icon: "history",
    summary: "Keep every quote request and message in one member account view.",
    details: [
      "A single record of past requests",
      "Contact details kept up to date for faster replies",
      "Membership status visible at any time",
    ],
    audience: "member",
    featured: false,
  },
];

export const publicBenefits = benefits.filter((b) => b.audience === "public");
export const memberBenefits = benefits.filter((b) => b.audience === "member");
