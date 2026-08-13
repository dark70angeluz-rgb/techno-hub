import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import SiteShell from "@/components/layout/SiteShell";
import Icon from "@/components/kit/Icon";
import { Button, ButtonLink } from "@/components/kit/Button";
import { Card, Eyebrow, Field, inputClass, invalidClass, textareaClass } from "@/components/kit";
import {
  collectApplicationErrors,
  interestOptions,
  membershipApplicationSchema,
  type MembershipApplicationInput,
} from "@/lib/membership";
import { submitMembershipApplication } from "@/lib/membership.functions";

export const Route = createFileRoute("/membership/apply")({
  component: MembershipApplyPage,
  head: () => ({
    meta: [
      { title: "Apply for Membership — TechHub" },
      {
        name: "description",
        content:
          "Submit a free TechHub membership application. Share your details, tell us what you're interested in, and get a decision by email within two business days.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Apply for Membership — TechHub" },
      {
        property: "og:description",
        content: "A short, free membership application reviewed by a TechHub specialist.",
      },
    ],
  }),
});

type Status = "idle" | "loading" | "pending" | "error";
type Errors = Partial<Record<keyof MembershipApplicationInput, string>>;

const empty = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  interest: interestOptions[0] as string,
  reason: "",
  agree: false,
};

function MembershipApplyPage() {
  const send = useServerFn(submitMembershipApplication);
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [reference, setReference] = useState("");

  const set = <K extends keyof typeof empty>(key: K, value: (typeof empty)[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as keyof Errors]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = membershipApplicationSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(collectApplicationErrors(parsed.error));
      setStatus("idle");
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const result = await send({ data: parsed.data });
      setReference(result.reference);
      setStatus("pending");
    } catch {
      setStatus("error");
    }
  };

  if (status === "pending") {
    return (
      <SiteShell>
        <section className="section-y">
          <div className="shell flex max-w-[620px] flex-col items-start gap-5">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-tint">
              <Icon name="hourglass_top" size={28} className="text-blue" />
            </span>
            <Eyebrow icon="schedule">Application pending</Eyebrow>
            <h1 className="text-[34px] leading-[1.08] tracking-[-0.025em] md:text-[40px]">
              Thanks — your application is under review.
            </h1>
            <p className="text-[16px] leading-[1.65] text-muted">
              We've received your membership application and a specialist will review it shortly.
              Most decisions are sent by email within two business days.
            </p>
            <Card className="w-full p-6">
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: "Reference", value: reference },
                  { label: "Status", value: "Pending review" },
                  { label: "Decision by", value: "Email, within 2 business days" },
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
            <p className="text-[14.5px] text-muted">
              Nothing is on hold while you wait — browsing, events and quote requests stay open to
              everyone.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <ButtonLink to="/membership/status" icon="arrow_forward">
                View application status
              </ButtonLink>
              <ButtonLink to="/" variant="secondary" iconLeading="home">
                Back to home
              </ButtonLink>
            </div>
          </div>
        </section>
      </SiteShell>
    );
  }

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
          <span className="font-medium text-navy">Apply</span>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Eyebrow icon="edit_note">Membership application</Eyebrow>
            <h1 className="mt-4 text-[34px] leading-[1.08] tracking-[-0.025em] md:text-[40px]">
              Tell us a little about you.
            </h1>
            <p className="mt-5 text-[16px] leading-[1.65] text-muted">
              Membership is free and reviewed by a person, so a sentence or two about what you're
              sourcing goes a long way.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {[
                "No fees and no payment details",
                "Reviewed within two business days",
                "Decision sent by email",
                "You can keep using the site as a guest",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[15px] text-muted">
                  <Icon name="check_circle" size={18} className="mt-0.5 shrink-0 text-blue" fill />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <Card className="p-6 lg:p-8">
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                {status === "error" && (
                  <p
                    role="alert"
                    className="flex items-start gap-2 rounded-[10px] border border-danger/30 bg-danger-tint px-3.5 py-3 text-[13.5px] text-danger"
                  >
                    <Icon name="error" size={17} />
                    We couldn't submit your application. Please try again in a moment.
                  </p>
                )}

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Full Name" required error={errors.name} htmlFor="apply-name">
                    <input
                      id="apply-name"
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) => set("name", e.target.value)}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "apply-name-error" : undefined}
                      placeholder="Alex Morgan"
                      className={`${inputClass} ${errors.name ? invalidClass : ""}`}
                    />
                  </Field>
                  <Field label="Email" required error={errors.email} htmlFor="apply-email">
                    <input
                      id="apply-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "apply-email-error" : undefined}
                      placeholder="alex@company.com"
                      className={`${inputClass} ${errors.email ? invalidClass : ""}`}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="Contact Number" required error={errors.phone} htmlFor="apply-phone">
                    <input
                      id="apply-phone"
                      type="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? "apply-phone-error" : undefined}
                      placeholder="+63 900 000 0000"
                      className={`${inputClass} ${errors.phone ? invalidClass : ""}`}
                    />
                  </Field>
                  <Field
                    label="Company / Organization"
                    hint="Optional"
                    error={errors.organization}
                    htmlFor="apply-org"
                  >
                    <input
                      id="apply-org"
                      autoComplete="organization"
                      value={form.organization}
                      onChange={(e) => set("organization", e.target.value)}
                      aria-invalid={Boolean(errors.organization)}
                      placeholder="Northwind Studios"
                      className={`${inputClass} ${errors.organization ? invalidClass : ""}`}
                    />
                  </Field>
                </div>

                <Field label="Primary interest" required htmlFor="apply-interest">
                  <select
                    id="apply-interest"
                    value={form.interest}
                    onChange={(e) => set("interest", e.target.value)}
                    className={`${inputClass} appearance-none pr-10`}
                  >
                    {interestOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Why would you like to join?"
                  required
                  error={errors.reason}
                  htmlFor="apply-reason"
                >
                  <textarea
                    id="apply-reason"
                    rows={5}
                    value={form.reason}
                    onChange={(e) => set("reason", e.target.value)}
                    aria-invalid={Boolean(errors.reason)}
                    aria-describedby={errors.reason ? "apply-reason-error" : undefined}
                    placeholder="What you typically source, how often, and what you'd use membership for."
                    className={`${textareaClass} ${errors.reason ? invalidClass : ""}`}
                  />
                </Field>

                <div className="flex flex-col gap-1.5">
                  <label className="flex items-start gap-2.5 text-[14px] leading-[1.55] text-muted">
                    <input
                      type="checkbox"
                      checked={form.agree}
                      onChange={(e) => set("agree", e.target.checked)}
                      aria-invalid={Boolean(errors.agree)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded-[4px] border-line-strong accent-[color:var(--color-blue)]"
                    />
                    I confirm the details above are accurate and TechHub may contact me about this
                    application.
                  </label>
                  {errors.agree && (
                    <span role="alert" className="flex items-center gap-1.5 text-[13px] text-danger">
                      <Icon name="error" size={15} />
                      {errors.agree}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 border-t border-line pt-4">
                  <Button type="submit" size="lg" icon="arrow_forward" loading={status === "loading"}>
                    {status === "loading" ? "Submitting…" : "Submit Application"}
                  </Button>
                  <p className="text-[13px] text-faint">Free · no payment details required</p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
