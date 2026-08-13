import type { CSSProperties } from "react";

type Props = {
  name: string;
  size?: number;
  fill?: boolean;
  weight?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Google Material Symbols (Rounded). The only icon system in this project.
 */
export function Icon({ name, size = 20, fill = false, weight = 400, className = "", style }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`msym ${className}`}
      style={{
        fontSize: size,
        width: size,
        height: size,
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${size}`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}

export default Icon;
