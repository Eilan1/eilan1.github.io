window.addEventListener("load", () => {

  const loader = document.getElementById("loading-screen");

  if (!loader) return;

  setTimeout(() => {
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.remove();
    }, 500);

  }, 1200);

});
