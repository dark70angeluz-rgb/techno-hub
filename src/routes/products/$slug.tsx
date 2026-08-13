import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import SiteShell from "@/components/layout/SiteShell";
import Icon from "@/components/kit/Icon";
import { ButtonLink } from "@/components/kit/Button";
import { Card, Eyebrow, Reveal, StatusChip } from "@/components/kit";
import { products, type Product } from "@/data/products";
import { usePublicProducts } from "@/lib/content-store";


export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = products.find((p) => p.slug === params.slug);
    // Admin-created products live in the client store; render them client-side.
    return { product: product ?? null, slug: params.slug };
  },
  head: ({ loaderData }) => {
    if (!loaderData?.product) {
      return {
        meta: [{ title: "Product unavailable | TechHub" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.name} — ${product.category} | TechHub`;
    return {
      meta: [
        { title },
        { name: "description", content: product.desc },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:title", content: title },
        { property: "og:description", content: product.desc },
        { property: "og:image", content: product.image },
        { name: "twitter:image", content: product.image },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const loaded = Route.useLoaderData() as { product: Product | null; slug: string };
  const allProducts = usePublicProducts();
  const [active, setActive] = useState(0);
  const product = (allProducts.find((p) => p.slug === loaded.slug) ?? loaded.product) as
    | Product
    | undefined;
  const related = product
    ? allProducts.filter((p) => product.relatedSlugs?.includes(p.slug)).slice(0, 3)
    : [];

  if (!product) {
    return (
      <SiteShell>
        <section className="section-y">
          <div className="shell flex max-w-[560px] flex-col items-start gap-5">
            <h1 className="text-[32px] leading-[1.1] tracking-[-0.02em] text-ink">
              Product unavailable
            </h1>
            <p className="text-[16px] leading-[1.6] text-muted">
              This product may have been archived. Browse the full catalogue instead.
            </p>
            <ButtonLink to="/" hash="products" icon="arrow_forward">
              Back to products
            </ButtonLink>

          </div>
        </section>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <section className="border-b border-line py-6">
        <div className="shell flex items-center gap-2 text-[13.5px] text-muted">
          <Link to="/" className="hover:text-navy">
            Home
          </Link>
          <Icon name="chevron_right" size={16} className="text-faint" />
          <Link to="/" hash="products" className="hover:text-navy">
            Products
          </Link>

          <Icon name="chevron_right" size={16} className="text-faint" />
          <span className="font-semibold text-navy">{product.name}</span>
        </div>
      </section>

      <section className="section-y">
        <div className="shell grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <div className="overflow-hidden rounded-[18px] border border-line bg-dirty">
              <img
                src={product.images?.[active] ?? product.image}
                alt={`${product.name} — view ${active + 1}`}
                className="aspect-square w-full object-cover"
              />
            </div>
            {product.images?.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={active === i}
                    className={`overflow-hidden rounded-[12px] border bg-dirty transition-colors ${
                      active === i ? "border-blue" : "border-line hover:border-line-strong"
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </Reveal>

          <div className="lg:col-span-6">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2">
                <Eyebrow>{product.brand}</Eyebrow>
                <StatusChip label={product.category} tone="neutral" />
                {product.featured && <StatusChip label="Featured" tone="blue" icon="star" />}
              </div>
              <h1 className="mt-4 text-[36px] leading-[1.08] tracking-[-0.03em] text-ink md:text-[44px]">
                {product.name}
              </h1>
              <p className="mt-4 text-[16px] leading-[1.65] text-muted">{product.summary}</p>

              <div className="mt-6 flex flex-wrap items-end gap-6 border-y border-line py-5">
                <div>
                  <p className="text-[11.5px] uppercase tracking-[0.1em] text-faint">
                    Indicative price
                  </p>
                  <p className="text-[26px] font-bold tracking-tight text-ink">{product.price}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ButtonLink
                    to="/contact"
                    search={{ product: product.slug }}
                    iconLeading="request_quote"
                  >
                    Get a Quote
                  </ButtonLink>
                  <ButtonLink to="/contact" variant="secondary" icon="arrow_forward">
                    Ask a question
                  </ButtonLink>
                </div>

              </div>

              <h2 className="mt-8 text-[19px] font-semibold tracking-tight text-navy">Highlights</h2>
              <ul className="mt-3 flex flex-col gap-2">
                {product.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-[15px] leading-[1.6] text-muted">
                    <Icon name="check_circle" size={17} className="mt-0.5 shrink-0 text-blue" />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line section-y">
        <div className="shell grid grid-cols-1 gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <h2 className="text-[24px] font-semibold tracking-tight text-navy">Overview</h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-muted">{product.overview}</p>

            <h3 className="mt-10 text-[19px] font-semibold tracking-tight text-navy">
              Specifications
            </h3>
            <dl className="mt-4 overflow-hidden rounded-[14px] border border-line">
              {product.specs.map((s, i) => (
                <div
                  key={s.label}
                  className={`grid grid-cols-2 gap-4 px-4 py-3 text-[14.5px] ${
                    i % 2 ? "bg-white" : "bg-dirty"
                  }`}
                >
                  <dt className="font-semibold text-navy">{s.label}</dt>
                  <dd className="text-muted">{s.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="flex flex-col gap-6 lg:col-span-5">
            <Card className="p-6">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-navy">
                In the box
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {product.inTheBox.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[14.5px] text-muted">
                    <Icon name="inventory_2" size={16} className="mt-0.5 shrink-0 text-blue" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h3 className="text-[13px] font-bold uppercase tracking-wider text-navy">
                Member insight
              </h3>
              <p className="mt-3 text-[14.5px] leading-[1.65] text-muted">{product.memberInsight}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.recommendedFor.map((r) => (
                  <StatusChip key={r} label={r} tone="outline" />
                ))}
              </div>
            </Card>

            {product.relatedEvents?.length ? (
              <Card className="p-6">
                <h3 className="text-[13px] font-bold uppercase tracking-wider text-navy">
                  Related events
                </h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {product.relatedEvents.map((e) => (
                    <li key={e} className="flex items-start gap-2 text-[14.5px] text-muted">
                      <Icon name="event" size={16} className="mt-0.5 shrink-0 text-blue" />
                      {e}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <ButtonLink to="/events" variant="secondary" size="sm" icon="arrow_forward">
                    See the calendar
                  </ButtonLink>
                </div>
              </Card>
            ) : null}
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="border-t border-line section-y">
          <div className="shell flex flex-col gap-6">
            <h2 className="text-[24px] font-semibold tracking-tight text-navy">Related products</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  to="/products/$slug"
                  params={{ slug: p.slug }}
                  className="group flex flex-col overflow-hidden rounded-[14px] border border-line bg-white transition-[box-shadow,border-color] hover:border-line-strong hover:shadow-soft"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <div className="p-5">
                    <p className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-blue">
                      {p.brand}
                    </p>
                    <h3 className="mt-1.5 text-[17px] font-semibold text-ink">{p.name}</h3>
                    <p className="mt-1.5 line-clamp-2 text-[14.5px] text-muted">{p.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </SiteShell>
  );
}
