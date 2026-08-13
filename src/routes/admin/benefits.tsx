import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, EmptyState, Field, StatusChip, inputClass, textareaClass } from "@/components/kit";
import { Button } from "@/components/kit/Button";
import Icon from "@/components/kit/Icon";
import PageHeader from "@/components/admin/PageHeader";
import { FilterChip, Toolbar } from "@/components/admin/Toolbar";
import { EntityModal, ImageUploadField } from "@/components/admin/EntityModal";
import { slugify, useAdminStore, type ArchivableBenefit } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/benefits")({
  head: () => ({
    meta: [
      { title: "Benefits · TechHub Admin" },
      {
        name: "description",
        content:
          "Create, edit, archive and feature member benefits, upload benefit images and manage benefit descriptions.",
      },
      { property: "og:title", content: "Benefits · TechHub Admin" },
      {
        property: "og:description",
        content: "Full benefits management: create, edit, archive, images, descriptions, featured.",
      },
    ],
  }),
  component: AdminBenefitsPage,
});

const audienceFilters = ["All", "Available to Everyone", "Member-Exclusive", "Archived"] as const;

type Draft = {
  id: string;
  title: string;
  icon: string;
  summary: string;
  details: string;
  audience: "public" | "member";
  image: string;
  featured: boolean;
};

const emptyDraft: Draft = {
  id: "",
  title: "",
  icon: "redeem",
  summary: "",
  details: "",
  audience: "public",
  image: "",
  featured: false,
};

function AdminBenefitsPage() {
  const { benefits, saveBenefit, removeBenefit, toggleBenefitArchived, toggleBenefitFeatured } =
    useAdminStore();
  const [filter, setFilter] = useState<(typeof audienceFilters)[number]>("All");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<{ open: boolean; editing: string | null; draft: Draft }>({
    open: false,
    editing: null,
    draft: emptyDraft,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return benefits.filter((b) => {
      const matchesAudience =
        filter === "All"
          ? !b.archived
          : filter === "Archived"
            ? Boolean(b.archived)
            : !b.archived &&
              ((filter === "Available to Everyone" && b.audience === "public") ||
                (filter === "Member-Exclusive" && b.audience === "member"));
      return (
        matchesAudience &&
        (b.title.toLowerCase().includes(q) || b.summary.toLowerCase().includes(q))
      );
    });
  }, [benefits, filter, query]);

  const live = benefits.filter((b) => !b.archived);
  const publicCount = live.filter((b) => b.audience === "public").length;
  const memberCount = live.length - publicCount;

  const openNew = () => {
    setErrors({});
    setModal({ open: true, editing: null, draft: emptyDraft });
  };
  const openEdit = (benefit: ArchivableBenefit) => {
    setErrors({});
    setModal({
      open: true,
      editing: benefit.id,
      draft: {
        id: benefit.id,
        title: benefit.title,
        icon: benefit.icon,
        summary: benefit.summary,
        details: (benefit.details ?? []).join("\n"),
        audience: benefit.audience,
        image: (benefit as ArchivableBenefit & { image?: string }).image ?? "",
        featured: benefit.featured,
      },
    });
  };
  const close = () => setModal((m) => ({ ...m, open: false }));
  const setDraft = (patch: Partial<Draft>) =>
    setModal((m) => ({ ...m, draft: { ...m.draft, ...patch } }));

  const submit = () => {
    const d = modal.draft;
    const next: Partial<Record<keyof Draft, string>> = {};
    if (!d.title.trim()) next.title = "Benefit title is required.";
    if (!d.summary.trim()) next.summary = "A short description is required.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    const id = modal.editing ?? (slugify(d.title) || `benefit-${Date.now()}`);
    const existing = benefits.find((b) => b.id === id);
    saveBenefit({
      ...(existing ?? {}),
      id,
      title: d.title.trim(),
      icon: d.icon.trim() || "redeem",
      summary: d.summary.trim(),
      details: d.details
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      audience: d.audience,
      image: d.image,
      featured: d.featured,
    } as ArchivableBenefit);
    toast.success(modal.editing ? "Benefit updated" : "Benefit created");
    close();
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Benefits"
        subtitle={`${publicCount} available to everyone · ${memberCount} member-exclusive`}
        action={
          <Button variant="dark" size="sm" iconLeading="add" onClick={openNew}>
            New Benefit
          </Button>
        }
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search benefits…" />

      <div className="flex flex-wrap gap-2">
        {audienceFilters.map((f) => (
          <FilterChip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon="redeem"
            title="No benefits found"
            message="Try a different filter, or create a new benefit."
            action={
              <Button variant="dark" size="sm" iconLeading="add" onClick={openNew}>
                New Benefit
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((benefit) => {
            const image = (benefit as ArchivableBenefit & { image?: string }).image;
            return (
              <Card key={benefit.id} className="flex flex-col gap-4 p-5">
                <div className="flex items-start gap-3">
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-[12px] border border-line object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] border border-line bg-tint">
                      <Icon name={benefit.icon} size={20} className="text-blue" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-[15.5px] font-semibold text-navy">{benefit.title}</p>
                    <p className="mt-1 text-[14px] leading-[1.55] text-muted">{benefit.summary}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusChip
                    label={
                      benefit.audience === "public" ? "Available to Everyone" : "Member-Exclusive"
                    }
                    tone={benefit.audience === "public" ? "blue" : "outline"}
                    icon={benefit.audience === "public" ? "public" : "lock"}
                  />
                  <button
                    type="button"
                    onClick={() => toggleBenefitFeatured(benefit.id)}
                    aria-pressed={benefit.featured}
                    aria-label={`Toggle featured for ${benefit.title}`}
                  >
                    <StatusChip
                      label={benefit.featured ? "Featured" : "Standard"}
                      tone={benefit.featured ? "navy" : "neutral"}
                      icon={benefit.featured ? "star" : "star_outline"}
                    />
                  </button>
                  {benefit.archived && (
                    <StatusChip label="Archived" tone="neutral" icon="inventory" />
                  )}
                </div>

                <div className="flex flex-wrap gap-2 border-t border-line pt-4">
                  <Button variant="secondary" size="sm" iconLeading="edit" onClick={() => openEdit(benefit)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconLeading={benefit.archived ? "unarchive" : "inventory_2"}
                    onClick={() => {
                      toggleBenefitArchived(benefit.id);
                      toast.success(benefit.archived ? "Benefit restored" : "Benefit archived");
                    }}
                  >
                    {benefit.archived ? "Restore" : "Archive"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconLeading="delete"
                    onClick={() => {
                      if (window.confirm(`Delete “${benefit.title}” permanently?`)) {
                        removeBenefit(benefit.id);
                        toast.success("Benefit deleted");
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <EntityModal
        open={modal.open}
        title={modal.editing ? "Edit benefit" : "New benefit"}
        subtitle="Description, audience, image and featured placement."
        onClose={close}
        onSubmit={submit}
        submitLabel={modal.editing ? "Save benefit" : "Create benefit"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Benefit title" htmlFor="b-title" required error={errors.title}>
            <input
              id="b-title"
              value={modal.draft.title}
              maxLength={120}
              onChange={(e) => setDraft({ title: e.target.value })}
              className={inputClass}
              placeholder="Specialist support"
            />
          </Field>
          <Field label="Audience" htmlFor="b-audience">
            <select
              id="b-audience"
              value={modal.draft.audience}
              onChange={(e) => setDraft({ audience: e.target.value as "public" | "member" })}
              className={inputClass}
            >
              <option value="public">Available to everyone</option>
              <option value="member">Member-exclusive</option>
            </select>
          </Field>
        </div>

        <Field label="Short description" htmlFor="b-summary" required error={errors.summary}>
          <textarea
            id="b-summary"
            value={modal.draft.summary}
            maxLength={280}
            onChange={(e) => setDraft({ summary: e.target.value })}
            className={`${textareaClass} min-h-[80px]`}
          />
        </Field>

        <Field label="Detail points" htmlFor="b-details" hint="One point per line.">
          <textarea
            id="b-details"
            value={modal.draft.details}
            onChange={(e) => setDraft({ details: e.target.value })}
            className={textareaClass}
          />
        </Field>

        <ImageUploadField
          label="Benefit image"
          value={modal.draft.image}
          onChange={(image) => setDraft({ image })}
          hint="Optional — replaces the icon on benefit cards."
        />

        <Field label="Icon name" htmlFor="b-icon" hint="Material Symbols name, e.g. support_agent.">
          <input
            id="b-icon"
            value={modal.draft.icon}
            onChange={(e) => setDraft({ icon: e.target.value })}
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-3 rounded-[12px] border border-line bg-dirty px-4 py-3">
          <input
            type="checkbox"
            checked={modal.draft.featured}
            onChange={(e) => setDraft({ featured: e.target.checked })}
            className="h-4 w-4 accent-blue"
          />
          <span className="text-[14px] font-semibold text-navy">
            Mark as Featured
            <span className="ml-2 font-normal text-muted">Highlighted on membership pages</span>
          </span>
        </label>
      </EntityModal>
    </div>
  );
}
