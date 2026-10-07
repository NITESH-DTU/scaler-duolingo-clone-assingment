"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import type { Quest } from "@/types/api";
import { api } from "@/lib/api";
import ProgressBar from "./ProgressBar";

export default function DailyQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuests() {
      try {
        const data = await api.getQuests();

        setQuests(
          data.filter(
            (quest) => quest.period === "daily"
          )
        );
      } catch (error) {
        console.error(
          "Failed to load daily quests:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuests();
  }, []);

  if (loading) {
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

        <div className="py-8 text-center">
          <div className="text-3xl">🦉</div>

          <p className="mt-2 text-sm font-bold text-[#999]">
            Loading quests...
          </p>
        </div>
      </div>
    );
  }

  if (quests.length === 0) {
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

        <p className="py-5 text-center text-sm font-bold text-[#999]">
          No daily quests available.
        </p>
      </div>
    );
  }

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

      <div>
        {quests.map((quest, index) => (
          <DailyQuestItem
            key={quest.id}
            quest={quest}
            last={index === quests.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

interface DailyQuestItemProps {
  quest: Quest;
  last: boolean;
}

function DailyQuestItem({
  quest,
  last,
}: DailyQuestItemProps) {
  const progress =
    quest.target > 0
      ? Math.min(
          quest.progress / quest.target,
          1
        )
      : 0;

  return (
    <div
      className={`py-5 ${
        last ? "" : "border-b border-[#eee]"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f7f7f7] text-3xl">
          {quest.completed
            ? "✅"
            : quest.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="font-extrabold text-[#444]">
              {quest.title}
            </p>

            <span className="shrink-0 text-lg">
              🎁
            </span>
          </div>

          <div className="mt-3">
            <ProgressBar
              value={quest.progress}
              max={quest.target}
              color={
                quest.completed
                  ? "#58cc02"
                  : "#ffc800"
              }
              height={10}
            />
          </div>

          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs font-bold text-[#999]">
              {quest.progress} / {quest.target}
            </p>

            <p className="text-xs font-extrabold text-[#999]">
              +{quest.reward_gems} 💎
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}