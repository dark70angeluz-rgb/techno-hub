import { useMemo } from "react";
import { products as seedProducts, type Product } from "@/data/products";
import { benefits as seedBenefits, type Benefit } from "@/data/benefits";
import { events as seedEvents, type EventItem } from "@/data/events";

/**
 * Read-only content source for the public website.
 *
 * Products, benefits and events come from the static data modules. The
 * `archived` flag is still honoured so any legacy stored/authored content
 * marked as archived stays hidden from visitors.
 */

export type ArchivableProduct = Product & { archived?: boolean };
export type ArchivableBenefit = Benefit & { archived?: boolean };
export type ArchivableEvent = EventItem & { archived?: boolean };

/** Public (non-archived) collections used by the visitor-facing pages. */
export function usePublicProducts() {
  return useMemo(
    () => (seedProducts as ArchivableProduct[]).filter((p) => !p.archived),
    []
  );
}

export function usePublicBenefits() {
  return useMemo(
    () => (seedBenefits as ArchivableBenefit[]).filter((b) => !b.archived),
    []
  );
}

export function usePublicEvents() {
  return useMemo(() => (seedEvents as ArchivableEvent[]).filter((e) => !e.archived), []);
}
