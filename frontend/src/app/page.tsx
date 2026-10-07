"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import TopStats from "@/components/TopStats";
import RightSidebar from "@/components/RightSidebar";
import LearningPath from "@/components/LearningPath";

import { api } from "@/lib/api";
import type { CoursePath, User } from "@/types/api";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [coursePath, setCoursePath] = useState<CoursePath | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, pathData] = await Promise.all([
          api.getMe(),
          api.getCoursePath(),
        ]);

        setUser(userData);
        setCoursePath(pathData);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-5xl">🦉</div>

          <p className="mt-4 text-lg font-extrabold text-[#777]">
            Loading your learning path...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user || !coursePath) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-[450px] rounded-2xl border border-[#ddd] bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">😕</div>

          <h1 className="mt-4 text-xl font-extrabold text-[#444]">
            Something went wrong
          </h1>

          <p className="mt-2 text-sm text-[#777]">
            {error || "Unable to load your data."}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl border-b-4 border-[#46a302] bg-[#58cc02] px-6 py-3 text-sm font-extrabold text-white"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="min-h-screen pb-[72px] lg:ml-[300px] lg:pb-0">
        <TopStats user={user} />

        <div className="flex items-start">
          {/* Learning path */}
          <section className="min-w-0 flex-1">
            <LearningPath data={coursePath} />
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