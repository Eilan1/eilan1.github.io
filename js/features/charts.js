function renderCharts(){

  const ctx = document.getElementById("statsChart");

  if(!ctx) return;

  new Chart(ctx,{
    type:"line",
    data:{
      labels:["Mon","Tue","Wed","Thu","Fri"],
      datasets:[{
        label:"Productivity",
        data:[3,7,5,9,10]
      }]
    }
  });
}
