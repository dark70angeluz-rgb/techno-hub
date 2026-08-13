export type NavItem = {
  label: string;
  path: string;
  icon: string;
  badge?: number;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", path: "/admin", icon: "dashboard" }],
  },
  {
    label: "Content",
    items: [
      { label: "Products", path: "/admin/products", icon: "inventory_2" },
      { label: "Benefits", path: "/admin/benefits", icon: "redeem" },
      { label: "Events", path: "/admin/events", icon: "calendar_month" },
    ],
  },
  {
    label: "People",
    items: [
      { label: "Membership", path: "/admin/membership", icon: "group", badge: 3 },
      { label: "Leads", path: "/admin/leads", icon: "mail", badge: 2 },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Notifications", path: "/admin/notifications", icon: "notifications_active" },
    ],
  },
  {
    label: "Preferences",
    items: [{ label: "Settings", path: "/admin/settings", icon: "settings" }],
  },
];

export const pageTitles: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/benefits": "Benefits",
  "/admin/events": "Events",
  "/admin/membership": "Membership Applications",
  "/admin/leads": "Leads & Inquiries",
  "/admin/notifications": "Email Notifications",
  "/admin/settings": "Settings",
};
