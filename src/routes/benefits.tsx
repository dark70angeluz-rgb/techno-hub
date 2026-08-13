import { createFileRoute } from "@tanstack/react-router";
import SiteShell from "@/components/layout/SiteShell";
import Icon from "@/components/kit/Icon";
import { ButtonLink } from "@/components/kit/Button";
import { Card, Eyebrow, Reveal, SectionHeading, StatusChip } from "@/components/kit";
import { type Benefit } from "@/data/benefits";
import { usePublicBenefits } from "@/lib/admin-store";

export const Route = createFileRoute("/benefits")({
  component: BenefitsPage,
  head: () => ({
    meta: [
      { title: "Benefits — Open to Everyone & Member-Exclusive | TechHub" },
      {
        name: "description",
        content:
          "See exactly what TechHub offers guests for free and what optional membership adds: priority quotes, early access, member gatherings and request history.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Benefits — Open to Everyone & Member-Exclusive | TechHub" },
      {
        property: "og:description",
        content:
          "What's free for everyone, and what optional TechHub membership adds on top. No plans, no fees.",
      },
    ],
  }),
});

/** Fully readable card — public benefits hide nothing from guests. */
function PublicBenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <Card className="flex h-full flex-col gap-3 p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-tint">
          <Icon name={benefit.icon} size={21} className="text-blue" />
        </span>
        <StatusChip label="Everyone" tone="blue" icon="public" />
      </div>
      <h3 className="text-[17px] font-semibold tracking-tight">{benefit.title}</h3>
      <p className="text-[14.5px] leading-[1.6] text-muted">{benefit.summary}</p>
      <ul className="mt-1 flex flex-col gap-2 border-t border-line pt-4">
        {benefit.details.map((detail) => (
          <li key={detail} className="flex items-start gap-2 text-[14px] leading-[1.55] text-muted">
            <Icon name="check" size={16} className="mt-0.5 shrink-0 text-blue" />
            {detail}
          </li>
        ))}
      </ul>
    </Card>
  );
}

/** Member-exclusive card — described openly, with a guest CTA instead of access. */
function MemberBenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <Card className="flex h-full flex-col gap-3 border-line-strong p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-navy">
          <Icon name={benefit.icon} size={21} className="text-white" />
        </span>
        <StatusChip label="Member only" tone="navy" icon="lock" />
      </div>
      <h3 className="text-[17px] font-semibold tracking-tight">{benefit.title}</h3>
      <p className="text-[14.5px] leading-[1.6] text-muted">{benefit.summary}</p>
      <ul className="mt-1 flex flex-col gap-2 border-t border-line pt-4">
        {benefit.details.map((detail) => (
          <li key={detail} className="flex items-start gap-2 text-[14px] leading-[1.55] text-muted">
            <Icon name="check" size={16} className="mt-0.5 shrink-0 text-navy" />
            {detail}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <ButtonLink to="/membership/apply" size="sm" icon="arrow_forward">
          Join to unlock
        </ButtonLink>
        <ButtonLink to="/membership/status" size="sm" variant="secondary">
          Already applied?
        </ButtonLink>
      </div>
    </Card>
  );
}

function BenefitsPage() {
  const allBenefits = usePublicBenefits();
  const publicBenefits = allBenefits.filter((b) => b.audience === "public");
  const memberBenefits = allBenefits.filter((b) => b.audience === "member");
  return (
    <SiteShell>
      <header className="border-b border-line section-y">
        <div className="shell flex flex-col gap-5">
          <Reveal>
            <Eyebrow icon="workspace_premium">Benefits</Eyebrow>
          </Reveal>
          <Reveal delay={0.04}>
            <h1 className="max-w-[760px] text-[40px] leading-[1.05] tracking-[-0.03em] md:text-[52px]">
              What's open to everyone, and what membership adds.
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="max-w-[600px] text-[16px] leading-[1.65] text-muted">
              Most of what we offer needs no account at all. Membership is free, optional and
              application-based — it only layers priority and access on top.
            </p>
          </Reveal>
          <Reveal delay={0.12} className="flex flex-wrap gap-3 pt-2">
            <ButtonLink to="/membership" size="lg" icon="arrow_forward">
              About membership
            </ButtonLink>
            <ButtonLink to="/contact" size="lg" variant="secondary" iconLeading="forum">
              Ask a specialist
            </ButtonLink>
          </Reveal>
        </div>
      </header>

      <section className="section-y">
        <div className="shell flex flex-col gap-9">
          <SectionHeading
            eyebrow="Available to everyone"
            title="No account needed"
            description="Browse, compare and request quotes as a guest. These benefits are never gated."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {publicBenefits.map((benefit, i) => (
              <Reveal key={benefit.id} delay={Math.min(i * 0.04, 0.2)} className="h-full">
                <PublicBenefitCard benefit={benefit} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-dirty section-y">
        <div className="shell flex flex-col gap-9">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Member-exclusive"
              title="Reserved for approved members"
              description="You can read exactly what each one includes before deciding whether to apply."
            />
            <ButtonLink to="/membership/apply" variant="dark" icon="arrow_forward">
              Apply for membership
            </ButtonLink>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {memberBenefits.map((benefit, i) => (
              <Reveal key={benefit.id} delay={Math.min(i * 0.04, 0.2)} className="h-full">
                <MemberBenefitCard benefit={benefit} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="shell">
          <Reveal>
            <div className="flex flex-col items-start gap-8 rounded-[24px] bg-navy p-10 text-white lg:flex-row lg:items-center lg:justify-between lg:p-14">
              <div className="max-w-[560px]">
                <Eyebrow icon="bolt">Ready when you are</Eyebrow>
                <h2 className="mt-4 mb-3 text-[30px] leading-tight tracking-[-0.02em] lg:text-[36px]">
                  Membership is free — the only cost is two minutes.
                </h2>
                <p className="text-[16px] leading-[1.6] text-white/65">
                  Submit an application, we review it, and you'll hear back by email. Keep browsing
                  and requesting quotes as a guest in the meantime.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink to="/membership/apply" size="lg" icon="arrow_forward">
                  Apply now
                </ButtonLink>
                <ButtonLink to="/" size="lg" variant="secondary" iconLeading="devices">
                  Browse products
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </SiteShell>
  );
}
