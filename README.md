[README.md](https://github.com/user-attachments/files/28105488/README.md)
# Habit it!

A lightweight habit tracker that runs entirely in your browser. Swipe habits complete, level up with XP, and tune the UI with light/dark themes, focus mode, and optional cyberpunk styling — no account, no backend.

## Live links

| Page | URL |
|------|-----|
| **App** | [eilan1.github.io/app.html](https://eilan1.github.io/app.html) |
| **Landing** | [eilan1.github.io](https://eilan1.github.io/) |

## Features (current)

- **Habit list** — Add habits by name, mark complete, delete (optional confirm)
- **Swipe gestures** — Swipe **left** to complete · swipe **right** to undo
- **XP & levels** — Earn XP when you add and complete habits
- **Today dashboard** — Habits, XP bar, and activity heatmap
- **Stats** — Simple completion trend chart
- **Insights** — Short daily summary based on today’s progress
- **Settings panel** — Slider-style toggles (not buttons):
  - Light / dark theme
  - Cyberpunk mode
  - Focus mode (dims non-essential UI)
  - Sound effects toggle *(UI only — no audio yet)*
  - Confirm before delete
- **Offline** — Works without internet; data stays in your browser
- **PWA-ready** — `manifest.json` + service worker for caching

## Quick start

1. Open [app.html](https://eilan1.github.io/app.html) (or run locally — see below).
2. Tap **+ Habit** and enter a name.
3. Swipe a habit **left** when you finish it; swipe **right** to undo.
4. Open **⚙ Settings** for theme and other toggles.
5. Use **Stats** and **Insights** tabs for charts and today’s message.

## How to use

### Adding a habit

1. Go to the **Today** tab.
2. Click **+ Habit**.
3. Enter a name in the prompt and confirm.

### Completing / undoing

| Gesture | Action |
|---------|--------|
| Swipe **left** | Mark habit **done** (+10 XP) |
| Swipe **right** | **Undo** completion |
| **✕** button | Delete habit (confirmation depends on settings) |

### Navigation

| Tab | What it shows |
|-----|----------------|
| **Today** | Habits, XP, activity heatmap |
| **Stats** | Trend chart |
| **Insights** | Text summary for today |

### Settings (⚙)

Open the gear button in the sidebar. All options use **toggle sliders**:

- **Light theme** — Switches between dark (default) and light UI
- **Cyberpunk mode** — Grid background and neon accent styling
- **Focus mode** — Lowers distraction from secondary panels
- **Sound effects** — Preference saved; sounds not implemented yet
- **Confirm delete** — Ask before removing a habit

## Data storage

- Saved in **localStorage** under the key `habitit`
- Older data from **Project X** (`projectx` key) is imported automatically on first load
- Stays on your device only — nothing is sent to a server
- Clearing site data in the browser removes your habits and progress

There is **no export/import UI** in this version yet.

## Local development

```bash
git clone https://github.com/Eilan1/eilan1.github.io.git
cd eilan1.github.io
python3 -m http.server 8080
```

Then open `http://localhost:8080/app.html`.

## Project structure

| File | Role |
|------|------|
| `index.html` | Marketing / landing page |
| `app.html` | Main app shell |
| `app.js` | App logic (habits, swipe, settings, XP) |
| `style.css` | App styles (themes, toggles, layout) |
| `manifest.json` | PWA metadata |
| `sw.js` | Offline cache |
| `js/features/*.js` | Legacy modules — **not loaded** by the current app |

## Deploy

Pushes to `main` deploy via GitHub Actions (`.github/workflows/deploy.yml`) to GitHub Pages.

## Not in this version (yet)

These appear in older docs or other trackers but are **not** implemented in **Habit it!** today:

- Daily automatic reset
- Streaks and achievements
- Categories, difficulty, notes, reminders
- Edit habit (rename) in UI
- JSON export / import
- Custom accent color picker
- Real historical analytics (chart/heatmap use today or demo data)

If you still use the fuller tracker, it may live separately (e.g. `habitstracker-v3.html` on the same GitHub Pages site).

## Tech stack

- HTML5, CSS3, vanilla JavaScript
- No frameworks or npm dependencies
- GitHub Pages + Actions

## License

MIT — see [LICENSE](LICENSE).

## Author

[Eilan1](https://github.com/Eilan1)

---

**Habit it!** — swipe, level up, stay consistent.
