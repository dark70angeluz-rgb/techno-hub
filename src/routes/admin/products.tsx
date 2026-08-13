import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card, EmptyState, Field, StatusChip, inputClass, textareaClass } from "@/components/kit";
import { Button } from "@/components/kit/Button";
import Icon from "@/components/kit/Icon";
import PageHeader from "@/components/admin/PageHeader";
import { Toolbar, FilterChip } from "@/components/admin/Toolbar";
import Pagination from "@/components/admin/Pagination";
import { EntityModal, ImageUploadField } from "@/components/admin/EntityModal";
import { slugify, useAdminStore, type ArchivableProduct } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/products")({
  head: () => ({
    meta: [
      { title: "Products · TechHub Admin" },
      {
        name: "description",
        content:
          "Create, edit, archive and feature TechHub products, upload product images and manage product descriptions.",
      },
      { property: "og:title", content: "Products · TechHub Admin" },
      {
        property: "og:description",
        content: "Full product management: create, edit, archive, images, descriptions, featured.",
      },
    ],
  }),
  component: AdminProductsPage,
});

const PAGE_SIZE = 6;

type Draft = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: string;
  desc: string;
  overview: string;
  image: string;
  gallery: string;
  highlights: string;
  featured: boolean;
};

const emptyDraft: Draft = {
  slug: "",
  name: "",
  brand: "",
  category: "",
  price: "",
  desc: "",
  overview: "",
  image: "",
  gallery: "",
  highlights: "",
  featured: false,
};

function toDraft(p: ArchivableProduct): Draft {
  return {
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    desc: p.desc,
    overview: p.overview ?? "",
    image: p.image,
    gallery: (p.images ?? []).join("\n"),
    highlights: (p.highlights ?? []).join("\n"),
    featured: Boolean(p.featured),
  };
}

function AdminProductsPage() {
  const {
    products,
    saveProduct,
    removeProduct,
    toggleProductArchived,
    toggleProductFeatured,
  } = useAdminStore();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [showArchived, setShowArchived] = useState(false);
  const [modal, setModal] = useState<{ open: boolean; editing: string | null; draft: Draft }>({
    open: false,
    editing: null,
    draft: emptyDraft,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Draft, string>>>({});

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category))).sort()],
    [products]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter(
      (p) =>
        (showArchived ? true : !p.archived) &&
        (category === "All" || p.category === category) &&
        (p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    );
  }, [products, query, category, showArchived]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const featuredCount = products.filter((p) => p.featured && !p.archived).length;

  const openNew = () => {
    setErrors({});
    setModal({ open: true, editing: null, draft: emptyDraft });
  };
  const openEdit = (product: ArchivableProduct) => {
    setErrors({});
    setModal({ open: true, editing: product.slug, draft: toDraft(product) });
  };
  const close = () => setModal((m) => ({ ...m, open: false }));
  const setDraft = (patch: Partial<Draft>) =>
    setModal((m) => ({ ...m, draft: { ...m.draft, ...patch } }));

  const submit = () => {
    const d = modal.draft;
    const next: Partial<Record<keyof Draft, string>> = {};
    if (!d.name.trim()) next.name = "Product name is required.";
    if (!d.brand.trim()) next.brand = "Brand is required.";
    if (!d.category.trim()) next.category = "Category is required.";
    if (!d.desc.trim()) next.desc = "A short description is required.";
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    const slug = modal.editing ?? (slugify(d.name) || `product-${Date.now()}`);
    const existing = products.find((p) => p.slug === slug);
    const gallery = d.gallery
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const highlights = d.highlights
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const priceNum = Number(d.price.replace(/[^0-9.]/g, "")) || 0;

    const record: ArchivableProduct = {
      ...(existing ?? {
        specs: [],
        inTheBox: [],
        relatedEvents: [],
        relatedSlugs: [],
        memberInsight: "",
        recommendedFor: [],
        summary: "",
      }),
      slug,
      name: d.name.trim(),
      brand: d.brand.trim(),
      category: d.category.trim(),
      price: d.price.trim() || "Price on request",
      priceNum,
      desc: d.desc.trim(),
      overview: d.overview.trim(),
      summary: d.overview.trim() || existing?.summary || d.desc.trim(),
      image: d.image || gallery[0] || "",
      images: gallery.length ? gallery : d.image ? [d.image] : [],
      highlights,
      featured: d.featured,
    } as ArchivableProduct;

    saveProduct(record);
    toast.success(modal.editing ? "Product updated" : "Product created");
    close();
  };

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Products"
        subtitle={`${products.filter((p) => !p.archived).length} live products · ${featuredCount} featured`}
        action={
          <Button variant="dark" size="sm" iconLeading="add" onClick={openNew}>
            New Product
          </Button>
        }
      />

      <Toolbar
        query={query}
        onQuery={(v) => {
          setQuery(v);
          setPage(1);
        }}
        placeholder="Search products or brands…"
      />

      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <FilterChip
            key={c}
            label={c}
            active={category === c}
            onClick={() => {
              setCategory(c);
              setPage(1);
            }}
          />
        ))}
        <span className="mx-1 hidden h-5 w-px bg-line-strong sm:block" />
        <FilterChip
          label={showArchived ? "Showing archived" : "Hide archived"}
          active={showArchived}
          onClick={() => setShowArchived((v) => !v)}
        />
      </div>

      <Card className="overflow-hidden">
        {paged.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon="inventory_2"
              title="No products found"
              message="Try a different search term or category filter, or create a new product."
              action={
                <Button variant="dark" size="sm" iconLeading="add" onClick={openNew}>
                  New Product
                </Button>
              }
            />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-line bg-dirty">
                    {["Product", "Brand", "Category", "Price", "Status", "Featured", "Actions"].map(
                      (h) => (
                        <th
                          key={h}
                          className={`px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-muted ${
                            h === "Actions" ? "text-right" : ""
                          }`}
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paged.map((product) => (
                    <tr
                      key={product.slug}
                      className="border-b border-line last:border-0 hover:bg-dirty/60"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt=""
                            width={40}
                            height={40}
                            loading="lazy"
                            className="h-10 w-10 rounded-[10px] border border-line object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate text-[14.5px] font-semibold text-navy">
                              {product.name}
                            </p>
                            <p className="truncate text-[12.5px] text-muted">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[14px] text-muted">{product.brand}</td>
                      <td className="px-5 py-3.5 text-[14px] text-muted">{product.category}</td>
                      <td className="px-5 py-3.5 text-[14px] font-semibold text-navy">
                        {product.price}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusChip
                          label={product.archived ? "Archived" : "Published"}
                          tone={product.archived ? "neutral" : "blue"}
                          icon={product.archived ? "inventory" : "check_circle"}
                        />
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => toggleProductFeatured(product.slug)}
                          aria-pressed={Boolean(product.featured)}
                          className="inline-flex items-center"
                          aria-label={`Toggle featured for ${product.name}`}
                        >
                          <StatusChip
                            label={product.featured ? "Featured" : "Standard"}
                            tone={product.featured ? "navy" : "neutral"}
                            icon={product.featured ? "star" : "star_outline"}
                          />
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => openEdit(product)}
                            className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-dirty text-navy hover:bg-tint hover:text-blue"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Icon name="edit" size={16} />
                          </button>
                          <button
                            onClick={() => {
                              toggleProductArchived(product.slug);
                              toast.success(
                                product.archived
                                  ? `${product.name} restored`
                                  : `${product.name} archived`
                              );
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-dirty text-navy hover:bg-tint hover:text-blue"
                            aria-label={`${product.archived ? "Restore" : "Archive"} ${product.name}`}
                          >
                            <Icon name={product.archived ? "unarchive" : "inventory_2"} size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete “${product.name}” permanently?`)) {
                                removeProduct(product.slug);
                                toast.success(`${product.name} deleted`);
                              }
                            }}
                            className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-dirty text-navy hover:bg-danger-tint hover:text-danger"
                            aria-label={`Delete ${product.name}`}
                          >
                            <Icon name="delete" size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={current}
              totalPages={totalPages}
              onPage={setPage}
              total={filtered.length}
            />
          </>
        )}
      </Card>

      <p className="flex items-center gap-2 text-[13px] text-muted">
        <Icon name="info" size={16} className="text-blue" />
        Published products appear in the public catalogue and on their own detail page. Featured
        products also surface on the home showcase.
      </p>

      <EntityModal
        open={modal.open}
        title={modal.editing ? "Edit product" : "New product"}
        subtitle="Product details, description, images and featured placement."
        onClose={close}
        onSubmit={submit}
        submitLabel={modal.editing ? "Save product" : "Create product"}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product name" htmlFor="p-name" required error={errors.name}>
            <input
              id="p-name"
              value={modal.draft.name}
              maxLength={120}
              onChange={(e) => setDraft({ name: e.target.value })}
              className={inputClass}
              placeholder="Lumix One Pro"
            />
          </Field>
          <Field label="Brand" htmlFor="p-brand" required error={errors.brand}>
            <input
              id="p-brand"
              value={modal.draft.brand}
              maxLength={80}
              onChange={(e) => setDraft({ brand: e.target.value })}
              className={inputClass}
              placeholder="Lumix"
            />
          </Field>
          <Field label="Category" htmlFor="p-category" required error={errors.category}>
            <input
              id="p-category"
              value={modal.draft.category}
              maxLength={60}
              onChange={(e) => setDraft({ category: e.target.value })}
              className={inputClass}
              placeholder="Smartphone"
            />
          </Field>
          <Field label="Indicative price" htmlFor="p-price" hint="Shown as text, e.g. ₱49,990.">
            <input
              id="p-price"
              value={modal.draft.price}
              maxLength={40}
              onChange={(e) => setDraft({ price: e.target.value })}
              className={inputClass}
              placeholder="₱49,990"
            />
          </Field>
        </div>

        <Field label="Short description" htmlFor="p-desc" required error={errors.desc}>
          <textarea
            id="p-desc"
            value={modal.draft.desc}
            maxLength={280}
            onChange={(e) => setDraft({ desc: e.target.value })}
            className={`${textareaClass} min-h-[80px]`}
            placeholder="One line shown on product cards."
          />
        </Field>

        <Field
          label="Full description"
          htmlFor="p-overview"
          hint="Shown in the Overview section of the product detail page."
        >
          <textarea
            id="p-overview"
            value={modal.draft.overview}
            maxLength={2000}
            onChange={(e) => setDraft({ overview: e.target.value })}
            className={textareaClass}
          />
        </Field>

        <ImageUploadField
          label="Main product image"
          value={modal.draft.image}
          onChange={(image) => setDraft({ image })}
        />

        <Field
          label="Gallery image URLs"
          htmlFor="p-gallery"
          hint="One URL per line — used by the product detail gallery."
        >
          <textarea
            id="p-gallery"
            value={modal.draft.gallery}
            onChange={(e) => setDraft({ gallery: e.target.value })}
            className={`${textareaClass} min-h-[90px]`}
          />
        </Field>

        <Field label="Highlights" htmlFor="p-highlights" hint="One highlight per line.">
          <textarea
            id="p-highlights"
            value={modal.draft.highlights}
            onChange={(e) => setDraft({ highlights: e.target.value })}
            className={`${textareaClass} min-h-[90px]`}
          />
        </Field>

        <label className="flex items-center gap-3 rounded-[12px] border border-line bg-dirty px-4 py-3">
          <input
            type="checkbox"
            checked={modal.draft.featured}
            onChange={(e) => setDraft({ featured: e.target.checked })}
            className="h-4 w-4 accent-blue"
          />
          <span className="text-[14px] font-semibold text-navy">
            Mark as Featured
            <span className="ml-2 font-normal text-muted">Shows on the home page showcase</span>
          </span>
        </label>
      </EntityModal>
    </div>
  );
}
