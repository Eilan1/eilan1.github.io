function toggleFocusMode(){

  document.body.classList.toggle("focus-mode");

  if(document.body.classList.contains("focus-mode")){
    document.querySelector(".sidebar").style.display = "none";
  }else{
    document.querySelector(".sidebar").style.display = "flex";
  }
}
