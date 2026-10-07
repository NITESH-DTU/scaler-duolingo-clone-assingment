"use client";

import type { User } from "@/types/api";

interface TopStatsProps {
  user: User;
}

export default function TopStats({ user }: TopStatsProps) {
  return (
    <div className="flex items-center justify-end gap-7 border-b border-[#eee] px-8 py-4">
      {/* XP */}
      <div className="flex items-center gap-2">
        <span className="text-[23px]">⚡</span>

        <span className="text-[15px] font-extrabold text-[#ffc800]">
          {user.xp}
        </span>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-2">
        <span className="text-[24px]">🔥</span>

        <span className="text-[15px] font-extrabold text-[#ff9600]">
          {user.streak}
        </span>
      </div>

      {/* Gems */}
      <div className="flex items-center gap-2">
        <span className="text-[23px]">💎</span>

        <span className="text-[15px] font-extrabold text-[#1cb0f6]">
          {user.gems}
        </span>
      </div>

      {/* Hearts */}
      <div className="flex items-center gap-2">
        <span className="text-[24px]">❤️</span>

        <span className="text-[15px] font-extrabold text-[#ff4b4b]">
          {user.hearts}
        </span>
      </div>
    </div>
  );
}