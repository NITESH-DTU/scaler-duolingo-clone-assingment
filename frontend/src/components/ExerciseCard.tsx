"use client";

import { useMemo, useState } from "react";
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

  const matchPairs = useMemo(
    () => getMatchPairs(options),
    [exercise.id, exercise.options]
  );

  const [selectedLeft, setSelectedLeft] = useState<string | null>(
    null
  );

  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  const [matchError, setMatchError] = useState<string | null>(
    null
  );

  function handleMatchLeft(value: string) {
    if (result !== null || matchedPairs.includes(value)) {
      return;
    }

    setSelectedLeft(value);
    setMatchError(null);
  }

  function handleMatchRight(value: string) {
    if (
      result !== null ||
      !selectedLeft ||
      matchedPairs.includes(selectedLeft)
    ) {
      return;
    }

    const pair = matchPairs.find(
      (item) => item.left === selectedLeft
    );

    if (!pair) {
      return;
    }

    if (pair.right === value) {
      const nextMatchedPairs = [
        ...matchedPairs,
        selectedLeft,
      ];

      setMatchedPairs(nextMatchedPairs);
      setSelectedLeft(null);
      setMatchError(null);

      if (nextMatchedPairs.length === matchPairs.length) {
        const answer = matchPairs
          .map(
            (item) =>
              `${item.left}=${item.right}`
          )
          .join(" | ");

        setSelectedAnswer(answer);
      }
    } else {
      setMatchError(
        "That pair doesn't match. Try again!"
      );

      setSelectedLeft(null);
    }
  }

  return (
    <div>
      <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[#999]">
        {getExerciseLabel(exercise.type)}
      </p>

      <h1 className="text-3xl font-extrabold leading-tight text-[#444]">
        {exercise.question}
      </h1>

      {isMatch ? (
        <MatchExercise
          pairs={matchPairs}
          selectedLeft={selectedLeft}
          matchedPairs={matchedPairs}
          matchError={matchError}
          disabled={result !== null}
          onLeftSelect={handleMatchLeft}
          onRightSelect={handleMatchRight}
        />
      ) : isChoice ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {options.map((option) => {
            const selected =
              selectedAnswer === option;

            return (
              <button
                key={option}
                type="button"
                disabled={result !== null}
                onClick={() =>
                  setSelectedAnswer(option)
                }
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
            placeholder={getPlaceholder(
              exercise.type
            )}
            className="w-full rounded-2xl border-2 border-[#ddd] px-5 py-5 text-lg font-bold text-[#444] outline-none placeholder:text-[#aaa] focus:border-[#1cb0f6]"
          />
        </div>
      )}
    </div>
  );
}

interface MatchExerciseProps {
  pairs: MatchPair[];
  selectedLeft: string | null;
  matchedPairs: string[];
  matchError: string | null;
  disabled: boolean;
  onLeftSelect: (value: string) => void;
  onRightSelect: (value: string) => void;
}

function MatchExercise({
  pairs,
  selectedLeft,
  matchedPairs,
  matchError,
  disabled,
  onLeftSelect,
  onRightSelect,
}: MatchExerciseProps) {
  const rightOptions = useMemo(
    () =>
      [...pairs]
        .sort(() => Math.random() - 0.5)
        .map((pair) => pair.right),
    [pairs]
  );

  if (pairs.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border-2 border-dashed border-[#ddd] p-8 text-center">
        <p className="font-bold text-[#999]">
          No matching pairs available.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-wide text-[#999]">
            Spanish
          </p>

          {pairs.map((pair) => {
            const matched =
              matchedPairs.includes(pair.left);

            const selected =
              selectedLeft === pair.left;

            return (
              <button
                key={pair.left}
                type="button"
                disabled={disabled || matched}
                onClick={() =>
                  onLeftSelect(pair.left)
                }
                className={`min-h-[70px] w-full rounded-2xl border-2 px-4 py-3 text-center font-extrabold transition ${
                  matched
                    ? "border-[#58cc02] bg-[#d7ffb8] text-[#46a302]"
                    : selected
                      ? "border-[#1cb0f6] bg-[#dff4ff] text-[#1899d6]"
                      : "border-[#ddd] bg-white text-[#555] hover:border-[#1cb0f6] hover:bg-[#f7f7f7]"
                }`}
              >
                {matched ? "✓ " : ""}
                {pair.left}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-wide text-[#999]">
            English
          </p>

          {rightOptions.map((option) => {
            const matched = pairs.some(
              (pair) =>
                pair.right === option &&
                matchedPairs.includes(
                  pair.left
                )
            );

            return (
              <button
                key={option}
                type="button"
                disabled={disabled || matched}
                onClick={() =>
                  onRightSelect(option)
                }
                className={`min-h-[70px] w-full rounded-2xl border-2 px-4 py-3 text-center font-extrabold transition ${
                  matched
                    ? "border-[#58cc02] bg-[#d7ffb8] text-[#46a302]"
                    : selectedLeft
                      ? "border-[#ddd] bg-white text-[#555] hover:border-[#1cb0f6] hover:bg-[#dff4ff]"
                      : "border-[#ddd] bg-white text-[#555]"
                }`}
              >
                {matched ? "✓ " : ""}
                {option}
              </button>
            );
          })}
        </div>
      </div>

      {matchError && (
        <div className="mt-5 rounded-xl bg-[#fff4f4] px-4 py-3 text-center text-sm font-extrabold text-[#d32f2f]">
          {matchError}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm font-bold text-[#999]">
          {matchedPairs.length} / {pairs.length} pairs
          matched
        </p>
      </div>
    </div>
  );
}

interface MatchPair {
  left: string;
  right: string;
}

function getMatchPairs(
  options: string[]
): MatchPair[] {
  const pairs: MatchPair[] = [];

  for (
    let index = 0;
    index + 1 < options.length;
    index += 2
  ) {
    pairs.push({
      left: options[index],
      right: options[index + 1],
    });
  }

  return pairs;
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