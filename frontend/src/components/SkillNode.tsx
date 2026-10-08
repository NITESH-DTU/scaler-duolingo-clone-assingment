"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Skill } from "@/types/api";

interface SkillNodeProps {
  skill: Skill;
}

export default function SkillNode({
  skill,
}: SkillNodeProps) {
  const router = useRouter();

  const locked = skill.status === "locked";
  const completed = skill.status === "completed";
  const available = skill.status === "available";
  const icon = getSkillIcon(skill.title, skill.id);
  const palette = [
    "border-[#46a302] bg-[#58cc02] shadow-[0_5px_0_#46a302]",
    "border-[#1899d6] bg-[#1cb0f6] shadow-[0_5px_0_#168cc0]",
    "border-[#8a4de8] bg-[#a66bff] shadow-[0_5px_0_#7842c7]",
    "border-[#e78b00] bg-[#ffb020] shadow-[0_5px_0_#cf7600]",
    "border-[#df4c78] bg-[#ff6d9a] shadow-[0_5px_0_#cf456d]",
  ];

  const lessonId = skill.lesson_id ?? skill.id;

  function handleClick(
    event: React.MouseEvent<HTMLAnchorElement>
  ) {
    if (locked) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    router.push(`/lesson/${lessonId}`);
  }

  return (
    <div className="flex h-[86px] w-[132px] flex-col items-center">
      <Link
        href={
          locked
            ? "#"
            : `/lesson/${lessonId}`
        }
        onClick={handleClick}
        aria-label={`${skill.title}, ${skill.status}${completed ? `, ${skill.crowns} crowns` : ""}`}
        aria-disabled={locked}
        title={skill.title}
        className={`relative flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full border-[5px] transition-transform focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#1cb0f6] ${
          locked
            ? "cursor-not-allowed border-[#d9d9d9] bg-[#eeeeee] shadow-[0_5px_0_#d0d0d0]"
            : `${palette[(skill.id - 1) % palette.length]} hover:-translate-y-1`
        }`}
      >
        <span aria-hidden="true" className={`text-[28px] ${locked ? "grayscale opacity-70" : "drop-shadow-sm"}`}>
          {icon}
        </span>

        {completed && (
          <span aria-hidden="true" className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#ffc800] text-sm font-black text-white shadow-sm">✓</span>
        )}

        {available && (
          <span className="absolute -top-3 rounded-full border-2 border-white bg-white px-3 py-1 text-[10px] font-black tracking-wide text-[#1cb0f6] shadow-sm">
            START
          </span>
        )}
      </Link>

      {completed ? (
        <span className="mt-0.5 text-[11px] font-extrabold text-[#b88600]" aria-label={`${skill.crowns} crowns`}>
          ♛ {skill.crowns}
        </span>
      ) : available ? (
        <span className="mt-0.5 max-w-[120px] truncate text-[11px] font-extrabold text-[#555]">
          {skill.title}
        </span>
      ) : (
        <span className="sr-only">{skill.title}</span>
      )}
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
  const match = topics.find(([keywords]) => keywords.some((word) => name.includes(word)));
  const fallback = ["🎯", "🧩", "🌱", "🎵", "🚲", "🌍", "🐬", "🪁"];
  return match?.[1] ?? fallback[(id - 1) % fallback.length];
}
