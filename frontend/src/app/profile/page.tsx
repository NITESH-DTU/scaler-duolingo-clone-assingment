"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import TopStats from "@/components/TopStats";
import RightSidebar from "@/components/RightSidebar";

import { api } from "@/lib/api";
import type { Profile, User } from "@/types/api";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [userData, profileData] = await Promise.all([
          api.getMe(),
          api.getProfile(),
        ]);

        setUser(userData);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />

        <main className="flex min-h-screen items-center justify-center lg:ml-[300px]">
          <div className="text-center">
            <div className="text-6xl">🦉</div>

            <p className="mt-4 font-extrabold text-[#777]">
              Loading profile...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!profile || !user) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />

        <main className="flex min-h-screen items-center justify-center px-6 lg:ml-[300px]">
          <div className="text-center">
            <div className="text-6xl">😕</div>

            <h1 className="mt-4 text-2xl font-extrabold text-[#444]">
              Unable to load profile
            </h1>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl border-b-4 border-[#46a302] bg-[#58cc02] px-7 py-3 text-sm font-extrabold text-white"
            >
              TRY AGAIN
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="min-h-screen pb-[80px] lg:ml-[300px] lg:pb-0">
        <TopStats user={user} />

        <div className="flex items-start">
          <section className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[760px] px-5 py-7 sm:px-8">

              {/* Profile header */}
              <section>
                <div className="relative h-[230px] overflow-hidden rounded-2xl bg-[#dff4ff]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative flex h-[150px] w-[150px] items-center justify-center rounded-full border-[6px] border-dashed border-[#1cb0f6]">
                      <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[#7dd3f5]">
                        <span className="text-6xl">👤</span>
                      </div>

                      <button
                        type="button"
                        className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#999] bg-white text-lg"
                      >
                        ✎
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-b border-[#dedede] pb-7 pt-7">
                  <h1 className="text-3xl font-extrabold text-[#444]">
                    {profile.user.name}
                  </h1>

                  <p className="mt-1 text-base font-semibold text-[#999]">
                    {profile.user.name
                      .toLowerCase()
                      .replace(/\s+/g, "")}
                  </p>

                  <p className="mt-2 text-base font-semibold text-[#777]">
                    Learning Spanish
                  </p>

                  <div className="mt-5 flex flex-wrap gap-6">
                    <div>
                      <span className="font-extrabold text-[#1cb0f6]">
                        0
                      </span>{" "}
                      <span className="font-bold text-[#777]">
                        Following
                      </span>
                    </div>

                    <div>
                      <span className="font-extrabold text-[#1cb0f6]">
                        0
                      </span>{" "}
                      <span className="font-bold text-[#777]">
                        Followers
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Statistics */}
              <section className="mt-8">
                <h2 className="mb-5 text-2xl font-extrabold text-[#444]">
                  Statistics
                </h2>

                <div className="grid gap-3 sm:grid-cols-2">
                  <StatCard
                    icon="🔥"
                    value={profile.user.streak}
                    label="Day streak"
                  />

                  <StatCard
                    icon="⚡"
                    value={profile.user.xp}
                    label="Total XP"
                  />

                  <StatCard
                    icon="🏅"
                    value={0}
                    label="Current league"
                    valueText="None"
                  />

                  <StatCard
                    icon="🏆"
                    value={0}
                    label="Top 3 finishes"
                  />
                </div>
              </section>

              {/* Friend suggestions */}
              <section className="mt-10">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-[#444]">
                    Friend suggestions
                  </h2>

                  <button
                    type="button"
                    className="text-sm font-extrabold text-[#1cb0f6]"
                  >
                    VIEW ALL
                  </button>
                </div>

                <div className="rounded-2xl border border-[#dedede] bg-white p-5 sm:p-6">
                  <div className="flex flex-col items-center text-center">
                    <button
                      type="button"
                      className="absolute"
                    >
                      ×
                    </button>

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff9600] text-2xl font-extrabold text-white">
                      V
                    </div>

                    <h3 className="mt-3 text-lg font-extrabold text-[#444]">
                      Vikas Bhardwaj
                    </h3>

                    <p className="mt-1 text-sm font-semibold text-[#999]">
                      You may know each other
                    </p>

                    <button
                      type="button"
                      className="mt-5 w-full rounded-xl border-b-4 border-[#1496cc] bg-[#1cb0f6] py-3 text-sm font-extrabold text-white"
                    >
                      FOLLOW
                    </button>
                  </div>
                </div>
              </section>

              {/* Achievements */}
              <section className="mt-10">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-[#444]">
                    Achievements
                  </h2>

                  <button
                    type="button"
                    className="text-sm font-extrabold text-[#1cb0f6]"
                  >
                    VIEW ALL
                  </button>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#dedede] bg-white">
                  <Achievement
                    icon="🔥"
                    title="Wildfire"
                    description="Reach a 3 day streak"
                    progress={profile.user.streak}
                    target={3}
                    level="LEVEL 1"
                  />

                  <Achievement
                    icon="🧙"
                    title="Sage"
                    description="Earn 100 XP"
                    progress={profile.user.xp}
                    target={100}
                    level="LEVEL 1"
                  />

                  <Achievement
                    icon="⭐"
                    title="Scholar"
                    description="Complete 3 lessons"
                    progress={profile.stats.lessons_completed}
                    target={3}
                    level="LEVEL 1"
                  />
                </div>
              </section>

              {/* Learning progress */}
              <section className="mt-10 pb-10">
                <h2 className="mb-5 text-2xl font-extrabold text-[#444]">
                  Learning Progress
                </h2>

                <div className="rounded-2xl border border-[#dedede] bg-white p-6">
                  <div className="flex items-center gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#d7ffb8] text-3xl">
                      🇪🇸
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-[#444]">
                        Spanish
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-[#999]">
                        {profile.stats.skills_completed} skills completed
                      </p>

                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e5e5e5]">
                        <div
                          className="h-full rounded-full bg-[#58cc02]"
                          style={{
                            width: `${Math.min(
                              profile.stats.skills_completed * 33.33,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </section>

          {/* Right sidebar */}
          <div className="hidden xl:block">
            <ProfileSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}

interface StatCardProps {
  icon: string;
  value: number;
  label: string;
  valueText?: string;
}

function StatCard({
  icon,
  value,
  label,
  valueText,
}: StatCardProps) {
  return (
    <div className="flex min-h-[105px] items-center gap-4 rounded-2xl border border-[#dedede] bg-white px-5 py-4">
      <div className="text-3xl">{icon}</div>

      <div>
        <p className="text-xl font-extrabold text-[#444]">
          {valueText ?? value}
        </p>

        <p className="mt-1 text-sm font-semibold text-[#999]">
          {label}
        </p>
      </div>
    </div>
  );
}

interface AchievementProps {
  icon: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  level: string;
}

function Achievement({
  icon,
  title,
  description,
  progress,
  target,
  level,
}: AchievementProps) {
  const percentage = Math.min(
    (progress / target) * 100,
    100
  );

  return (
    <div className="flex gap-5 border-b border-[#eee] p-5 last:border-b-0 sm:p-6">
      <div className="flex h-[84px] w-[84px] shrink-0 flex-col items-center justify-center rounded-2xl bg-[#ff4b4b] text-white shadow-[0_3px_0_#d93636]">
        <span className="text-3xl">{icon}</span>

        <span className="mt-1 text-[9px] font-black">
          {level}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-extrabold text-[#444]">
            {title}
          </h3>

          <span className="shrink-0 text-sm font-semibold text-[#aaa]">
            {Math.min(progress, target)}/{target}
          </span>
        </div>

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e5e5e5]">
          <div
            className="h-full rounded-full bg-[#58cc02] transition-all duration-500"
            style={{
              width: `${percentage}%`,
            }}
          />
        </div>

        <p className="mt-4 text-sm font-semibold text-[#777]">
          {description}
        </p>
      </div>
    </div>
  );
}

function ProfileSidebar() {
  return (
    <aside className="w-[390px] shrink-0 px-5 pt-6">
      {/* Following / Followers */}
      <div className="overflow-hidden rounded-2xl border border-[#dedede] bg-white">
        <div className="grid grid-cols-2 border-b border-[#ddd]">
          <button
            type="button"
            className="border-b-2 border-[#1cb0f6] py-4 text-sm font-extrabold text-[#1cb0f6]"
          >
            FOLLOWING
          </button>

          <button
            type="button"
            className="py-4 text-sm font-extrabold text-[#999]"
          >
            FOLLOWERS
          </button>
        </div>

        <div className="px-6 py-8 text-center">
          <div className="text-7xl">👥</div>

          <p className="mt-5 text-base font-semibold leading-7 text-[#777]">
            Learning is more fun and effective when you connect with others.
          </p>
        </div>
      </div>

      {/* Add friends */}
      <div className="mt-5 rounded-2xl border border-[#dedede] bg-white p-5">
        <h2 className="text-xl font-extrabold text-[#444]">
          Add friends
        </h2>

        <button
          type="button"
          className="mt-5 flex w-full items-center gap-4 rounded-xl p-3 text-left hover:bg-[#f7f7f7]"
        >
          <span className="text-3xl">🔎</span>

          <span className="flex-1 font-extrabold text-[#555]">
            Find friends
          </span>

          <span className="text-2xl text-[#bbb]">
            ›
          </span>
        </button>

        <button
          type="button"
          className="flex w-full items-center gap-4 rounded-xl p-3 text-left hover:bg-[#f7f7f7]"
        >
          <span className="text-3xl">🦉</span>

          <span className="flex-1 font-extrabold text-[#555]">
            Invite friends
          </span>

          <span className="text-2xl text-[#bbb]">
            ›
          </span>
        </button>
      </div>

      <footer className="flex flex-wrap justify-center gap-x-5 gap-y-3 px-4 py-6 text-xs font-bold text-[#999]">
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