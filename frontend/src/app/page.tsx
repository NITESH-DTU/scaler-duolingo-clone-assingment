"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import TopStats from "@/components/TopStats";
import LearningPath from "@/components/LearningPath";
import RightSidebar from "@/components/RightSidebar";

import { api } from "@/lib/api";
import type {
  CoursePath,
  User,
} from "@/types/api";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);

  const [coursePath, setCoursePath] =
    useState<CoursePath | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHome() {
      try {
        const [userData, pathData] =
          await Promise.all([
            api.getMe(),
            api.getCoursePath(),
          ]);

        setUser(userData);
        setCoursePath(pathData);
      } catch (error) {
        console.error("Failed to load home:", error);
      } finally {
        setLoading(false);
      }
    }

    loadHome();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-lg font-extrabold text-[#777]">
          Loading your course...
        </div>
      </div>
    );
  }

  if (!user || !coursePath) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <div className="text-5xl">😕</div>

          <h1 className="mt-4 text-2xl font-extrabold text-[#444]">
            Unable to load your course
          </h1>

          <p className="mt-2 text-sm font-semibold text-[#888]">
            Please make sure the backend is running and try again.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-2xl bg-[#58cc02] px-6 py-3 font-extrabold text-white shadow-[0_4px_0_#46a302]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main className="min-h-screen pb-24 lg:ml-[220px] lg:pb-0 2xl:ml-[256px]">
        <div className="mx-auto max-w-[1180px] px-4 pb-10 pt-5 sm:px-7 lg:px-8">
          
          {/* Top statistics stay inside the normal layout */}
          <div className="mb-5 flex justify-end border-b border-[#eeeeee] pb-3">
            <TopStats user={user} />
          </div>

          {/* Main learning area + right sidebar */}
          <div className="grid items-start gap-8 2xl:grid-cols-[minmax(0,1fr)_368px]">
            <section className="min-w-0">
              <LearningPath data={coursePath} />
            </section>

            <aside className="min-w-0">
              <RightSidebar user={user} />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}