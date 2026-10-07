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
  const leaderboardUnlocked = user.xp >= 20;

  return (
    <aside className="hidden w-[320px] shrink-0 xl:block">
      <div className="space-y-5">
        <div className="rounded-2xl border-2 border-[#e5e5e5] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#999]">
                Leaderboard
              </p>

              <h3 className="mt-1 text-lg font-extrabold text-[#444]">
                Weekly competition
              </h3>
            </div>

            <span className="text-3xl">
              🏆
            </span>
          </div>

          {leaderboardUnlocked ? (
            <>
              <p className="mt-4 text-sm font-semibold leading-6 text-[#777]">
                You're competing this week. Keep
                earning XP to climb the leaderboard!
              </p>

              <Link
                href="/leaderboard"
                className="mt-4 block rounded-xl bg-[#fff7d6] px-4 py-3 text-center text-sm font-extrabold text-[#b88600] transition hover:bg-[#fff1b8]"
              >
                View leaderboard →
              </Link>
            </>
          ) : (
            <>
              <p className="mt-4 text-sm font-semibold leading-6 text-[#777]">
                Earn{" "}
                <span className="font-extrabold text-[#444]">
                  {20 - user.xp} more XP
                </span>{" "}
                to start competing.
              </p>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eee]">
                <div
                  className="h-full rounded-full bg-[#ffc800] transition-all"
                  style={{
                    width: `${Math.min(
                      (user.xp / 20) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </>
          )}
        </div>

        <DailyQuests />

        <div className="rounded-2xl border-2 border-[#e5e5e5] bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wide text-[#999]">
                Keep learning
              </p>

              <h3 className="mt-1 text-lg font-extrabold text-[#444]">
                Your progress
              </h3>
            </div>

            <span className="text-3xl">
              🚀
            </span>
          </div>

          <p className="mt-4 text-sm font-semibold leading-6 text-[#777]">
            Complete lessons every day to build your
            streak and earn more XP.
          </p>

          <Link
            href="/"
            className="mt-4 block rounded-xl bg-[#dff4ff] px-4 py-3 text-center text-sm font-extrabold text-[#1899d6] transition hover:bg-[#c9edff]"
          >
            Continue learning →
          </Link>
        </div>

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