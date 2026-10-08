"use client";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import TopStats from "@/components/TopStats";

import { api } from "@/lib/api";
import type { User } from "@/types/api";

const HEART_COST = 20;
const STREAK_FREEZE_COST = 50;

export default function ShopPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [buyingHeart, setBuyingHeart] = useState(false);
  const [buyingFreeze, setBuyingFreeze] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.getMe()
      .then((userData) => {
        if (active) setUser(userData);
      })
      .catch((err: unknown) => {
        console.error("Failed to load shop:", err);
        if (active) setError("Unable to load the shop.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  async function buyHeart() {
    if (!user || buyingHeart) {
      return;
    }

    setMessage(null);
    setError(null);

    if (user.hearts >= 5) {
      setError("Your hearts are already full.");
      return;
    }

    if (user.gems < HEART_COST) {
      setError("You don't have enough gems.");
      return;
    }

    setBuyingHeart(true);

    try {
      const response = await api.buyHeart();

      setUser((current) =>
        current
          ? {
              ...current,
              hearts: response.hearts,
              gems: response.gems,
            }
          : current
      );

      setMessage("❤️ Heart refilled!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to buy a heart."
      );
    } finally {
      setBuyingHeart(false);
    }
  }

  async function buyStreakFreeze() {
    if (!user || buyingFreeze) {
      return;
    }

    setMessage(null);
    setError(null);

    if (user.gems < STREAK_FREEZE_COST) {
      setError("You don't have enough gems.");
      return;
    }

    setBuyingFreeze(true);

    try {
      const response =
        await api.buyStreakFreeze();

      setUser((current) =>
        current
          ? {
              ...current,
              streak_freezes:
                response.streak_freezes,
              gems: response.gems,
            }
          : current
      );

      setMessage("🧊 Streak Freeze purchased!");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to purchase streak freeze."
      );
    } finally {
      setBuyingFreeze(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />

        <main className="flex min-h-screen items-center justify-center lg:ml-[220px] 2xl:ml-[256px]">
          <div className="text-center">
            <div className="text-6xl">🛍️</div>

            <p className="mt-4 font-extrabold text-[#777]">
              Loading shop...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white">
        <Sidebar />

        <main className="flex min-h-screen items-center justify-center px-6 lg:ml-[220px] 2xl:ml-[256px]">
          <div className="text-center">
            <div className="text-6xl">😕</div>

            <h1 className="mt-4 text-2xl font-extrabold text-[#444]">
              Unable to load shop
            </h1>

            <button
              type="button"
              onClick={() => {
                setLoading(true);
                setError(null);
                api.getMe()
                  .then(setUser)
                  .catch(() => setError("Unable to load the shop."))
                  .finally(() => setLoading(false));
              }}
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

        <div className="mx-auto w-full max-w-[900px] px-5 py-8 sm:px-8">
          <header className="mb-8">
            <p className="text-sm font-extrabold uppercase tracking-wide text-[#999]">
              Rewards
            </p>

            <h1 className="mt-2 text-3xl font-extrabold text-[#444]">
              Shop
            </h1>

            <div className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#eaf8ff] px-4 py-3">
              <span className="text-2xl">💎</span>

              <span className="text-lg font-extrabold text-[#1cb0f6]">
                {user.gems} Gems
              </span>
            </div>
          </header>

          {(message || error) && (
            <div
              className={`mb-6 rounded-2xl px-5 py-4 font-extrabold ${
                error
                  ? "bg-[#fff0f0] text-[#d32f2f]"
                  : "bg-[#d7ffb8] text-[#46a302]"
              }`}
            >
              {error || message}
            </div>
          )}

          <section>
            <h2 className="mb-5 text-xl font-extrabold text-[#444]">
              Items
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <ShopItem
                icon="❤️"
                title="Refill 1 Heart"
                description="Restore one missing heart and keep learning."
                cost={HEART_COST}
                disabled={
                  buyingHeart ||
                  user.hearts >= 5 ||
                  user.gems < HEART_COST
                }
                buttonText={
                  user.hearts >= 5
                    ? "FULL"
                    : buyingHeart
                      ? "BUYING..."
                      : "BUY"
                }
                onClick={buyHeart}
              />

              <ShopItem
                icon="🧊"
                title="Streak Freeze"
                description="Protect your streak for one missed day."
                cost={STREAK_FREEZE_COST}
                disabled={
                  buyingFreeze ||
                  user.gems < STREAK_FREEZE_COST
                }
                buttonText={
                  buyingFreeze
                    ? "BUYING..."
                    : "BUY"
                }
                onClick={buyStreakFreeze}
              />
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-[#dedede] bg-white p-6">
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#eaf8ff] text-4xl">
                🧊
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-extrabold text-[#444]">
                  Your Streak Freezes
                </h2>

                <p className="mt-1 text-sm font-semibold text-[#999]">
                  Use a freeze to protect your streak on a missed day.
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-extrabold text-[#1cb0f6]">
                  {user.streak_freezes}
                </p>

                <p className="text-xs font-extrabold text-[#999]">
                  OWNED
                </p>
              </div>
            </div>
          </section>

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#dedede] bg-white">
            <div className="bg-[#fff7d6] px-6 py-5">
              <h2 className="text-lg font-extrabold text-[#444]">
                How Gems Work
              </h2>
            </div>

            <div className="space-y-4 p-6">
              <InfoRow
                icon="🎁"
                text="Complete quests to earn gems."
              />

              <InfoRow
                icon="❤️"
                text={`Spend ${HEART_COST} gems to refill one heart.`}
              />

              <InfoRow
                icon="🧊"
                text={`Spend ${STREAK_FREEZE_COST} gems to buy a streak freeze.`}
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

interface ShopItemProps {
  icon: string;
  title: string;
  description: string;
  cost: number;
  disabled: boolean;
  buttonText: string;
  onClick: () => void;
}

function ShopItem({
  icon,
  title,
  description,
  cost,
  disabled,
  buttonText,
  onClick,
}: ShopItemProps) {
  return (
    <div className="rounded-2xl border border-[#dedede] bg-white p-6 shadow-[0_2px_0_rgba(0,0,0,0.04)]">
      <div className="flex items-start gap-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f7f7f7] text-4xl">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-extrabold text-[#444]">
            {title}
          </h3>

          <p className="mt-2 text-sm font-semibold leading-6 text-[#999]">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">💎</span>

          <span className="font-extrabold text-[#1cb0f6]">
            {cost}
          </span>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={onClick}
          className="rounded-xl border-b-4 border-[#46a302] bg-[#58cc02] px-7 py-3 text-sm font-extrabold text-white transition hover:bg-[#61d909] disabled:cursor-not-allowed disabled:border-[#ccc] disabled:bg-[#ddd] disabled:text-[#999]"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

interface InfoRowProps {
  icon: string;
  text: string;
}

function InfoRow({
  icon,
  text,
}: InfoRowProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-2xl">{icon}</span>

      <p className="text-sm font-bold text-[#666]">
        {text}
      </p>
    </div>
  );
}
