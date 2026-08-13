import { z } from "zod";

/**
 * Single shared schema for every inbound lead on the site.
 * Used by the Contact page form and the product "Get a Quote" modal so both
 * flows go through one validation + submission path (no duplicate logic).
 * The field names mirror the CMS lead/inquiry structure so this can be wired
 * to Strapi later without changing the forms.
 */
export const inquiryTypes = [
  "General Inquiry",
  "Product Quote",
  "Membership",
  "Partnership Opportunity",
  "Event Question",
] as const;

export type InquiryType = (typeof inquiryTypes)[number];

export const leadSchema = z.object({
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
  phone: z
    .string()
    .trim()
    .max(40, { message: "Contact number must be under 40 characters." })
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .trim()
    .max(120, { message: "Company must be under 120 characters." })
    .optional()
    .or(z.literal("")),
  subject: z
    .string()
    .trim()
    .min(1, { message: "Subject is required." })
    .max(160, { message: "Subject must be under 160 characters." }),
  inquiryType: z.enum(inquiryTypes),
  message: z
    .string()
    .trim()
    .min(1, { message: "Message is required." })
    .max(2000, { message: "Message must be under 2000 characters." }),
  source: z.enum(["contact", "quote"]),
  productName: z.string().trim().max(160).optional().or(z.literal("")),
  productBrand: z.string().trim().max(120).optional().or(z.literal("")),
  productSlug: z.string().trim().max(120).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

/** Field-level errors keyed by field name, ready for inline form display. */
export function collectFieldErrors(error: z.ZodError<LeadInput>) {
  const out: Partial<Record<keyof LeadInput, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof LeadInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
