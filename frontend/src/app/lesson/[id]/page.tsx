"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { api } from "@/lib/api";
import ExerciseCard from "@/components/ExerciseCard";
import type { Lesson } from "@/types/api";

const HEART_REFILL_COST = 20;

function LessonContent() {
  const params = useParams();
  const router = useRouter();

  const lessonId = Number(params.id);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [hearts, setHearts] = useState(0);
  const [gems, setGems] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refilling, setRefilling] = useState(false);

  const [finished, setFinished] = useState(false);
  const [failed, setFailed] = useState(false);

  const [completion, setCompletion] = useState<{
    xp_earned: number;
    total_xp: number;
    streak: number;
  } | null>(null);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadLesson() {
      try {
        const [lessonData, userData] = await Promise.all([
          api.getLesson(lessonId),
          api.getMe(),
        ]);

        setLesson(lessonData);
        setHearts(userData.hearts);
        setGems(userData.gems);

        if (userData.hearts <= 0) {
          setFailed(true);
        }
      } catch (error) {
        console.error("Failed to load lesson:", error);
      } finally {
        setLoading(false);
      }
    }

    if (!Number.isNaN(lessonId)) {
      loadLesson();
    }
  }, [lessonId]);

  async function refillHeart() {
    if (
      refilling ||
      hearts >= 5
    ) {
      return;
    }

    setErrorMessage("");

    if (gems < HEART_REFILL_COST) {
      setErrorMessage(
        `You need ${HEART_REFILL_COST} gems to refill a heart.`
      );
      return;
    }

    setRefilling(true);

    try {
      const response = await api.refillHeart();

      setHearts(response.hearts);
      setGems(response.gems);

      if (response.hearts > 0) {
        setFailed(false);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to refill a heart."
      );
    } finally {
      setRefilling(false);
    }
  }

  async function submitAnswer() {
    const exercise = lesson?.exercises[currentIndex];

    if (
      !exercise ||
      !selectedAnswer.trim() ||
      submitting ||
      hearts <= 0
    ) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await api.submitAnswer(
        exercise.id,
        selectedAnswer
      );

      setResult(response.correct);
      setCorrectAnswer(
        response.correct_answer ?? ""
      );
      setHearts(response.hearts_remaining);

      if (
        response.hearts_remaining <= 0 &&
        !response.correct
      ) {
        setFailed(true);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to submit your answer."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function nextExercise() {
    if (!lesson || failed) {
      return;
    }

    if (
      currentIndex ===
      lesson.exercises.length - 1
    ) {
      try {
        const response =
          await api.completeLesson(lesson.id);

        setCompletion({
          xp_earned: response.xp_earned,
          total_xp: response.total_xp,
          streak: response.streak,
        });

        setFinished(true);
      } catch (error) {
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Failed to complete lesson."
        );
      }

      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedAnswer("");
    setCorrectAnswer("");
    setResult(null);
    setErrorMessage("");
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-lg font-extrabold text-[#777]">
          Loading lesson...
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-[#444]">
            Lesson not found
          </h1>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-2xl bg-[#58cc02] px-6 py-3 font-extrabold text-white shadow-[0_4px_0_#46a302]"
          >
            Back to learning
          </button>
        </div>
      </div>
    );
  }

  if (failed && !finished) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
          <div className="w-full rounded-3xl border-2 border-[#e5e5e5] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="text-6xl">💔</div>

            <h1 className="mt-5 text-4xl font-extrabold text-[#444]">
              Out of hearts
            </h1>

            <p className="mx-auto mt-4 max-w-md text-base font-semibold leading-7 text-[#777]">
              You lost all your hearts during this
              lesson. Refill one heart to continue.
            </p>

            <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-4">
              <div className="rounded-2xl border-2 border-[#eee] bg-[#fafafa] p-4">
                <div className="text-2xl">❤️</div>
                <p className="mt-1 text-sm font-extrabold text-[#999]">
                  Hearts
                </p>
                <p className="mt-1 text-xl font-extrabold text-[#444]">
                  {hearts} / 5
                </p>
              </div>

              <div className="rounded-2xl border-2 border-[#eee] bg-[#fafafa] p-4">
                <div className="text-2xl">💎</div>
                <p className="mt-1 text-sm font-extrabold text-[#999]">
                  Gems
                </p>
                <p className="mt-1 text-xl font-extrabold text-[#444]">
                  {gems}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mx-auto mt-6 max-w-md rounded-xl bg-[#fff4f4] px-4 py-3 text-sm font-extrabold text-[#d32f2f]">
                {errorMessage}
              </div>
            )}

            <div className="mx-auto mt-8 max-w-md space-y-3">
              <button
                type="button"
                onClick={refillHeart}
                disabled={
                  refilling ||
                  gems < HEART_REFILL_COST
                }
                className={`w-full rounded-2xl px-6 py-4 font-extrabold text-white shadow-[0_4px_0_#46a302] transition ${
                  refilling ||
                  gems < HEART_REFILL_COST
                    ? "cursor-not-allowed bg-[#aaa] shadow-[0_4px_0_#888]"
                    : "bg-[#58cc02] hover:bg-[#4fbd02]"
                }`}
              >
                {refilling
                  ? "Refilling..."
                  : `❤️ Refill 1 Heart · 💎 ${HEART_REFILL_COST}`}
              </button>

              {gems < HEART_REFILL_COST && (
                <p className="text-sm font-bold text-[#999]">
                  You need{" "}
                  {HEART_REFILL_COST - gems} more gems.
                </p>
              )}

              <button
                type="button"
                onClick={() => router.push("/shop")}
                className="w-full rounded-2xl border-2 border-[#ddd] bg-white px-6 py-4 font-extrabold text-[#555] transition hover:bg-[#f7f7f7]"
              >
                Go to Shop
              </button>

              <button
                type="button"
                onClick={() => router.push("/")}
                className="w-full px-6 py-3 font-extrabold text-[#999] hover:text-[#666]"
              >
                Back to learning
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (finished && completion) {
    return (
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6 py-12">
          <div className="w-full rounded-3xl border-2 border-[#e5e5e5] bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="text-6xl">🎉</div>

            <h1 className="mt-5 text-4xl font-extrabold text-[#444]">
              Lesson complete!
            </h1>

            <p className="mt-3 text-lg font-bold text-[#777]">
              Great work. Keep your streak alive!
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <ResultCard
                icon="⚡"
                value={`+${completion.xp_earned}`}
                label="XP earned"
              />

              <ResultCard
                icon="⭐"
                value={`${completion.total_xp}`}
                label="Total XP"
              />

              <ResultCard
                icon="🔥"
                value={`${completion.streak}`}
                label="Day streak"
              />
            </div>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="mt-8 rounded-2xl bg-[#58cc02] px-8 py-4 font-extrabold text-white shadow-[0_4px_0_#46a302]"
            >
              Continue learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  const exercise =
    lesson.exercises[currentIndex];

  const progress =
    ((currentIndex + 1) /
      lesson.exercises.length) *
    100;

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-2xl font-bold text-[#999] hover:text-[#666]"
          >
            ×
          </button>

          <div className="h-4 flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
            <div
              className="h-full rounded-full bg-[#58cc02] transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-2 font-extrabold text-[#ff4b4b]">
            <span>❤️</span>
            <span>{hearts}</span>
          </div>

          <div className="hidden items-center gap-2 font-extrabold text-[#1cb0f6] sm:flex">
            <span>💎</span>
            <span>{gems}</span>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-3xl">
          <ExerciseCard
            exercise={exercise}
            selectedAnswer={selectedAnswer}
            setSelectedAnswer={setSelectedAnswer}
            result={result}
          />

          {errorMessage && (
            <div className="mt-6 rounded-xl bg-[#fff4f4] px-4 py-3 text-center text-sm font-extrabold text-[#d32f2f]">
              {errorMessage}
            </div>
          )}

          {result !== null && (
            <div
              className={`mt-8 rounded-2xl border-2 p-5 ${
                result
                  ? "border-[#58cc02] bg-[#d7ffb8]"
                  : "border-[#ff4b4b] bg-[#fff0f0]"
              }`}
            >
              <p
                className={`text-lg font-extrabold ${
                  result
                    ? "text-[#46a302]"
                    : "text-[#d32f2f]"
                }`}
              >
                {result
                  ? "Excellent! That's correct."
                  : "Not quite!"}
              </p>

              {!result && correctAnswer && (
                <p className="mt-2 font-bold text-[#555]">
                  Correct answer:{" "}
                  <span className="font-extrabold">
                    {correctAnswer}
                  </span>
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            {result === null ? (
              <button
                type="button"
                onClick={submitAnswer}
                disabled={
                  !selectedAnswer.trim() ||
                  submitting ||
                  hearts <= 0
                }
                className={`rounded-2xl px-8 py-4 font-extrabold text-white shadow-[0_4px_0_#1899d6] ${
                  !selectedAnswer.trim() ||
                  submitting ||
                  hearts <= 0
                    ? "cursor-not-allowed bg-[#aaa] shadow-[0_4px_0_#888]"
                    : "bg-[#1cb0f6] hover:bg-[#1599d1]"
                }`}
              >
                {submitting
                  ? "Checking..."
                  : "CHECK"}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextExercise}
                className="rounded-2xl bg-[#58cc02] px-8 py-4 font-extrabold text-white shadow-[0_4px_0_#46a302]"
              >
                {currentIndex ===
                lesson.exercises.length - 1
                  ? "FINISH"
                  : "CONTINUE"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ResultCardProps {
  icon: string;
  value: string;
  label: string;
}

function ResultCard({
  icon,
  value,
  label,
}: ResultCardProps) {
  return (
    <div className="rounded-2xl border-2 border-[#eee] bg-[#fafafa] p-5">
      <div className="text-3xl">{icon}</div>
      <p className="mt-2 text-2xl font-extrabold text-[#444]">
        {value}
      </p>
      <p className="mt-1 text-sm font-bold text-[#999]">
        {label}
      </p>
    </div>
  );
}

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-lg font-extrabold text-[#777]">
            Loading lesson...
          </div>
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}