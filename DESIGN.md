# TechHub design conventions (READ BEFORE EDITING UI)

Stack: TanStack Start (routes in `src/routes`), Tailwind v4 (tokens in `src/styles.css`), framer-motion, recharts.
Original (pre-redesign) source for CONTENT reference only: `/tmp/up/src/**` (React Router + lucide). Reuse its copy/data, never its markup or icons.

## Colors — ONLY these 5, via tokens
`bg-white text-white`, `bg-ink text-ink` (#000), `bg-dirty` (#F5F5F3), `bg-blue text-blue` (#2563EB), `bg-navy text-navy` (#0F172A).
Opacity-derived helpers: `border-line`, `border-line-strong`, `border-line-blue`, `text-muted`, `text-faint`, `bg-tint`.
NO gradients, NO glow, NO other hues, NO colored shadows. Shadows only `shadow-soft` / `shadow-lift`.

## Icons — Material Symbols only
`import Icon from "@/components/kit/Icon"` → `<Icon name="devices" size={20} />`. Never lucide, never emoji.

## Kit
`import { Card, SectionHeading, Eyebrow, Reveal, StatusChip, EmptyState, Field, inputClass, textareaClass } from "@/components/kit"`
`import { Button, ButtonLink } from "@/components/kit/Button"`

## Layout
Wrap public pages: `import SiteShell from "@/components/layout/SiteShell"` → `<SiteShell>…</SiteShell>`.
Containers: `className="shell"` (1200px content, 24px gutters) or `shell-wide` (1440). Section padding: `className="section-y"` (48/64/96).
12-col grids: `grid grid-cols-12 gap-6`.

## Type scale
Section titles 40–48px bold tight (`text-[40px] lg:text-[46px] font-bold tracking-tight`). Card titles 18–20px semibold. Body 15–16px, leading 1.6, `text-muted`.
Buttons h-48 r-14 (kit Button). Cards r-24, 1px `border-line`, soft shadow, equal heights in a row. Inputs h-52 r-16, blue focus ring.

## Motion (framer-motion, restrained)
Fade + 12px slide, 180–220ms, ease `[0.22,0.61,0.36,1]`. Hover scale max 1.02. No bounce/spin/parallax.

## Data
`import { products } from "@/data/products"`.

## Accessibility
Semantic sections, one h1 per page, 44px min touch targets, visible focus (global), alt text on images.

## Route head()
Every route needs a unique `head()` with title/description/og:title/og:description.
