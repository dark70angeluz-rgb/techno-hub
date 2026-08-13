import { EmptyState } from "@/components/kit";
import { leadRecords } from "@/data/leads";

const messages = leadRecords.slice(0, 3);

export function InboxPreview() {
  if (messages.length === 0) {
    return (
      <EmptyState icon="mail" title="Inbox is empty" message="New inquiries will show up here." />
    );
  }

  return (
    <div className="flex flex-col">
      {messages.map((m) => (
        <div key={m.id} className="flex items-center gap-3 border-b border-line py-3 last:border-0">
          <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-navy text-[12px] font-bold text-white">
            {m.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-[14px] ${m.status === "New" ? "font-semibold text-navy" : "text-muted"}`}
            >
              {m.name}
            </p>
            <p className="truncate text-[12px] text-faint">{m.subject}</p>
          </div>
          {m.status === "New" && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-blue" />}
        </div>
      ))}
    </div>
  );
}

export default InboxPreview;
