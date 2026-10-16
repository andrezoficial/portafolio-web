// Sistema de partículas (tema azul). Optimizado: sin shadowBlur (muy costoso en canvas),
// distancias al cuadrado, pausa cuando la pestaña está oculta y resize con debounce.
const LINK_DIST = 100;
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
const MOUSE_DIST = 120;

export class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('particles-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: -9999, y: -9999 };
    this.rafId = 0;
    this.resizeTimer = 0;
    this.loop = this.loop.bind(this);
    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.start();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    // Menos partículas en pantallas pequeñas (el coste de enlazarlas crece al cuadrado).
    const count = Math.min(window.innerWidth < 768 ? 35 : 70, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.3 ? '#2563eb' : '#3b82f6'
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => this.resize(), 150);
    }, { passive: true });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    }, { passive: true });
    document.addEventListener('visibilitychange', () => {
      document.hidden ? this.stop() : this.start();
    });
  }

  start() {
    if (!this.rafId) this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  loop() {
    this.rafId = requestAnimationFrame(this.loop);
    const { ctx, canvas, particles, mouse } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 0.5;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const distSq = dx * dx + dy * dy;
      if (distSq < MOUSE_DIST * MOUSE_DIST) {
        const force = (MOUSE_DIST - Math.sqrt(distSq)) / MOUSE_DIST;
        p.vx += dx * force * 0.002;
        p.vy += dy * force * 0.002;
      }

      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = p.color;
      for (let j = i + 1; j < particles.length; j++) {
        const o = particles[j];
        const ddx = p.x - o.x;
        const ddy = p.y - o.y;
        const d2 = ddx * ddx + ddy * ddy;
        if (d2 < LINK_DIST_SQ) {
          ctx.globalAlpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(o.x, o.y);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }
}
