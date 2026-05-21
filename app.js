let activeTab = "dashboard";

const state = {
  habits: [],
  xp: 0,
  level: 1
};

function save(){
  localStorage.setItem("projectx", JSON.stringify(state));
}

function load(){
  const data = localStorage.getItem("projectx");

  if(data){
    Object.assign(state, JSON.parse(data));
  }
}

function setTab(tab){
  activeTab = tab;
  render();
}

/* SAFE FALLBACKS */

window.renderXP = window.renderXP || function(){};
window.renderHeatmap = window.renderHeatmap || function(){};
window.renderCharts = window.renderCharts || function(){};
window.renderInsights = window.renderInsights || function(){};

function render(){

  const main = document.getElementById("main-content");

  if(!main) return;

  /* DASHBOARD */

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

    if(window.renderXP){
      renderXP();
    }

    if(window.renderHeatmap){
      renderHeatmap();
    }
  }

  /* STATS */

  if(activeTab === "stats"){

    main.innerHTML = `
      <div class="card">
        <h1>Stats</h1>

        <canvas id="statsChart"></canvas>
      </div>
    `;

    if(window.renderCharts){
      renderCharts();
    }
  }

  /* ANALYTICS */

  if(activeTab === "analytics"){

    main.innerHTML = `
      <div class="card">
        <h1>AI Insights</h1>

        <div id="insights"></div>
      </div>
    `;

    if(window.renderInsights){
      renderInsights();
    }
  }

  /* SETTINGS */

  if(activeTab === "settings"){

    main.innerHTML = `
      <div class="card">
        <h1>Settings</h1>

        <button onclick="toggleCyberpunk()">
          Toggle Cyberpunk
        </button>

        <br><br>

        <button onclick="toggleFocusMode()">
          Focus Mode
        </button>
      </div>
    `;
  }
}

/* ADD HABIT */

function addHabit(){

  const name = prompt("Habit name");

  if(!name) return;

  state.habits.push({
    id: Date.now(),
    name,
    done:false
  });

  if(window.gainXP){
    gainXP(25);
  }

  save();
  render();
}

/* RENDER HABITS */

function renderHabits(){

  const container = document.getElementById("habits");

  if(!container) return;

  container.innerHTML = state.habits.map(h=>`
    <div class="card">
      ${h.name}
    </div>
  `).join("");
}

/* STARTUP */

load();

window.APP = state;
globalThis.APP = state;

render();

/* SERVICE WORKER */

if("serviceWorker" in navigator){

  navigator.serviceWorker
    .register("./sw.js")
    .catch(err=>{
      console.log("SW FAILED", err);
    });

}
