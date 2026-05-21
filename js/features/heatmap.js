function renderHeatmap(){

  const el = document.getElementById("heatmap");

  if(!el) return;

  let html = `<div class="card"><h2>Heatmap</h2>`;

  for(let i=0;i<60;i++){

    const opacity = Math.random();

    html += `
      <div style="
      width:14px;
      height:14px;
      display:inline-block;
      margin:2px;
      background:rgba(0,255,150,${opacity});
      "></div>
    `;
  }

  html += "</div>";

  el.innerHTML = html;
}
