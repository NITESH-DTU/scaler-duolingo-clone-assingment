interface UnitHeaderProps {
  title: string;
  unitNumber: number;
  description?: string;
}

export default function UnitHeader({
  title,
  unitNumber,
  description,
}: UnitHeaderProps) {
  return (
    <div className="relative mb-10 overflow-hidden rounded-2xl bg-[#58cc02] px-8 py-7 text-white shadow-[0_4px_0_#46a302]">
      {/* Decorative circles */}
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-12 right-20 h-28 w-28 rounded-full bg-white/10" />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="mb-1 text-sm font-extrabold uppercase tracking-wider text-[#d7ffbf]">
            Unit {unitNumber}
          </p>

          <h2 className="text-2xl font-extrabold">
            {title}
          </h2>

          {description && (
            <p className="mt-2 max-w-[500px] text-sm font-semibold text-[#eaffdc]">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/20 text-3xl">
          📚
        </div>
      </div>
    </div>
  );
}