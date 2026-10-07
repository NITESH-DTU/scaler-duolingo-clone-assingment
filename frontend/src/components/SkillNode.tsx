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

  const lessonId = skill.lesson_id ?? skill.id;

  function handleClick(
    event: React.MouseEvent<HTMLAnchorElement>
  ) {
    if (locked) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    const attemptId = Date.now();

    router.push(
      `/lesson/${lessonId}?attempt=${attemptId}`
    );
  }

  return (
    <div className="flex flex-col items-center">
      <Link
        href={
          locked
            ? "#"
            : `/lesson/${lessonId}`
        }
        onClick={handleClick}
        className={`relative flex h-[82px] w-[82px] items-center justify-center rounded-full border-[6px] transition-transform ${
          locked
            ? "cursor-not-allowed border-[#d9d9d9] bg-[#eeeeee]"
            : completed
              ? "border-[#46b900] bg-[#58cc02] shadow-[0_5px_0_#46a302] hover:-translate-y-1"
              : "border-[#46a302] bg-[#58cc02] shadow-[0_5px_0_#46a302] hover:-translate-y-1"
        }`}
      >
        {locked ? (
          <span className="text-3xl text-[#999]">
            🔒
          </span>
        ) : completed ? (
          <span className="text-3xl text-white">
            ✓
          </span>
        ) : (
          <span className="text-3xl">
            ⭐
          </span>
        )}

        {available && (
          <span className="absolute -top-3 rounded-full bg-[#ffc800] px-2 py-1 text-[11px] font-black text-white shadow-sm">
            START
          </span>
        )}
      </Link>

      <div className="mt-3 text-center">
        <p className="text-[15px] font-extrabold text-[#444]">
          {skill.title}
        </p>

        <div className="mt-2 flex items-center justify-center gap-1">
          <span className="text-sm">
            👑
          </span>

          <span className="text-xs font-bold text-[#999]">
            {skill.crowns}
          </span>
        </div>
      </div>

      <div className="mt-2 w-[90px]">
        <div className="h-2 overflow-hidden rounded-full bg-[#e5e5e5]">
          <div
            className="h-full rounded-full bg-[#58cc02] transition-all"
            style={{
              width: `${Math.min(
                Math.max(skill.progress, 0),
                100
              )}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}