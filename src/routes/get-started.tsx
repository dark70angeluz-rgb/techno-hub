import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import SiteShell from "@/components/layout/SiteShell";
import Icon from "@/components/kit/Icon";
import { Button } from "@/components/kit/Button";
import { Card, Eyebrow, Field, Reveal, inputClass, invalidClass } from "@/components/kit";

export const Route = createFileRoute("/get-started")({
  component: GetStartedPage,
  head: () => ({
    meta: [
      { title: "Get Started — Create Your TechHub Account" },
      {
        name: "description",
        content:
          "Create a TechHub account, then apply for membership. Registration is free and every application is reviewed by an administrator before approval.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Get Started — Create Your TechHub Account" },
      {
        property: "og:description",
        content: "Sign up in a minute, then submit your membership application for review.",
      },
    ],
  }),
});

const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Full name is required." })
      .max(100, { message: "Full name must be under 100 characters." }),
    email: z
      .string()
      .trim()
      .min(1, { message: "Email address is required." })
      .email({ message: "Enter a valid email address." })
      .max(255, { message: "Email must be under 255 characters." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(128, { message: "Password must be under 128 characters." }),
    confirm: z.string().min(1, { message: "Please confirm your password." }),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

type FormKey = "name" | "email" | "password" | "confirm";

const steps = [
  {
    icon: "person_add",
    title: "Create your account",
    desc: "Name, email and a password. Free, and no payment details are ever collected.",
  },
  {
    icon: "edit_note",
    title: "Apply for membership",
    desc: "A short application form covering your interests and organization.",
  },
  {
    icon: "verified",
    title: "Administrator review",
    desc: "An admin reviews, approves or rejects your application — you're notified by email.",
  },
];

function GetStartedPage() {
  const [values, setValues] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<Partial<Record<FormKey, string>>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<FormKey, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as FormKey;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("loading");
    setTimeout(() => setStatus("done"), 700);
  };

  const set = (key: FormKey) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  return (
    <SiteShell>
      <section className="border-b border-line section-y">
        <div className="shell grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow icon="rocket_launch">Get started</Eyebrow>
            <h1 className="mt-4 text-[38px] leading-[1.07] tracking-[-0.03em] text-ink md:text-[46px]">
              Register, then apply for membership.
            </h1>
            <p className="mt-5 max-w-[520px] text-[16px] leading-[1.65] text-muted">
              Signing up takes a minute. Membership itself is free and optional — applications are
              reviewed by an administrator, and you&apos;ll get an email with the decision.
            </p>

            <ol className="mt-9 flex flex-col gap-5">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] border border-line bg-dirty">
                    <Icon name={s.icon} size={19} className="text-blue" />
                  </span>
                  <div>
                    <p className="text-[15.5px] font-semibold text-navy">
                      {i + 1}. {s.title}
                    </p>
                    <p className="mt-1 text-[14.5px] leading-[1.6] text-muted">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Card className="p-7 lg:col-span-6">
            {status === "done" ? (
              <div className="flex flex-col items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-tint">
                  <Icon name="mark_email_read" size={24} className="text-blue" />
                </span>
                <h2 className="text-[22px] font-semibold tracking-tight text-navy">
                  Account created
                </h2>
                <p className="text-[15px] leading-[1.6] text-muted">
                  Welcome, <span className="font-semibold text-navy">{values.name}</span>. A
                  confirmation email is on its way to{" "}
                  <span className="font-semibold text-navy">{values.email}</span>. The next step is
                  your membership application.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link to="/membership/apply">
                    <Button icon="arrow_forward">Apply for membership</Button>
                  </Link>
                  <Link to="/membership/status">
                    <Button variant="secondary">Check status</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="flex flex-col gap-5">
                <div>
                  <h2 className="text-[22px] font-semibold tracking-tight text-navy">
                    Create your account
                  </h2>
                  <p className="mt-1.5 text-[14.5px] text-muted">
                    Already registered?{" "}
                    <Link to="/login" className="font-semibold text-blue hover:underline">
                      Log in instead
                    </Link>
                    .
                  </p>
                </div>

                <Field label="Full name" htmlFor="su-name" required error={errors.name}>
                  <input
                    id="su-name"
                    value={values.name}
                    maxLength={100}
                    autoComplete="name"
                    onChange={set("name")}
                    className={`${inputClass} ${errors.name ? invalidClass : ""}`}
                    placeholder="Juan dela Cruz"
                  />
                </Field>

                <Field label="Email address" htmlFor="su-email" required error={errors.email}>
                  <input
                    id="su-email"
                    type="email"
                    value={values.email}
                    maxLength={255}
                    autoComplete="email"
                    onChange={set("email")}
                    className={`${inputClass} ${errors.email ? invalidClass : ""}`}
                    placeholder="you@company.com"
                  />
                </Field>

                <Field
                  label="Password"
                  htmlFor="su-password"
                  required
                  error={errors.password}
                  hint="At least 8 characters."
                >
                  <input
                    id="su-password"
                    type="password"
                    value={values.password}
                    maxLength={128}
                    autoComplete="new-password"
                    onChange={set("password")}
                    className={`${inputClass} ${errors.password ? invalidClass : ""}`}
                    placeholder="••••••••"
                  />
                </Field>

                <Field label="Confirm password" htmlFor="su-confirm" required error={errors.confirm}>
                  <input
                    id="su-confirm"
                    type="password"
                    value={values.confirm}
                    maxLength={128}
                    autoComplete="new-password"
                    onChange={set("confirm")}
                    className={`${inputClass} ${errors.confirm ? invalidClass : ""}`}
                    placeholder="••••••••"
                  />
                </Field>

                <Button type="submit" fullWidth loading={status === "loading"} icon="arrow_forward">
                  Create account
                </Button>
              </form>
            )}
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
