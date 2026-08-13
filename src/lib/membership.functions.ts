import { createServerFn } from "@tanstack/react-start";
import { membershipApplicationSchema } from "./membership";

/**
 * Submits a membership application for admin review.
 * Applications always start as "Pending"; an admin approves or rejects them
 * from the admin panel. No payment or subscription is involved.
 */
export const submitMembershipApplication = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => membershipApplicationSchema.parse(data))
  .handler(async ({ data }) => {
    const endpoint = process.env["MEMBERSHIP_ENDPOINT"];
    const token = process.env["LEADS_TOKEN"];

    const reference = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = {
      reference,
      name: data.name,
      email: data.email,
      phone: data.phone,
      organization: data.organization || null,
      interest: data.interest,
      reason: data.reason,
      status: "Pending",
      submittedAt: new Date().toISOString(),
    };

    if (endpoint) {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ data: payload }),
      });
      if (!res.ok) throw new Error("The membership service rejected this application.");
    } else {
      console.info("[membership:application]", {
        reference,
        interest: payload.interest,
        submittedAt: payload.submittedAt,
      });
    }

    return { ok: true as const, reference, submittedAt: payload.submittedAt };
  });
