import { memo } from "react";
import { Cookie } from "lucide-react";
import { CELL_SIZE } from "../../constants/theme";

interface ResourceNodeProps {
  id: string;
  x: number;
  y: number;
  value: number;
}

export const ResourceNode = memo(function ResourceNode({
  x,
  y,
  value,
}: ResourceNodeProps) {
  const px = x * CELL_SIZE;
  const py = y * CELL_SIZE;

  return (
    <div
      className="pointer-events-none absolute z-20 flex select-none items-center justify-center"
      style={{
        transform: `translate3d(${px}px, ${py}px, 0)`,
        width: CELL_SIZE,
        height: CELL_SIZE,
      }}
    >
      <div className="cookie-bob relative flex h-6 w-6 items-center justify-center rounded-full bg-amber-300 shadow-[0_3px_0_rgba(146,64,14,0.55)]">
        <Cookie className="h-3.5 w-3.5 text-amber-800" strokeWidth={2.5} />
        <span className="absolute -right-1.5 -bottom-1 rounded-full bg-amber-900 px-1 text-[9px] leading-[13px] font-extrabold text-amber-100">
          {value}
        </span>
      </div>
    </div>
  );
});
