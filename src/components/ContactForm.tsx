import { useEffect, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import Icon from "@/components/kit/Icon";
import { Button } from "@/components/kit/Button";
import { Field, inputClass, invalidClass, textareaClass } from "@/components/kit";
import {
  collectFieldErrors,
  inquiryTypes,
  leadSchema,
  type InquiryType,
  type LeadInput,
} from "@/lib/leads";
import { submitLead } from "@/lib/leads.functions";
import { useAdminStore } from "@/lib/content-store";

type Status = "idle" | "loading" | "success" | "error";
type Errors = Partial<Record<keyof LeadInput, string>>;

const contactTypes = inquiryTypes;

const empty = {
  name: "",
  email: "",
  phone: "",
  company: "",
  subject: "",
  inquiryType: contactTypes[0] as InquiryType,
  message: "",
};

export type QuoteProduct = { name: string; brand: string; slug: string };

/** Contact form shared by the home Contact section and the Contact page. */
export default function ContactForm({
  idPrefix = "contact",
  product,
}: {
  idPrefix?: string;
  product?: QuoteProduct | undefined;
}) {
  const send = useServerFn(submitLead);
  const { provider, rules, addLogEntry } = useAdminStore();
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  // A "Get a Quote" click lands here with ?product=<slug>: pre-fill the subject
  // and inquiry type from the selected product.
  useEffect(() => {
    if (!product) return;
    setForm((f) => ({
      ...f,
      subject: `Quote for ${product.name}`,
      inquiryType: "Product Quote",
    }));
  }, [product?.slug, product?.name]);

  const id = (name: string) => `${idPrefix}-${name}`;

  const set = (key: keyof typeof empty, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = leadSchema.safeParse({
      ...form,
      subject: form.subject.trim() || form.inquiryType,
      source: product ? "quote" : "contact",
      ...(product
        ? { productName: product.name, productBrand: product.brand, productSlug: product.slug }
        : {}),
    });

    if (!parsed.success) {
      setErrors(collectFieldErrors(parsed.error));
      setStatus("idle");
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const rule = rules.find((r) => r.id === "contact");
      const recipient = rule?.recipients || provider.adminEmail;
      const result = await send({
        data: { ...parsed.data, ...(rule?.on !== false ? { notifyEmail: recipient } : {}) },
      });
      if (rule?.on !== false) {
        addLogEntry({
          to: recipient,
          subject: `New inquiry from ${parsed.data.name} — ${parsed.data.subject}`,
          type: "Contact form",
          status: result?.notification?.delivered ? "Delivered" : "Queued",
        });
      }
      setForm(empty);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {status === "success" && (
        <p
          role="status"
          className="flex items-start gap-2 rounded-[10px] border border-line-blue bg-tint px-3.5 py-3 text-[13.5px] text-blue"
        >
          <Icon name="check_circle" size={17} fill />
          Message sent. Our team replies within four hours on business days.
        </p>
      )}
      {status === "error" && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-[10px] border border-danger/30 bg-danger-tint px-3.5 py-3 text-[13.5px] text-danger"
        >
          <Icon name="error" size={17} />
          We couldn't send your message. Please try again, or email hello@techhub.io directly.
        </p>
      )}
      {product && status !== "success" && (
        <div className="flex items-start gap-2.5 rounded-[10px] border border-line bg-dirty px-3.5 py-3">
          <Icon name="request_quote" size={18} className="mt-0.5 shrink-0 text-blue" />
          <p className="text-[13.5px] leading-[1.55] text-muted">
            Quote request for{" "}
            <span className="font-semibold text-navy">
              {product.name.toLowerCase().startsWith(product.brand.toLowerCase())
                ? product.name
                : `${product.brand} ${product.name}`}
            </span>

            . The subject is filled in for you — add quantities or timelines below.
          </p>
        </div>
      )}



      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Full Name" required error={errors.name} htmlFor={id("name")}>
          <input
            id={id("name")}
            name="name"
            autoComplete="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id("name")}-error` : undefined}
            placeholder="Alex Morgan"
            className={`${inputClass} ${errors.name ? invalidClass : ""}`}
          />
        </Field>
        <Field label="Email" required error={errors.email} htmlFor={id("email")}>
          <input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${id("email")}-error` : undefined}
            placeholder="alex@company.com"
            className={`${inputClass} ${errors.email ? invalidClass : ""}`}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Contact Number" hint="Optional" error={errors.phone} htmlFor={id("phone")}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            placeholder="+63 900 000 0000"
            className={`${inputClass} ${errors.phone ? invalidClass : ""}`}
          />
        </Field>
        <Field
          label="Company / Organization"
          hint="Optional"
          error={errors.company}
          htmlFor={id("company")}
        >
          <input
            id={id("company")}
            name="company"
            autoComplete="organization"
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            aria-invalid={Boolean(errors.company)}
            placeholder="Northwind Studios"
            className={`${inputClass} ${errors.company ? invalidClass : ""}`}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Inquiry Type" required htmlFor={id("type")}>
          <select
            id={id("type")}
            name="inquiryType"
            value={form.inquiryType}
            onChange={(e) => set("inquiryType", e.target.value)}
            className={`${inputClass} appearance-none pr-10`}
          >
            {contactTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Subject"
          hint="Defaults to the inquiry type"
          error={errors.subject}
          htmlFor={id("subject")}
        >
          <input
            id={id("subject")}
            name="subject"
            value={form.subject}
            onChange={(e) => set("subject", e.target.value)}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? `${id("subject")}-error` : undefined}
            placeholder={form.inquiryType}
            className={`${inputClass} ${errors.subject ? invalidClass : ""}`}
          />
        </Field>
      </div>

      <Field label="Message" required error={errors.message} htmlFor={id("message")}>
        <textarea
          id={id("message")}
          name="message"
          rows={5}
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${id("message")}-error` : undefined}
          placeholder="Tell us what you're looking for."
          className={`${textareaClass} ${errors.message ? invalidClass : ""}`}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <Button type="submit" size="lg" icon="send" loading={status === "loading"}>
          {status === "loading" ? "Sending…" : "Send Message"}
        </Button>
        <p className="text-[13px] text-faint">No account needed — we reply by email.</p>
      </div>
    </form>
  );
}
