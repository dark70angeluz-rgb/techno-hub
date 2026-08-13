import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Card, Field, StatusChip, inputClass, textareaClass } from "@/components/kit";
import { Button } from "@/components/kit/Button";
import Icon from "@/components/kit/Icon";
import PageHeader from "@/components/admin/PageHeader";
import { useAdminStore } from "@/lib/admin-store";
import { sendTestNotification } from "@/lib/leads.functions";

export const Route = createFileRoute("/admin/notifications")({
  head: () => ({
    meta: [
      { title: "Email Notifications \u00b7 TechHub Admin" },
      {
        name: "description",
        content:
          "Configure the email provider, recipients and templates used for contact form, quote and membership notifications.",
      },
      { property: "og:title", content: "Email Notifications \u00b7 TechHub Admin" },
      {
        property: "og:description",
        content: "Provider settings, notification rules, templates and delivery log.",
      },
    ],
  }),
  component: NotificationsPage,
});

const templates = [
  {
    id: "contact",
    label: "New contact inquiry",
    subject: "New inquiry from {{name}} — {{subject}}",
    body: "You have a new contact form submission on techhub.io.\n\nName: {{name}}\nEmail: {{email}}\nPhone: {{phone}}\nSubject: {{subject}}\n\nMessage:\n{{message}}\n\nReceived: {{submitted_at}}\nOpen in admin: {{admin_url}}",
  },
  {
    id: "application",
    label: "New membership application",
    subject: "Membership application — {{name}}",
    body: "A new membership application is awaiting review.\n\nApplicant: {{name}}\nEmail: {{email}}\nOrganization: {{organization}}\nInterest: {{interest}}\n\nReview it here: {{admin_url}}",
  },
  {
    id: "approved",
    label: "Application approved",
    subject: "Welcome to TechHub, {{name}}",
    body: "Hi {{name}},\n\nYour TechHub membership application has been approved. You now have access to all member-exclusive benefits.\n\nSign in: {{login_url}}\n\n— The TechHub team",
  },
];

function ToggleSwitch({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      aria-label={label}
      className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${on ? "bg-blue" : "bg-line-strong"}`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-soft transition-transform ${
          on ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function SectionCard({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {icon && <Icon name={icon} size={17} className="text-blue" />}
          <h3 className="text-[13px] font-bold uppercase tracking-wider text-navy">{title}</h3>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

function NotificationsPage() {
  const {
    rules,
    setRules,
    provider,
    setProvider,
    log,
    addLogEntry,
  } = useAdminStore();
  const runTest = useServerFn(sendTestNotification);
  const [draft, setDraft] = useState(provider);
  const [activeTemplate, setActiveTemplate] = useState(templates[0]!.id);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);

  const template = templates.find((t) => t.id === activeTemplate)!;
  const delivered = log.filter((l) => l.status === "Delivered").length;
  const failed = log.filter((l) => l.status === "Failed").length;
  const rate = log.length ? `${Math.round((delivered / log.length) * 100)}%` : "—";
  const setField = (patch: Partial<typeof provider>) => setDraft((d) => ({ ...d, ...patch }));

  const save = () => {
    setProvider(draft);
    setSaved(true);
    toast.success("Notification settings saved");
    setTimeout(() => setSaved(false), 2200);
  };

  const sendTest = async () => {
    const to = draft.adminEmail.trim();
    if (!to) {
      toast.error("Add an administrator email first.");
      return;
    }
    setTesting(true);
    try {
      const result = await runTest({ data: { to } });
      addLogEntry({
        to,
        subject: "TechHub test notification",
        type: "Test",
        status: result.delivered ? "Delivered" : "Queued",
      });
      if (result.delivered) {
        toast.success(`Test email sent to ${to}`);
      } else {
        toast.warning(
          result.error === "No email provider configured"
            ? "No email service is connected yet — the test was recorded but not delivered."
            : `The email service rejected the test: ${result.error}`
        );
      }
    } catch {
      toast.error("The test email could not be sent.");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="flex max-w-[900px] flex-col gap-6">
      <PageHeader
        title="Email Notifications"
        subtitle="Choose who gets notified, from which address, and with what message"
        action={
          <Button
            onClick={save}
            size="sm"
            variant={saved ? "primary" : "dark"}
            iconLeading={saved ? "check" : "save"}
          >
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: "outgoing_mail", label: "Sent (30 days)", value: String(log.length) },
          { icon: "mark_email_read", label: "Delivered", value: rate },
          { icon: "error", label: "Failed", value: String(failed) },
        ].map((s) => (
          <Card key={s.label} className="flex items-center gap-3 p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-tint">
              <Icon name={s.icon} size={19} className="text-blue" />
            </span>
            <div>
              <p className="text-[12px] uppercase tracking-[0.1em] text-muted">{s.label}</p>
              <p className="text-[20px] font-bold tracking-tight text-ink">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <SectionCard
        title="Email delivery"
        icon="mail"
        action={<StatusChip label="Connected" tone="blue" icon="check_circle" />}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field

            label="Administrator email"
            hint="Contact form inquiries are delivered to this address."
          >
            <input
              value={draft.adminEmail}
              onChange={(e) => setField({ adminEmail: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Reply-to address">
            <input
              value={draft.replyTo}
              onChange={(e) => setField({ replyTo: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="From name">
            <input
              value={draft.fromName}
              onChange={(e) => setField({ fromName: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="From email">
            <input
              value={draft.fromEmail}
              onChange={(e) => setField({ fromEmail: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-line pt-5">
          <Button
            variant="secondary"
            size="sm"
            iconLeading="send"
            loading={testing}
            onClick={() => void sendTest()}
          >
            Send test email
          </Button>
          <p className="text-[13px] text-muted">
            A sample notification is sent to {draft.adminEmail || "the administrator address"} to
            verify the configuration.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Notification rules" icon="rule">
        <div className="flex flex-col">
          {rules.map((rule, i) => (
            <div
              key={rule.id}
              className="flex items-start justify-between gap-4 border-b border-line py-4 last:border-0"
            >
              <div className="flex gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-line bg-dirty">
                  <Icon name={rule.icon} size={17} className="text-blue" />
                </span>
                <div>
                  <p className="text-[14.5px] font-semibold text-navy">{rule.title}</p>
                  <p className="mt-0.5 text-[13.5px] leading-[1.55] text-muted">{rule.desc}</p>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-muted">
                    <Icon name="person" size={15} className="text-faint" />
                    Recipients: <span className="font-semibold text-navy">{rule.recipients}</span>
                  </p>
                </div>
              </div>
              <ToggleSwitch
                on={rule.on}
                label={`Toggle ${rule.title}`}
                onClick={() =>
                  setRules(rules.map((r, idx) => (idx === i ? { ...r, on: !r.on } : r)))
                }
              />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Email templates" icon="draft">
        <div className="mb-4 flex flex-wrap gap-2">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTemplate(t.id)}
              aria-pressed={activeTemplate === t.id}
              className={`h-9 rounded-full border px-3.5 text-[13.5px] font-semibold transition-colors ${
                activeTemplate === t.id
                  ? "border-navy bg-navy text-white"
                  : "border-line-strong bg-white text-muted hover:text-navy"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <Field label="Subject line">
            <input defaultValue={template.subject} key={`s-${template.id}`} className={inputClass} />
          </Field>
          <Field
            label="Body"
            hint="Placeholders like {{name}} and {{message}} are replaced when the email is sent."
          >
            <textarea
              defaultValue={template.body}
              key={`b-${template.id}`}
              className={`${textareaClass} min-h-[200px] font-mono text-[13.5px]`}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Delivery log"
        icon="history"
        action={
          <Button variant="secondary" size="sm" iconLeading="refresh">
            Refresh
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="border-b border-line text-[12px] uppercase tracking-[0.1em] text-muted">
                <th className="pb-3 font-semibold">Recipient</th>
                <th className="pb-3 font-semibold">Subject</th>
                <th className="pb-3 font-semibold">Type</th>
                <th className="pb-3 font-semibold">Sent</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {log.map((row) => (
                <tr key={row.id} className="border-b border-line last:border-0 text-[14px]">
                  <td className="py-3.5 font-medium text-navy">{row.to}</td>
                  <td className="py-3.5 text-muted">{row.subject}</td>
                  <td className="py-3.5 text-muted">{row.type}</td>
                  <td className="py-3.5 text-muted">{row.time}</td>
                  <td className="py-3.5">
                    <StatusChip
                      label={row.status}
                      tone={row.status === "Delivered" ? "blue" : "outline"}
                      icon={
                        row.status === "Delivered"
                          ? "check_circle"
                          : row.status === "Failed"
                            ? "error"
                            : "schedule"
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
