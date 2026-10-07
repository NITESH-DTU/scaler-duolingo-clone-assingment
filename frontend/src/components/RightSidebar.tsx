"use client";

import type { User } from "@/types/api";
import DailyQuests from "./DailyQuests";

interface RightSidebarProps {
  user: User;
}

export default function RightSidebar({
  user,
}: RightSidebarProps) {
  return (
    <aside className="w-[390px] shrink-0 px-5 pt-6">
      {/* Super promotion */}
      <div className="mb-5 rounded-2xl border border-[#dedede] bg-white p-6 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
        <div className="mb-3">
          <span className="rounded-md bg-gradient-to-r from-[#1cb0f6] to-[#ce82ff] px-2 py-1 text-[13px] font-black italic text-white">
            SUPER
          </span>
        </div>

        <h2 className="text-[20px] font-extrabold text-[#444]">
          Try Super for free
        </h2>

        <p className="mt-3 max-w-[270px] text-[16px] leading-7 text-[#777]">
          No ads, personalized practice, and unlimited Legendary!
        </p>

        <button
          type="button"
          className="mt-6 w-full rounded-xl border-b-4 border-[#2938d8] bg-[#4c5cff] py-4 text-[15px] font-extrabold text-white"
        >
          TRY 1 WEEK FREE
        </button>
      </div>

      {/* Leaderboard */}
      <div className="mb-5 rounded-2xl border border-[#dedede] bg-white p-6">
        <h2 className="text-[20px] font-extrabold text-[#444]">
          Unlock Leaderboards!
        </h2>

        <div className="mt-5 flex items-center gap-5">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#e7f1f8] text-3xl">
            🛡️
          </div>

          <p className="text-[16px] leading-7 text-[#777]">
            Complete 2 more lessons to start competing
          </p>
        </div>
      </div>

      {/* Daily quests */}
      <div className="mb-5">
        <DailyQuests user={user} />
      </div>

      {/* Footer */}
      <footer className="flex flex-wrap justify-center gap-x-5 gap-y-3 px-4 py-5 text-xs font-bold text-[#999]">
        <span>ABOUT</span>
        <span>BLOG</span>
        <span>STORE</span>
        <span>EFFICACY</span>
        <span>CAREERS</span>
        <span>INVESTORS</span>
        <span>TERMS</span>
        <span>PRIVACY</span>
      </footer>
    </aside>
  );
}