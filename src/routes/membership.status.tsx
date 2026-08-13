import { createFileRoute, Link } from "@tanstack/react-router";
import SiteShell from "@/components/layout/SiteShell";
import Icon from "@/components/kit/Icon";
import { ButtonLink } from "@/components/kit/Button";
import { Card, Eyebrow, StatusChip } from "@/components/kit";
import { demoAccount } from "@/data/membership";
import { benefits } from "@/data/benefits";

export const Route = createFileRoute("/membership/status")({
  component: MembershipStatusPage,
  head: () => ({
    meta: [
      { title: "Membership Status — TechHub" },
      {
        name: "description",
        content:
          "Check the status of your TechHub membership application: pending review, approved, or declined, with the member benefits available to you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Membership Status — TechHub" },
      {
        property: "og:description",
        content: "See where your TechHub membership application stands.",
      },
    ],
  }),
});

const statusMeta = {
  Pending: {
    icon: "hourglass_top",
    tone: "outline" as const,
    headline: "Your application is under review.",
    body: "A specialist is reviewing your details. You'll get a decision by email within two business days.",
  },
  Approved: {
    icon: "verified",
    tone: "blue" as const,
    headline: "You're an approved member.",
    body: "Member-exclusive benefits are active on your account. Quote requests you send are flagged for priority handling.",
  },
  Rejected: {
    icon: "info",
    tone: "neutral" as const,
    headline: "This application wasn't approved.",
    body: "You can apply again at any time, or contact us and we'll explain what to include next time.",
  },
};

function MembershipStatusPage() {
  const account = demoAccount;
  const meta = statusMeta[account.status];
  const memberBenefits = benefits.filter((b) => b.audience === "member");

  return (
    <SiteShell>
      <section className="border-b border-line bg-dirty">
        <div className="shell flex items-center gap-2 py-4 text-[13.5px] text-muted">
          <Link to="/" className="transition-colors hover:text-navy">
            Home
          </Link>
          <Icon name="chevron_right" size={16} className="text-faint" />
          <Link to="/membership" className="transition-colors hover:text-navy">
            Membership
          </Link>
          <Icon name="chevron_right" size={16} className="text-faint" />
          <span className="font-medium text-navy">Status</span>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Eyebrow icon="badge">Application status</Eyebrow>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="text-[32px] leading-[1.1] tracking-[-0.025em] md:text-[38px]">
                {meta.headline}
              </h1>
            </div>
            <div className="mt-4">
              <StatusChip label={account.status} tone={meta.tone} icon={meta.icon} />
            </div>
            <p className="mt-5 max-w-[560px] text-[16px] leading-[1.65] text-muted">{meta.body}</p>

            <Card className="mt-8 p-6">
              <h2 className="text-[17px] font-semibold tracking-tight">Application summary</h2>
              <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                {[
                  { label: "Reference", value: account.applicationId },
                  { label: "Applicant", value: account.name },
                  { label: "Email", value: account.email },
                  { label: "Contact number", value: account.phone },
                  { label: "Organization", value: account.organization },
                  { label: "Submitted", value: account.submittedAt },
                  { label: "Reviewed", value: account.reviewedAt },
                  {
                    label: "Member since",
                    value: account.status === "Approved" ? account.memberSince : "—",
                  },
                ].map((row) => (
                  <div key={row.label}>
                    <dt className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-faint">
                      {row.label}
                    </dt>
                    <dd className="mt-1 text-[15px] font-medium text-navy">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </Card>

            <div className="mt-6 flex flex-wrap gap-3">
              {account.status === "Rejected" ? (
                <ButtonLink to="/membership/apply" icon="arrow_forward">
                  Apply again
                </ButtonLink>
              ) : (
                <ButtonLink to="/benefits" icon="arrow_forward">
                  View your benefits
                </ButtonLink>
              )}
              <ButtonLink to="/contact" variant="secondary" iconLeading="forum">
                Contact support
              </ButtonLink>
            </div>
          </div>

          <aside className="lg:col-span-5">
            <Card className="flex flex-col gap-4 p-6">
              <h2 className="text-[17px] font-semibold tracking-tight">
                {account.status === "Approved" ? "Active member benefits" : "What approval unlocks"}
              </h2>
              <ul className="flex flex-col divide-y divide-[color:var(--color-line)]">
                {memberBenefits.map((benefit) => (
                  <li key={benefit.id} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                    <Icon
                      name={account.status === "Approved" ? "check_circle" : benefit.icon}
                      size={19}
                      className={account.status === "Approved" ? "mt-0.5 text-blue" : "mt-0.5 text-faint"}
                      fill={account.status === "Approved"}
                    />
                    <div>
                      <p className="text-[15px] font-medium text-navy">{benefit.title}</p>
                      <p className="mt-0.5 text-[13.5px] leading-[1.55] text-muted">
                        {benefit.summary}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="border-t border-line pt-4 text-[13.5px] text-faint">
                Public benefits, product browsing and quote requests stay available to everyone,
                regardless of membership.
              </p>
            </Card>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
