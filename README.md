# Alias - Purim Edition 🎭

A browser-based Alias party game for adults, themed for Purim.

> **עברית?** ההסבר בעברית נמצא בהמשך העמוד.

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

- React 19 + Vite + TypeScript
- Zustand (state management)
- Tailwind CSS v4
- Web Audio API (sounds)

## Contributing

Contributions are welcome! To get started:

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/alias-game.git
   cd alias-game
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create a branch** for your feature or fix:
   ```bash
   git checkout -b feature/my-feature
   ```
5. **Make your changes** and verify they work:
   ```bash
   npm run lint
   npm run build
   ```
6. **Commit** with a clear message and **push** your branch:
   ```bash
   git commit -m "Add my feature"
   git push origin feature/my-feature
   ```
7. **Open a Pull Request** against the `main` branch

### Guidelines

- Keep PRs focused on a single change
- Follow the existing code style
- Make sure `npm run lint` and `npm run build` pass before submitting
- New cards can be added via the in-app card management or by editing the cards JSON

---

<div dir="rtl">

# אליאס - מהדורת פורים 🎭

משחק אליאס מבוסס דפדפן למסיבות פורים למבוגרים.

## התקנה

<div dir="ltr">

```bash
npm install
npm run dev
```

</div>

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

- React 19 + Vite + TypeScript
- Zustand (ניהול state)
- Tailwind CSS v4
- Web Audio API (צלילים)

</div>
