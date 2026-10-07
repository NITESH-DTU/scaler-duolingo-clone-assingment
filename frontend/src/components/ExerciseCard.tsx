"use client";

import type { Exercise } from "@/types/api";

interface ExerciseCardProps {
  exercise: Exercise;
  selectedAnswer: string;
  setSelectedAnswer: (value: string) => void;
  result: boolean | null;
}

export default function ExerciseCard({
  exercise,
  selectedAnswer,
  setSelectedAnswer,
  result,
}: ExerciseCardProps) {
  const options = exercise.options
    ? exercise.options
        .split(",")
        .map((option) => option.trim())
        .filter(Boolean)
    : [];

  const isChoice = exercise.type === "multiple_choice";
  const isMatch = exercise.type === "match";

  return (
    <div>
      <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[#999]">
        {getExerciseLabel(exercise.type)}
      </p>

      <h1 className="text-3xl font-extrabold leading-tight text-[#444]">
        {exercise.question}
      </h1>

      {isMatch ? (
        <div className="mt-10">
          <div className="grid grid-cols-2 gap-4">
            {options.length > 0 ? (
              options.map((option) => {
                const selected = selectedAnswer === option;

                return (
                  <button
                    key={option}
                    type="button"
                    disabled={result !== null}
                    onClick={() => setSelectedAnswer(option)}
                    className={`min-h-[80px] rounded-2xl border-2 px-5 py-4 text-center font-extrabold transition ${
                      selected
                        ? "border-[#1cb0f6] bg-[#dff4ff] text-[#1899d6]"
                        : "border-[#ddd] bg-white text-[#555] hover:border-[#bbb] hover:bg-[#f7f7f7]"
                    }`}
                  >
                    {option}
                  </button>
                );
              })
            ) : (
              <div className="col-span-2 rounded-2xl border-2 border-dashed border-[#ddd] p-8 text-center">
                <p className="font-bold text-[#999]">
                  No matching options available.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : isChoice ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {options.map((option) => {
            const selected = selectedAnswer === option;

            return (
              <button
                key={option}
                type="button"
                disabled={result !== null}
                onClick={() => setSelectedAnswer(option)}
                className={`rounded-2xl border-2 p-5 text-left font-extrabold transition ${
                  selected
                    ? "border-[#1cb0f6] bg-[#dff4ff] text-[#1899d6]"
                    : "border-[#ddd] bg-white text-[#555] hover:border-[#bbb] hover:bg-[#f7f7f7]"
                }`}
              >
                {option}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="mt-10">
          <input
            type="text"
            value={selectedAnswer}
            disabled={result !== null}
            onChange={(event) =>
              setSelectedAnswer(event.target.value)
            }
            placeholder={getPlaceholder(exercise.type)}
            className="w-full rounded-2xl border-2 border-[#ddd] px-5 py-5 text-lg font-bold text-[#444] outline-none placeholder:text-[#aaa] focus:border-[#1cb0f6]"
          />
        </div>
      )}
    </div>
  );
}

function getExerciseLabel(type: string) {
  switch (type) {
    case "multiple_choice":
      return "Choose the correct answer";

    case "translate":
      return "Translate this sentence";

    case "fill_blank":
      return "Fill in the blank";

    case "type_answer":
      return "Type your answer";

    case "match":
      return "Match the pairs";

    default:
      return "Answer the question";
  }
}

function getPlaceholder(type: string) {
  switch (type) {
    case "translate":
      return "Type your translation...";

    case "fill_blank":
      return "Type the missing word...";

    case "type_answer":
      return "Type your answer...";

    default:
      return "Type your answer...";
  }
}