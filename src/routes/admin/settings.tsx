import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, Field, inputClass } from "@/components/kit";
import { Button } from "@/components/kit/Button";
import Icon from "@/components/kit/Icon";
import PageHeader from "@/components/admin/PageHeader";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings · TechHub Admin" },
      { name: "description", content: "Manage organization profile, brand, and membership plan settings." },
      { property: "og:title", content: "Settings · TechHub Admin" },
      { property: "og:description", content: "Manage organization profile, brand, and membership plan settings." },
    ],
  }),
  component: SettingsPage,
});

const socials = [
  { icon: "alternate_email", label: "Twitter / X", key: "twitter", placeholder: "https://x.com/techhub" },
  { icon: "photo_camera", label: "Instagram", key: "instagram", placeholder: "https://instagram.com/techhub" },
  { icon: "work", label: "LinkedIn", key: "linkedin", placeholder: "https://linkedin.com/company/techhub" },
  { icon: "play_circle", label: "YouTube", key: "youtube", placeholder: "https://youtube.com/techhub" },
];

const swatches = [
  { label: "Primary Blue", color: "#2563EB" },
  { label: "Dark Navy", color: "#0F172A" },
  { label: "Black", color: "#000000" },
  { label: "Dirty White", color: "#F5F5F3" },
];

function ToggleSwitch({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
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

function SettingsCard({ title, icon, children }: { title: string; icon?: string; children: React.ReactNode }) {
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center gap-2">
        {icon && <Icon name={icon} size={17} className="text-faint" />}
        <h3 className="text-[13px] font-bold uppercase tracking-wider text-navy">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [general, setGeneral] = useState({
    name: "TechHub",
    tagline: "The Premium Tech Membership",
    email: "hello@techhub.io",
    phone: "+63 917 000 0001",
    website: "https://techhub.io",
  });
  const [links, setLinks] = useState({
    twitter: "https://x.com/techhub",
    instagram: "https://instagram.com/techhub",
    linkedin: "https://linkedin.com/company/techhub",
    youtube: "https://youtube.com/techhub",
  });
  const [plans, setPlans] = useState([
    { name: "Basic", price: "₱299/mo", active: true },
    { name: "Professional", price: "₱799/mo", active: true },
    { name: "Premium", price: "₱1,499/mo", active: true },
  ]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <div className="flex max-w-[820px] flex-col gap-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your organization profile and preferences"
        action={
          <Button onClick={handleSave} size="sm" variant={saved ? "primary" : "dark"} iconLeading={saved ? "check" : "save"}>
            {saved ? "Saved!" : "Save Changes"}
          </Button>
        }
      />

      <SettingsCard title="Logo & Brand">
        <div className="flex items-center gap-6">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[20px] border border-line bg-dirty">
            <span className="text-[24px] font-bold text-navy">
              T<span className="text-blue">H</span>
            </span>
          </div>
          <div>
            <button className="mb-2 flex h-11 items-center gap-2 rounded-[12px] border border-line bg-dirty px-4 text-[14px] font-medium text-navy hover:bg-tint">
              <Icon name="upload" size={16} /> Upload Logo
            </button>
            <p className="text-[12px] text-faint">PNG, JPG, SVG · Recommended 256×256px</p>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="General Information" icon="language">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Organization Name">
            <input value={general.name} onChange={(e) => setGeneral((g) => ({ ...g, name: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Tagline">
            <input value={general.tagline} onChange={(e) => setGeneral((g) => ({ ...g, tagline: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Contact Email">
            <input type="email" value={general.email} onChange={(e) => setGeneral((g) => ({ ...g, email: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Phone Number">
            <input value={general.phone} onChange={(e) => setGeneral((g) => ({ ...g, phone: e.target.value }))} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Website URL">
              <input value={general.website} onChange={(e) => setGeneral((g) => ({ ...g, website: e.target.value }))} className={inputClass} />
            </Field>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Brand Colors">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.label} className="text-center">
              <div className="mb-2 h-14 w-full rounded-[12px] border border-line" style={{ backgroundColor: s.color }} />
              <p className="text-[12px] font-semibold text-muted">{s.label}</p>
              <p className="font-mono text-[11px] text-faint">{s.color}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-faint">Brand colors are fixed per design system. Contact your developer to update.</p>
      </SettingsCard>

      <SettingsCard title="Social Links" icon="link">
        <div className="flex flex-col gap-4">
          {socials.map((s) => (
            <Field key={s.key} label={s.label}>
              <div className="relative">
                <Icon name={s.icon} size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-faint" />
                <input
                  value={(links as any)[s.key]}
                  onChange={(e) => setLinks((l) => ({ ...l, [s.key]: e.target.value }))}
                  placeholder={s.placeholder}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </Field>
          ))}
        </div>
      </SettingsCard>

      <SettingsCard title="Membership Plans">
        <div className="flex flex-col">
          {plans.map((plan, i) => (
            <div key={plan.name} className="flex items-center justify-between border-b border-line py-3.5 last:border-0">
              <div>
                <p className="text-[14px] font-semibold text-navy">{plan.name}</p>
                <p className="text-[12px] text-faint">{plan.price}</p>
              </div>
              <ToggleSwitch
                on={plan.active}
                onClick={() => setPlans((ps) => ps.map((p, idx) => (idx === i ? { ...p, active: !p.active } : p)))}
              />
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
