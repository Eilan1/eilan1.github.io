const particles = document.getElementById("particles");

for(let i=0;i<80;i++){

  const p = document.createElement("div");

  p.style.position = "absolute";
  p.style.width = "2px";
  p.style.height = "2px";
  p.style.background = "white";
  p.style.left = Math.random()*100+"%";
  p.style.top = Math.random()*100+"%";
  p.style.opacity = Math.random();

  particles.appendChild(p);
}
