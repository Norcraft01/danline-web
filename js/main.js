/* =========================================================
   DANLINE.ONLINE — Motor de animaciones (GSAP)
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// =========================================================
// PRELOADER
// =========================================================
window.addEventListener("load", () => {
  const pre = document.querySelector(".preloader");
  if (!pre) return;
  setTimeout(() => {
    if (window.gsap) {
      gsap.to(pre, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => { pre.style.display = "none"; }
      });
    } else {
      pre.style.display = "none";
    }
  }, 1800);
});

// =========================================================
// CURSOR + POLEN
// =========================================================
(() => {
  if (window.matchMedia("(max-width: 700px)").matches) return;
  const cursor = document.createElement("div");
  cursor.className = "cursor";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  document.body.append(cursor, ring);

  let mx = 0, my = 0, rx = 0, ry = 0, dirty = false;
  window.addEventListener("mousemove", e => {
    mx = e.clientX; my = e.clientY; dirty = true;
  }, { passive: true });

  const render = () => {
    if (dirty || Math.abs(rx - mx) > 0.5 || Math.abs(ry - my) > 0.5) {
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      cursor.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      dirty = false;
    }
    requestAnimationFrame(render);
  };
  render();

  const hoverables = "a, button, .bento-card, .service-card, .btn, [data-hover]";
  document.addEventListener("mouseover", e => {
    if (e.target.closest(hoverables)) cursor.classList.add("is-hover");
  });
  document.addEventListener("mouseout", e => {
    if (e.target.closest(hoverables)) cursor.classList.remove("is-hover");
  });

  // Polen — partícula al click
  document.addEventListener("click", e => {
    if (reduceMotion) return;
    for (let i = 0; i < 8; i++) {
      const p = document.createElement("div");
      p.className = "pollen";
      p.style.left = e.clientX + "px";
      p.style.top = e.clientY + "px";
      document.body.appendChild(p);
      const angle = (i / 8) * Math.PI * 2;
      const dist = 30 + Math.random() * 50;
      if (window.gsap) {
        gsap.set(p, { opacity: 1, scale: 1 });
        gsap.to(p, {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          opacity: 0,
          scale: 0,
          duration: 0.8 + Math.random() * 0.4,
          ease: "power2.out",
          onComplete: () => p.remove()
        });
      } else {
        setTimeout(() => p.remove(), 800);
      }
    }
  });
})();

// =========================================================
// GSAP — REVEAL + HERO TIMELINE
// =========================================================
if (window.gsap && !reduceMotion) {
  gsap.registerPlugin(ScrollTrigger);

  // Hero timeline
  const tl = gsap.timeline({ delay: 1.6 });
  tl.from(".hero .eyebrow", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
    .from(".hero h1 .word", { yPercent: 110, opacity: 0, duration: 1.1, stagger: 0.08, ease: "power3.out" }, "-=0.4")
    .from(".hero .sub", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
    .from(".hero-cta .btn", { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.4")
    .from(".hero-bee", { opacity: 0, scale: 0, duration: 0.6, stagger: 0.15, ease: "back.out(2)" }, "-=0.6");

  // Bees floating eternally
  gsap.utils.toArray(".hero-bee").forEach((bee, i) => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(bee, {
      x: () => (Math.random() - 0.5) * 60,
      y: () => (Math.random() - 0.5) * 40,
      rotation: () => (Math.random() - 0.5) * 20,
      duration: 2 + Math.random() * 2,
      ease: "sine.inOut"
    });
  });

  // Reveal genérico
  gsap.utils.toArray("[data-reveal]").forEach(el => {
    const delay = parseFloat(el.dataset.delay || 0);
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, delay, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true }
      });
  });

  // Bento cards stagger
  ScrollTrigger.batch(".bento-card", {
    start: "top 90%",
    once: true,
    onEnter: batch => gsap.fromTo(batch,
      { opacity: 0, y: 60, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.9, stagger: 0.1, ease: "power3.out" })
  });

  // Service cards
  ScrollTrigger.batch(".service-card", {
    start: "top 85%",
    once: true,
    onEnter: batch => gsap.fromTo(batch,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" })
  });

  // Process steps
  ScrollTrigger.batch(".process-step", {
    start: "top 85%",
    once: true,
    onEnter: batch => gsap.fromTo(batch,
      { opacity: 0, x: -40 },
      { opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" })
  });

  // Stats: counter + reveal
  ScrollTrigger.create({
    trigger: ".stats",
    start: "top 75%",
    once: true,
    onEnter: () => {
      gsap.utils.toArray(".stat .num").forEach(el => {
        const target = parseInt(el.dataset.count || el.textContent);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            const suffix = el.dataset.suffix || "";
            el.textContent = Math.round(obj.v) + suffix;
          }
        });
      });
    }
  });

  // CTA bees floating
  gsap.utils.toArray(".cta-bee").forEach(bee => {
    gsap.to(bee, {
      x: () => (Math.random() - 0.5) * 80,
      y: () => (Math.random() - 0.5) * 60,
      rotation: () => (Math.random() - 0.5) * 30,
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
  });
}

// =========================================================
// MAGNETIC BUTTONS
// =========================================================
if (!reduceMotion) {
  document.querySelectorAll("[data-magnetic]").forEach(el => {
    const strength = 0.35;
    el.addEventListener("mousemove", e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      if (window.gsap) {
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.4, ease: "power2.out" });
      }
    });
    el.addEventListener("mouseleave", () => {
      if (window.gsap) gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    });
  });
}

// =========================================================
// SCRAMBLE
// =========================================================
class Scramble {
  constructor(el) {
    this.el = el;
    this.chars = "!<>-_/[]{}=+*^?#$%&█▓▒░";
    this.original = el.textContent.trim();
    this.running = false;
    this.update = this.update.bind(this);
  }
  trigger() {
    if (this.running) return;
    this.running = true;
    const text = this.original;
    this.queue = [];
    const speed = 1.4;
    for (let i = 0; i < text.length; i++) {
      const start = Math.floor(Math.random() * 25 * speed);
      const end = start + Math.floor(Math.random() * 25 * speed) + 6;
      this.queue.push({ to: text[i], start, end, char: null });
    }
    this.frame = 0;
    this.update();
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { to, start, end, char } = this.queue[i];
      if (this.frame >= end) { complete++; output += to; }
      else if (this.frame >= start) {
        if (!char || Math.random() < 0.5) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scr-glitch">${char}</span>`;
      } else output += to;
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.el.textContent = this.original;
      this.running = false;
    } else { this.frame++; requestAnimationFrame(this.update); }
  }
}

const SCRAMBLE_SEL = ".btn, .nav .links a, .footer-col a, .nav-cta, .bento-name, .step-title";
document.querySelectorAll(SCRAMBLE_SEL).forEach(el => {
  if (el.querySelector("img, svg")) return;
  if (el.dataset.scrAttached) return;
  el.dataset.scrAttached = "1";
  const s = new Scramble(el);
  el.addEventListener("mouseenter", () => s.trigger());
});

// =========================================================
// PLACEHOLDERS — reload al click
// =========================================================
document.querySelectorAll("[data-reload]").forEach(el => {
  el.addEventListener("click", e => {
    e.preventDefault();
    window.location.reload();
  });
});

// =========================================================
// LOGO HEX SUBTLE GLITCH
// =========================================================
const brand = document.querySelector(".nav .brand");
if (brand && !reduceMotion) {
  setInterval(() => {
    if (Math.random() < 0.08) {
      brand.style.transform = `translate(${(Math.random() - 0.5) * 2}px, 0)`;
      setTimeout(() => { brand.style.transform = ""; }, 80);
    }
  }, 2000);
}
