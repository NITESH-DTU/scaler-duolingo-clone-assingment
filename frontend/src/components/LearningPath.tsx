"use client";

import type { CoursePath } from "@/types/api";
import UnitHeader from "./UnitHeader";
import SkillNode from "./SkillNode";

interface LearningPathProps {
  data: CoursePath;
}

const NODE_GAP = 134;      // fixed vertical distance between node centres
const AMPLITUDE = 64;      // max horizontal offset in px (Duolingo is ~60-75)
const NODES_PER_UNIT = 3;  // 3 nodes => one half-wave per unit
const PERIOD = NODES_PER_UNIT * 2; // full wave = 2 units (right bow, left bow)

// One continuous wave across the whole course.
// +0.5 centres each half-wave on the middle node of a unit:
// g=0..5 -> 0.5, 1, 0.5, -0.5, -1, -0.5  (times AMPLITUDE)
function getOffset(globalIndex: number) {
  return AMPLITUDE * Math.sin((2 * Math.PI * (globalIndex + 0.5)) / PERIOD);
}

export default function LearningPath({ data }: LearningPathProps) {
  let globalIndex = 0; // keeps the wave continuous across units

  return (
    <div className="mx-auto w-full max-w-[700px] pb-20">
      {data.units.map((unit, unitIndex) => (
        <section key={unit.id} className="mb-10">
          <UnitHeader
            title={unit.title}
            unitNumber={unit.order}
            courseName={data.course.name}
          />

          <div className="mx-auto flex w-full max-w-[560px] flex-col items-center pt-8">
            {unit.skills.map((skill) => {
              const offset = getOffset(globalIndex++);

              return (
                <div
                  key={skill.id}
                  className="flex items-center justify-center"
                  style={{
                    height: `${NODE_GAP}px`,
                    transform: `translateX(${offset.toFixed(1)}px)`,
                  }}
                >
                  <SkillNode skill={skill} />
                </div>
              );
            })}
          </div>

          {unitIndex < data.units.length - 1 && (
            <div className="mx-auto mt-4 flex max-w-[430px] items-center gap-4 px-6">
              <div className="h-px flex-1 bg-[#eeeeee]" />
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#eeeeee] bg-white text-xs text-[#c5c5c5]">
                ✦
              </div>
              <div className="h-px flex-1 bg-[#eeeeee]" />
            </div>
          )}
        </section>
      ))}
    </div>
  );
}