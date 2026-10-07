export interface User {
  id: number;
  name: string;
  xp: number;
  streak: number;
  hearts: number;
  gems: number;
  streak_freezes: number;
}

export type SkillStatus =
  | "completed"
  | "available"
  | "locked";

export interface Skill {
  id: number;
  title: string;
  status: SkillStatus;
  progress: number;
  crowns: number;
  xp_reward: number;
  lesson_id?: number;
}

export interface Unit {
  id: number;
  title: string;
  order: number;
  skills: Skill[];
}

export interface Course {
  id: number;
  name: string;
  language: string;
}

export interface CoursePath {
  course: Course;
  units: Unit[];
}

export type ExerciseType =
  | "multiple_choice"
  | "translate"
  | "fill_blank"
  | "type_answer"
  | "match";

export interface Exercise {
  id: number;
  type: ExerciseType | string;
  question: string;
  options: string | null;
  order: number;
}

export interface Lesson {
  id: number;
  title: string;
  skill_id: number;
  exercises: Exercise[];
}

export interface AnswerResponse {
  correct: boolean;
  hearts_remaining: number;
  correct_answer?: string;
}

export interface CompleteLessonResponse {
  message: string;
  xp_earned: number;
  total_xp: number;
  streak: number;
  daily_xp: number;
  skill_progress: number;
}

export interface RefillHeartResponse {
  hearts: number;
  gems: number;
}

export interface ProfileUser {
  name: string;
  xp: number;
  streak: number;
}

export interface ProfileCourse {
  name: string | null;
  language: string | null;
}

export interface ProfileStats {
  lessons_completed: number;
  skills_completed: number;
}

export interface Profile {
  user: ProfileUser;
  course: ProfileCourse;
  stats: ProfileStats;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
}

export type Leaderboard = LeaderboardEntry[];

export interface Settings {
  sound_enabled: boolean;
  music_enabled: boolean;
  notifications_enabled: boolean;
}

export interface UpdateSettingsRequest {
  sound_enabled?: boolean;
  music_enabled?: boolean;
  notifications_enabled?: boolean;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  icon: string;
  quest_type: string;
  period: "daily" | "monthly";
  target: number;
  progress: number;
  completed: boolean;
  reward_gems: number;
}

export type Quests = Quest[];

export interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  achievement_type: string;
  target: number;
  progress: number;
  completed: boolean;
}

export type Achievements = Achievement[];

export interface ApiError {
  detail: string;
}