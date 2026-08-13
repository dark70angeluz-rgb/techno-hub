import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Card, EmptyState, StatusChip } from "@/components/kit";
import { Button } from "@/components/kit/Button";
import Icon from "@/components/kit/Icon";
import PageHeader from "@/components/admin/PageHeader";
import { Toolbar, FilterChip } from "@/components/admin/Toolbar";
import Pagination from "@/components/admin/Pagination";
import {
  leadRecords,
  leadStatuses,
  leadStatusTone,
  type LeadRecord,
  type LeadStatus,
} from "@/data/leads";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({
    meta: [
      { title: "Leads & Inquiries · TechHub Admin" },
      {
        name: "description",
        content: "Review contact messages and product quote requests submitted through TechHub.",
      },
      { property: "og:title", content: "Leads & Inquiries · TechHub Admin" },
      {
        property: "og:description",
        content: "A single inbox for contact messages and Get a Quote requests.",
      },
    ],
  }),
  component: AdminLeadsPage,
});

const PAGE_SIZE = 6;
const filters = ["All", "Quotes", ...leadStatuses] as const;

function AdminLeadsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<LeadRecord | null>(null);
  const [statuses, setStatuses] = useState<Record<string, LeadStatus>>({});

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leadRecords
      .map((l) => ({ ...l, status: statuses[l.id] ?? l.status }))
      .filter((l) => {
        const matchesFilter =
          filter === "All" ||
          (filter === "Quotes" ? l.source === "quote" : l.status === filter);
        return (
          matchesFilter &&
          (l.name.toLowerCase().includes(q) ||
            l.email.toLowerCase().includes(q) ||
            l.subject.toLowerCase().includes(q) ||
            l.company.toLowerCase().includes(q))
        );
      });
  }, [query, filter, statuses]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paged = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const newCount = leadRecords.filter((l) => (statuses[l.id] ?? l.status) === "New").length;
  const quoteCount = leadRecords.filter((l) => l.source === "quote").length;

  const setStatus = (id: string, next: LeadStatus) => {
    setStatuses((s) => ({ ...s, [id]: next }));
    setSelected((s) => (s && s.id === id ? { ...s, status: next } : s));
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Leads & Inquiries"
        subtitle={`${newCount} new · ${quoteCount} quote requests · ${leadRecords.length} total`}
      />

      <Toolbar
        query={query}
        onQuery={(v) => {
          setQuery(v);
          setPage(1);
        }}
        placeholder="Search by name, company or subject…"
      />

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <FilterChip
            key={f}
            label={f}
            active={filter === f}
            onClick={() => {
              setFilter(f);
              setPage(1);
            }}
          />
        ))}
      </div>

      <Card className="overflow-hidden">
        {paged.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon="mail"
              title="No inquiries found"
              message="Try a different filter — new submissions land here automatically."
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line bg-dirty">
                    {["Contact", "Inquiry", "Product", "Received", "Status", ""].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-faint"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((lead) => (
                    <tr key={lead.id} className="border-b border-line last:border-0 hover:bg-dirty/60">
                      <td className="px-5 py-3.5">
                        <p className="text-[14.5px] font-semibold text-navy">{lead.name}</p>
                        <p className="text-[12.5px] text-faint">{lead.company}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-[14px] text-navy">{lead.subject}</p>
                        <p className="text-[12.5px] text-faint">{lead.inquiryType}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[14px] text-muted">{lead.product}</td>
                      <td className="px-5 py-3.5 text-[14px] text-muted">{lead.receivedAt}</td>
                      <td className="px-5 py-3.5">
                        <StatusChip label={lead.status} tone={leadStatusTone[lead.status]} />
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setSelected(lead)}
                            className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-dirty text-navy hover:bg-tint hover:text-blue"
                            aria-label={`Open inquiry from ${lead.name}`}
                          >
                            <Icon name="visibility" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={current} totalPages={totalPages} onPage={setPage} total={rows.length} />
          </>
        )}
      </Card>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-navy/45 backdrop-blur-[2px] sm:items-center sm:p-6"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`Inquiry from ${selected.name}`}
              className="w-full max-w-[580px] overflow-hidden rounded-t-[16px] border border-line bg-white shadow-lift sm:rounded-[16px]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
                <div>
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-blue">
                    {selected.inquiryType}
                  </p>
                  <h3 className="mt-0.5 text-[18px] font-bold tracking-tight text-navy">
                    {selected.subject}
                  </h3>
                  <p className="text-[13px] text-faint">
                    {selected.name} · {selected.receivedAt}
                  </p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close inquiry"
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] text-muted hover:bg-dirty hover:text-navy"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-4 px-6 py-5">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { label: "Email", value: selected.email },
                    { label: "Phone", value: selected.phone },
                    { label: "Company", value: selected.company },
                    { label: "Product", value: selected.product },
                  ].map((row) => (
                    <div key={row.label}>
                      <dt className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-faint">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-[14.5px] font-medium text-navy">{row.value}</dd>
                    </div>
                  ))}
                </dl>
                <div>
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-faint">
                    Message
                  </p>
                  <p className="mt-1 text-[14.5px] leading-[1.6] text-muted">{selected.message}</p>
                </div>
                <div>
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-faint">
                    Update status
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {leadStatuses.map((s) => (
                      <FilterChip
                        key={s}
                        label={s}
                        active={selected.status === s}
                        onClick={() => setStatus(selected.id, s)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2.5 border-t border-line px-6 py-4 sm:flex-row sm:justify-end">
                <Button variant="secondary" onClick={() => setSelected(null)}>
                  Close
                </Button>
                <Button iconLeading="reply">Reply by email</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
