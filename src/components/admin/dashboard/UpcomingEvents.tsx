import Icon from "@/components/kit/Icon";
import { EmptyState } from "@/components/kit";
import { events } from "@/data/events";

const upcoming = events.slice(0, 3);

export function UpcomingEvents() {
  if (upcoming.length === 0) {
    return (
      <EmptyState
        icon="event_busy"
        title="No upcoming events"
        message="Create an event to see it listed here."
      />
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {upcoming.map((e) => (
        <div
          key={e.slug}
          className="flex items-center gap-3 rounded-[14px] px-2 py-2.5 transition-colors hover:bg-dirty"
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[12px] bg-tint text-blue">
            <Icon name="calendar_month" size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold text-navy">{e.title}</p>
            <p className="text-[12px] text-faint">
              {e.fullDate} · {e.location}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default UpcomingEvents;
