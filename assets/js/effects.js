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
      if (!intro || reducedMotion) {
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
        }, 650);
      }, 1500);
    }

    // Intersection Observer for enhanced animations
    export function setupIntersectionObserver() {
      const sections = document.querySelectorAll('.section');
      const options = {
        threshold: 0.15,
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
      // Project cards
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          card.style.borderColor = 'var(--primary-blue)';
        });
        card.addEventListener('mouseleave', () => {
          card.style.borderColor = 'var(--border-gray)';
        });
      });

      // Skill tags enhanced effect
      const skillTags = document.querySelectorAll('.skill-tag');
      skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
          tag.style.transform = 'translateY(-2px) scale(1.05)';
          tag.style.boxShadow = '0 15px 30px var(--glow-blue)';
        });
        tag.addEventListener('mouseleave', () => {
          tag.style.transform = 'translateY(0) scale(1)';
          tag.style.boxShadow = 'none';
        });
      });

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

    // Add CSS for additional animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
      
      @keyframes glitch {
        0%, 100% { transform: translateX(0); }
        20% { transform: translateX(-2px); }
        40% { transform: translateX(2px); }
        60% { transform: translateX(-2px); }
        80% { transform: translateX(2px); }
      }

      .skill-category:hover {
        box-shadow: 0 20px 40px var(--glow-blue);
      }

      .timeline-item:hover .job-title {
        color: var(--primary-blue);
        text-shadow: 0 0 10px var(--glow-blue);
      }

      .contact-item {
        position: relative;
        z-index: 1;
      }

      .floating-contact:hover {
        animation-play-state: paused;
      }

      /* Enhanced scrollbar with glow */
      ::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 6px var(--glow-blue);
      }

      /* Smooth section reveals */
      .section {
        perspective: 1000px;
      }

      .section.visible {
        transform: translateY(0) rotateX(0deg);
      }

      /* Advanced text effects */
      .achievements li:hover {
        color: var(--pure-white);
        padding-left: 2.5rem;
        transition: all 0.3s ease;
      }

      .achievements li:hover::before {
        content: '🚀';
        animation: bounceIn 0.5s ease;
        color: var(--primary-blue);
      }

      @keyframes bounceIn {
        0% { transform: scale(0.3); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }

      /* Interactive timeline */
      .timeline-item:hover::before {
        background: linear-gradient(135deg, var(--light-blue), var(--primary-blue));
        transform: translateX(-5px) scale(1.2);
        box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.3);
      }

      /* Enhanced education cards */
      .education-card:hover {
        transform: translateY(-5px);
        border-color: var(--primary-blue);
        box-shadow: 0 25px 50px var(--glow-blue);
      }

      .certification-item:hover .certification-icon {
        transform: scale(1.2) rotate(10deg);
        color: var(--light-blue);
      }

      /* Glowing borders on focus */
      .btn:focus,
      .contact-item:focus {
        outline: 2px solid var(--primary-blue);
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.3);
      }

      /* Mobile optimizations */
      @media (max-width: 768px) {
        .floating-contact {
          animation-duration: 2s;
        }
        
        .skill-tag:hover {
          transform: translateY(-1px) scale(1.02);
        }
        
        .project-card:hover {
          transform: translateY(-5px) scale(1.01);
        }

        .contact-info {
          flex-direction: column;
        }

        .social-links {
          flex-direction: column;
          align-items: center;
        }
      }

      /* Enhanced loading states */
      .loading {
        position: relative;
        overflow: hidden;
      }

      .loading::after {
        content: '';
        position: absolute;
        top: 0; left: -100%;
        width: 100%; height: 100%;
        background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.4), transparent);
        animation: loading 1.5s infinite;
      }

      @keyframes loading {
        to { left: 100%; }
      }
    `;
    document.head.appendChild(style);

