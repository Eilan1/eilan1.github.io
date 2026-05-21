/* Landing page mobile menu — index.html */
(function () {
  const btn = document.getElementById("lp-menu-btn");
  const drawer = document.getElementById("lp-drawer");
  const backdrop = document.getElementById("lp-drawer-backdrop");
  if (!btn || !drawer || !backdrop) return;

  function close() {
    btn.setAttribute("aria-expanded", "false");
    drawer.classList.remove("open");
    backdrop.classList.remove("open");
    document.body.style.overflow = "";
  }

  function open() {
    btn.setAttribute("aria-expanded", "true");
    drawer.classList.add("open");
    backdrop.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  btn.addEventListener("click", () => {
    if (drawer.classList.contains("open")) close();
    else open();
  });

  backdrop.addEventListener("click", close);
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
})();
