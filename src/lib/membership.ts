import { z } from "zod";

/**
 * Membership application schema.
 * Membership is optional and free — this is an application for review, not a
 * purchase. There are no plans, prices, or payment fields anywhere here.
 */
export const membershipApplicationSchema = z.object({
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
    .min(1, { message: "Contact number is required." })
    .max(40, { message: "Contact number must be under 40 characters." }),
  organization: z
    .string()
    .trim()
    .max(120, { message: "Organization must be under 120 characters." })
    .optional()
    .or(z.literal("")),
  interest: z
    .string()
    .trim()
    .min(1, { message: "Tell us what you're interested in." })
    .max(120, { message: "This must be under 120 characters." }),
  reason: z
    .string()
    .trim()
    .min(1, { message: "A short reason helps us review your application." })
    .max(1000, { message: "Please keep this under 1000 characters." }),
  agree: z.literal(true, { message: "Please confirm the details you provided are accurate." }),
});

export type MembershipApplicationInput = z.infer<typeof membershipApplicationSchema>;

export function collectApplicationErrors(error: z.ZodError<MembershipApplicationInput>) {
  const out: Partial<Record<keyof MembershipApplicationInput, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof MembershipApplicationInput | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}

export const interestOptions = [
  "Priority quote turnaround",
  "Early access to new arrivals",
  "Member events and workshops",
  "Business / fleet sourcing",
  "Something else",
] as const;
