import { ParticleSystem } from "./particles.js";
import { animateCounters } from "./utilities.js";


    // Enhanced Intro Animation
    export function enhancedIntro() {
      const intro = document.getElementById('intro-overlay');
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const startParticles = () => {
        if (!reducedMotion && document.getElementById('particles-canvas')) {
          try { new ParticleSystem(); } catch (error) { console.warn('Efecto de partículas desactivado:', error); }
        }
      };
      let seen = false;
      try { seen = sessionStorage.getItem('intro-visto') === '1'; sessionStorage.setItem('intro-visto', '1'); } catch (_) {}
      if (!intro || reducedMotion || seen) {
        if (intro) intro.style.display = 'none';
        startParticles();
        return;
      }
      window.setTimeout(() => {
        intro.style.opacity = '0';
        intro.style.pointerEvents = 'none';
        window.setTimeout(() => {
          intro.style.display = 'none';
          startParticles();
        }, 450);
      }, 900);
    }

    // Intersection Observer for enhanced animations
    export function setupIntersectionObserver() {
      const sections = document.querySelectorAll('.section');
      const options = {
        threshold: 0.05,
        rootMargin: "0px 0px -100px 0px"
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            entry.target.style.transitionDelay = `${index * 0.1}s`;
            
            // Trigger counter animation for stats section
            const statCards = entry.target.querySelectorAll('.stat-card');
            if (statCards.length > 0) {
              setTimeout(() => animateCounters(), 500);
            }
            
            observer.unobserve(entry.target);
          }
        });
      }, options);

      sections.forEach(section => {
        observer.observe(section);
      });
    }

    // Enhanced hover effects
    export function setupHoverEffects() {
      // Button ripple effect
      const buttons = document.querySelectorAll('.btn');
      buttons.forEach(btn => {
        btn.addEventListener('click', function(e) {
          const ripple = document.createElement('span');
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          const x = e.clientX - rect.left - size / 2;
          const y = e.clientY - rect.top - size / 2;
          
          ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
          `;
          
          this.appendChild(ripple);
          
          setTimeout(() => {
            ripple.remove();
          }, 600);
        });
      });
    }
