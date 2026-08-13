import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/kit";
import PageHeader from "@/components/admin/PageHeader";
import AnalyticsChart from "@/components/admin/dashboard/AnalyticsChart";
import MetricCard from "@/components/admin/dashboard/MetricCard";
import ActivityFeed from "@/components/admin/dashboard/ActivityFeed";
import UpcomingEvents from "@/components/admin/dashboard/UpcomingEvents";
import InboxPreview from "@/components/admin/dashboard/InboxPreview";
import DemoAccountPanel from "@/components/admin/dashboard/DemoAccountPanel";
import { memberRecords, membershipApplications } from "@/data/membership";
import { leadRecords } from "@/data/leads";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard · TechHub Admin" },
      { name: "description", content: "Overview of TechHub membership, events, and engagement metrics." },
      { property: "og:title", content: "Dashboard · TechHub Admin" },
      { property: "og:description", content: "Overview of TechHub membership, events, and engagement metrics." },
    ],
  }),
  component: AdminDashboard,
});

const metrics = [
  {
    label: "Approved Members",
    value: String(memberRecords.length),
    delta: "+2",
    up: true,
    sub: "vs last month",
  },
  {
    label: "Pending Applications",
    value: String(membershipApplications.filter((a) => a.status === "Pending").length),
    delta: "awaiting review",
    up: true,
    sub: "membership queue",
  },
  {
    label: "New Inquiries",
    value: String(leadRecords.filter((l) => l.status === "New").length),
    delta: "unread",
    up: false,
    sub: "leads inbox",
  },
];

function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Dashboard" subtitle="Welcome back, Alex. Here's what's happening." />

      <div className="grid grid-cols-12 gap-5">
        {/* Big analytics card */}
        <Card className="col-span-12 p-6 lg:col-span-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h3 className="text-[16px] font-bold text-navy">Membership Growth</h3>
              <p className="text-[13px] text-faint">Total members over 8 months</p>
            </div>
            <span className="rounded-[10px] bg-tint px-3 py-1.5 text-[12px] font-semibold text-blue">2026</span>
          </div>
          <AnalyticsChart />
        </Card>

        {/* Metric column */}
        <div className="col-span-12 flex flex-col gap-4 lg:col-span-4">
          {metrics.map((m) => (
            <MetricCard key={m.label} {...m} />
          ))}
        </div>

        {/* Activity feed */}
        <Card className="col-span-12 p-6 lg:col-span-5">
          <h3 className="mb-4 text-[16px] font-bold text-navy">Recent Activity</h3>
          <ActivityFeed />
        </Card>

        {/* Upcoming events */}
        <Card className="col-span-12 p-6 lg:col-span-4">
          <h3 className="mb-4 text-[16px] font-bold text-navy">Upcoming Events</h3>
          <UpcomingEvents />
        </Card>

        {/* Inbox preview */}
        <Card className="col-span-12 p-6 lg:col-span-3">
          <h3 className="mb-2 text-[16px] font-bold text-navy">Inbox</h3>
          <InboxPreview />
        </Card>

        <DemoAccountPanel />
      </div>
    </div>
  );
}
