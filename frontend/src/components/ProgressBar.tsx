interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  color = "#58cc02",
  height = 12,
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min(
    Math.max((value / max) * 100, 0),
    100
  );

  return (
    <div className="w-full">
      <div
        className="w-full overflow-hidden rounded-full bg-[#e5e5e5]"
        style={{ height }}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {showLabel && (
        <div className="mt-1 text-center text-xs font-bold text-[#999]">
          {value} / {max}
        </div>
      )}
    </div>
  );
}