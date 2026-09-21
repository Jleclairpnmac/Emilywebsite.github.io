/* =========================================================
   scroll-effects.js
   - Progress bar
   - Fade / slide / blur reveals
   - Light parallax on floating chrome
   ========================================================= */

(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bar = document.getElementById("progress-bar");
  const floaters = document.querySelectorAll("[data-float]");

  /* Wrap a heading line so it can slide up */
  function wrapLine(el, delay) {
    if (!el || el.dataset.wrapped) return;
    const inner = document.createElement("span");
    while (el.firstChild) inner.appendChild(el.firstChild);
    el.appendChild(inner);
    el.classList.add("text-line");
    inner.style.transitionDelay = delay + "s";
    el.dataset.wrapped = "1";
  }

  /* Soft rise for paragraphs and list items */
  function markRise(el, delay) {
    if (!el || el.dataset.wrapped) return;
    el.classList.add("text-rise");
    el.style.transitionDelay = delay + "s";
    el.dataset.wrapped = "1";
  }

  /* Headings: one line at a time */
  document.querySelectorAll(".split-title").forEach((title) => {
    title.querySelectorAll(":scope > span").forEach((line, i) => wrapLine(line, i * 0.12));
  });
  document.querySelectorAll(".card-face h3, .hero-kicker, .name-first, .name-last, .creds-degree, .creds-label").forEach((el, i) => {
    wrapLine(el, (i % 3) * 0.08);
  });

  /* Body copy inside each section, staggered */
  document.querySelectorAll(".case-note, .seo-block p, .band-row p, .bio-copy p, .contact-list li, .cert-list li").forEach((el) => {
    const group = el.parentElement;
    const siblings = [...group.children].filter((node) => node.matches("p, li, .case-note"));
    const index = Math.max(0, siblings.indexOf(el));
    markRise(el, 0.18 + index * 0.1);
  });

  const hero = document.querySelector(".hero");
  if (hero) requestAnimationFrame(() => hero.classList.add("is-shown"));

  const reveals = document.querySelectorAll(".reveal");

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (bar) bar.style.width = pct + "%";

    if (reduce) return;

    const y = window.scrollY;
    floaters.forEach((el, i) => {
      const wave = Math.sin((y + i * 55) * 0.012) * 14;
      el.style.transform = `translate3d(0, ${wave}px, 0)`;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal sections as they enter the viewport
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
  );

  reveals.forEach((el) => io.observe(el));
})();
