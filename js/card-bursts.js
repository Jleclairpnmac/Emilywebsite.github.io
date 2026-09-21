/* =========================================================
   card-bursts.js
   Particles behind each service card that spray OUTWARD
   (like the Canva "What I Can Do" burst effect).
   ========================================================= */

(function () {
  const canvases = document.querySelectorAll("[data-burst]");
  if (!canvases.length) return;

  const bursts = [];

  function resizeCanvas(canvas) {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  function makeParticle(cx, cy, w, h) {
    const angle = Math.random() * Math.PI * 2;
    // start near center, shoot outward
    const speed = 0.35 + Math.random() * 1.4;
    return {
      x: cx + (Math.random() - 0.5) * 20,
      y: cy + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: 0.8 + Math.random() * 2.2,
      life: 1,
      decay: 0.004 + Math.random() * 0.01,
      a: 0.35 + Math.random() * 0.55,
    };
  }

  function initOne(canvas) {
    const size = resizeCanvas(canvas);
    const cx = size.w / 2;
    const cy = size.h / 2;
    const count = 90;
    const particles = Array.from({ length: count }, () =>
      makeParticle(cx, cy, size.w, size.h)
    );
    // scatter ages so it doesn't look like one explosion
    particles.forEach((p) => {
      p.life = Math.random();
      p.x = cx + p.vx * (1 - p.life) * 80;
      p.y = cy + p.vy * (1 - p.life) * 80;
    });
    bursts.push({ canvas, ...size, cx, cy, particles });
  }

  canvases.forEach(initOne);

  window.addEventListener("resize", () => {
    bursts.forEach((b) => {
      const size = resizeCanvas(b.canvas);
      b.ctx = size.ctx;
      b.w = size.w;
      b.h = size.h;
      b.cx = size.w / 2;
      b.cy = size.h / 2;
    });
  });

  function tick() {
    bursts.forEach((b) => {
      const { ctx, w, h, cx, cy, particles } = b;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        // when a particle dies, respawn at center and shoot out again
        if (p.life <= 0) {
          const fresh = makeParticle(cx, cy, w, h);
          particles[i] = fresh;
          continue;
        }

        const alpha = p.a * p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(90, 50, 140, ${alpha})`;
        ctx.fill();

        // tiny white core for sparkle
        if (p.r > 1.4) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
          ctx.fill();
        }
      }
    });

    requestAnimationFrame(tick);
  }

  tick();
})();
