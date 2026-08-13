import { createFileRoute, Link } from "@tanstack/react-router";
import SiteShell from "@/components/layout/SiteShell";
import Icon from "@/components/kit/Icon";
import { ButtonLink } from "@/components/kit/Button";
import { Card, Reveal } from "@/components/kit";
import { getEvent } from "@/data/events";
import { usePublicEvents } from "@/lib/content-store";

export const Route = createFileRoute("/events/$slug")({
  loader: ({ params }) => ({ event: getEvent(params.slug) ?? null, slug: params.slug }),
  head: ({ loaderData }) => {
    if (!loaderData?.event) {
      return {
        meta: [{ title: "Event not found — TechHub" }, { name: "robots", content: "noindex" }],
      };
    }
    const { event } = loaderData;
    const description = `${event.fullDate} · ${event.location}. ${event.desc}`;
    return {
      meta: [
        { title: `${event.title} — TechHub Events` },
        { name: "description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:title", content: `${event.title} — TechHub Events` },
        { property: "og:description", content: description },
      ],
    };
  },
  notFoundComponent: EventNotFound,
  component: EventDetail,
});

function EventNotFound() {
  return (
    <SiteShell>
      <section className="section-y">
        <div className="shell flex max-w-[560px] flex-col items-start gap-5">
          <h1 className="text-[32px] leading-[1.1] tracking-[-0.02em]">Event not found</h1>
          <p className="text-[16px] leading-[1.6] text-muted">
            This event may have ended or moved. The full calendar has everything that's current.
          </p>
          <ButtonLink to="/events" icon="arrow_forward">
            Back to events
          </ButtonLink>
        </div>
      </section>
    </SiteShell>
  );
}

function EventDetail() {
  const loaded = Route.useLoaderData();
  const events = usePublicEvents();
  const event = events.find((e) => e.slug === loaded.slug) ?? loaded.event;
  const others = event ? events.filter((e) => e.slug !== event.slug).slice(0, 3) : [];

  if (!event) return <EventNotFound />;

  return (
    <SiteShell>
      <div className="border-b border-line bg-dirty">
        <div className="shell flex items-center gap-2 py-4 text-[13.5px] text-muted">
          <Link to="/" className="transition-colors hover:text-navy">
            Home
          </Link>
          <Icon name="chevron_right" size={16} className="text-faint" />
          <Link to="/events" className="transition-colors hover:text-navy">
            Events
          </Link>
          <Icon name="chevron_right" size={16} className="text-faint" />
          <span className="truncate font-medium text-navy">{event.title}</span>
        </div>
      </div>

      <section className="section-y">
        <div className="shell grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            <Reveal>
              <div className="overflow-hidden rounded-[14px] border border-line bg-dirty">
                <img
                  src={event.image}
                  alt={event.imageAlt}
                  width={1600}
                  height={912}
                  className="aspect-[16/9] w-full object-cover"
                />
              </div>
            </Reveal>
            <h1 className="mt-8 text-[34px] leading-[1.08] tracking-[-0.025em] md:text-[42px]">
              {event.title}
            </h1>
            <p className="mt-5 max-w-[620px] text-[16.5px] leading-[1.7] text-muted">{event.desc}</p>
          </div>

          <aside className="lg:col-span-5">
            <Card className="flex flex-col gap-5 p-6">
              <h2 className="text-[17px] font-semibold tracking-tight">Event details</h2>
              <dl className="flex flex-col divide-y divide-[color:var(--color-line)]">
                {[
                  { icon: "calendar_month", label: "Date", value: event.fullDate },
                  { icon: "location_on", label: "Location", value: event.location },
                  { icon: "person", label: "Attendance", value: "Open to guests and members" },
                ].map((row) => (
                  <div key={row.label} className="flex items-start gap-3 py-3.5 first:pt-0 last:pb-0">
                    <Icon name={row.icon} size={19} className="mt-0.5 text-blue" />
                    <div>
                      <dt className="text-[12.5px] uppercase tracking-[0.1em] text-faint">
                        {row.label}
                      </dt>
                      <dd className="text-[15px] font-medium text-navy">{row.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
              <p className="text-[13.5px] leading-[1.6] text-faint">
                Questions about the agenda or which products will be on display? Our team can help.
              </p>
              <ButtonLink to="/contact" icon="arrow_forward" className="w-full justify-center">
                Ask about this event
              </ButtonLink>
            </Card>
          </aside>
        </div>
      </section>

      <section className="border-t border-line bg-dirty section-y">
        <div className="shell flex flex-col gap-8">
          <h2 className="text-[24px] tracking-[-0.02em] md:text-[28px]">Other events</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {others.map((other) => (
              <Link
                key={other.slug}
                to="/events/$slug"
                params={{ slug: other.slug }}
                className="group flex flex-col gap-2 rounded-[14px] border border-line bg-white p-5 transition-[box-shadow,border-color] duration-200 hover:border-line-strong hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
              >
                <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-blue">
                  {other.fullDate}
                </p>
                <h3 className="text-[17px] font-semibold leading-snug tracking-tight">
                  {other.title}
                </h3>
                <p className="flex items-center gap-1.5 text-[13.5px] text-muted">
                  <Icon name="location_on" size={16} className="text-faint" />
                  {other.location}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
