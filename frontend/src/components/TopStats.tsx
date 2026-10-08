"use client";

import type { User } from "@/types/api";

interface TopStatsProps {
  user: User;
}

export default function TopStats({ user }: TopStatsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 py-1 sm:gap-5 2xl:gap-4">
      {/* XP */}
      <div aria-label={`${user.xp} experience points`} className="flex items-center gap-2 rounded-xl px-3 py-2">
        <span className="text-[23px]">⚡</span>

        <span className="text-[15px] font-extrabold text-[#ffc800]">
          {user.xp}
        </span>
      </div>

      {/* Streak */}
      <div aria-label={`${user.streak} day streak`} className="flex items-center gap-2 rounded-xl px-3 py-2">
        <span className="text-[24px]">🔥</span>

        <span className="text-[15px] font-extrabold text-[#ff9600]">
          {user.streak}
        </span>
      </div>

      {/* Gems */}
      <div aria-label={`${user.gems} gems`} className="flex items-center gap-2 rounded-xl px-3 py-2">
        <span className="text-[23px]">💎</span>

        <span className="text-[15px] font-extrabold text-[#1cb0f6]">
          {user.gems}
        </span>
      </div>

      {/* Hearts */}
      <div aria-label={`${user.hearts} hearts`} className="flex items-center gap-2 rounded-xl px-3 py-2">
        <span className="text-[24px]">❤️</span>

        <span className="text-[15px] font-extrabold text-[#ff4b4b]">
          {user.hearts}
        </span>
      </div>
    </div>
  );
}
