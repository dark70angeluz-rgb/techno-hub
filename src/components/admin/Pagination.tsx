import Icon from "@/components/kit/Icon";

export function Pagination({
  page,
  totalPages,
  onPage,
  total,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
  total: number;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3.5">
      <p className="text-[13px] text-faint">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-dirty text-navy transition-opacity disabled:opacity-35"
        >
          <Icon name="chevron_left" size={18} />
        </button>
        <button
          onClick={() => onPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-dirty text-navy transition-opacity disabled:opacity-35"
        >
          <Icon name="chevron_right" size={18} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
