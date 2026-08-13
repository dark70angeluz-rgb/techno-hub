import { createFileRoute, Link } from "@tanstack/react-router";
import SiteShell from "@/components/layout/SiteShell";
import Icon from "@/components/kit/Icon";
import { ButtonLink } from "@/components/kit/Button";
import { Eyebrow, Reveal, SectionHeading } from "@/components/kit";
import { usePublicEvents } from "@/lib/content-store";

export const Route = createFileRoute("/events/")({
  component: EventsPage,
  head: () => ({
    meta: [
      { title: "Events — Summits, Workshops & Expos | TechHub" },
      {
        name: "description",
        content:
          "Technology summits, hands-on workshops and gadget expos hosted or attended by TechHub. Browse dates, locations and details — open to everyone.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "Events — Summits, Workshops & Expos | TechHub" },
      {
        property: "og:description",
        content: "Dates, locations and details for every TechHub summit, workshop and expo.",
      },
    ],
  }),
});

function EventsPage() {
  const events = usePublicEvents();
  return (
    <SiteShell>
      <section className="border-b border-line section-y">
        <div className="shell">
          <Reveal className="max-w-[720px]">
            <Eyebrow icon="event">Events</Eyebrow>
            <h1 className="mt-4 text-[40px] leading-[1.05] tracking-[-0.03em] md:text-[50px]">
              See the gear before you specify it.
            </h1>
            <p className="mt-5 max-w-[560px] text-[16px] leading-[1.65] text-muted">
              Summits, workshops and expos we host or attend. Every listing is informational —
              nothing to register for here, and no account required to read the details.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-y">
        <div className="shell flex flex-col gap-10">
          <SectionHeading
            eyebrow="All events"
            title="Where you can find us"
            description="Dates and locations, kept simple. Open any event for the full details."
          />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event, i) => (
              <Reveal key={event.slug} delay={Math.min(i * 0.03, 0.18)} className="h-full">
                <Link
                  to="/events/$slug"
                  params={{ slug: event.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-white transition-[box-shadow,border-color] duration-200 hover:border-line-strong hover:shadow-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
                >
                  <div className="relative overflow-hidden bg-dirty">
                    <img
                      src={event.image}
                      alt={event.imageAlt}
                      width={1600}
                      height={912}
                      loading="lazy"
                      className="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute left-4 top-4 flex h-14 w-14 flex-col items-center justify-center rounded-[10px] bg-white/95 backdrop-blur-sm">
                      <span className="text-[18px] font-bold leading-none text-navy">{event.day}</span>
                      <span className="text-[11px] uppercase tracking-[0.1em] text-faint">
                        {event.month}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <p className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-blue">
                      {event.fullDate}
                    </p>
                    <h2 className="text-[18px] font-semibold leading-snug tracking-tight">
                      {event.title}
                    </h2>
                    <p className="flex items-center gap-1.5 text-[13.5px] text-muted">
                      <Icon name="location_on" size={16} className="text-faint" />
                      {event.location}
                    </p>
                    <p className="line-clamp-2 text-[14.5px] leading-[1.6] text-muted">{event.desc}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 border-t border-line pt-4 text-[13.5px] font-semibold text-blue">
                      Event details
                      <Icon name="arrow_forward" size={15} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-dirty section-y">
        <div className="shell flex flex-col items-center gap-6 text-center">
          <SectionHeading
            align="center"
            title="Looking for something specific at an event?"
            description="Tell us which products you want to see and we'll make sure a specialist is available."
          />
          <ButtonLink to="/contact" size="lg" icon="arrow_forward">
            Contact the team
          </ButtonLink>
        </div>
      </section>
    </SiteShell>
  );
}
