/* =========================================================
   particles.js
   Animated star / sparkle background — ALWAYS moves
   (ignores OS "reduce motion" for this decorative layer so
   the site doesn't look frozen on Windows).
   ========================================================= */

(function () {
  const canvas = document.getElementById("particles");
  if (!canvas) {
    console.warn("particles canvas missing");
    return;
  }

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let stars = [];
  let sparkles = [];
  const mouse = { x: 0, y: 0, active: false };
  let time = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    // drifting dots
    const dotCount = Math.min(140, Math.floor((width * height) / 8500));
    stars = Array.from({ length: dotCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 2.4 + 0.8,
      // FASTER drift so motion is obvious
      vx: (Math.random() - 0.5) * 1.4,
      vy: (Math.random() - 0.5) * 1.4,
      a: Math.random() * 0.5 + 0.35,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: 0.03 + Math.random() * 0.05,
    }));

    // 4-point sparkle stars that float + rotate
    const sparkleCount = Math.min(28, Math.floor(width / 50));
    sparkles = Array.from({ length: sparkleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 6 + Math.random() * 16,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      a: 0.35 + Math.random() * 0.45,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function drawSparkle(s) {
    const pulse = 0.7 + Math.sin(s.pulse) * 0.3;
    const size = s.size * pulse;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.beginPath();
    // 4-point star shape
    for (let i = 0; i < 4; i++) {
      const a1 = (i * Math.PI) / 2;
      const a2 = a1 + Math.PI / 4;
      ctx.lineTo(Math.cos(a1) * size, Math.sin(a1) * size);
      ctx.lineTo(Math.cos(a2) * size * 0.28, Math.sin(a2) * size * 0.28);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(160, 110, 220, ${s.a * pulse})`;
    ctx.shadowColor = "rgba(200, 160, 255, 0.8)";
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  }

  function wrap(p) {
    if (p.x < -30) p.x = width + 30;
    if (p.x > width + 30) p.x = -30;
    if (p.y < -30) p.y = height + 30;
    if (p.y > height + 30) p.y = -30;
  }

  function tick() {
    time += 1;
    ctx.clearRect(0, 0, width, height);

    // soft drifting dots
    for (let i = 0; i < stars.length; i++) {
      const d = stars[i];

      if (mouse.active) {
        const dx = mouse.x - d.x;
        const dy = mouse.y - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        if (dist < 200) {
          d.vx += (dx / dist) * 0.05;
          d.vy += (dy / dist) * 0.05;
        }
      }

      d.vx *= 0.992;
      d.vy *= 0.992;
      // keep a minimum drift so nothing ever looks frozen
      if (Math.abs(d.vx) < 0.15) d.vx += (Math.random() - 0.5) * 0.08;
      if (Math.abs(d.vy) < 0.15) d.vy += (Math.random() - 0.5) * 0.08;

      d.x += d.vx;
      d.y += d.vy;
      d.twinkle += d.twinkleSpeed;
      wrap(d);

      const tw = 0.55 + Math.sin(d.twinkle) * 0.45;
      const alpha = d.a * tw;

      const glow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 5);
      glow.addColorStop(0, `rgba(200, 150, 255, ${alpha})`);
      glow.addColorStop(1, "rgba(200, 150, 255, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha + 0.25)})`;
      ctx.fill();

      // connections
      for (let j = i + 1; j < stars.length; j++) {
        const b = stars[j];
        const dx = d.x - b.x;
        const dy = d.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(150, 100, 210, ${0.25 * (1 - dist / 100)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // floating 4-point stars
    for (const s of sparkles) {
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.rotSpeed;
      s.pulse += 0.05;
      wrap(s);
      drawSparkle(s);
    }

    requestAnimationFrame(tick);
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  });
  window.addEventListener("mouseleave", () => {
    mouse.active = false;
  });
  window.addEventListener("resize", resize);

  resize();
  tick();
  console.log("particles.js running — stars should be moving");
})();
