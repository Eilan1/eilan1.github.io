let activeTab = "dashboard";

const state = {
  habits: [],
  xp: 0,
  level: 1,
  cyberpunk: false,
  focusMode: false
};

window.APP = state;
globalThis.APP = state;

/* ---------------- SAVE / LOAD ---------------- */

function save(){
  localStorage.setItem("projectx", JSON.stringify(state));
}

function load(){
  const data = localStorage.getItem("projectx");

  if(data){
    Object.assign(state, JSON.parse(data));
  }
}

/* ---------------- SAFE FALLBACKS ---------------- */

window.renderXP = window.renderXP || function(){};
window.renderHeatmap = window.renderHeatmap || function(){};
window.renderCharts = window.renderCharts || function(){};
window.renderInsights = window.renderInsights || function(){};

/* ---------------- XP SYSTEM ---------------- */

function gainXP(amount){

  state.xp += amount;

  while(state.xp >= state.level * 100){
    state.xp -= state.level * 100;
    state.level++;
  }

  save();
}

function renderXP(){

  const bar = document.getElementById("xp-bar");

  if(!bar) return;

  const needed = state.level * 100;
  const percent = (state.xp / needed) * 100;

  bar.innerHTML = `
    <div class="card">
      <h2>Level ${state.level}</h2>

      <div style="
        width:100%;
        height:20px;
        background:#111;
        border-radius:10px;
        overflow:hidden;
        margin-top:10px;
      ">
        <div style="
          width:${percent}%;
          height:100%;
          background:cyan;
          transition:0.3s;
        "></div>
      </div>

      <p>${state.xp} / ${needed} XP</p>
    </div>
  `;
}

/* ---------------- FEATURES ---------------- */

function toggleCyberpunk(){

  state.cyberpunk = !state.cyberpunk;

  document.body.classList.toggle(
    "cyberpunk",
    state.cyberpunk
  );

  save();
}

function toggleFocusMode(){

  state.focusMode = !state.focusMode;

  document.body.classList.toggle(
    "focus",
    state.focusMode
  );

  save();
}

/* ---------------- TABS ---------------- */

function setTab(tab){
  activeTab = tab;
  render();
}

/* ---------------- HABITS ---------------- */

function addHabit(){

  const name = prompt("Habit name");

  if(!name) return;

  state.habits.push({
    id: Date.now(),
    name,
    done: false
  });

  gainXP(25);

  save();
  render();
}

function toggleHabit(id){

  const habit = state.habits.find(h => h.id === id);

  if(!habit) return;

  habit.done = !habit.done;

  if(habit.done){
    gainXP(10);
  }

  save();
  render();
}

function deleteHabit(id){

  state.habits = state.habits.filter(
    h => h.id !== id
  );

  save();
  render();
}

function renderHabits(){

  const container = document.getElementById("habits");

  if(!container) return;

  container.innerHTML = state.habits.map(h => `
    <div class="card habit-card">

      <div>
        <h3>${h.name}</h3>

        <p>
          ${h.done ? "DONE" : "PENDING"}
        </p>
      </div>

      <div style="display:flex;gap:10px;">

        <button onclick="toggleHabit(${h.id})">
          ${h.done ? "Undo" : "Done"}
        </button>

        <button onclick="deleteHabit(${h.id})">
          Delete
        </button>

      </div>

    </div>
  `).join("");
}

/* ---------------- HEATMAP ---------------- */

function renderHeatmap(){

  const heatmap = document.getElementById("heatmap");

  if(!heatmap) return;

  let cells = "";

  for(let i = 0; i < 60; i++){

    const intensity = Math.random();

    cells += `
      <div style="
        width:14px;
        height:14px;
        border-radius:3px;
        background:rgba(0,255,255,${intensity});
      "></div>
    `;
  }

  heatmap.innerHTML = `
    <div class="card">
      <h2>Heatmap</h2>

      <div style="
        display:grid;
        grid-template-columns:repeat(10,14px);
        gap:4px;
        margin-top:10px;
      ">
        ${cells}
      </div>
    </div>
  `;
}

/* ---------------- CHARTS ---------------- */

function renderCharts(){

  const canvas = document.getElementById("statsChart");

  if(!canvas) return;

  const ctx = canvas.getContext("2d");

  canvas.width = 600;
  canvas.height = 300;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  ctx.strokeStyle = "cyan";
  ctx.lineWidth = 3;

  ctx.beginPath();

  const points = [20,80,50,140,100,200,180];

  points.forEach((p,i)=>{

    const x = i * 90;
    const y = 260 - p;

    if(i === 0){
      ctx.moveTo(x,y);
    }else{
      ctx.lineTo(x,y);
    }
  });

  ctx.stroke();
}

/* ---------------- INSIGHTS ---------------- */

function renderInsights(){

  const insights = document.getElementById("insights");

  if(!insights) return;

  const completed = state.habits.filter(
    h => h.done
  ).length;

  let text = "You are doing decent.";

  if(completed === state.habits.length && completed > 0){
    text = "Perfect streak today.";
  }

  if(completed === 0){
    text = "You are slacking today.";
  }

  insights.innerHTML = `
    <div class="card">
      <h2>Productivity Analysis</h2>
      <p>${text}</p>
    </div>
  `;
}

/* ---------------- MAIN RENDER ---------------- */

function render(){

  const main = document.getElementById(
    "main-content"
  );

  if(!main) return;

  if(activeTab === "dashboard"){

    main.innerHTML = `
      <div class="card">
        <h1>Dashboard</h1>

        <button onclick="addHabit()">
          Add Habit
        </button>
      </div>

      <div id="xp-bar"></div>

      <div id="habits"></div>

      <div id="heatmap"></div>
    `;

    renderHabits();
    renderXP();
    renderHeatmap();
  }

  if(activeTab === "stats"){

    main.innerHTML = `
      <div class="card">
        <h1>Stats</h1>

        <canvas id="statsChart"></canvas>
      </div>
    `;

    renderCharts();
  }

  if(activeTab === "analytics"){

    main.innerHTML = `
      <div class="card">
        <h1>AI Insights</h1>

        <div id="insights"></div>
      </div>
    `;

    renderInsights();
  }

  if(activeTab === "settings"){

    main.innerHTML = `
      <div class="card">
        <h1>Settings</h1>

        <button onclick="toggleCyberpunk()">
          Toggle Cyberpunk
        </button>

        <button onclick="toggleFocusMode()">
          Focus Mode
        </button>
      </div>
    `;
  }
}

/* ---------------- STARTUP ---------------- */

window.addEventListener("load", ()=>{

  load();

  render();

  const loader = document.getElementById(
    "loading-screen"
  );

  if(loader){

    setTimeout(()=>{

      loader.style.opacity = "0";

      setTimeout(()=>{
        loader.remove();
      },500);

    },1200);
  }
});

/* ---------------- PWA ---------------- */

if("serviceWorker" in navigator){

  navigator.serviceWorker.register("./sw.js")
    .catch(console.error);
}
