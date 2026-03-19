# אליאס - מהדורת פורים 🎭

משחק אליאס מבוסס דפדפן למסיבות פורים למבוגרים.

## התקנה

```bash
npm install
npm run dev
```

## משחק

- **דף הבית** - התחלת משחק, איפוס, גישה לניהול קלפים
- **הגדרת קבוצות** - שמות קבוצות וזמן לסיבוב
- **לוח המשחק** - קלף, טיימר, נכון/דלג, ניקוד
- **סיבוב גניבה** - אחרי כל תור, שתי הקבוצות יכולות לגנוב נקודה
- **מסך סיום** - תוצאות סופיות והיסטוריית תורות

## חוקים

- נכון = +1 נקודה
- דילוג = -1 נקודה
- "משחק חדש" - מאפס ניקוד אבל לא קלפים
- "איפוס מלא" - מחזיר את כל 100 הקלפים

## ניהול קלפים

- הוספה/עריכה/מחיקה של קלפים
- ייצוא/ייבוא JSON

## טכנולוגיות

- React 18 + Vite + TypeScript
- Zustand (state management)
- Tailwind CSS v4
- Web Audio API (צלילים)

---

# Alias - Purim Edition 🎭

A browser-based Alias party game for adults, themed for Purim.

## Installation

```bash
npm install
npm run dev
```

## Gameplay

- **Home Page** - Start a game, reset, access card management
- **Team Setup** - Team names and round timer duration
- **Game Board** - Card, timer, correct/skip, scoring
- **Steal Round** - After each turn, both teams can steal a point
- **End Screen** - Final results and turn history

## Rules

- Correct = +1 point
- Skip = -1 point
- "New Game" - Resets scores but not cards
- "Full Reset" - Restores all 100 cards

## Card Management

- Add/edit/delete cards
- Export/import JSON

## Tech Stack

- React 18 + Vite + TypeScript
- Zustand (state management)
- Tailwind CSS v4
- Web Audio API (sounds)
