console.log("Performance optimizer loaded");

window.addEventListener("visibilitychange",()=>{

  if(document.hidden){
    console.log("Low power mode");
  }else{
    console.log("Performance restored");
  }

});
