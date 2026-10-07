"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import TopStats from "@/components/TopStats";
import RightSidebar from "@/components/RightSidebar";

import { api } from "@/lib/api";
import type { Quest, User } from "@/types/api";

export default function QuestsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, questData] = await Promise.all([
          api.getMe(),
          api.getQuests(),
        ]);

        setUser(userData);
        setQuests(questData);
      } catch (error) {
        console.error("Failed to load quests:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const monthlyQuest = quests.find(
    (quest) => quest.period === "monthly"
  );

  const dailyQuests = quests.filter(
    (quest) => quest.period === "daily"
  );

  const monthlyProgress = monthlyQuest
    ? Math.min(
        (monthlyQuest.progress / monthlyQuest.target) * 100,
        100
      )
    : 0;

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="min-h-screen pb-[80px] lg:ml-[300px] lg:pb-0">
        <TopStats
          user={
            user ?? {
              id: 1,
              name: "Learner",
              xp: 0,
              streak: 0,
              hearts: 0,
              gems: 0,
            }
          }
        />

        <div className="flex items-start">
          <section className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[760px] px-5 py-7 sm:px-8">

              {loading ? (
                <div className="py-20 text-center">
                  <div className="text-6xl">🦉</div>

                  <p className="mt-4 font-extrabold text-[#777]">
                    Loading quests...
                  </p>
                </div>
              ) : (
                <>
                  {/* Monthly Quest */}
                  {monthlyQuest && (
                    <section className="mb-10 overflow-hidden rounded-2xl bg-[#ff9600] p-6 text-white sm:p-7">
                      <div className="mb-7">
                        <span className="inline-block rounded-lg bg-white px-3 py-2 text-sm font-extrabold text-[#ff9600]">
                          OCTOBER
                        </span>

                        <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
                          October Quest
                        </h1>

                        <p className="mt-4 flex items-center gap-2 text-sm font-extrabold text-[#fff1d8]">
                          ◷ MONTHLY QUEST
                        </p>
                      </div>

                      <div className="rounded-2xl bg-white p-5 text-[#444] sm:p-6">
                        <div className="flex items-center gap-4">
                          <div className="min-w-0 flex-1">
                            <h2 className="text-lg font-extrabold">
                              {monthlyQuest.title}
                            </h2>

                            <div className="mt-5 h-4 overflow-hidden rounded-full bg-[#e5e5e5]">
                              <div
                                className="h-full rounded-full bg-[#ff9600] transition-all duration-500"
                                style={{
                                  width: `${monthlyProgress}%`,
                                }}
                              />
                            </div>

                            <p className="mt-1 text-center text-xs font-bold text-[#aaa]">
                              {monthlyQuest.progress} /{" "}
                              {monthlyQuest.target}
                            </p>
                          </div>

                          <div className="hidden text-4xl sm:block">
                            {monthlyQuest.icon}
                          </div>
                        </div>
                      </div>
                    </section>
                  )}

                  {/* Daily quests */}
                  <section>
                    <div className="mb-5 flex items-center justify-between">
                      <h2 className="text-2xl font-extrabold text-[#444]">
                        Daily Quests
                      </h2>

                      <span className="flex items-center gap-1 text-sm font-extrabold text-[#ff9600]">
                        ◷ TODAY
                      </span>
                    </div>

                    <div className="overflow-hidden rounded-2xl border border-[#dedede] bg-white">
                      {dailyQuests.length === 0 ? (
                        <div className="p-8 text-center font-bold text-[#999]">
                          No daily quests available.
                        </div>
                      ) : (
                        dailyQuests.map((quest) => (
                          <QuestRow
                            key={quest.id}
                            quest={quest}
                          />
                        ))
                      )}
                    </div>
                  </section>
                </>
              )}
            </div>
          </section>

          <div className="hidden xl:block">
            {user && <RightSidebar user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
}

interface QuestRowProps {
  quest: Quest;
}

function QuestRow({
  quest,
}: QuestRowProps) {
  const percentage =
    quest.target > 0
      ? Math.min(
          (quest.progress / quest.target) * 100,
          100
        )
      : 0;

  return (
    <div className="flex items-center gap-4 border-b border-[#eee] px-5 py-6 last:border-b-0 sm:gap-6 sm:px-7">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center text-4xl">
        {quest.completed ? "✅" : quest.icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-extrabold text-[#444] sm:text-lg">
          {quest.title}
        </h3>

        <p className="mt-1 text-xs font-semibold text-[#999]">
          {quest.description}
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                quest.completed
                  ? "bg-[#58cc02]"
                  : "bg-[#ddd]"
              }`}
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <span className="w-[55px] text-center text-xs font-bold text-[#aaa]">
            {quest.progress} / {quest.target}
          </span>
        </div>
      </div>

      <div className="hidden text-right sm:block">
        <div className="text-2xl">
          🎁
        </div>

        <p className="mt-1 text-[10px] font-extrabold text-[#999]">
          +{quest.reward_gems} 💎
        </p>
      </div>
    </div>
  );
}