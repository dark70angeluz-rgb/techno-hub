/**
 * Static demo membership data.
 *
 * Membership is optional and free-form: an application is submitted, reviewed
 * by an admin, then approved or rejected. There is no plan, price, billing or
 * subscription anywhere in this model.
 */
export type MembershipStatus = "Pending" | "Approved" | "Rejected";

export interface MembershipApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  reason: string;
  submittedAt: string;
  status: MembershipStatus;
  reviewNote?: string;
}

export const membershipApplications: MembershipApplication[] = [
  {
    id: "APP-1041",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "+63 912 345 6789",
    organization: "Northwind Studios",
    reason: "We source camera and audio gear for client shoots several times a year.",
    submittedAt: "Aug 10, 2026 · 09:24",
    status: "Pending",
  },
  {
    id: "APP-1040",
    name: "James Reyes",
    email: "james@email.com",
    phone: "+63 917 234 5678",
    organization: "Reyes IT Consulting",
    reason: "Looking for priority turnaround on laptop refresh quotes.",
    submittedAt: "Aug 9, 2026 · 16:02",
    status: "Pending",
  },
  {
    id: "APP-1039",
    name: "Lea Mendoza",
    email: "lea@email.com",
    phone: "+63 918 123 4567",
    organization: "Independent",
    reason: "Personal buyer, interested in member gatherings and early access.",
    submittedAt: "Aug 7, 2026 · 11:47",
    status: "Approved",
    reviewNote: "Verified by email.",
  },
  {
    id: "APP-1038",
    name: "Carlo Dela Cruz",
    email: "carlo@email.com",
    phone: "+63 919 876 5432",
    organization: "Dela Cruz Media",
    reason: "Regular buyer of imaging equipment for production work.",
    submittedAt: "Aug 4, 2026 · 08:15",
    status: "Approved",
  },
  {
    id: "APP-1037",
    name: "Ana Villanueva",
    email: "ana@email.com",
    phone: "+63 920 765 4321",
    organization: "—",
    reason: "Wanted to see whether membership is required to browse.",
    submittedAt: "Aug 1, 2026 · 14:30",
    status: "Rejected",
    reviewNote: "Duplicate of an earlier application.",
  },
  {
    id: "APP-1036",
    name: "Rico Bautista",
    email: "rico@email.com",
    phone: "+63 921 654 3210",
    organization: "Bautista Audio Lab",
    reason: "Studio equipment sourcing, several requests per quarter.",
    submittedAt: "Jul 28, 2026 · 10:05",
    status: "Approved",
  },
  {
    id: "APP-1035",
    name: "Sofia Ramos",
    email: "sofia@email.com",
    phone: "+63 922 543 2109",
    organization: "Ramos & Co.",
    reason: "Fleet of wearables for a field team.",
    submittedAt: "Jul 22, 2026 · 13:41",
    status: "Pending",
  },
  {
    id: "APP-1034",
    name: "Miguel Garcia",
    email: "miguel@email.com",
    phone: "+63 923 432 1098",
    organization: "Garcia Logistics",
    reason: "Comparing smartphones for a small operations team.",
    submittedAt: "Jul 15, 2026 · 17:12",
    status: "Rejected",
    reviewNote: "Contact details could not be verified.",
  },
];

/** Records for applicants that were approved and now hold a membership. */
export interface MemberRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  organization: string;
  memberSince: string;
  status: "Active" | "Inactive";
}

export const memberRecords: MemberRecord[] = [
  {
    id: "MEM-207",
    name: "Lea Mendoza",
    email: "lea@email.com",
    phone: "+63 918 123 4567",
    organization: "Independent",
    memberSince: "Aug 7, 2026",
    status: "Active",
  },
  {
    id: "MEM-206",
    name: "Carlo Dela Cruz",
    email: "carlo@email.com",
    phone: "+63 919 876 5432",
    organization: "Dela Cruz Media",
    memberSince: "Aug 4, 2026",
    status: "Active",
  },
  {
    id: "MEM-205",
    name: "Rico Bautista",
    email: "rico@email.com",
    phone: "+63 921 654 3210",
    organization: "Bautista Audio Lab",
    memberSince: "Jul 28, 2026",
    status: "Active",
  },
  {
    id: "MEM-204",
    name: "Diana Torres",
    email: "diana@email.com",
    phone: "+63 924 321 0987",
    organization: "Torres Design",
    memberSince: "Jun 12, 2026",
    status: "Inactive",
  },
];

/**
 * The signed-in member shown on the public Membership Status page.
 * Static demo state only — no production authentication in this pass.
 */
export const demoAccount = {
  name: "Lea Mendoza",
  email: "lea@email.com",
  phone: "+63 918 123 4567",
  organization: "Independent",
  applicationId: "APP-1039",
  submittedAt: "Aug 7, 2026",
  reviewedAt: "Aug 8, 2026",
  status: "Approved" as MembershipStatus,
  memberSince: "Aug 8, 2026",
};
