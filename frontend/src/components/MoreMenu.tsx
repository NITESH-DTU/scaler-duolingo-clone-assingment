"use client";

import Link from "next/link";

interface MoreMenuProps {
  onClose?: () => void;
}

export default function MoreMenu({ onClose }: MoreMenuProps) {
  return (
    <div className="absolute bottom-[165px] left-[195px] z-50 w-[300px] overflow-hidden rounded-2xl border border-[#ddd] bg-white shadow-[0_4px_15px_rgba(0,0,0,0.12)] 2xl:left-[220px]">
      <div className="border-b px-6 py-5 text-[15px] font-extrabold text-[#666]">
        🟢 DUOLINGO ENGLISH TEST
      </div>

      <Link
        href="/settings"
        onClick={onClose}
        className="block px-6 py-4 text-[16px] font-bold text-[#555] hover:bg-[#f7f7f7]"
      >
        SETTINGS
      </Link>

      <button
        type="button"
        className="block w-full px-6 py-4 text-left text-[16px] font-bold text-[#555] hover:bg-[#f7f7f7]"
      >
        HELP
      </button>

      <button
        type="button"
        className="block w-full px-6 py-4 text-left text-[16px] font-bold text-[#555] hover:bg-[#f7f7f7]"
      >
        LOG OUT
      </button>
    </div>
  );
}
