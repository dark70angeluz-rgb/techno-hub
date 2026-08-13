import Icon from "@/components/kit/Icon";

export function MetricCard({
  label,
  value,
  delta,
  up,
  sub,
}: {
  label: string;
  value: string;
  delta: string;
  up: boolean;
  sub: string;
}) {
  return (
    <div className="rounded-[20px] border border-line bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between">
        <p className="text-[13px] font-medium text-muted">{label}</p>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-semibold ${
            up ? "bg-tint text-blue" : "bg-dirty text-faint"
          }`}
        >
          <Icon name={up ? "trending_up" : "trending_down"} size={14} />
          {delta}
        </span>
      </div>
      <p className="mt-3 text-[32px] font-bold leading-none tracking-tight text-navy">{value}</p>
      <p className="mt-1.5 text-[12px] text-faint">{sub}</p>
    </div>
  );
}

export default MetricCard;
