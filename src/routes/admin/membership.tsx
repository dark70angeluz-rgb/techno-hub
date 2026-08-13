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
  membershipApplications,
  memberRecords,
  type MembershipApplication,
  type MembershipStatus,
} from "@/data/membership";

export const Route = createFileRoute("/admin/membership")({
  head: () => ({
    meta: [
      { title: "Membership Applications · TechHub Admin" },
      {
        name: "description",
        content: "Review, approve or reject TechHub membership applications and view approved members.",
      },
      { property: "og:title", content: "Membership Applications · TechHub Admin" },
      {
        property: "og:description",
        content: "Review membership applications and manage approved members.",
      },
    ],
  }),
  component: AdminMembershipPage,
});

const statusFilters = ["All", "Pending", "Approved", "Rejected"] as const;

const statusTone: Record<MembershipStatus, "blue" | "neutral" | "outline"> = {
  Approved: "blue",
  Rejected: "neutral",
  Pending: "outline",
};

const statusIcon: Record<MembershipStatus, string> = {
  Approved: "verified",
  Rejected: "block",
  Pending: "hourglass_top",
};

const PAGE_SIZE = 6;

function AdminMembershipPage() {
  const [tab, setTab] = useState<"applications" | "members">("applications");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<MembershipApplication | null>(null);
  const [decisions, setDecisions] = useState<Record<string, MembershipStatus>>({});

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return membershipApplications
      .map((a) => ({ ...a, status: decisions[a.id] ?? a.status }))
      .filter(
        (a) =>
          (status === "All" || a.status === status) &&
          (a.name.toLowerCase().includes(q) ||
            a.email.toLowerCase().includes(q) ||
            a.organization.toLowerCase().includes(q))
      );
  }, [query, status, decisions]);

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paged = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const pendingCount = membershipApplications.filter(
    (a) => (decisions[a.id] ?? a.status) === "Pending"
  ).length;

  const decide = (id: string, next: MembershipStatus) => {
    setDecisions((d) => ({ ...d, [id]: next }));
    setSelected((s) => (s && s.id === id ? { ...s, status: next } : s));
  };

  const members = useMemo(() => {
    const q = query.trim().toLowerCase();
    return memberRecords.filter(
      (m) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Membership"
        subtitle={`${pendingCount} application${pendingCount === 1 ? "" : "s"} awaiting review · ${memberRecords.length} approved members`}
      />

      <div className="flex flex-wrap gap-2">
        <FilterChip
          label="Applications"
          active={tab === "applications"}
          onClick={() => setTab("applications")}
        />
        <FilterChip label="Members" active={tab === "members"} onClick={() => setTab("members")} />
      </div>

      <Toolbar
        query={query}
        onQuery={(v) => {
          setQuery(v);
          setPage(1);
        }}
        placeholder={tab === "applications" ? "Search applicants…" : "Search members…"}
      />

      {tab === "applications" ? (
        <>
          <div className="flex flex-wrap gap-2">
            {statusFilters.map((s) => (
              <FilterChip
                key={s}
                label={s}
                active={status === s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
              />
            ))}
          </div>

          <Card className="overflow-hidden">
            {paged.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon="how_to_reg"
                  title="No applications found"
                  message="Adjust the status filter or search term to see more applications."
                />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-line bg-dirty">
                        {["Applicant", "Organization", "Submitted", "Status", ""].map((h) => (
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
                      {paged.map((application) => (
                        <tr
                          key={application.id}
                          className="border-b border-line last:border-0 hover:bg-dirty/60"
                        >
                          <td className="px-5 py-3.5">
                            <p className="text-[14.5px] font-semibold text-navy">
                              {application.name}
                            </p>
                            <p className="text-[12.5px] text-faint">{application.email}</p>
                          </td>
                          <td className="px-5 py-3.5 text-[14px] text-muted">
                            {application.organization}
                          </td>
                          <td className="px-5 py-3.5 text-[14px] text-muted">
                            {application.submittedAt}
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusChip
                              label={application.status}
                              tone={statusTone[application.status]}
                              icon={statusIcon[application.status]}
                            />
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex justify-end gap-2">
                              {application.status === "Pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    iconLeading="check"
                                    onClick={() => decide(application.id, "Approved")}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    iconLeading="close"
                                    onClick={() => decide(application.id, "Rejected")}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              <button
                                onClick={() => setSelected(application)}
                                className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-dirty text-navy hover:bg-tint hover:text-blue"
                                aria-label={`View ${application.name}'s application`}
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
                <Pagination
                  page={current}
                  totalPages={totalPages}
                  onPage={setPage}
                  total={rows.length}
                />
              </>
            )}
          </Card>
        </>
      ) : (
        <Card className="overflow-hidden">
          {members.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon="group"
                title="No members found"
                message="Approved applicants appear here as members."
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line bg-dirty">
                    {["Member", "Organization", "Contact", "Member since", "Status"].map((h) => (
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
                  {members.map((member) => (
                    <tr key={member.id} className="border-b border-line last:border-0 hover:bg-dirty/60">
                      <td className="px-5 py-3.5">
                        <p className="text-[14.5px] font-semibold text-navy">{member.name}</p>
                        <p className="text-[12.5px] text-faint">{member.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[14px] text-muted">{member.organization}</td>
                      <td className="px-5 py-3.5 text-[14px] text-muted">{member.phone}</td>
                      <td className="px-5 py-3.5 text-[14px] text-muted">{member.memberSince}</td>
                      <td className="px-5 py-3.5">
                        <StatusChip
                          label={member.status}
                          tone={member.status === "Active" ? "blue" : "neutral"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-navy/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={`Application from ${selected.name}`}
              className="w-full max-w-[560px] overflow-hidden rounded-t-[16px] border border-line bg-white shadow-lift sm:rounded-[16px]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
                <div>
                  <p className="text-[11.5px] font-semibold uppercase tracking-[0.12em] text-blue">
                    {selected.id}
                  </p>
                  <h3 className="mt-0.5 text-[18px] font-bold tracking-tight text-navy">
                    {selected.name}
                  </h3>
                  <p className="text-[13px] text-faint">{selected.email}</p>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Close application"
                  className="flex h-9 w-9 items-center justify-center rounded-[10px] text-muted hover:bg-dirty hover:text-navy"
                >
                  <Icon name="close" size={20} />
                </button>
              </div>

              <div className="flex flex-col gap-4 px-6 py-5">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusChip
                    label={selected.status}
                    tone={statusTone[selected.status]}
                    icon={statusIcon[selected.status]}
                  />
                  <span className="text-[13px] text-faint">Submitted {selected.submittedAt}</span>
                </div>
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    { label: "Contact number", value: selected.phone },
                    { label: "Organization", value: selected.organization },
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
                    Reason for joining
                  </p>
                  <p className="mt-1 text-[14.5px] leading-[1.6] text-muted">{selected.reason}</p>
                </div>
                {selected.reviewNote && (
                  <div className="rounded-[10px] border border-line bg-dirty px-4 py-3">
                    <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-faint">
                      Review note
                    </p>
                    <p className="mt-1 text-[14px] text-muted">{selected.reviewNote}</p>
                  </div>
                )}
              </div>

              {selected.status === "Pending" && (
                <div className="flex flex-col-reverse gap-2.5 border-t border-line px-6 py-4 sm:flex-row sm:justify-end">
                  <Button
                    variant="secondary"
                    iconLeading="close"
                    onClick={() => decide(selected.id, "Rejected")}
                  >
                    Reject
                  </Button>
                  <Button iconLeading="check" onClick={() => decide(selected.id, "Approved")}>
                    Approve application
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
