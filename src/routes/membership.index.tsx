import { createFileRoute, Link } from "@tanstack/react-router";
import SiteShell from "@/components/layout/SiteShell";
import Icon from "@/components/kit/Icon";
import { ButtonLink } from "@/components/kit/Button";
import { Card, Eyebrow, Reveal, SectionHeading } from "@/components/kit";
import { benefits } from "@/data/benefits";

export const Route = createFileRoute("/membership/")({
  component: MembershipPage,
  head: () => ({
    meta: [
      { title: "Membership — Apply to Join TechHub" },
      {
        name: "description",
        content:
          "Membership at TechHub is optional and free. Apply, wait for a short review, and unlock member-exclusive benefits. Browsing and quotes stay open to everyone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Membership — Apply to Join TechHub" },
      {
        property: "og:description",
        content:
          "Apply for optional TechHub membership. Free, review-based, and never required to browse or request a quote.",
      },
    ],
  }),
});

const steps = [
  {
    icon: "edit_note",
    title: "Submit an application",
    desc: "A short form: who you are, how to reach you, and what you're interested in.",
  },
  {
    icon: "hourglass_top",
    title: "We review it",
    desc: "A specialist checks your details. Most applications are reviewed within two business days.",
  },
  {
    icon: "verified",
    title: "Get your decision",
    desc: "You'll hear by email. Approved applicants get member-exclusive benefits immediately.",
  },
];

function MembershipPage() {
  const memberBenefits = benefits.filter((b) => b.audience === "member");

  return (
    <SiteShell>
      <section className="border-b border-line section-y">
        <div className="shell grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow icon="workspace_premium">Membership</Eyebrow>
            <h1 className="mt-4 max-w-[600px] text-[40px] leading-[1.05] tracking-[-0.03em] md:text-[50px]">
              Optional membership, for people who come back.
            </h1>
            <p className="mt-5 max-w-[560px] text-[16px] leading-[1.65] text-muted">
              You never need an account to browse products, read benefits, follow events, or request
              a quote. Membership is free and application-based — it simply adds priority and
              member-only access on top of everything that's already public.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink to="/membership/apply" size="lg" icon="arrow_forward">
                Apply for membership
              </ButtonLink>
              <ButtonLink to="/membership/status" size="lg" variant="secondary" iconLeading="badge">
                Check application status
              </ButtonLink>
            </div>
            <p className="mt-4 flex items-center gap-2 text-[13.5px] text-faint">
              <Icon name="info" size={16} className="text-blue" />
              No fees, no plans, no payment details — membership is not a purchase.
            </p>
          </Reveal>

          <Reveal delay={0.06} className="lg:col-span-5">
            <Card className="flex flex-col gap-5 p-6">
              <h2 className="text-[17px] font-semibold tracking-tight">How it works</h2>
              <ol className="flex flex-col divide-y divide-[color:var(--color-line)]">
                {steps.map((step, i) => (
                  <li key={step.title} className="flex items-start gap-3.5 py-4 first:pt-0 last:pb-0">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-tint text-[13.5px] font-bold text-blue">
                      {i + 1}
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 text-[15px] font-semibold text-navy">
                        <Icon name={step.icon} size={17} className="text-blue" />
                        {step.title}
                      </p>
                      <p className="mt-1 text-[14px] leading-[1.55] text-muted">{step.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="shell flex flex-col gap-10">
          <SectionHeading
            eyebrow="Member-exclusive"
            title="What membership adds"
            description="Everything else on this site stays open to guests. These are the parts reserved for approved members."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {memberBenefits.map((benefit, i) => (
              <Reveal key={benefit.id} delay={Math.min(i * 0.04, 0.2)} className="h-full">
                <Card className="flex h-full flex-col gap-3 p-6">
                  <span className="flex h-11 w-11 items-center justify-center rounded-[10px] bg-navy">
                    <Icon name={benefit.icon} size={21} className="text-white" />
                  </span>
                  <h3 className="text-[17px] font-semibold tracking-tight">{benefit.title}</h3>
                  <p className="text-[14.5px] leading-[1.6] text-muted">{benefit.summary}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <p className="text-[14.5px] text-muted">
            Not sure yet?{" "}
            <Link to="/benefits" className="font-semibold text-blue hover:underline">
              Compare public and member benefits
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-dirty section-y">
        <div className="shell flex flex-col items-center gap-6 text-center">
          <SectionHeading
            align="center"
            title="Ready to apply?"
            description="It takes about two minutes, and you'll get a decision by email."
          />
          <div className="flex flex-wrap justify-center gap-3">
            <ButtonLink to="/membership/apply" size="lg" icon="arrow_forward">
              Start your application
            </ButtonLink>
            <ButtonLink to="/contact" size="lg" variant="secondary" iconLeading="forum">
              Ask a question first
            </ButtonLink>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
