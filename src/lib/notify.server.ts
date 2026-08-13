/**
 * Admin email notification delivery.
 *
 * Uses whichever email service is configured through secrets:
 *   RESEND_API_KEY (+ NOTIFY_FROM, NOTIFY_ADMIN_EMAIL)  → Resend HTTP API
 *   EMAIL_WEBHOOK_URL (+ EMAIL_WEBHOOK_TOKEN)           → generic provider/SMTP relay
 * When neither is set the notification is validated and logged instead of
 * being silently dropped, so nothing is lost before the provider is connected.
 */
export type NotifyResult = {
  delivered: boolean;
  provider: "resend" | "webhook" | "none";
  to: string;
  subject: string;
  error?: string;
};

export type NotifyInput = {
  subject: string;
  text: string;
  replyTo?: string | undefined;
  to?: string | undefined;
};

export async function sendAdminNotification(input: NotifyInput): Promise<NotifyResult> {
  const adminEmail = input.to || process.env["NOTIFY_ADMIN_EMAIL"] || "";
  const from = process.env["NOTIFY_FROM"] || "notifications@techhub.io";
  const resendKey = process.env["RESEND_API_KEY"];
  const webhook = process.env["EMAIL_WEBHOOK_URL"];
  const webhookToken = process.env["EMAIL_WEBHOOK_TOKEN"];

  const base = { to: adminEmail, subject: input.subject };

  try {
    if (resendKey && adminEmail) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          authorization: `Bearer ${resendKey}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [adminEmail],
          subject: input.subject,
          text: input.text,
          ...(input.replyTo ? { reply_to: input.replyTo } : {}),
        }),
      });
      if (!res.ok) {
        return { ...base, delivered: false, provider: "resend", error: `HTTP ${res.status}` };
      }
      return { ...base, delivered: true, provider: "resend" };
    }

    if (webhook && adminEmail) {
      const res = await fetch(webhook, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(webhookToken ? { authorization: `Bearer ${webhookToken}` } : {}),
        },
        body: JSON.stringify({ from, to: adminEmail, ...input }),
      });
      if (!res.ok) {
        return { ...base, delivered: false, provider: "webhook", error: `HTTP ${res.status}` };
      }
      return { ...base, delivered: true, provider: "webhook" };
    }
  } catch (error) {
    return {
      ...base,
      delivered: false,
      provider: resendKey ? "resend" : "webhook",
      error: error instanceof Error ? error.message : "Unknown delivery error",
    };
  }

  console.info("[notification:pending-provider]", { to: adminEmail, subject: input.subject });
  return { ...base, delivered: false, provider: "none", error: "No email provider configured" };
}

export function formatLeadEmail(data: {
  name: string;
  email: string;
  phone?: string | undefined;
  company?: string | undefined;
  subject: string;
  inquiryType: string;
  message: string;
  source: string;
  productName?: string | undefined;
  submittedAt: string;
}) {
  return [
    `You have a new ${data.source === "quote" ? "quote request" : "contact form submission"} on TechHub.`,
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone || "—"}`,
    `Company: ${data.company || "—"}`,
    `Inquiry type: ${data.inquiryType}`,
    `Subject: ${data.subject}`,
    ...(data.productName ? [`Product: ${data.productName}`] : []),
    "",
    "Message:",
    data.message,
    "",
    `Received: ${data.submittedAt}`,
  ].join("\n");
}
