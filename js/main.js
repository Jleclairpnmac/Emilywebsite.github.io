/* =========================================================
   main.js — small site utilities + CSS starfield fallback
   ========================================================= */

(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Build a simple moving CSS star layer (visible even before canvas paints)
  const field = document.getElementById("starfield");
  if (field) {
    const count = 40;
    for (let i = 0; i < count; i++) {
      const s = document.createElement("span");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDuration = 4 + Math.random() * 8 + "s";
      s.style.animationDelay = Math.random() * -6 + "s";
      field.appendChild(s);
    }
  }

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".topnav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
})();
