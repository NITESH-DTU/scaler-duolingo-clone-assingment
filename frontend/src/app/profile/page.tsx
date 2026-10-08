"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import TopStats from "@/components/TopStats";
import RightSidebar from "@/components/RightSidebar";

import { api } from "@/lib/api";
import type { Achievement, CoursePath, Profile, User } from "@/types/api";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [coursePath, setCoursePath] = useState<CoursePath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const [userData, profileData, achievementData, pathData] = await Promise.all([
          api.getMe(),
          api.getProfile(),
          api.getAchievements(),
          api.getCoursePath(),
        ]);

        setUser(userData);
        setProfile(profileData);
        setAchievements(achievementData);
        setCoursePath(pathData);
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

        <main className="flex min-h-screen items-center justify-center lg:ml-[220px] 2xl:ml-[256px]">
          <div className="text-center">
            <div className="text-6xl">🧑‍🎓</div>

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

        <main className="flex min-h-screen items-center justify-center px-6 lg:ml-[220px] 2xl:ml-[256px]">
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

      <main className="min-h-screen pb-[80px] lg:ml-[220px] lg:pb-0 2xl:ml-[256px]">
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
                    Learning {profile.course.name ?? "a language"}
                  </p>

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

                  <StatCard icon="📘" value={profile.stats.lessons_completed} label="Lessons completed" />
                  <StatCard icon="🏅" value={profile.stats.skills_completed} label="Skills completed" />
                </div>
              </section>

              {/* Achievements */}
              <section className="mt-10">
                <div className="mb-5">
                  <h2 className="text-2xl font-extrabold text-[#444]">
                    Achievements
                  </h2>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[#dedede] bg-white">
                  {achievements.map((achievement) => (
                    <Achievement key={achievement.id} achievement={achievement} />
                  ))}
                  {achievements.length === 0 && <p className="p-6 text-sm font-bold text-[#999]">Your achievements will appear here as you learn.</p>}
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
                        🌐
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-extrabold text-[#444]">
                        {profile.course.name ?? "Your course"}
                      </h3>

                      <p className="mt-1 text-sm font-semibold text-[#999]">
                        {profile.stats.skills_completed} skills completed
                      </p>

                      <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#e5e5e5]">
                        <div
                          className="h-full rounded-full bg-[#58cc02]"
                          style={{
                            width: `${Math.min(profile.stats.skills_completed * 100 / Math.max(coursePath?.units.reduce((total, unit) => total + unit.skills.length, 0) ?? 1, 1), 100)}%`,
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
            <RightSidebar user={user} />
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

function Achievement({ achievement }: { achievement: Achievement }) {
  const { icon, title, description, progress, target, completed } = achievement;
  const percentage = Math.min(
    (progress / Math.max(target, 1)) * 100,
    100
  );

  return (
    <div className="flex gap-5 border-b border-[#eee] p-5 last:border-b-0 sm:p-6">
      <div className={`flex h-[84px] w-[84px] shrink-0 flex-col items-center justify-center rounded-2xl text-white shadow-[0_3px_0_#d93636] ${completed ? "bg-[#58cc02] shadow-[0_3px_0_#46a302]" : "bg-[#ff9600]"}`}>
        <span className="text-3xl">{icon}</span>

        <span className="mt-1 text-[9px] font-black">
          {completed ? "COMPLETE" : "IN PROGRESS"}
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
