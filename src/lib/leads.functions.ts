import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { leadSchema } from "./leads";
import { formatLeadEmail, sendAdminNotification } from "./notify.server";

/**
 * The single server entry point for inbound leads (contact messages and
 * product quote requests). Both the Contact page and the Get a Quote modal
 * call this, so there is exactly one submission path on the site.
 *
 * Every submission notifies the designated administrator by email through the
 * configured email service; the result is returned so the admin delivery log
 * reflects what actually happened.
 */
export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    leadSchema
      .and(z.object({ notifyEmail: z.string().email().optional() }).partial())
      .parse(data)
  )
  .handler(async ({ data }) => {
    const endpoint = process.env["LEADS_ENDPOINT"];
    const token = process.env["LEADS_TOKEN"];

    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      subject: data.subject,
      inquiryType: data.inquiryType,
      message: data.message,
      source: data.source,
      productName: data.productName || null,
      productBrand: data.productBrand || null,
      productSlug: data.productSlug || null,
      submittedAt: new Date().toISOString(),
      status: "New",
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

      if (!res.ok) {
        throw new Error("The lead service rejected this submission.");
      }
    } else {
      console.info("[lead:received]", {
        source: payload.source,
        inquiryType: payload.inquiryType,
        subject: payload.subject,
        productSlug: payload.productSlug,
        submittedAt: payload.submittedAt,
      });
    }

    const notification = await sendAdminNotification({
      to: data.notifyEmail,
      replyTo: data.email,
      subject:
        data.source === "quote"
          ? `Quote request — ${data.productName || data.subject}`
          : `New inquiry from ${data.name} — ${data.subject}`,
      text: formatLeadEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        subject: data.subject,
        inquiryType: data.inquiryType,
        message: data.message,
        source: data.source,
        productName: data.productName,
        submittedAt: payload.submittedAt,
      }),
    });

    return { ok: true as const, submittedAt: payload.submittedAt, notification };
  });

/** Sends a sample notification so an administrator can verify the setup. */
export const sendTestNotification = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) =>
    z.object({ to: z.string().trim().email("Enter a valid administrator email.") }).parse(data)
  )
  .handler(async ({ data }) => {
    return await sendAdminNotification({
      to: data.to,
      subject: "TechHub test notification",
      text: "This is a test notification from the TechHub admin portal. If you received this, contact form notifications are configured correctly.",
    });
  });
