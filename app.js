// State Management
let habits = JSON.parse(localStorage.getItem('x_habits')) || [];
let currentFilter = 'all';

// DOM Elements
const habitsContainer = document.getElementById('habits-container');
const habitModal = document.getElementById('habit-modal');
const openModalBtn = document.getElementById('open-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');
const saveHabitBtn = document.getElementById('save-habit-btn');
const themeToggle = document.getElementById('theme-toggle');

// Form Inputs
const nameInput = document.getElementById('habit-name-input');
const categoryInput = document.getElementById('habit-category-input');
const difficultyInput = document.getElementById('habit-difficulty-input');

// App Initialization
function init() {
  renderHabits();
  updateStats();
  startClock();
  setupEventListeners();
}

// Render Core View
function renderHabits() {
  const filtered = habits.filter(h => currentFilter === 'all' || h.category === currentFilter);
  
  if (filtered.length === 0) {
    habitsContainer.innerHTML = `<div class="empty-state">No habits found in this section.</div>`;
    return;
  }

  habitsContainer.innerHTML = filtered.map(habit => {
    let stateClass = '';
    let statusIcon = '<i class="ti ti-circle"></i>';
    if (habit.status === 'done') {
      stateClass = 'state-done';
      statusIcon = '<i class="ti ti-circle-check-filled"></i>';
    } else if (habit.status === 'missed') {
      stateClass = 'state-missed';
      statusIcon = '<i class="ti ti-circle-x-filled"></i>';
    }

    const diffDots = Array.from({length: 3}, (_, i) => 
      `<div class="difficulty-dot ${i < habit.difficulty ? 'active' : ''}"></div>`
    ).join('');

    return `
      <div class="habit-wrap" data-id="${habit.id}">
        <div class="habit-action-done"><i class="ti ti-check"></i> Complete</div>
        <div class="habit-action-miss">Miss <i class="ti ti-x"></i></div>
        
        <div class="habit-item ${stateClass}">
          <div class="habit-left" onclick="cycleStatus('${habit.id}')">
            <div class="status-icon">${statusIcon}</div>
            <div class="habit-info">
              <div class="habit-name">${escapeHTML(habit.name)}</div>
              <div class="habit-meta">
                <span class="habit-category">${habit.category}</span>
                <span class="habit-difficulty">${diffDots}</span>
              </div>
            </div>
          </div>
          <div class="habit-right">
            <span class="streak-badge ${habit.streak > 2 ? 'hot' : 'cold'}">
              <i class="ti ti-flame"></i> ${habit.streak}d
            </span>
            <button class="delete-btn" onclick="deleteHabit('${habit.id}')">
              <i class="ti ti-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Logic Rules
function cycleStatus(id) {
  const habit = habits.find(h => h.id === id);
  if (!habit) return;

  if (habit.status === 'none') {
    habit.status = 'done';
    habit.streak += 1;
  } else if (habit.status === 'done') {
    habit.status = 'missed';
    habit.streak = 0;
  } else {
    habit.status = 'none';
  }

  saveAndSync();
}

// Global actions tied to scope
window.cycleStatus = cycleStatus;
window.deleteHabit = deleteHabit;

function deleteHabit(id) {
  habits = habits.filter(h => h.id !== id);
  saveAndSync();
}

function updateStats() {
  const total = habits.length;
  const doneCount = habits.filter(h => h.status === 'done').length;
  const rate = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const maxStreak = habits.length > 0 ? Math.max(...habits.map(h => h.streak), 0) : 0;

  document.getElementById('stat-active').innerText = total;
  document.getElementById('stat-rate').innerText = `${rate}%`;
  document.getElementById('progress-rate').style.width = `${rate}%`;
  document.getElementById('stat-streak').innerHTML = `${maxStreak}<span class="stat-sub">days</span>`;
}

function saveAndSync() {
  localStorage.setItem('x_habits', JSON.stringify(habits));
  renderHabits();
  updateStats();
}

// Event Binder
function setupEventListeners() {
  openModalBtn.addEventListener('click', () => habitModal.classList.add('open'));
  closeModalBtn.addEventListener('click', () => habitModal.classList.remove('open'));
  
  saveHabitBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) return alert('Please enter a habit name.');

    habits.push({
      id: Date.now().toString(),
      name: name,
      category: categoryInput.value,
      difficulty: parseInt(difficultyInput.value),
      status: 'none',
      streak: 0
    });

    nameInput.value = '';
    habitModal.classList.remove('open');
    saveAndSync();
  });

  // Filter System
  document.getElementById('category-filter-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('category-pill')) {
      document.querySelectorAll('.category-pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.category;
      renderHabits();
    }
  });

  // Theme Core
  const themes = ['theme-purple', 'theme-blue', 'theme-green', 'theme-red', 'theme-orange'];
  let currentThemeIndex = 0;
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    document.body.classList.remove(themes[currentThemeIndex]);
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.classList.add(themes[currentThemeIndex]);
  });
}

// Utilities
function startClock() {
  setInterval(() => {
    const now = new Date();
    document.getElementById('live-clock').innerText = now.toLocaleTimeString('en-US');
  }, 1000);
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

init();
