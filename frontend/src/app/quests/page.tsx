"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import TopStats from "@/components/TopStats";

import { api } from "@/lib/api";
import type {
  Quest,
  Quests,
  User,
} from "@/types/api";

export default function QuestsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [quests, setQuests] = useState<Quests>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuests() {
      try {
        const [userData, questData] =
          await Promise.all([
            api.getMe(),
            api.getQuests(),
          ]);

        setUser(userData);
        setQuests(questData);
      } catch (err) {
        console.error(
          "Failed to load quests:",
          err
        );

        setError(
          "Unable to load your quests."
        );
      } finally {
        setLoading(false);
      }
    }

    loadQuests();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-lg font-extrabold text-[#777]">
          Loading quests...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <div className="text-5xl">😕</div>

          <h1 className="mt-4 text-2xl font-extrabold text-[#444]">
            Unable to load quests
          </h1>

          <p className="mt-2 text-sm font-semibold text-[#888]">
            {error ||
              "Please make sure the backend is running."}
          </p>
        </div>
      </div>
    );
  }

  const dailyQuests = quests.filter(
    (quest) => quest.period === "daily"
  );

  const monthlyQuests = quests.filter(
    (quest) => quest.period === "monthly"
  );

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="min-h-screen pb-16 lg:ml-[300px]">
        <div className="mx-auto max-w-[1000px] px-5 py-8 sm:px-8">
          <TopStats user={user} />

          <div className="mt-10">
            <p className="text-sm font-extrabold uppercase tracking-widest text-[#999]">
              Rewards
            </p>

            <h1 className="mt-1 text-4xl font-extrabold text-[#444]">
              Quests
            </h1>

            <p className="mt-2 text-base font-semibold text-[#777]">
              Complete quests to earn extra gems.
            </p>

            <section className="mt-8">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-[#444]">
                    Daily Quests
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-[#999]">
                    New quests every day
                  </p>
                </div>

                <span className="rounded-xl bg-[#dff4ff] px-4 py-2 text-sm font-extrabold text-[#1899d6]">
                  {dailyQuests.length} quests
                </span>
              </div>

              {dailyQuests.length === 0 ? (
                <EmptyState message="No daily quests available right now." />
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {dailyQuests.map((quest) => (
                    <QuestCard
                      key={quest.id}
                      quest={quest}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="mt-12">
              <div className="mb-5">
                <p className="text-sm font-extrabold uppercase tracking-widest text-[#999]">
                  Monthly
                </p>

                <h2 className="mt-1 text-2xl font-extrabold text-[#444]">
                  Monthly Challenge
                </h2>

                <p className="mt-1 text-sm font-semibold text-[#999]">
                  Complete a bigger goal throughout the month.
                </p>
              </div>

              {monthlyQuests.length === 0 ? (
                <EmptyState message="No monthly quest available right now." />
              ) : (
                <div className="space-y-5">
                  {monthlyQuests.map((quest) => (
                    <MonthlyQuestCard
                      key={quest.id}
                      quest={quest}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

interface QuestCardProps {
  quest: Quest;
}

function QuestCard({
  quest,
}: QuestCardProps) {
  const percentage =
    quest.target > 0
      ? Math.min(
          (quest.progress / quest.target) * 100,
          100
        )
      : 0;

  return (
    <div
      className={`rounded-3xl border-2 p-6 ${
        quest.completed
          ? "border-[#58cc02] bg-[#f3ffe9]"
          : "border-[#e5e5e5] bg-white"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f7f7f7] text-3xl">
          {quest.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-extrabold text-[#444]">
                {quest.title}
              </h3>

              <p className="mt-1 text-sm font-semibold leading-5 text-[#888]">
                {quest.description}
              </p>
            </div>

            {quest.completed && (
              <span className="text-2xl">✅</span>
            )}
          </div>

          <div className="mt-5">
            <div className="h-3 overflow-hidden rounded-full bg-[#e5e5e5]">
              <div
                className={`h-full rounded-full transition-all ${
                  quest.completed
                    ? "bg-[#58cc02]"
                    : "bg-[#ffc800]"
                }`}
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#777]">
                {quest.progress} / {quest.target}
              </span>

              <span className="text-sm font-extrabold text-[#1cb0f6]">
                +{quest.reward_gems} 💎
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface MonthlyQuestCardProps {
  quest: Quest;
}

function MonthlyQuestCard({
  quest,
}: MonthlyQuestCardProps) {
  const percentage =
    quest.target > 0
      ? Math.min(
          (quest.progress / quest.target) * 100,
          100
        )
      : 0;

  return (
    <div
      className={`rounded-3xl border-2 p-7 ${
        quest.completed
          ? "border-[#58cc02] bg-[#f3ffe9]"
          : "border-[#e5e5e5] bg-white"
      }`}
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-[#fff7d6] text-5xl">
          {quest.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#999]">
                Monthly Challenge
              </p>

              <h3 className="mt-1 text-2xl font-extrabold text-[#444]">
                {quest.title}
              </h3>

              <p className="mt-2 text-sm font-semibold leading-6 text-[#777]">
                {quest.description}
              </p>
            </div>

            {quest.completed && (
              <span className="text-3xl">🏆</span>
            )}
          </div>

          <div className="mt-5">
            <div className="h-4 overflow-hidden rounded-full bg-[#e5e5e5]">
              <div
                className={`h-full rounded-full transition-all ${
                  quest.completed
                    ? "bg-[#58cc02]"
                    : "bg-[#ffc800]"
                }`}
                style={{
                  width: `${percentage}%`,
                }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-sm font-extrabold text-[#777]">
                {quest.progress} / {quest.target}
              </span>

              <span className="text-sm font-extrabold text-[#1cb0f6]">
                Reward: +{quest.reward_gems} 💎
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  message: string;
}

function EmptyState({
  message,
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-[#ddd] bg-[#fafafa] p-10 text-center">
      <div className="text-4xl">🎯</div>

      <p className="mt-3 font-bold text-[#999]">
        {message}
      </p>
    </div>
  );
}