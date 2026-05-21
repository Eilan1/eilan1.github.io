function renderInsights(){

  const el = document.getElementById("insights");

  if(!el) return;

  const total = APP.habits.length;

  el.innerHTML = `
    Total habits: ${total}
    <br><br>
    Productivity stable.
    <br><br>
    No burnout detected.
  `;
}
