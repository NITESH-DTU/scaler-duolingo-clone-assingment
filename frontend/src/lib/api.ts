import type {
  User,
  CoursePath,
  Lesson,
  AnswerResponse,
  CompleteLessonResponse,
  RefillHeartResponse,
  Profile,
  Leaderboard,
  Settings,
  UpdateSettingsRequest,
  Quests,
  Achievements,
} from "@/types/api";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "/svc/api/v1";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        cache: "no-store",

        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      }
    );

    if (!response.ok) {
      let message = "Something went wrong";

      try {
        const error = await response.json();

        message =
          error?.detail || message;
      } catch {}

      throw new Error(message);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error(
      "Unable to connect to the server"
    );
  }
}

export const api = {
  getMe: () =>
    request<User>("/me"),

  getCoursePath: () =>
    request<CoursePath>("/course/path"),

  getLesson: (lessonId: number) =>
    request<Lesson>(
      `/lessons/${lessonId}`
    ),

  submitAnswer: (
    exerciseId: number,
    answer: string
  ) =>
    request<AnswerResponse>(
      `/exercises/${exerciseId}/answer`,
      {
        method: "POST",
        body: JSON.stringify({
          answer,
        }),
      }
    ),

  completeLesson: (lessonId: number) =>
    request<CompleteLessonResponse>(
      `/lessons/${lessonId}/complete`,
      {
        method: "POST",
      }
    ),

  refillHeart: () =>
    request<RefillHeartResponse>(
      "/hearts/refill",
      {
        method: "POST",
      }
    ),

  buyHeart: () =>
    request<{
      message: string;
      hearts: number;
      gems: number;
    }>("/shop/buy/heart", {
      method: "POST",
    }),

  buyStreakFreeze: () =>
    request<{
      message: string;
      streak_freezes: number;
      gems: number;
    }>("/shop/buy/streak-freeze", {
      method: "POST",
    }),

  getProfile: () =>
    request<Profile>("/profile"),

  getLeaderboard: () =>
    request<Leaderboard>("/leaderboard"),

  getSettings: () =>
    request<Settings>("/settings"),

  updateSettings: (
    settings: UpdateSettingsRequest
  ) =>
    request<Settings>("/settings", {
      method: "PATCH",
      body: JSON.stringify(settings),
    }),

  getQuests: () =>
    request<Quests>("/quests"),

  getAchievements: () =>
    request<Achievements>(
      "/achievements"
    ),
};
