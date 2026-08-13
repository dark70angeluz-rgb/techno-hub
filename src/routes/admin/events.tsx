import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, EmptyState, Field, StatusChip, inputClass, textareaClass } from "@/components/kit";
import { Button } from "@/components/kit/Button";
import Icon from "@/components/kit/Icon";
import PageHeader from "@/components/admin/PageHeader";
import { FilterChip, Toolbar } from "@/components/admin/Toolbar";
import { EntityModal, ImageUploadField } from "@/components/admin/EntityModal";
import { slugify, useAdminStore, type ArchivableEvent } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/events")({
  head: () => ({
    meta: [
      { title: "Events · TechHub Admin" },
      {
        name: "description",
        content:
          "Create, edit, archive and feature TechHub events, upload event images and manage event dates, locations and descriptions.",
      },
      { property: "og:title", content: "Events · TechHub Admin" },
      {
        property: "og:description",
        content: "Full events management: create, edit, archive, images, dates, descriptions, featured.",
      },
    ],
  }),
  component: AdminEventsPage,
});

const filters = ["All", "Featured", "Listing only", "Archived"] as const;

type Draft = {
  slug: string;
  title: string;
  date: string;
  location: string;
  desc: string;
  image: string;
  imageAlt: string;
  featured: boolean;
};

const emptyDraft: Draft = {
  slug: "",
  title: "",
  date: "",
  location: "",
  desc: "",
  image: "",
  imageAlt: "",
  featured: false,
};

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/** Turns a yyyy-mm-dd value into the month / day / full-date fields the site renders. */
function expandDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return { month: "TBA", day: "--", fullDate: value || "Date to be announced" };
  const date = new Date(Date.UTC(y, m - 1, d));
  return {
    month: monthNames[m - 1],
    day: String(d),
    fullDate: date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }),
  };
}

/** Best-effort reverse of expandDate so the edit form can prefill a date input. */
function toDateInput(event: ArchivableEvent) {
  const parsed = Date.parse(event.fullDate);
  if (Number.isNaN(parsed)) return "";
  return new Date(parsed).toISOString().slice(0, 10);
}

function AdminEventsPage() {
  const { events, saveEvent, removeEvent, toggleEventArchived, toggleEventFeatured } =
    useAdminStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [modal, setModal] = useState<{ open: boolean; editing: string | null; draft: Draft }>({
    open: false,
    editing: null,
    draft: emptyDraft,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return events.filter((e) => {
      const matchesFilter =
        filter === "All"
          ? !e.archived
          : filter === "Archived"
            ? Boolean(e.archived)
            : !e.archived && (filter === "Featured" ? e.featured : !e.featured);
      return (
        matchesFilter &&
        (e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q))
      );
    });
  }, [events, filter, query]);

  const live = events.filter((e) => !e.archived);

  const openNew = () => {
    setErrors({});
    setModal({ open: true, editing: null, draft: emptyDraft });
  };

  const openEdit = (event: ArchivableEvent) => {
    setErrors({});
    setModal({
      open: true,
      editing: event.slug,
      draft: {
        slug: event.slug,
        title: event.title,
        date: toDateInput(event),
        location: event.location,
        desc: event.desc,
        image: event.image,
        imageAlt: event.imageAlt,
        featured: event.featured,
      },
    });
  };

  const close = () => setModal((m) => ({ ...m, open: false }));
  const setDraft = (patch: Partial<Draft>) =>
    setModal((m) => ({ ...m, draft: { ...m.draft, ...patch } }));

  const submit = () => {
    const d = modal.draft;
    const next: Partial<Record<keyof Draft, string>> = {};
    if (!d.title.trim()) next.title = "Event title is required.";
    if (!d.date) next.date = "Pick an event date.";
    if (!d.location.trim()) next.location = "Location is required (use “Virtual” if online).";
    if (!d.desc.trim()) next.desc = "A short description is required.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    const slug = modal.editing ?? (slugify(d.title) || `event-${Date.now()}`);
    const existing = events.find((e) => e.slug === slug);
    saveEvent({
      ...(existing ?? {}),
      slug,
      title: d.title.trim(),
      ...expandDate(d.date),
      location: d.location.trim(),
      desc: d.desc.trim(),
      image: d.image,
      imageAlt: d.imageAlt.trim() || d.title.trim(),
      featured: d.featured,
    } as ArchivableEvent);
    toast.success(modal.editing ? "Event updated" : "Event created");
    close();
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Events"
        subtitle={`${live.length} published · ${live.filter((e) => e.featured).length} featured`}
        action={
          <Button variant="dark" size="sm" iconLeading="add" onClick={openNew}>
            Create Event
          </Button>
        }
      />

      <Toolbar query={query} onQuery={setQuery} placeholder="Search events or locations…" />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <FilterChip key={f} label={f} active={filter === f} onClick={() => setFilter(f)} />
        ))}
      </div>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon="event_busy"
              title="No events found"
              message="Try a different search term, or create a new event listing."
              action={
                <Button variant="dark" size="sm" iconLeading="add" onClick={openNew}>
                  Create Event
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line bg-dirty">
                  {["Event", "Date", "Location", "Home page", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-faint ${
                        h === "Actions" ? "text-right" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((event) => (
                  <tr
                    key={event.slug}
                    className="border-b border-line last:border-0 hover:bg-dirty/60"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {event.image ? (
                          <img
                            src={event.image}
                            alt=""
                            width={56}
                            height={40}
                            loading="lazy"
                            className="h-10 w-14 rounded-[8px] border border-line object-cover"
                          />
                        ) : (
                          <span className="flex h-10 w-14 items-center justify-center rounded-[8px] border border-line bg-tint">
                            <Icon name="event" size={18} className="text-blue" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-[14.5px] font-semibold text-navy">
                            {event.title}
                          </p>
                          <p className="truncate text-[12.5px] text-faint">{event.slug}</p>
                        </div>
                        {event.archived && (
                          <StatusChip label="Archived" tone="neutral" icon="inventory" />
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[14px] text-muted">{event.fullDate}</td>
                    <td className="px-5 py-3.5 text-[14px] text-muted">{event.location}</td>
                    <td className="px-5 py-3.5">
                      <button
                        type="button"
                        onClick={() => toggleEventFeatured(event.slug)}
                        aria-pressed={event.featured}
                        aria-label={`Toggle home page placement for ${event.title}`}
                      >
                        <StatusChip
                          label={event.featured ? "Featured" : "Listing only"}
                          tone={event.featured ? "blue" : "neutral"}
                          icon={event.featured ? "star" : "star_outline"}
                        />
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEdit(event)}
                          className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-dirty text-navy hover:bg-tint hover:text-blue"
                          aria-label={`Edit ${event.title}`}
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            toggleEventArchived(event.slug);
                            toast.success(event.archived ? "Event restored" : "Event archived");
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-dirty text-navy hover:bg-tint hover:text-blue"
                          aria-label={`${event.archived ? "Restore" : "Archive"} ${event.title}`}
                        >
                          <Icon name={event.archived ? "unarchive" : "inventory_2"} size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Delete “${event.title}” permanently?`)) {
                              removeEvent(event.slug);
                              toast.success("Event deleted");
                            }
                          }}
                          className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-dirty text-navy hover:bg-tint hover:text-blue"
                          aria-label={`Delete ${event.title}`}
                        >
                          <Icon name="delete" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="flex items-center gap-2 text-[13px] text-faint">
        <Icon name="info" size={16} className="text-blue" />
        Events are informational only — there is no registration, capacity or attendance tracking.
      </p>

      <EntityModal
        open={modal.open}
        title={modal.editing ? "Edit event" : "New event"}
        subtitle="Date, location, description, image and home page placement."
        onClose={close}
        onSubmit={submit}
        submitLabel={modal.editing ? "Save event" : "Create event"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Event title" htmlFor="e-title" required error={errors.title}>
            <input
              id="e-title"
              value={modal.draft.title}
              maxLength={120}
              onChange={(e) => setDraft({ title: e.target.value })}
              placeholder="Global Tech Summit 2026"
              className={inputClass}
            />
          </Field>
          <Field label="Event date" htmlFor="e-date" required error={errors.date}>
            <input
              id="e-date"
              type="date"
              value={modal.draft.date}
              onChange={(e) => setDraft({ date: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Location" htmlFor="e-location" required error={errors.location}>
          <input
            id="e-location"
            value={modal.draft.location}
            maxLength={120}
            onChange={(e) => setDraft({ location: e.target.value })}
            placeholder="San Francisco, CA — or Virtual"
            className={inputClass}
          />
        </Field>

        <Field label="Description" htmlFor="e-desc" required error={errors.desc}>
          <textarea
            id="e-desc"
            rows={4}
            maxLength={600}
            value={modal.draft.desc}
            onChange={(e) => setDraft({ desc: e.target.value })}
            placeholder="What happens at this event, who it is for and what attendees will see."
            className={textareaClass}
          />
        </Field>

        <ImageUploadField
          label="Event image"
          value={modal.draft.image}
          onChange={(image) => setDraft({ image })}
        />

        <Field label="Image alt text" htmlFor="e-alt" hint="Describes the image for screen readers.">
          <input
            id="e-alt"
            value={modal.draft.imageAlt}
            maxLength={160}
            onChange={(e) => setDraft({ imageAlt: e.target.value })}
            placeholder="Speaker on stage in front of a seated audience"
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-3 rounded-[12px] border border-line bg-dirty px-4 py-3">
          <input
            type="checkbox"
            checked={modal.draft.featured}
            onChange={(e) => setDraft({ featured: e.target.checked })}
            className="h-4 w-4 accent-[#2563EB]"
          />
          <span className="text-[14px] font-semibold text-navy">
            Feature on the home page
            <span className="block text-[13px] font-normal text-muted">
              Featured events appear in the home page events section.
            </span>
          </span>
        </label>
      </EntityModal>
    </div>
  );
}
