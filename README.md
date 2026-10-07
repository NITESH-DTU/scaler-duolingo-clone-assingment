# Duolingo Web App Clone

A full-stack Duolingo-inspired language learning platform built as an SDE Fullstack assignment.

The project focuses on reproducing the core learning experience of Duolingo while maintaining a clean separation between the frontend, backend, database, and persistent learner state.

---

## 1. Problem Statement

The objective was to build a functional Duolingo-style learning application where a learner can:

- Navigate through a structured learning path.
- Unlock skills progressively.
- Start and complete lessons.
- Solve different types of exercises.
- Receive immediate feedback.
- Lose hearts for incorrect answers.
- Earn XP after completing lessons.
- Maintain a learning streak.
- Track skill and lesson progress.
- Complete daily and monthly quests.
- Unlock achievements.
- View leaderboard rankings.
- Manage hearts and gems through the shop.
- View profile statistics.
- Configure application settings.
- Persist all important progress in a database.

The application was designed to feel like a real product rather than a collection of static frontend screens.

---

# 2. Approach

The project was approached in stages rather than building the entire UI first.

The implementation followed this order:

```text
Problem Analysis
       ↓
System Architecture
       ↓
Backend Data Model
       ↓
REST APIs
       ↓
Database Seeding
       ↓
Frontend Architecture
       ↓
Core Learning UI
       ↓
Gamification
       ↓
Dynamic Quests & Achievements
       ↓
Responsive UI
       ↓
End-to-End Testing