import type { InquiryType } from "@/lib/leads";

/**
 * Static demo lead records for the admin Leads area. Shape matches the shared
 * lead schema in `src/lib/leads.ts`, so live submissions from Contact Us and
 * Get a Quote drop straight into this table once the CMS is connected.
 */
export const leadStatuses = ["New", "Contacted", "In Progress", "Converted", "Closed"] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  subject: string;
  inquiryType: InquiryType;
  product: string;
  message: string;
  receivedAt: string;
  source: "contact" | "quote";
  status: LeadStatus;
}

export const leadRecords: LeadRecord[] = [
  {
    id: "LEAD-3120",
    name: "Maria Santos",
    email: "maria@email.com",
    phone: "+63 912 345 6789",
    company: "Northwind Studios",
    subject: "Quote for Lumix One Pro",
    inquiryType: "Product Quote",
    product: "Lumix One Pro",
    message: "Need pricing for six units with delivery before the end of the quarter.",
    receivedAt: "Aug 12, 2026 · 09:41",
    source: "quote",
    status: "New",
  },
  {
    id: "LEAD-3119",
    name: "James Reyes",
    email: "james@email.com",
    phone: "+63 917 234 5678",
    company: "Reyes IT Consulting",
    subject: "General Inquiry",
    inquiryType: "General Inquiry",
    product: "—",
    message: "Which brands do you carry for business laptops?",
    receivedAt: "Aug 11, 2026 · 15:08",
    source: "contact",
    status: "Contacted",
  },
  {
    id: "LEAD-3118",
    name: "Sofia Ramos",
    email: "sofia@email.com",
    phone: "+63 922 543 2109",
    company: "Ramos & Co.",
    subject: "Quote for AeroWatch 5",
    inquiryType: "Product Quote",
    product: "AeroWatch 5",
    message: "Twelve units for a field team, plus spare straps if available.",
    receivedAt: "Aug 11, 2026 · 10:22",
    source: "quote",
    status: "In Progress",
  },
  {
    id: "LEAD-3117",
    name: "Carlo Dela Cruz",
    email: "carlo@email.com",
    phone: "+63 919 876 5432",
    company: "Dela Cruz Media",
    subject: "Event Question",
    inquiryType: "Event Question",
    product: "—",
    message: "Will imaging gear be on display at the Wearable Tech Expo?",
    receivedAt: "Aug 10, 2026 · 18:55",
    source: "contact",
    status: "Contacted",
  },
  {
    id: "LEAD-3116",
    name: "Lea Mendoza",
    email: "lea@email.com",
    phone: "+63 918 123 4567",
    company: "Independent",
    subject: "Membership",
    inquiryType: "Membership",
    product: "—",
    message: "How long does membership review usually take?",
    receivedAt: "Aug 9, 2026 · 12:03",
    source: "contact",
    status: "Converted",
  },
  {
    id: "LEAD-3115",
    name: "Rico Bautista",
    email: "rico@email.com",
    phone: "+63 921 654 3210",
    company: "Bautista Audio Lab",
    subject: "Quote for SonicWave Headphones",
    inquiryType: "Product Quote",
    product: "SonicWave Headphones",
    message: "Looking for eight sets for a studio fit-out, delivered to Manila.",
    receivedAt: "Aug 8, 2026 · 08:30",
    source: "quote",
    status: "In Progress",
  },
  {
    id: "LEAD-3114",
    name: "Miguel Garcia",
    email: "miguel@email.com",
    phone: "+63 923 432 1098",
    company: "Garcia Logistics",
    subject: "Partnership Opportunity",
    inquiryType: "Partnership Opportunity",
    product: "—",
    message: "We supply protective cases and would like to discuss a partnership.",
    receivedAt: "Aug 5, 2026 · 14:47",
    source: "contact",
    status: "Closed",
  },
  {
    id: "LEAD-3113",
    name: "Ana Villanueva",
    email: "ana@email.com",
    phone: "+63 920 765 4321",
    company: "—",
    subject: "Quote for TitanBook Air 14",
    inquiryType: "Product Quote",
    product: "TitanBook Air 14",
    message: "One unit for personal use — which memory configurations are available?",
    receivedAt: "Aug 3, 2026 · 19:12",
    source: "quote",
    status: "New",
  },
];

export const leadStatusTone: Record<LeadStatus, "blue" | "neutral" | "navy" | "outline"> = {
  New: "blue",
  Contacted: "outline",
  "In Progress": "outline",
  Converted: "navy",
  Closed: "neutral",
};
