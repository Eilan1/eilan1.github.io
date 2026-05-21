const palette = document.getElementById("command-palette");

document.addEventListener("keydown", e=>{

  if(e.ctrlKey && e.key === "k"){
    e.preventDefault();
    palette.classList.toggle("hidden");
  }
});
