/* Habit it! — main app logic (app.html) */

const STORAGE_KEY = "habitit";
const LEGACY_KEY = "projectx";

let activeTab = "dashboard";

const state = {
  habits: [],
  xp: 0,
  level: 1,
  theme: "dark",
  cyberpunk: false,
  focusMode: false,
  sounds: true,
  confirmDelete: true
};

window.APP = state;
globalThis.APP = state;

/* ---------------- SAVE / LOAD ---------------- */

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function load() {
  let raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) raw = localStorage.getItem(LEGACY_KEY);
  if (!raw) return;
  try {
    Object.assign(state, JSON.parse(raw));
  } catch {
    /* ignore corrupt data */
  }
  applyTheme();
  applyFocusMode();
  applyCyberpunk();
}

/* ---------------- THEME & MODES ---------------- */

function applyTheme() {
  document.body.classList.toggle("light", state.theme === "light");
  document.body.classList.toggle("dark", state.theme !== "light");
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.content = state.theme === "light" ? "#f4f6fb" : "#070b14";
}

function applyCyberpunk() {
  document.body.classList.toggle("cyberpunk", state.cyberpunk);
}

function applyFocusMode() {
  document.body.classList.toggle("focus", state.focusMode);
}

function setTheme(value) {
  state.theme = value;
  applyTheme();
  save();
  syncSettingsToggles();
}

function setCyberpunk(on) {
  state.cyberpunk = on;
  applyCyberpunk();
  save();
  syncSettingsToggles();
}

function setFocusMode(on) {
  state.focusMode = on;
  applyFocusMode();
  save();
  syncSettingsToggles();
}

function setSounds(on) {
  state.sounds = on;
  save();
  syncSettingsToggles();
}

function setConfirmDelete(on) {
  state.confirmDelete = on;
  save();
  syncSettingsToggles();
}

/* ---------------- SETTINGS PANEL ---------------- */

function openSettings() {
  const panel = document.getElementById("settings-panel");
  const backdrop = document.getElementById("settings-backdrop");
  if (!panel || !backdrop) return;
  renderSettingsPanel();
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  backdrop.hidden = false;
  requestAnimationFrame(() => backdrop.classList.add("visible"));
}

function closeSettings() {
  const panel = document.getElementById("settings-panel");
  const backdrop = document.getElementById("settings-backdrop");
  if (!panel || !backdrop) return;
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  backdrop.classList.remove("visible");
  setTimeout(() => { backdrop.hidden = true; }, 200);
}

function toggleRow(id, label, desc, checked, onChange) {
  return `
    <div class="setting-row">
      <div class="setting-label">
        <span>${label}</span>
        ${desc ? `<small>${desc}</small>` : ""}
      </div>
      <label class="toggle" for="${id}">
        <input type="checkbox" id="${id}" ${checked ? "checked" : ""}>
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
      </label>
    </div>
  `;
}

function renderSettingsPanel() {
  const body = document.getElementById("settings-body");
  if (!body) return;

  body.innerHTML = `
    ${toggleRow("toggle-light", "Light theme", "Bright, clean interface", state.theme === "light", null)}
    ${toggleRow("toggle-cyber", "Cyberpunk mode", "Neon grid & scanlines", state.cyberpunk, null)}
    ${toggleRow("toggle-focus", "Focus mode", "Hide distractions", state.focusMode, null)}
    ${toggleRow("toggle-sounds", "Sound effects", "UI feedback sounds", state.sounds, null)}
    ${toggleRow("toggle-confirm", "Confirm delete", "Ask before removing habits", state.confirmDelete, null)}
    <div class="setting-row setting-meta">
      <span>Level ${state.level}</span>
      <span>${state.xp} XP</span>
    </div>
  `;

  bindToggle("toggle-light", (on) => setTheme(on ? "light" : "dark"));
  bindToggle("toggle-cyber", setCyberpunk);
  bindToggle("toggle-focus", setFocusMode);
  bindToggle("toggle-sounds", setSounds);
  bindToggle("toggle-confirm", setConfirmDelete);
}

function bindToggle(id, handler) {
  const el = document.getElementById(id);
  if (!el) return;
  el.onchange = () => handler(el.checked);
}

function syncSettingsToggles() {
  const map = {
    "toggle-light": state.theme === "light",
    "toggle-cyber": state.cyberpunk,
    "toggle-focus": state.focusMode,
    "toggle-sounds": state.sounds,
    "toggle-confirm": state.confirmDelete
  };
  for (const [id, on] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el && el.checked !== on) el.checked = on;
  }
}

/* ---------------- XP ---------------- */

function gainXP(amount) {
  state.xp += amount;
  while (state.xp >= state.level * 100) {
    state.xp -= state.level * 100;
    state.level++;
  }
  save();
}

function renderXP() {
  const bar = document.getElementById("xp-bar");
  if (!bar) return;
  const needed = state.level * 100;
  const percent = Math.min(100, (state.xp / needed) * 100);
  bar.innerHTML = `
    <div class="card xp-card">
      <div class="xp-header">
        <h2>Level ${state.level}</h2>
        <span class="xp-badge">${state.xp} / ${needed} XP</span>
      </div>
      <div class="xp-track">
        <div class="xp-fill" style="width:${percent}%"></div>
      </div>
    </div>
  `;
}

/* ---------------- TABS ---------------- */

const TABS = [
  { id: "dashboard", label: "Today" },
  { id: "stats", label: "Stats" },
  { id: "analytics", label: "Insights" }
];

function setTab(tab) {
  activeTab = tab;
  renderNav();
  render();
}

function renderNav() {
  const nav = document.getElementById("nav");
  if (!nav) return;
  nav.innerHTML = TABS.map((t) => `
    <button type="button" class="${activeTab === t.id ? "active" : ""}" data-tab="${t.id}">
      ${t.label}
    </button>
  `).join("");
  nav.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.onclick = () => setTab(btn.dataset.tab);
  });
}

/* ---------------- HABITS ---------------- */

function addHabit() {
  const name = prompt("Habit name");
  if (!name || !name.trim()) return;
  state.habits.push({
    id: Date.now(),
    name: name.trim(),
    done: false
  });
  gainXP(25);
  save();
  render();
}

function markHabitDone(id) {
  const habit = state.habits.find((h) => h.id === id);
  if (!habit || habit.done) return;
  habit.done = true;
  gainXP(10);
  save();
  renderHabits();
  renderInsightsIfVisible();
}

function markHabitUndone(id) {
  const habit = state.habits.find((h) => h.id === id);
  if (!habit || !habit.done) return;
  habit.done = false;
  save();
  renderHabits();
  renderInsightsIfVisible();
}

function deleteHabit(id) {
  const habit = state.habits.find((h) => h.id === id);
  if (!habit) return;
  if (state.confirmDelete && !confirm(`Delete "${habit.name}"?`)) return;
  state.habits = state.habits.filter((h) => h.id !== id);
  save();
  render();
}

function renderHabits() {
  const container = document.getElementById("habits");
  if (!container) return;

  if (state.habits.length === 0) {
    container.innerHTML = `
      <div class="card empty-habits">
        <p>No habits yet. Add one to get started.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.habits.map((h) => `
    <div class="habit-wrap" data-id="${h.id}">
      <div class="habit-bg-left"><span>Done</span></div>
      <div class="habit-bg-right"><span>Undo</span></div>
      <div class="habit-card ${h.done ? "done" : ""}" data-habit-id="${h.id}">
        <div class="habit-left">
          <div class="habit-check"></div>
          <div class="habit-info">
            <h3>${escapeHtml(h.name)}</h3>
            <p>${h.done ? "Completed today" : "Swipe left to complete"}</p>
          </div>
        </div>
        <button type="button" class="btn-ghost" data-delete="${h.id}" aria-label="Delete habit">✕</button>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".habit-card").forEach(bindSwipe);
  container.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      deleteHabit(Number(btn.dataset.delete));
    };
  });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* Swipe: left = done, right = undo */
function bindSwipe(card) {
  const wrap = card.closest(".habit-wrap");
  const id = Number(card.dataset.habitId);
  let startX = 0;
  let currentX = 0;
  let dragging = false;

  const threshold = 72;
  const maxDrag = 120;

  function setOffset(x) {
    const clamped = Math.max(-maxDrag, Math.min(maxDrag, x));
    card.style.transform = `translateX(${clamped}px)`;
    wrap.classList.toggle("swipe-left-hint", clamped < -24);
    wrap.classList.toggle("swipe-right-hint", clamped > 24);
  }

  function reset(snapBack = true) {
    if (snapBack) {
      card.style.transition = "transform 0.2s cubic-bezier(0.34, 1.2, 0.64, 1)";
      card.style.transform = "";
      setTimeout(() => { card.style.transition = ""; }, 200);
    }
    wrap.classList.remove("swipe-left-hint", "swipe-right-hint");
    dragging = false;
  }

  function onStart(clientX) {
    dragging = true;
    startX = clientX;
    currentX = 0;
    card.style.transition = "none";
  }

  function onMove(clientX) {
    if (!dragging) return;
    currentX = clientX - startX;
    setOffset(currentX);
  }

  function onEnd() {
    if (!dragging) return;
    if (currentX <= -threshold) {
      card.style.transform = "translateX(-100%)";
      card.style.opacity = "0";
      setTimeout(() => {
        markHabitDone(id);
        card.style.opacity = "";
        card.style.transform = "";
      }, 180);
    } else if (currentX >= threshold) {
      card.style.transform = "translateX(100%)";
      card.style.opacity = "0";
      setTimeout(() => {
        markHabitUndone(id);
        card.style.opacity = "";
        card.style.transform = "";
      }, 180);
    } else {
      reset(true);
    }
    dragging = false;
  }

  card.addEventListener("pointerdown", (e) => {
    if (e.target.closest("[data-delete]")) return;
    card.setPointerCapture(e.pointerId);
    onStart(e.clientX);
  });
  card.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    onMove(e.clientX);
  });
  card.addEventListener("pointerup", onEnd);
  card.addEventListener("pointercancel", () => reset(true));
}

/* ---------------- HEATMAP / CHARTS / INSIGHTS ---------------- */

function renderHeatmap() {
  const heatmap = document.getElementById("heatmap");
  if (!heatmap) return;
  const doneCount = state.habits.filter((h) => h.done).length;
  const ratio = state.habits.length ? doneCount / state.habits.length : 0;
  let cells = "";
  for (let i = 0; i < 56; i++) {
    const intensity = i / 56 < ratio ? 0.35 + ratio * 0.65 : 0.08 + Math.random() * 0.12;
    cells += `<div class="heat-cell" style="opacity:${intensity}"></div>`;
  }
  heatmap.innerHTML = `
    <div class="card">
      <h2>Activity</h2>
      <div class="heat-grid">${cells}</div>
    </div>
  `;
}

function renderCharts() {
  const canvas = document.getElementById("statsChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.parentElement?.clientWidth || 400;
  canvas.width = w * dpr;
  canvas.height = 220 * dpr;
  canvas.style.width = `${w}px`;
  canvas.style.height = "220px";
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, 220);
  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#7c5cff";
  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  const points = [30, 90, 55, 130, 100, 175, 150];
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = 24 + i * ((w - 48) / (points.length - 1));
    const y = 200 - p;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function renderInsights() {
  const insights = document.getElementById("insights");
  if (!insights) return;
  const total = state.habits.length;
  const completed = state.habits.filter((h) => h.done).length;
  let text = "Add habits and swipe left when you finish one.";
  if (total > 0 && completed === total) text = "Perfect day — every habit completed.";
  else if (completed === 0 && total > 0) text = "Nothing done yet. Swipe left on a habit to mark it complete.";
  else if (completed > 0) text = `${completed} of ${total} habits done today. Keep going.`;
  insights.innerHTML = `
    <div class="card insight-card">
      <h2>Today's insight</h2>
      <p>${text}</p>
    </div>
  `;
}

function renderInsightsIfVisible() {
  if (activeTab === "analytics") renderInsights();
}

/* ---------------- MAIN RENDER ---------------- */

function render() {
  const main = document.getElementById("main-content");
  if (!main) return;

  if (activeTab === "dashboard") {
    main.innerHTML = `
      <div class="page-header card">
        <div>
          <h1>Today</h1>
          <p class="muted">Swipe <strong>left</strong> to complete · <strong>right</strong> to undo</p>
        </div>
        <button type="button" class="btn-primary" onclick="addHabit()">+ Habit</button>
      </div>
      <div id="xp-bar"></div>
      <div id="habits"></div>
      <div id="heatmap"></div>
    `;
    renderHabits();
    renderXP();
    renderHeatmap();
  }

  if (activeTab === "stats") {
    main.innerHTML = `
      <div class="card">
        <h1>Stats</h1>
        <p class="muted">Completion trend</p>
        <canvas id="statsChart"></canvas>
      </div>
    `;
    requestAnimationFrame(renderCharts);
  }

  if (activeTab === "analytics") {
    main.innerHTML = `<div id="insights"></div>`;
    renderInsights();
  }
}

/* ---------------- STARTUP ---------------- */

window.addEventListener("load", () => {
  load();
  renderNav();
  render();

  document.getElementById("open-settings")?.addEventListener("click", openSettings);
  document.getElementById("close-settings")?.addEventListener("click", closeSettings);
  document.getElementById("settings-backdrop")?.addEventListener("click", closeSettings);

  const loader = document.getElementById("loading-screen");
  if (loader) {
    setTimeout(() => {
      loader.classList.add("hide");
      setTimeout(() => loader.remove(), 400);
    }, 900);
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(console.error);
}
