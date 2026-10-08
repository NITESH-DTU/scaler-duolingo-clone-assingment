interface UnitHeaderProps {
  title: string;
  unitNumber: number;
  courseName: string;
  description?: string;
}

export default function UnitHeader({
  title,
  unitNumber,
  courseName,
  description,
}: UnitHeaderProps) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl bg-[#58cc02] px-5 py-3 text-white shadow-[0_4px_0_#46a302] sm:px-5">
      <div className="relative flex items-center justify-between">
        <div>
          <p className="mb-1 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#e8ffd8]">
            <span aria-hidden="true" className="mr-2 text-xl leading-none">←</span>
            {courseName}
          </p>

          <h2 className="text-2xl font-extrabold sm:text-[26px]">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
}
