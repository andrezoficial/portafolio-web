import { enhancedIntro, setupIntersectionObserver, setupHoverEffects } from "./effects.js";
import { setupChatInput } from "./chat.js";
import { typeWriter, updateScrollProgress, scrollToContact } from "./utilities.js";

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// El video está bajo el pliegue: solo se descarga/reproduce cuando se acerca a la pantalla.
function setupShowreelVideo() {
  const video = document.querySelector('.showreel-video');
  if (!video) return;
  if (prefersReducedMotion() || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        video.preload = 'auto';
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, { threshold: 0.25 });
  io.observe(video);
}

export function initializeApp() {
  const reduced = prefersReducedMotion();

  enhancedIntro();
  setupIntersectionObserver();
  setupHoverEffects();
  setupChatInput();
  setupShowreelVideo();

  // Scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
      }
    });
  });

  // Efecto de escritura en el subtítulo
  const subtitle = document.querySelector('.subtitle');
  if (subtitle && !reduced) {
    const originalText = subtitle.textContent;
    setTimeout(() => typeWriter(subtitle, originalText, 45), 700);
  }

  // Barra de progreso: un solo listener pasivo, limitado a un frame por scroll
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateScrollProgress();
      ticking = false;
    });
  }, { passive: true });
  updateScrollProgress();

  // Accesibilidad por teclado y atajos
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'h') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
      else if (e.key === 'c') { e.preventDefault(); scrollToContact(); }
    }
  });
  document.addEventListener('mousedown', () => document.body.classList.remove('keyboard-nav'));

  // Pausar animaciones de etiquetas cuando no están visibles
  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.skill-tag, .tech-tag, .stat-card').forEach((el) => animationObserver.observe(el));
  }

  // Aparición escalonada de la línea de tiempo (estilos en CSS: .timeline-item / .is-in)
  const timelineItems = document.querySelectorAll('.timeline-item');
  if ('IntersectionObserver' in window) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add('is-in'), index * 200);
        timelineObserver.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    timelineItems.forEach((item) => timelineObserver.observe(item));
  } else {
    timelineItems.forEach((item) => item.classList.add('is-in'));
  }
}
