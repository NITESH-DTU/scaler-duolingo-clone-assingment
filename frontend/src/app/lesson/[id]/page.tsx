"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { api } from "@/lib/api";
import ExerciseCard from "@/components/ExerciseCard";
import type { Lesson } from "@/types/api";

function LessonContent() {
  const params = useParams();
  const router = useRouter();

  const lessonId = Number(params.id);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [result, setResult] = useState<boolean | null>(null);

  // Backend is the source of truth.
  // 0 is only the initial UI value while we load the real value.
  const [hearts, setHearts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [refilling, setRefilling] = useState(false);

  const [finished, setFinished] = useState(false);

  const [completion, setCompletion] = useState<{
    xp_earned: number;
    total_xp: number;
    streak: number;
  } | null>(null);

  useEffect(() => {
    async function loadLesson() {
      try {
        const [lessonData, userData] = await Promise.all([
          api.getLesson(lessonId),
          api.getMe(),
        ]);

        setLesson(lessonData);

        // Real value comes from backend.
        setHearts(userData.hearts);
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
    if (refilling || hearts >= 5) {
      return;
    }

    setRefilling(true);

    try {
      const response = await api.refillHeart();

      // Backend decides the new value.
      setHearts(response.hearts);
    } catch (error) {
      console.error("Failed to refill heart:", error);
    } finally {
      setRefilling(false);
    }
  }

  async function submitAnswer() {
    const exercise = lesson?.exercises[currentIndex];

    if (
      !exercise ||
      !selectedAnswer ||
      submitting ||
      hearts <= 0
    ) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.submitAnswer(
        exercise.id,
        selectedAnswer
      );

      // Backend tells us whether the answer was correct
      // and how many hearts remain.
      setResult(response.correct);
      setHearts(response.hearts_remaining);
    } catch (error) {
      console.error("Failed to submit answer:", error);
    } finally {
      setSubmitting(false);
    }
  }

  async function nextExercise() {
    if (!lesson) {
      return;
    }

    if (currentIndex === lesson.exercises.length - 1) {
      try {
        const response = await api.completeLesson(lesson.id);

        setCompletion(response);
        setFinished(true);
      } catch (error) {
        console.error("Failed to complete lesson:", error);
      }

      return;
    }

    setCurrentIndex((index) => index + 1);
    setSelectedAnswer("");
    setResult(null);
  }

  // -------------------------
  // LOADING
  // -------------------------

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-5xl">🦉</div>

          <p className="mt-4 font-extrabold text-[#777]">
            Loading lesson...
          </p>
        </div>
      </div>
    );
  }

  // -------------------------
  // LESSON NOT FOUND
  // -------------------------

  if (!lesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-5xl">😕</div>

          <h1 className="mt-4 text-xl font-extrabold text-[#444]">
            Lesson not found
          </h1>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 rounded-xl border-b-4 border-[#46a302] bg-[#58cc02] px-6 py-3 font-extrabold text-white"
          >
            BACK TO LEARN
          </button>
        </div>
      </div>
    );
  }

  // -------------------------
  // OUT OF HEARTS
  // -------------------------

  if (hearts <= 0 && !finished) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-[500px] text-center">
          <div className="text-7xl">💔</div>

          <h1 className="mt-6 text-4xl font-extrabold text-[#444]">
            Out of hearts!
          </h1>

          <p className="mt-4 text-lg font-semibold leading-7 text-[#777]">
            You need at least one heart to continue this lesson.
          </p>

          <div className="mt-8 rounded-2xl bg-[#fff4f4] p-6">
            <div className="text-5xl">❤️</div>

            <p className="mt-3 font-extrabold text-[#ff4b4b]">
              Hearts remaining: 0
            </p>
          </div>

          <button
            type="button"
            disabled={refilling}
            onClick={refillHeart}
            className="mt-8 w-full rounded-xl border-b-4 border-[#46a302] bg-[#58cc02] py-4 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:border-[#888] disabled:bg-[#aaa]"
          >
            {refilling
              ? "REFILLING..."
              : "REFILL 1 HEART"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-4 w-full rounded-xl border-2 border-[#ddd] bg-white py-4 text-sm font-extrabold text-[#777] hover:bg-[#f7f7f7]"
          >
            BACK TO LEARN
          </button>
        </div>
      </div>
    );
  }

  // -------------------------
  // LESSON COMPLETE
  // -------------------------

  if (finished && completion) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <div className="w-full max-w-[520px] text-center">
          <div className="text-7xl">🎉</div>

          <h1 className="mt-6 text-4xl font-extrabold text-[#444]">
            Lesson Complete!
          </h1>

          <p className="mt-3 text-lg font-semibold text-[#777]">
            Great work! Keep your streak going.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            <ResultCard
              icon="⭐"
              value={`+${completion.xp_earned}`}
              label="XP"
            />

            <ResultCard
              icon="🔥"
              value={`${completion.streak}`}
              label="STREAK"
            />

            <ResultCard
              icon="💎"
              value={`${completion.total_xp}`}
              label="TOTAL XP"
            />
          </div>

          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-8 w-full rounded-xl border-b-4 border-[#46a302] bg-[#58cc02] py-4 text-sm font-extrabold text-white"
          >
            CONTINUE
          </button>
        </div>
      </div>
    );
  }

  const exercise = lesson.exercises[currentIndex];

  const progress =
    ((currentIndex + 1) / lesson.exercises.length) * 100;

  // -------------------------
  // MAIN LESSON UI
  // -------------------------

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      <header className="flex items-center gap-5 border-b border-[#eee] px-6 py-5">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-2xl font-bold text-[#999] hover:text-[#555]"
        >
          ✕
        </button>

        <div className="h-3 flex-1 overflow-hidden rounded-full bg-[#e5e5e5]">
          <div
            className="h-full rounded-full bg-[#58cc02] transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xl">❤️</span>

          <span className="font-extrabold text-[#ff4b4b]">
            {hearts}
          </span>
        </div>
      </header>

      {/* CONTENT */}
      <main className="mx-auto max-w-[850px] px-6 py-12">
        <div className="mb-10">
          <p className="text-sm font-extrabold uppercase tracking-wide text-[#999]">
            {lesson.title}
          </p>

          <p className="mt-2 text-sm font-bold text-[#aaa]">
            Question {currentIndex + 1} of{" "}
            {lesson.exercises.length}
          </p>
        </div>

        <ExerciseCard
          exercise={exercise}
          selectedAnswer={selectedAnswer}
          setSelectedAnswer={setSelectedAnswer}
          result={result}
        />

        {/* FEEDBACK */}
        {result !== null && (
          <div
            className={`mt-8 rounded-2xl p-5 ${
              result
                ? "bg-[#d7ffb8]"
                : "bg-[#ffdfe0]"
            }`}
          >
            <p
              className={`font-extrabold ${
                result
                  ? "text-[#46a302]"
                  : "text-[#d32f2f]"
              }`}
            >
              {result
                ? "Correct! Great job! 🎉"
                : "Not quite. Keep going! 💪"}
            </p>
          </div>
        )}

        {/* ACTION BUTTON */}
        <div className="mt-10 flex justify-end">
          {result === null ? (
            <button
              type="button"
              disabled={
                !selectedAnswer ||
                submitting ||
                hearts <= 0
              }
              onClick={submitAnswer}
              className="rounded-xl border-b-4 border-[#46a302] bg-[#58cc02] px-10 py-4 font-extrabold text-white disabled:cursor-not-allowed disabled:border-[#ccc] disabled:bg-[#ddd]"
            >
              {submitting
                ? "CHECKING..."
                : "CHECK"}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextExercise}
              className={`rounded-xl border-b-4 px-10 py-4 font-extrabold text-white ${
                result
                  ? "border-[#46a302] bg-[#58cc02]"
                  : "border-[#d32f2f] bg-[#ff4b4b]"
              }`}
            >
              {currentIndex ===
              lesson.exercises.length - 1
                ? "FINISH"
                : "CONTINUE"}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

// -------------------------
// RESULT CARD
// -------------------------

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
    <div className="rounded-2xl bg-[#f7f7f7] p-5">
      <div className="text-3xl">{icon}</div>

      <p className="mt-2 text-xl font-extrabold text-[#444]">
        {value}
      </p>

      <p className="mt-1 text-xs font-extrabold text-[#999]">
        {label}
      </p>
    </div>
  );
}

// -------------------------
// SUSPENSE WRAPPER
// -------------------------

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="text-center">
            <div className="text-5xl">🦉</div>

            <p className="mt-4 font-extrabold text-[#777]">
              Loading lesson...
            </p>
          </div>
        </div>
      }
    >
      <LessonContent />
    </Suspense>
  );
}