/* =========================================================
   DANLINE.ONLINE — Motor de animaciones (GSAP)
   ========================================================= */

// =========================================================
// FAB WHATSAPP — usa el href del CTA final existente
// =========================================================
(function () {
  function spawnWaFab() {
    if (document.querySelector(".wa-fab")) return;
    const ref = document.querySelector('a[href*="wa.me"]');
    if (!ref) return;
    const a = document.createElement("a");
    a.className = "wa-fab";
    a.href = ref.href;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Contactar por WhatsApp");
    a.innerHTML = `
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#fff" d="M16 3C8.82 3 3 8.82 3 16c0 2.29.6 4.44 1.66 6.3L3 29l6.9-1.63A12.9 12.9 0 0 0 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 23.6a10.6 10.6 0 0 1-5.4-1.47l-.38-.22-4.1.97.97-4-.25-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.93c-.32-.16-1.87-.92-2.16-1.02-.29-.1-.5-.16-.71.16-.21.32-.82 1.02-1.01 1.23-.18.21-.37.24-.69.08-.32-.16-1.34-.49-2.56-1.57-.95-.84-1.59-1.88-1.78-2.2-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.18.21-.32.32-.53.11-.21.05-.39-.03-.55-.08-.16-.71-1.7-.97-2.33-.26-.62-.52-.53-.71-.54l-.6-.01c-.21 0-.55.08-.84.39-.29.32-1.11 1.08-1.11 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.23 3.4 5.4 4.64.75.32 1.34.52 1.8.66.76.24 1.44.21 1.98.13.6-.09 1.87-.76 2.14-1.49.27-.73.27-1.36.19-1.49-.08-.13-.29-.21-.61-.37z"/>
      </svg>
      <span>WhatsApp</span>`;
    document.body.appendChild(a);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", spawnWaFab);
  else spawnWaFab();
})();


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

  // Enjambre dinamico: spawnea muchas abejitas con movimiento amplio
  const BEE_SVG = `
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
      <g class="bee-wings">
        <ellipse cx="20" cy="14" rx="10" ry="7" fill="#fff" opacity="0.55"/>
        <ellipse cx="40" cy="14" rx="10" ry="7" fill="#fff" opacity="0.55"/>
      </g>
      <ellipse cx="30" cy="22" rx="18" ry="11" fill="#ffc107"/>
      <rect x="20" y="14" width="3" height="16" fill="#000"/>
      <rect x="28" y="14" width="3" height="16" fill="#000"/>
      <rect x="36" y="14" width="3" height="16" fill="#000"/>
      <circle cx="14" cy="22" r="2" fill="#000"/>
    </svg>`;

  function spawnSwarm(container, count, opts = {}) {
    if (!container) return;
    const rangeX = opts.rangeX || 320;
    const rangeY = opts.rangeY || 220;
    for (let i = 0; i < count; i++) {
      const bee = document.createElement("div");
      bee.className = "bee-dyn";
      bee.innerHTML = BEE_SVG;
      const scale = 0.35 + Math.random() * 0.95;
      const opacity = 0.55 + Math.random() * 0.45;
      bee.style.setProperty("--bee-scale", scale);
      bee.style.setProperty("--bee-op", opacity);
      bee.style.left = (Math.random() * 96 + 2) + "%";
      bee.style.top = (Math.random() * 88 + 6) + "%";
      container.appendChild(bee);

      // Wander principal (posicion)
      gsap.to(bee, {
        x: () => (Math.random() - 0.5) * rangeX,
        y: () => (Math.random() - 0.5) * rangeY,
        rotation: () => (Math.random() - 0.5) * 60,
        duration: 2.2 + Math.random() * 3.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: Math.random() * 2
      });

      // Pulsacion sutil de escala (respiracion)
      gsap.to(bee, {
        scale: 0.9 + Math.random() * 0.25,
        duration: 0.8 + Math.random() * 1.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: Math.random()
      });
    }
  }

  // Heredadas (las 3 hardcodeadas en HTML) — les meto mas movimiento
  gsap.utils.toArray(".hero-bee").forEach(bee => {
    gsap.to(bee, {
      x: () => (Math.random() - 0.5) * 260,
      y: () => (Math.random() - 0.5) * 160,
      rotation: () => (Math.random() - 0.5) * 50,
      duration: 2 + Math.random() * 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true
    });
  });

  // Nuevas abejitas: hero 28, cta 14
  spawnSwarm(document.querySelector(".hero"), 28, { rangeX: 380, rangeY: 260 });
  spawnSwarm(document.querySelector(".cta-section"), 14, { rangeX: 300, rangeY: 180 });

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

  // CTA bees floating (mas agresivo)
  gsap.utils.toArray(".cta-bee").forEach(bee => {
    gsap.to(bee, {
      x: () => (Math.random() - 0.5) * 320,
      y: () => (Math.random() - 0.5) * 200,
      rotation: () => (Math.random() - 0.5) * 70,
      duration: 2.5 + Math.random() * 2,
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
// ACORDEÓN TIER / MANTENIMIENTO
// - tier-toggle: solo UN panel abierto a la vez (accordion strict)
// - maintenance-toggle: independiente (puede convivir con otro)
// =========================================================
(function initAccordions() {
  const togglers = document.querySelectorAll(".tier-toggle, .maintenance-toggle");

  // Estado inicial: cerrar todos los panels
  togglers.forEach(btn => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    panel.style.height = "0px";
    panel.style.opacity = "0";
    panel.style.overflow = "hidden";
    panel.style.willChange = "height";
    panel.classList.remove("td-open");
  });

  function closePanel(btn, panel) {
    btn.setAttribute("aria-expanded", "false");
    if (window.gsap && !reduceMotion) {
      gsap.to(panel, {
        height: 0, opacity: 0, duration: 0.4, ease: "power2.inOut",
        onComplete: () => { panel.classList.remove("td-open"); }
      });
    } else {
      panel.style.height = "0px"; panel.style.opacity = "0";
      panel.classList.remove("td-open");
    }
  }

  function openPanel(btn, panel) {
    btn.setAttribute("aria-expanded", "true");
    panel.classList.add("td-open");
    const innerHeight = panel.firstElementChild
      ? panel.firstElementChild.offsetHeight
      : panel.scrollHeight;

    if (window.gsap && !reduceMotion) {
      gsap.fromTo(panel,
        { height: 0, opacity: 0 },
        {
          height: innerHeight, opacity: 1, duration: 0.55, ease: "power3.out",
          onComplete: () => {
            panel.style.height = "auto";
            if (window.ScrollTrigger) ScrollTrigger.refresh();
          }
        });
    } else {
      panel.style.height = "auto"; panel.style.opacity = "1";
    }
  }

  togglers.forEach(btn => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    const isTierToggle = btn.classList.contains("tier-toggle");

    btn.addEventListener("click", e => {
      e.preventDefault();
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      // Si es tier y se va a abrir, cerrar los otros tier primero
      if (isTierToggle && !isOpen) {
        document.querySelectorAll(".tier-toggle[aria-expanded='true']").forEach(other => {
          if (other === btn) return;
          const otherPanel = document.getElementById(other.getAttribute("aria-controls"));
          if (otherPanel) closePanel(other, otherPanel);
        });
      }

      if (isOpen) closePanel(btn, panel);
      else openPanel(btn, panel);
    });
  });
})();

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
