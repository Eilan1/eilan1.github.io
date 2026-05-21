function gainXP(amount){

  APP.xp += amount;

  const nextLevel = APP.level * 100;

  if(APP.xp >= nextLevel){
    APP.level++;
    APP.xp = 0;
  }

  save();
  renderXP();
}

function renderXP(){

  const el = document.getElementById("xp-bar");

  if(!el) return;

  el.innerHTML = `
    <div class="card">
      LEVEL ${APP.level}
      <br><br>
      XP: ${APP.xp}/${APP.level*100}
    </div>
  `;
}
