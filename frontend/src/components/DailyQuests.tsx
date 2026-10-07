"use client";

import Link from "next/link";
import type { User } from "@/types/api";
import ProgressBar from "./ProgressBar";

interface DailyQuestsProps {
  user: User;
}

export default function DailyQuests({ user }: DailyQuestsProps) {
  const xpProgress = Math.min(user.xp, 10);

  return (
    <div className="rounded-2xl border border-[#dedede] bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-[20px] font-extrabold text-[#444]">
          Daily Quests
        </h2>

        <Link
          href="/quests"
          className="text-[14px] font-extrabold text-[#1cb0f6]"
        >
          VIEW ALL
        </Link>
      </div>

      <div className="border-b border-[#eee] pb-5">
        <div className="flex items-center gap-4">
          <span className="text-4xl">⚡</span>

          <div className="flex-1">
            <p className="font-extrabold text-[#444]">
              Earn 10 XP
            </p>

            <div className="mt-3">
              <ProgressBar
                value={xpProgress}
                max={10}
                color="#ffc800"
                height={10}
              />
            </div>

            <p className="mt-1 text-center text-xs font-bold text-[#999]">
              {xpProgress} / 10
            </p>
          </div>

          <span className="text-2xl">🎁</span>
        </div>
      </div>

      <div className="border-b border-[#eee] py-5">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🎯</span>

          <div className="flex-1">
            <p className="font-extrabold text-[#444]">
              Score 80% or higher in 2 lessons
            </p>

            <div className="mt-3">
              <ProgressBar
                value={0}
                max={2}
                color="#58cc02"
                height={10}
              />
            </div>

            <p className="mt-1 text-center text-xs font-bold text-[#999]">
              0 / 2
            </p>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex items-center gap-4">
          <span className="text-4xl">🦉</span>

          <div className="flex-1">
            <p className="font-extrabold text-[#444]">
              Get 5 in a row correct in 2 lessons
            </p>

            <div className="mt-3">
              <ProgressBar
                value={0}
                max={2}
                color="#1cb0f6"
                height={10}
              />
            </div>

            <p className="mt-1 text-center text-xs font-bold text-[#999]">
              0 / 2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}