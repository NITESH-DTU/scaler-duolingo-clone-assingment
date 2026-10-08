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
  const [user, setUser] = useState<User | null>(
    null
  );

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
        console.error(
          "Failed to load home:",
          error
        );
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
          <div className="text-5xl">
            😕
          </div>

          <h1 className="mt-4 text-2xl font-extrabold text-[#444]">
            Unable to load your course
          </h1>

          <p className="mt-2 text-sm font-semibold text-[#888]">
            Please make sure the backend is
            running and try again.
          </p>

          <button
            type="button"
            onClick={() =>
              window.location.reload()
            }
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
        <div className="relative mx-auto max-w-[1072px] px-4 pb-4 pt-12 sm:px-7 lg:px-8">
          <div className="mb-4 flex justify-end 2xl:absolute 2xl:right-[26px] 2xl:top-5 2xl:z-10 2xl:mb-0">
            <TopStats user={user} />
          </div>

          <div className="grid items-start gap-7 2xl:grid-cols-[minmax(470px,1fr)_368px]">
            <section className="min-w-0">
              <LearningPath
                data={coursePath}
              />
            </section>

            <RightSidebar user={user} />
          </div>
        </div>
      </main>
    </div>
  );
}
