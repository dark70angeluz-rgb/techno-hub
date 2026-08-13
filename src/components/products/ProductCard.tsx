import { Link } from "@tanstack/react-router";
import Icon from "@/components/kit/Icon";
import type { Product } from "@/data/products";

/**
 * Product card for the Home showcase — the only place the catalogue is listed.
 * Two actions: open the full detail page, or jump to Contact with the subject
 * pre-filled as "Quote for <product>". No cart, no checkout, no account.
 */
export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[14px] border border-line bg-white transition-[box-shadow,border-color] duration-200 hover:border-line-strong hover:shadow-soft">
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        aria-label={`View details for ${product.name}`}
        className="block overflow-hidden bg-dirty focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.14em] text-blue">
            {product.brand}
          </span>
          <span className="h-1 w-1 rounded-full bg-line-strong" aria-hidden="true" />
          <span className="text-[11.5px] font-medium uppercase tracking-[0.1em] text-faint">
            {product.category}
          </span>
        </div>

        <h3 className="mt-2 text-[17px] font-semibold leading-snug tracking-tight">
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="transition-colors hover:text-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            {product.name}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-2 text-[14.5px] leading-[1.6] text-muted">{product.desc}</p>

        {product.highlights?.length ? (
          <ul className="mt-3.5 flex flex-col gap-1.5">
            {product.highlights.slice(0, 3).map((highlight) => (
              <li
                key={highlight}
                className="flex items-start gap-1.5 text-[13.5px] leading-[1.5] text-muted"
              >
                <Icon name="check" size={15} className="mt-0.5 shrink-0 text-blue" />
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-auto flex flex-col gap-4 border-t border-line pt-4 mt-5">
          <div className="leading-tight">
            <p className="text-[11.5px] uppercase tracking-[0.1em] text-faint">Indicative price</p>
            <p className="text-[17px] font-bold tracking-tight text-ink">{product.price}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/products/$slug"
              params={{ slug: product.slug }}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[10px] border border-line-strong bg-white px-3 text-[14px] font-semibold tracking-tight text-navy transition-colors hover:border-line-blue hover:bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >
              View Details
              <Icon name="arrow_forward" size={16} />
            </Link>
            <Link
              to="/contact"
              search={{ product: product.slug }}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-[10px] bg-navy px-3 text-[14px] font-semibold tracking-tight text-white transition-colors hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
            >
              <Icon name="request_quote" size={17} />
              Get a Quote
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
