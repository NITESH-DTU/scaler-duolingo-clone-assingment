"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Sidebar from "@/components/Sidebar";
import TopStats from "@/components/TopStats";
import RightSidebar from "@/components/RightSidebar";

import { api } from "@/lib/api";
import type {
  Leaderboard,
  Profile,
  User,
} from "@/types/api";

export default function LeaderboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [leaderboard, setLeaderboard] = useState<Leaderboard>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, leaderboardData, profileData] =
          await Promise.all([
            api.getMe(),
            api.getLeaderboard(),
            api.getProfile(),
          ]);

        setUser(userData);
        setLeaderboard(leaderboardData);
        setProfile(profileData);
      } catch (error) {
        console.error(
          "Failed to load leaderboard:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const lessonsCompleted =
    profile?.stats.lessons_completed ?? 0;

  const unlocked = lessonsCompleted >= 2;

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
              streak_freezes: 0,
            }
          }
        />

        <div className="flex items-start">
          <section className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[760px] px-5 py-8 sm:px-8">

              {!loading && !unlocked ? (
                <LockedLeaderboard
                  lessonsCompleted={lessonsCompleted}
                />
              ) : (
                <UnlockedLeaderboard
                  leaderboard={leaderboard}
                  user={user}
                  loading={loading}
                />
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

interface LockedLeaderboardProps {
  lessonsCompleted: number;
}

function LockedLeaderboard({
  lessonsCompleted,
}: LockedLeaderboardProps) {
  const remaining = Math.max(
    2 - lessonsCompleted,
    0
  );

  return (
    <div className="text-center">
      {/* Trophy illustration */}
      <div className="relative mx-auto mb-5 flex h-[170px] w-[300px] items-center justify-center">
        <div className="absolute left-10 top-10 h-20 w-20 rotate-[-25deg] rounded-2xl bg-[#e6b17d] opacity-80" />

        <div className="absolute right-10 top-10 h-20 w-20 rotate-[25deg] rounded-2xl bg-[#cbd9e5] opacity-80" />

        <div className="relative flex h-32 w-32 items-center justify-center rounded-[28px] border-b-8 border-[#e5a900] bg-[#ffc800] shadow-sm">
          <span className="text-6xl">🏆</span>
        </div>

        <div className="absolute left-1/2 top-0 text-3xl">
          ✨
        </div>
      </div>

      <h1 className="text-3xl font-extrabold text-[#444]">
        Unlock Leaderboards!
      </h1>

      <p className="mt-4 text-lg font-semibold text-[#777]">
        Complete {remaining} more{" "}
        {remaining === 1 ? "lesson" : "lessons"} to start
        competing
      </p>

      <Link
        href="/"
        className="mt-7 inline-block rounded-xl border-2 border-[#ddd] bg-white px-16 py-4 text-sm font-extrabold text-[#1cb0f6] shadow-[0_3px_0_#ddd] transition hover:bg-[#f7f7f7]"
      >
        START A LESSON
      </Link>

      <div className="mt-16 space-y-5 opacity-30">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="flex items-center gap-5 px-8"
          >
            <div className="h-5 w-5 rounded-full bg-[#ddd]" />

            <div className="h-14 w-14 rounded-full bg-[#ddd]" />

            <div className="h-4 w-28 rounded-full bg-[#ddd]" />

            <div className="ml-auto h-4 w-14 rounded-full bg-[#ddd]" />
          </div>
        ))}
      </div>
    </div>
  );
}

interface UnlockedLeaderboardProps {
  leaderboard: Leaderboard;
  user: User | null;
  loading: boolean;
}

function UnlockedLeaderboard({
  leaderboard,
  user,
  loading,
}: UnlockedLeaderboardProps) {
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="text-6xl">🏆</div>

        <h1 className="mt-4 text-3xl font-extrabold text-[#444]">
          Leaderboards
        </h1>

        <p className="mt-2 font-semibold text-[#999]">
          Do lessons. Earn XP. Compete.
        </p>
      </div>

      <div className="rounded-2xl border border-[#dedede] bg-white p-4 sm:p-6">
        {loading ? (
          <div className="py-14 text-center">
            <div className="text-5xl">🦉</div>

            <p className="mt-4 font-extrabold text-[#777]">
              Loading leaderboard...
            </p>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-14 text-center">
            <p className="font-extrabold text-[#777]">
              No leaderboard data yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry) => {
              const isCurrentUser =
                user?.name === entry.name;

              return (
                <div
                  key={`${entry.rank}-${entry.name}`}
                  className={`flex min-h-[70px] items-center rounded-xl px-3 py-3 sm:px-5 ${
                    isCurrentUser
                      ? "border-2 border-[#58cc02] bg-[#f2ffe9]"
                      : entry.rank === 1
                        ? "bg-[#fff8d9]"
                        : "bg-[#f7f7f7]"
                  }`}
                >
                  <div className="w-10 shrink-0 text-center text-lg font-extrabold text-[#777] sm:w-12 sm:text-xl">
                    {entry.rank === 1
                      ? "🥇"
                      : entry.rank === 2
                        ? "🥈"
                        : entry.rank === 3
                          ? "🥉"
                          : entry.rank}
                  </div>

                  <div className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dff4ff] text-xl sm:ml-4">
                    🦉
                  </div>

                  <div className="ml-3 min-w-0 flex-1 sm:ml-4">
                    <p className="truncate font-extrabold text-[#444]">
                      {entry.name}
                    </p>

                    {isCurrentUser && (
                      <p className="mt-0.5 text-xs font-extrabold text-[#58cc02]">
                        YOU
                      </p>
                    )}
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="font-extrabold text-[#ff9600]">
                      {entry.xp}
                    </p>

                    <p className="text-[10px] font-extrabold uppercase text-[#aaa]">
                      XP
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}