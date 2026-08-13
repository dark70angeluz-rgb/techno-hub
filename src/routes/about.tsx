import { createFileRoute } from "@tanstack/react-router";
import { ButtonLink } from "@/components/kit/Button";
import Icon from "@/components/kit/Icon";
import { Card, Eyebrow, Reveal, SectionHeading } from "@/components/kit";
import SiteShell from "@/components/layout/SiteShell";

export const Route = createFileRoute("/about")({
  component: Page,
  head: () => ({
    meta: [
      { title: "About — TechHub" },
      {
        name: "description",
        content:
          "TechHub started as a small Slack group in 2019. Today it's a 52,000-member global community redefining how people discover, access, and master technology.",
      },
      { property: "og:title", content: "About — TechHub" },
      {
        property: "og:description",
        content:
          "Our mission, timeline, principles, and the team behind TechHub's global tech community.",
      },
    ],
  }),
});

const timeline = [
  { year: "2019", title: "The Founding", desc: "TechHub was founded by 5 tech professionals who wanted a real community. We started with 300 members in San Francisco." },
  { year: "2020", title: "Going Virtual", desc: "The pandemic accelerated our virtual events program. We hosted 80+ online workshops and grew to 8,000 members across 40 countries." },
  { year: "2021", title: "First Global Summit", desc: "Our inaugural TechHub Summit drew 3,200 attendees and landed partnerships with Apple, Samsung, and Dell." },
  { year: "2022", title: "Learning Hub Launch", desc: "Launched our Learning Hub with 200+ courses. Certifications grew 400% in the first quarter. Crossed 20,000 members." },
  { year: "2023", title: "Series A Funding", desc: "Raised $12M to expand globally, reaching 35,000 members and opening regional chapters in London, Singapore, and Dubai." },
  { year: "2026", title: "Today & Beyond", desc: "52,000+ members, 200+ partner brands, 180 events annually. Expanding into AR/VR, AI gadgets, and enterprise memberships." },
];

const principles = [
  { icon: "public", title: "Global Access", desc: "Tech shouldn't be gatekept. We make premium access available to members in 90+ countries." },
  { icon: "favorite", title: "Community First", desc: "Every decision we make is filtered through one lens: does it serve our members?" },
  { icon: "lightbulb", title: "Curiosity-Driven", desc: "We celebrate the perpetual curiosity that defines the best technologists." },
  { icon: "shield", title: "Trusted & Transparent", desc: "No hidden fees, no data selling, no fake reviews. What we earn comes from members." },
];

const team = [
  { name: "Alex Morgan", role: "Founder & CEO", bio: "Former Apple product strategist with 12 years in consumer tech." },
  { name: "Sarah Chen", role: "Head of Community", bio: "Built communities at Discord and Product Hunt before joining TechHub." },
  { name: "Marcus Williams", role: "Chief Technology Officer", bio: "Ex-Google engineer passionate about democratizing access to tech." },
  { name: "Priya Patel", role: "VP of Partnerships", bio: "Negotiated 200+ brand deals worth $40M+ in total member savings." },
  { name: "James Kim", role: "Head of Events", bio: "Produced tech events for 15 years, including CES and Mobile World Congress." },
  { name: "Layla Hassan", role: "Director of Learning", bio: "Former MIT Media Lab researcher. Built the curriculum for 500+ courses." },
];

const stats = [
  { n: "52K+", l: "Global Members" },
  { n: "90+", l: "Countries" },
  { n: "$40M+", l: "Member Savings" },
  { n: "500+", l: "Courses" },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("");
}

function Page() {
  return (
    <SiteShell>
      {/* Intro header */}
      <section className="section-y">
        <div className="shell">
          <Reveal className="max-w-[720px]">
            <Eyebrow icon="history_edu">Our Story</Eyebrow>
            <h1 className="mt-4 text-[40px] leading-[1.06] font-bold tracking-tight lg:text-[46px]">
              Built by tech enthusiasts, for tech enthusiasts.
            </h1>
            <p className="mt-5 text-[16px] leading-[1.6] text-muted">
              TechHub started as a small Slack group in 2019. Today it's a 52,000-member global
              community redefining how people discover, access, and master technology.
            </p>
            <div className="mt-8">
              <ButtonLink to="/membership" icon="arrow_forward">
                Become a Member
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Mission statement block */}
      <section className="section-y pt-0">
        <div className="shell grid grid-cols-12 gap-6">
          <Reveal className="col-span-12 lg:col-span-6">
            <div className="flex h-full flex-col rounded-[24px] bg-blue p-8 text-white shadow-soft md:p-10">
              <span className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                <Icon name="bolt" size={22} className="text-white" />
              </span>
              <h2 className="text-[28px] font-bold tracking-tight text-white">Our Mission</h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-white/85">
                To empower every tech enthusiast with the community, resources, and access they
                need to stay at the frontier — regardless of their background or budget.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="col-span-12 lg:col-span-6">
            <div className="flex h-full flex-col rounded-[24px] bg-navy p-8 text-white shadow-soft md:p-10">
              <span className="mb-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Icon name="public" size={22} className="text-white" />
              </span>
              <h2 className="text-[28px] font-bold tracking-tight text-white">Our Vision</h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-white/75">
                A world where access to premium technology, knowledge, and community is a right,
                not a privilege — and where the next generation of innovators can grow together.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Principles grid */}
      <section className="section-y bg-dirty">
        <div className="shell">
          <SectionHeading eyebrow="Why TechHub" title="Our principles" align="center" />
          <div className="mt-12 grid grid-cols-12 gap-6">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05} className="col-span-12 sm:col-span-6 lg:col-span-3">
                <Card className="h-full p-7">
                  <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-dirty">
                    <Icon name={p.icon} size={20} />
                  </span>
                  <h3 className="text-[18px] font-semibold">{p.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-muted">{p.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-y">
        <div className="shell">
          <SectionHeading eyebrow="Our Journey" title="From Slack group to global community" align="center" />
          <div className="relative mx-auto mt-12 max-w-[680px]">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-line-strong" />
            {timeline.map((item, i) => (
              <Reveal key={item.year} delay={i * 0.04} className="relative mb-10 pl-14 last:mb-0">
                <div className="absolute left-3 top-5 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white bg-blue" />
                <Card className="p-6">
                  <span className="inline-flex items-center rounded-full border border-line-blue bg-tint px-2.5 py-1 text-[12px] font-semibold text-blue">
                    {item.year}
                  </span>
                  <h3 className="mt-3 text-[18px] font-semibold">{item.title}</h3>
                  <p className="mt-2 text-[15px] leading-[1.6] text-muted">{item.desc}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-y bg-dirty">
        <div className="shell">
          <SectionHeading eyebrow="The Team" title="The people behind TechHub" align="center" />
          <div className="mt-12 grid grid-cols-12 gap-6">
            {team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.04} className="col-span-12 sm:col-span-6 lg:col-span-4">
                <Card className="flex h-full items-start gap-4 p-6">
                  <span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-navy text-[16px] font-bold text-white">
                    {initials(m.name)}
                  </span>
                  <div>
                    <h3 className="text-[16px] font-semibold">{m.name}</h3>
                    <p className="text-[13px] font-medium text-blue">{m.role}</p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-muted">{m.bio}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-navy py-16 text-white">
        <div className="shell grid grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.l} delay={i * 0.05}>
              <div className="text-[40px] font-bold tracking-tight text-white">{s.n}</div>
              <div className="mt-1 text-[14px] text-white/70">{s.l}</div>
            </Reveal>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
