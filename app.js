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

function render(){

  const main = document.getElementById("main-content");

  if(activeTab === "dashboard"){

    main.innerHTML = `
      <div class="card">
        <h1>Dashboard</h1>
        <button onclick="addHabit()">Add Habit</button>
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

function addHabit(){

  const name = prompt("Habit name");

  if(!name) return;

  state.habits.push({
    id:Date.now(),
    name,
    done:false
  });

  gainXP(25);

  save();
  render();
}

function renderHabits(){

  const container = document.getElementById("habits");

  container.innerHTML = state.habits.map(h=>`
    <div class="card">
      ${h.name}
    </div>
  `).join("");
}

load();
render();

window.APP = state;

if("serviceWorker" in navigator){
  navigator.serviceWorker.register("./sw.js");
}
