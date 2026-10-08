"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MoreMenu from "./MoreMenu";

const navigation = [
  { label: "LEARN", href: "/", icon: "🏠" },
  { label: "LEADERBOARDS", href: "/leaderboard", icon: "🛡️" },
  { label: "QUESTS", href: "/quests", icon: "🎁" },
  { label: "SHOP", href: "/shop", icon: "🛍️" },
  { label: "PROFILE", href: "/profile", icon: "◯" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[220px] flex-col border-r border-[#e5e5e5] bg-white px-3 py-6 lg:flex 2xl:w-[256px] 2xl:px-[5px]">
        <div className="mb-8 px-4 2xl:px-6">
          <Link
            href="/"
            className="text-[32px] font-extrabold tracking-[-2px] text-[#58cc02]"
          >
            duolingo
          </Link>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-[62px] items-center gap-4 rounded-[14px] px-3 transition ${
                  active
                    ? "border-2 border-[#1cb0f6] bg-[#dff4ff] text-[#1899d6]"
                    : "text-[#666666] hover:bg-[#f7f7f7]"
                }`}
              >
                <span className="flex w-8 justify-center text-[25px]">
                  {item.icon}
                </span>

                <span className="text-[14px] font-extrabold tracking-[0.7px]">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen((value) => !value)}
            className={`flex h-[62px] w-full items-center gap-4 rounded-[14px] px-3 transition ${
              moreOpen
                ? "bg-[#f7f7f7] text-[#666666]"
                : "text-[#666666] hover:bg-[#f7f7f7]"
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ce82ff] text-[16px] font-bold text-white">
              •••
            </span>

            <span className="text-[14px] font-extrabold tracking-[0.7px]">
              MORE
            </span>
          </button>

          {moreOpen && (
            <MoreMenu onClose={() => setMoreOpen(false)} />
          )}
        </nav>

        <Link href="/shop" className="mt-auto block rounded-2xl border-2 border-[#e5e5e5] p-4 text-center transition hover:border-[#c8e8ae] hover:bg-[#fbfff8]">
          <div aria-hidden="true" className="mb-3 text-4xl">♞</div>
          <p className="font-extrabold text-[#444]">Want to learn chess?</p>
          <p className="mt-2 text-sm font-semibold text-[#777]">Duolingo makes it easy!</p>
          <span className="mt-4 block text-xs font-extrabold uppercase tracking-wide text-[#1cb0f6]">Try chess</span>
        </Link>
      </aside>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-[72px] items-center justify-around border-t border-[#ddd] bg-white px-2 lg:hidden">
        {navigation.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-full min-w-[58px] flex-col items-center justify-center gap-1 ${
                active
                  ? "text-[#58cc02]"
                  : "text-[#999]"
              }`}
            >
              <span className="text-[22px]">
                {item.icon}
              </span>

              <span className="text-[9px] font-extrabold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
