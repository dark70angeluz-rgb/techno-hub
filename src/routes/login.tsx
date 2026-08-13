import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import SiteShell from "@/components/layout/SiteShell";
import Icon from "@/components/kit/Icon";
import { Button } from "@/components/kit/Button";
import { Card, Eyebrow, Field, Reveal, inputClass, invalidClass } from "@/components/kit";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Login — Member Sign In | TechHub" },
      {
        name: "description",
        content:
          "Sign in to your TechHub member account to check your membership status, application progress and account information.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Login — Member Sign In | TechHub" },
      {
        property: "og:description",
        content: "Access your TechHub membership status and account information.",
      },
    ],
  }),
});

const loginSchema = z.object({
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
});

function LoginPage() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [status, setStatus] = useState<"idle" | "loading" | "done">("idle");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      const next: { email?: string; password?: string } = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as "email" | "password";
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("loading");
    setTimeout(() => setStatus("done"), 700);
  };

  return (
    <SiteShell>
      <section className="section-y">
        <div className="shell grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow icon="login">Member login</Eyebrow>
            <h1 className="mt-4 text-[38px] leading-[1.07] tracking-[-0.03em] text-ink md:text-[46px]">
              Welcome back to TechHub.
            </h1>
            <p className="mt-5 max-w-[520px] text-[16px] leading-[1.65] text-muted">
              Sign in to view your membership status, your application progress, and the account
              information we hold for you.
            </p>
            <ul className="mt-8 flex flex-col gap-3">
              {[
                { icon: "verified_user", text: "Check whether your application is approved" },
                { icon: "badge", text: "Review and update your member account information" },
                { icon: "redeem", text: "See the member-exclusive benefits available to you" },
              ].map((i) => (
                <li key={i.text} className="flex items-start gap-2.5 text-[15px] text-muted">
                  <Icon name={i.icon} size={18} className="mt-0.5 shrink-0 text-blue" />
                  {i.text}
                </li>
              ))}
            </ul>
          </Reveal>

          <Card className="p-7 lg:col-span-6">
            {status === "done" ? (
              <div className="flex flex-col items-start gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-[14px] bg-tint">
                  <Icon name="check_circle" size={24} className="text-blue" />
                </span>
                <h2 className="text-[22px] font-semibold tracking-tight text-navy">
                  You&apos;re signed in
                </h2>
                <p className="text-[15px] leading-[1.6] text-muted">
                  Signed in as <span className="font-semibold text-navy">{values.email}</span>. In
                  the Complete Package this session is issued by the membership system and your
                  status is read from the CMS.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link to="/membership/status">
                    <Button icon="arrow_forward">View membership status</Button>
                  </Link>
                  <Button variant="secondary" onClick={() => setStatus("idle")}>
                    Sign out
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="flex flex-col gap-5">
                <div>
                  <h2 className="text-[22px] font-semibold tracking-tight text-navy">Sign in</h2>
                  <p className="mt-1.5 text-[14.5px] text-muted">
                    Use the email address on your membership application.
                  </p>
                </div>

                <Field label="Email address" htmlFor="login-email" required error={errors.email}>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    value={values.email}
                    maxLength={255}
                    onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                    className={`${inputClass} ${errors.email ? invalidClass : ""}`}
                    placeholder="you@company.com"
                  />
                </Field>

                <Field label="Password" htmlFor="login-password" required error={errors.password}>
                  <input
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    value={values.password}
                    maxLength={128}
                    onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                    className={`${inputClass} ${errors.password ? invalidClass : ""}`}
                    placeholder="••••••••"
                  />
                </Field>

                <Button type="submit" fullWidth loading={status === "loading"} icon="arrow_forward">
                  Sign in
                </Button>

                <p className="text-[14.5px] text-muted">
                  No account yet?{" "}
                  <Link to="/get-started" className="font-semibold text-blue hover:underline">
                    Get started
                  </Link>
                </p>
              </form>
            )}
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
