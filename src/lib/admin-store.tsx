import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products as seedProducts, type Product } from "@/data/products";
import { benefits as seedBenefits, type Benefit } from "@/data/benefits";
import { events as seedEvents, type EventItem } from "@/data/events";

/**
 * Single client-side content + notification store for the portal.
 *
 * Seeded from the static demo data, persisted to localStorage so admin edits
 * (create / edit / archive / delete / featured / image uploads) survive a
 * reload and are immediately visible on the public pages.
 */

export type ArchivableProduct = Product & { archived?: boolean };
export type ArchivableBenefit = Benefit & { archived?: boolean };
export type ArchivableEvent = EventItem & { archived?: boolean };

export type NotificationRule = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  recipients: string;
  on: boolean;
};

export type ProviderSettings = {
  fromName: string;
  fromEmail: string;
  replyTo: string;
  adminEmail: string;
};

export type LogEntry = {
  id: string;
  to: string;
  subject: string;
  type: string;
  time: string;
  status: "Delivered" | "Failed" | "Queued";
};

export const defaultRules: NotificationRule[] = [
  {
    id: "contact",
    icon: "mail",
    title: "Contact form submission",
    desc: "Sends the full inquiry (name, email, subject, message) to the designated administrator.",
    recipients: "inquiries@techhub.io",
    on: true,
  },
  {
    id: "quote",
    icon: "request_quote",
    title: "Product quote request",
    desc: "Notifies the sales inbox whenever a visitor requests a quote from a product page.",
    recipients: "sales@techhub.io",
    on: true,
  },
  {
    id: "application",
    icon: "how_to_reg",
    title: "New membership application",
    desc: "Alerts reviewers that an application is waiting in the membership queue.",
    recipients: "membership@techhub.io",
    on: true,
  },
  {
    id: "approved",
    icon: "verified",
    title: "Application approved (to applicant)",
    desc: "Confirms approval and welcomes the new member.",
    recipients: "Applicant email",
    on: true,
  },
  {
    id: "rejected",
    icon: "cancel",
    title: "Application rejected (to applicant)",
    desc: "Politely informs the applicant of the outcome, with the reviewer note if provided.",
    recipients: "Applicant email",
    on: false,
  },
];

export const defaultProvider: ProviderSettings = {
  fromName: "TechHub Notifications",
  fromEmail: "no-reply@techhub.io",
  replyTo: "inquiries@techhub.io",
  adminEmail: "inquiries@techhub.io",
};

const defaultLog: LogEntry[] = [
  {
    id: "seed-1",
    to: "inquiries@techhub.io",
    subject: "New inquiry from Marisol Reyes — Bulk order",
    type: "Contact form",
    time: "Today, 09:41",
    status: "Delivered",
  },
  {
    id: "seed-2",
    to: "sales@techhub.io",
    subject: "Quote request — Lumix One Pro",
    type: "Quote",
    time: "Today, 08:57",
    status: "Delivered",
  },
  {
    id: "seed-3",
    to: "membership@techhub.io",
    subject: "Membership application — Dennis Uy",
    type: "Membership",
    time: "Yesterday, 17:20",
    status: "Delivered",
  },
  {
    id: "seed-4",
    to: "kate@brightlab.io",
    subject: "New inquiry from Kate Bautista — Partnership",
    type: "Contact form",
    time: "2 days ago",
    status: "Failed",
  },
];

/** Demo administrator credentials shown on the login page. */
export const DEMO_ADMIN = {
  email: "admin@techhub.io",
  password: "TechHub2026",
  name: "Demo Administrator",
};

export type DemoAccount = {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
};

/** Generates a ready-to-use demo administrator account (client-side demo data). */
function makeDemoAccount(index: number): DemoAccount {
  const stamp = Date.now().toString(36).slice(-4);
  const suffix = String(index).padStart(2, "0");
  return {
    id: `demo-${Date.now()}`,
    email: `demo${suffix}.${stamp}@techhub.io`,
    password: `Demo-${stamp.toUpperCase()}${suffix}`,
    name: `Demo User ${suffix}`,
    createdAt: new Date().toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

type State = {
  demoAccounts: DemoAccount[];
  products: ArchivableProduct[];
  benefits: ArchivableBenefit[];
  events: ArchivableEvent[];
  rules: NotificationRule[];
  provider: ProviderSettings;
  log: LogEntry[];
  admin: { email: string; name: string } | null;
};

const initialState: State = {
  demoAccounts: [],
  products: seedProducts,
  benefits: seedBenefits,
  events: seedEvents,
  rules: defaultRules,
  provider: defaultProvider,
  log: defaultLog,
  admin: null,
};

const STORAGE_KEY = "techhub-portal-v1";

type Store = State & {
  ready: boolean;
  saveProduct: (product: ArchivableProduct) => void;
  removeProduct: (slug: string) => void;
  toggleProductArchived: (slug: string) => void;
  toggleProductFeatured: (slug: string) => void;
  saveBenefit: (benefit: ArchivableBenefit) => void;
  removeBenefit: (id: string) => void;
  toggleBenefitArchived: (id: string) => void;
  toggleBenefitFeatured: (id: string) => void;
  saveEvent: (event: ArchivableEvent) => void;
  removeEvent: (slug: string) => void;
  toggleEventArchived: (slug: string) => void;
  toggleEventFeatured: (slug: string) => void;
  setRules: (rules: NotificationRule[]) => void;
  setProvider: (provider: ProviderSettings) => void;
  addLogEntry: (entry: Omit<LogEntry, "id" | "time">) => void;
  createDemoAccount: () => DemoAccount;
  removeDemoAccount: (id: string) => void;
  signInAdmin: (email: string, password: string) => boolean;
  signOutAdmin: () => void;
};

const StoreContext = createContext<Store | null>(null);

export function AdminStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [ready, setReady] = useState(false);

  // Hydrate after mount so SSR markup always matches the seed data.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState, ...(JSON.parse(raw) as Partial<State>) });
    } catch {
      /* corrupted storage — fall back to seed data */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or unavailable — edits stay in memory */
    }
  }, [state, ready]);

  const upsert = useCallback(
    <T,>(list: T[], item: T, key: (row: T) => string) => {
      const index = list.findIndex((row) => key(row) === key(item));
      if (index === -1) return [item, ...list];
      const next = [...list];
      next[index] = item;
      return next;
    },
    []
  );

  const value = useMemo<Store>(() => {
    const pKey = (p: ArchivableProduct) => p.slug;
    const bKey = (b: ArchivableBenefit) => b.id;
    const eKey = (e: ArchivableEvent) => e.slug;

    return {
      ...state,
      ready,
      saveProduct: (product) =>
        setState((s) => ({ ...s, products: upsert(s.products, product, pKey) })),
      removeProduct: (slug) =>
        setState((s) => ({ ...s, products: s.products.filter((p) => p.slug !== slug) })),
      toggleProductArchived: (slug) =>
        setState((s) => ({
          ...s,
          products: s.products.map((p) => (p.slug === slug ? { ...p, archived: !p.archived } : p)),
        })),
      toggleProductFeatured: (slug) =>
        setState((s) => ({
          ...s,
          products: s.products.map((p) => (p.slug === slug ? { ...p, featured: !p.featured } : p)),
        })),
      saveBenefit: (benefit) =>
        setState((s) => ({ ...s, benefits: upsert(s.benefits, benefit, bKey) })),
      removeBenefit: (id) =>
        setState((s) => ({ ...s, benefits: s.benefits.filter((b) => b.id !== id) })),
      toggleBenefitArchived: (id) =>
        setState((s) => ({
          ...s,
          benefits: s.benefits.map((b) => (b.id === id ? { ...b, archived: !b.archived } : b)),
        })),
      toggleBenefitFeatured: (id) =>
        setState((s) => ({
          ...s,
          benefits: s.benefits.map((b) => (b.id === id ? { ...b, featured: !b.featured } : b)),
        })),
      saveEvent: (event) => setState((s) => ({ ...s, events: upsert(s.events, event, eKey) })),
      removeEvent: (slug) =>
        setState((s) => ({ ...s, events: s.events.filter((e) => e.slug !== slug) })),
      toggleEventArchived: (slug) =>
        setState((s) => ({
          ...s,
          events: s.events.map((e) => (e.slug === slug ? { ...e, archived: !e.archived } : e)),
        })),
      toggleEventFeatured: (slug) =>
        setState((s) => ({
          ...s,
          events: s.events.map((e) => (e.slug === slug ? { ...e, featured: !e.featured } : e)),
        })),
      setRules: (rules) => setState((s) => ({ ...s, rules })),
      setProvider: (provider) => setState((s) => ({ ...s, provider })),
      addLogEntry: (entry) =>
        setState((s) => ({
          ...s,
          log: [
            {
              ...entry,
              id: `log-${Date.now()}`,
              time: new Date().toLocaleString(undefined, {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
            ...s.log,
          ].slice(0, 40),
        })),
      createDemoAccount: () => {
        const account = makeDemoAccount(state.demoAccounts.length + 1);
        setState((s) => ({ ...s, demoAccounts: [account, ...s.demoAccounts] }));
        return account;
      },
      removeDemoAccount: (id) =>
        setState((s) => ({ ...s, demoAccounts: s.demoAccounts.filter((a) => a.id !== id) })),
      signInAdmin: (email, password) => {
        const entered = email.trim().toLowerCase();
        if (entered === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
          setState((s) => ({ ...s, admin: { email: DEMO_ADMIN.email, name: DEMO_ADMIN.name } }));
          return true;
        }
        const demo = state.demoAccounts.find(
          (a) => a.email.toLowerCase() === entered && a.password === password
        );
        if (demo) {
          setState((s) => ({ ...s, admin: { email: demo.email, name: demo.name } }));
          return true;
        }
        return false;
      },
      signOutAdmin: () => setState((s) => ({ ...s, admin: null })),
    };
  }, [state, ready, upsert]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAdminStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useAdminStore must be used inside <AdminStoreProvider>");
  return ctx;
}

/** Public (non-archived) collections used by the visitor-facing pages. */
export function usePublicProducts() {
  const { products } = useAdminStore();
  return useMemo(() => products.filter((p) => !p.archived), [products]);
}

export function usePublicBenefits() {
  const { benefits } = useAdminStore();
  return useMemo(() => benefits.filter((b) => !b.archived), [benefits]);
}

export function usePublicEvents() {
  const { events } = useAdminStore();
  return useMemo(() => events.filter((e) => !e.archived), [events]);
}

/** Reads an uploaded image file as a data URL so it can be previewed + stored. */
export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("That image could not be read."));
    reader.readAsDataURL(file);
  });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
