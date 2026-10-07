"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import TopStats from "@/components/TopStats";
import RightSidebar from "@/components/RightSidebar";

import { api } from "@/lib/api";
import type { User } from "@/types/api";

export default function ShopPage() {
  const [user, setUser] = useState<User | null>(null);
  const [refilling, setRefilling] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await api.getMe();
        setUser(data);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }

    loadUser();
  }, []);

  async function refillHeart() {
    if (!user || refilling || user.hearts >= 5) {
      return;
    }

    setRefilling(true);

    try {
      const response = await api.refillHeart();

      setUser((current) =>
        current
          ? {
              ...current,
              hearts: response.hearts,
            }
          : current
      );
    } catch (error) {
      console.error("Failed to refill heart:", error);
    } finally {
      setRefilling(false);
    }
  }

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
          {/* Main shop */}
          <section className="min-w-0 flex-1">
            <div className="mx-auto w-full max-w-[760px] px-5 py-7 sm:px-8">
              {/* Super banner */}
              <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0b4f5d] via-[#123f72] to-[#452080] p-6 text-white shadow-sm sm:p-8">
                <div className="relative z-10 max-w-[430px]">
                  <p className="text-2xl font-extrabold sm:text-3xl">
                    Start a family plan!
                  </p>

                  <p className="mt-2 text-sm font-semibold sm:text-base">
                    Save on Super Duolingo when you learn with friends
                  </p>

                  <button
                    type="button"
                    className="mt-6 w-full rounded-xl border-b-4 border-[#d8d8d8] bg-white py-3 text-sm font-extrabold text-[#333] sm:max-w-[400px]"
                  >
                    LEARN MORE
                  </button>
                </div>

                <div className="pointer-events-none absolute -right-4 bottom-0 text-[90px] opacity-30">
                  🦉
                </div>

                <div className="pointer-events-none absolute right-8 top-5 text-3xl">
                  ✨
                </div>
              </div>

              {/* Hearts */}
              <ShopSection title="Hearts">
                <ShopRow
                  icon="❤️"
                  title="Refill Hearts"
                  description="Get full hearts so you can worry less about making mistakes in a lesson"
                  buttonText={
                    user?.hearts === 5
                      ? "FULL"
                      : refilling
                        ? "..."
                        : "REFILL"
                  }
                  disabled={
                    !user ||
                    user.hearts >= 5 ||
                    refilling
                  }
                  onClick={refillHeart}
                />

                <ShopRow
                  icon="💗"
                  title="Unlimited Hearts"
                  description="Never run out of hearts with Super!"
                  buttonText="FREE TRIAL"
                  onClick={() => {}}
                />
              </ShopSection>

              {/* Power-ups */}
              <ShopSection title="Power-Ups">
                <ShopRow
                  icon="🧊"
                  title="Streak Freeze"
                  description="Protect your streak for one day when you miss a lesson"
                  buttonText="200 💎"
                  onClick={() => {}}
                />

                <ShopRow
                  icon="⏱️"
                  title="Timer Boost"
                  description="Get extra time during timed challenges"
                  buttonText="150 💎"
                  onClick={() => {}}
                />
              </ShopSection>

              {/* Current balance */}
              <div className="mt-8 rounded-2xl border border-[#dedede] bg-[#f7f7f7] p-5 text-center">
                <p className="text-xs font-extrabold uppercase tracking-wide text-[#999]">
                  Your balance
                </p>

                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-2xl">💎</span>

                  <span className="text-xl font-extrabold text-[#1cb0f6]">
                    {user?.gems ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Right sidebar */}
          <div className="hidden xl:block">
            {user && <RightSidebar user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
}

interface ShopSectionProps {
  title: string;
  children: React.ReactNode;
}

function ShopSection({
  title,
  children,
}: ShopSectionProps) {
  return (
    <section className="mb-10">
      <h2 className="mb-5 text-2xl font-extrabold text-[#444]">
        {title}
      </h2>

      <div className="divide-y divide-[#e5e5e5] border-y border-[#e5e5e5]">
        {children}
      </div>
    </section>
  );
}

interface ShopRowProps {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  disabled?: boolean;
  onClick: () => void;
}

function ShopRow({
  icon,
  title,
  description,
  buttonText,
  disabled = false,
  onClick,
}: ShopRowProps) {
  return (
    <div className="flex items-center gap-4 py-6 sm:gap-6">
      <div className="flex h-16 w-16 shrink-0 items-center justify-center text-5xl">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-lg font-extrabold text-[#444]">
          {title}
        </h3>

        <p className="mt-1 max-w-[430px] text-sm leading-6 text-[#777]">
          {description}
        </p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="min-w-[120px] shrink-0 rounded-xl border-2 border-[#ddd] bg-white px-4 py-3 text-xs font-extrabold text-[#58cc02] transition hover:bg-[#f7f7f7] disabled:cursor-not-allowed disabled:text-[#ccc]"
      >
        {buttonText}
      </button>
    </div>
  );
}