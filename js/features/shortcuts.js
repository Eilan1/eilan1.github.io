document.addEventListener("keydown", e=>{

  if(e.ctrlKey && e.key === "1"){
    setTab("dashboard");
  }

  if(e.ctrlKey && e.key === "2"){
    setTab("stats");
  }

  if(e.ctrlKey && e.key === "3"){
    setTab("analytics");
  }

  if(e.ctrlKey && e.key === "4"){
    setTab("settings");
  }
});
