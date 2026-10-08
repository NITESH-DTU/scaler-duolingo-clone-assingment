"use client";

import Link from "next/link";
import DailyQuests from "@/components/DailyQuests";
import type { User } from "@/types/api";

interface RightSidebarProps {
  user: User;
}

export default function RightSidebar({
  user,
}: RightSidebarProps) {
  return (
    <aside className="hidden w-[368px] shrink-0 2xl:mt-[44px] 2xl:-translate-x-[6px] 2xl:block">
      <div className="space-y-4">
        <Link href="/shop" className="block rounded-2xl border-2 border-[#e5e5e5] bg-white p-5 transition hover:border-[#cfcfcf]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="inline-flex rounded-md bg-gradient-to-r from-[#1cb0f6] via-[#9b5de5] to-[#ed4ca0] px-2 py-0.5 text-xs font-black italic text-white">SUPER</span>
              <h2 className="mt-3 text-lg font-extrabold text-[#4b4b4b]">Try Super for free</h2>
            </div>
            <div aria-hidden="true" className="flex h-[68px] w-[68px] shrink-0 rotate-6 items-center justify-center rounded-[26px] bg-gradient-to-br from-[#31d9df] via-[#248bff] to-[#a657ff] text-4xl shadow-[0_5px_0_#dff4ff]">✨</div>
          </div>
          <p className="mt-2 text-sm font-semibold leading-6 text-[#888]">No ads, personalized practice, and unlimited Legendary!</p>
          <span className="mt-5 block rounded-2xl bg-[#4b4bff] px-4 py-3 text-center text-sm font-extrabold text-white shadow-[0_4px_0_#3828d8]">TRY 1 WEEK FREE</span>
        </Link>

        <div className="rounded-2xl border-2 border-[#e5e5e5] bg-white p-5">
          <h2 className="text-lg font-extrabold text-[#4b4b4b]">Weekly leaderboard</h2>
          <div className="mt-4 flex items-center gap-4">
            <span aria-hidden="true" className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#eaf7ff] text-3xl">🛡️</span>
            <p className="text-sm font-semibold leading-6 text-[#888]">{`You have ${user.xp} XP on the board. Keep learning to climb the ranks!`}</p>
          </div>
          <Link href="/leaderboard" className="mt-4 block text-sm font-extrabold text-[#1cb0f6] hover:text-[#168cc0]">VIEW LEADERBOARD →</Link>
        </div>

        <DailyQuests />

        <div className="px-2 pb-5">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold text-[#aaa]">
            <span>About</span>
            <span>Help</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>

          <p className="mt-3 text-xs font-semibold text-[#bbb]">
            © 2026 Duolingo Clone
          </p>
        </div>
      </div>
    </aside>
  );
}
