"use client";

import type { CoursePath } from "@/types/api";
import UnitHeader from "./UnitHeader";
import SkillNode from "./SkillNode";

interface LearningPathProps {
  data: CoursePath;
}

export default function LearningPath({ data }: LearningPathProps) {
  return (
    <div className="mx-auto w-full max-w-[592px] pb-20 2xl:-translate-x-[17px]">
      {data.units.map((unit) => (
        <section key={unit.id} className="mb-12">
          <UnitHeader
            title={unit.title}
            unitNumber={unit.order}
            courseName={data.course.name}
          />

          <div className="relative mx-auto max-w-[500px] pb-3 pt-1">
            <div className="relative flex flex-col items-center gap-0">
              {unit.skills.map((skill, index) => {
                const positions = [
                  "-translate-x-[66px] sm:-translate-x-[82px]",
                  "translate-x-[4px]",
                  "translate-x-[68px] sm:translate-x-[84px]",
                  "translate-x-[4px]",
                  "-translate-x-[66px] sm:-translate-x-[82px]",
                ];

                const position =
                  positions[index % positions.length];
                return (
                  <div
                    key={skill.id}
                    className={`relative ${position}`}
                  >
                    <SkillNode skill={skill} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
