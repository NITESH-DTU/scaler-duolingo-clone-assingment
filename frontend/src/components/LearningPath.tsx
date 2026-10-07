"use client";

import type { CoursePath } from "@/types/api";
import UnitHeader from "./UnitHeader";
import SkillNode from "./SkillNode";

interface LearningPathProps {
  data: CoursePath;
}

export default function LearningPath({ data }: LearningPathProps) {
  return (
    <div className="mx-auto w-full max-w-[760px] px-6 pb-20">
      {/* Course heading */}
      <div className="mb-10 pt-6 text-center">
        <h1 className="text-3xl font-extrabold text-[#444]">
          {data.course.name}
        </h1>

        <p className="mt-2 text-[15px] font-semibold text-[#999]">
          Learn {data.course.language}
        </p>
      </div>

      {data.units.map((unit) => (
        <section key={unit.id} className="mb-20">
          <UnitHeader
            title={unit.title}
            unitNumber={unit.order}
            description="Learn the basics and build your foundation"
          />

          <div className="relative">
            {/* Path line */}
            <div className="absolute left-1/2 top-0 h-full w-[6px] -translate-x-1/2 rounded-full bg-[#e5e5e5]" />

            <div className="relative flex flex-col items-center gap-16">
              {unit.skills.map((skill, index) => {
                const positions = [
                  "-translate-x-[100px]",
                  "translate-x-[5px]",
                  "translate-x-[100px]",
                  "translate-x-[5px]",
                  "-translate-x-[100px]",
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