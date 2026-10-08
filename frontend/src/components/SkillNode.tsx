"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Skill } from "@/types/api";

interface SkillNodeProps {
  skill: Skill;
}

const SIZE = 76; // face diameter
const DEPTH = 8; // 3D bottom edge

const PALETTE = [
  { main: "#58cc02", edge: "#58a700", ring: "#d7ffb8" },
  { main: "#1cb0f6", edge: "#1899d6", ring: "#ddf4ff" },
  { main: "#ce82ff", edge: "#a568cc", ring: "#f3e1ff" },
  { main: "#ff9600", edge: "#cd7900", ring: "#ffe8c4" },
  { main: "#ff6d9a", edge: "#d94f7c", ring: "#ffe0eb" },
];
const LOCKED = { main: "#e5e5e5", edge: "#b7b7b7", ring: "#f0f0f0" };

export default function SkillNode({ skill }: SkillNodeProps) {
  const router = useRouter();

  const locked = skill.status === "locked";
  const completed = skill.status === "completed";
  const available = skill.status === "available";

  const icon = getSkillIcon(skill.title, skill.id);
  const lessonId = skill.lesson_id ?? skill.id;

  // Completed and available nodes both keep their own palette colour.
  const colors = locked ? LOCKED : PALETTE[(skill.id - 1) % PALETTE.length];

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    if (locked) return;
    router.push(`/lesson/${lessonId}`);
  }

  return (
    <div className="flex w-[132px] justify-center">
      <div className="relative" style={{ width: SIZE, height: SIZE + DEPTH }}>
        {/* START bubble */}
        {available && (
          <div className="absolute -top-[50px] left-1/2 z-30 -translate-x-1/2">
            <div
              className="relative rounded-xl border-2 border-[#e5e5e5] bg-white px-4 py-2 text-[13px] font-extrabold uppercase tracking-wide"
              style={{ color: colors.main }}
            >
              Start
              <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-[#e5e5e5] bg-white" />
            </div>
          </div>
        )}

        {/* Ring around the active node */}
        {available && (
          <span
            aria-hidden="true"
            className="absolute -left-[7px] -top-[7px] rounded-full border-[6px]"
            style={{
              width: SIZE + 14,
              height: SIZE + 14,
              borderColor: colors.ring,
            }}
          />
        )}

        <Link
          href={locked ? "#" : `/lesson/${lessonId}`}
          onClick={handleClick}
          aria-label={`${skill.title}, ${skill.status}${
            completed ? `, ${skill.crowns} crowns` : ""
          }`}
          aria-disabled={locked}
          title={skill.title}
          className={`group absolute inset-0 block rounded-full focus-visible:outline-4 focus-visible:outline-offset-8 focus-visible:outline-[#84d8ff] ${
            locked ? "cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {/* 3D edge (stays put) */}
          <span
            aria-hidden="true"
            className="absolute left-0 rounded-full"
            style={{
              top: DEPTH,
              width: SIZE,
              height: SIZE,
              backgroundColor: colors.edge,
            }}
          />

          {/* Face (presses down on click) */}
          <span
            aria-hidden="true"
            className={`absolute left-0 top-0 flex items-center justify-center rounded-full transition-transform duration-75 ${
              locked ? "" : "group-active:translate-y-[6px]"
            }`}
            style={{
              width: SIZE,
              height: SIZE,
              backgroundColor: colors.main,
            }}
          >
            {!locked && (
              <span className="absolute left-[16px] top-[9px] h-[8px] w-[26px] -rotate-[20deg] rounded-full bg-white/30" />
            )}

            <span
              className={`relative text-[32px] leading-none ${
                locked ? "opacity-50 grayscale" : "drop-shadow-sm"
              }`}
            >
              {icon}
            </span>
          </span>

          {/* Completed badge: white, tick in the node's own colour */}
          {completed && (
            <span
              aria-hidden="true"
              className="absolute -right-1 -top-1 z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#e5e5e5] bg-white text-[14px] font-black"
              style={{ color: colors.edge }}
            >
              ✓
            </span>
          )}
        </Link>

        {/* Crowns */}
        {completed && (
          <div
            className="absolute left-1/2 top-[96px] -translate-x-1/2 whitespace-nowrap text-[13px] font-extrabold text-[#b88600]"
            aria-label={`${skill.crowns} crowns`}
          >
            ♛ {skill.crowns}
          </div>
        )}

        {/* Active skill title */}
        {available && (
          <div className="absolute left-1/2 top-[102px] w-[130px] -translate-x-1/2 truncate text-center text-[13px] font-extrabold text-[#4b4b4b]">
            {skill.title}
          </div>
        )}

        {locked && <span className="sr-only">{skill.title}</span>}
      </div>
    </div>
  );
}

function getSkillIcon(title: string, id: number) {
  const name = title.toLowerCase();
  const topics: Array<[string[], string]> = [
    [["greet", "hello"], "👋"],
    [["food", "eat", "drink", "restaurant"], "🍎"],
    [["travel", "transport", "direction", "journey"], "🧳"],
    [["animal", "pet"], "🐾"],
    [["family", "people"], "👨‍👩‍👧"],
    [["number", "math", "count"], "🔢"],
    [["color", "colour", "art"], "🎨"],
    [["school", "study", "learn"], "📚"],
    [["weather", "season"], "☀️"],
    [["home", "house", "room"], "🏠"],
    [["work", "job", "career"], "💼"],
    [["shopping", "shop", "store"], "🛍️"],
    [["intro", "name", "about"], "🙋"],
  ];
  const match = topics.find(([keywords]) =>
    keywords.some((word) => name.includes(word))
  );
  const fallback = ["🎯", "🧩", "🌱", "🎵", "🚲", "🌍", "🐬", "🪁"];
  return match?.[1] ?? fallback[(id - 1) % fallback.length];
}