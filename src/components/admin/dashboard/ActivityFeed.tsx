import { EmptyState } from "@/components/kit";

const activity = [
  { user: "Maria Santos", action: "submitted a membership application", time: "2 min ago" },
  { user: "James Reyes", action: "requested a quote for Lumix One Pro", time: "14 min ago" },
  { user: "Lea Mendoza", action: "sent a contact inquiry", time: "32 min ago" },
  { user: "Carlo Dela Cruz", action: "was approved as a member", time: "1 hr ago" },
  { user: "Ana Villanueva", action: "application was rejected", time: "2 hr ago" },
];

export function ActivityFeed() {
  if (activity.length === 0) {
    return (
      <EmptyState
        icon="history"
        title="No recent activity"
        message="Member activity will appear here as it happens."
      />
    );
  }

  return (
    <div className="flex flex-col">
      {activity.map((a, i) => (
        <div key={a.user} className="flex gap-3 px-1 py-3">
          <div className="flex flex-col items-center">
            <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue" />
            {i < activity.length - 1 && <span className="mt-1 w-px flex-1 bg-line" />}
          </div>
          <div className="min-w-0 flex-1 pb-1">
            <p className="text-[14px] text-navy">
              <span className="font-semibold">{a.user}</span>{" "}
              <span className="text-muted">{a.action}</span>
            </p>
            <p className="mt-0.5 text-[12px] text-faint">{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ActivityFeed;
