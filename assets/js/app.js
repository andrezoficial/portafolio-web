import { enhancedIntro, setupIntersectionObserver, setupHoverEffects } from "./effects.js";
import { setupChatInput } from "./chat.js";
import { typeWriter, updateScrollProgress, scrollToContact } from "./utilities.js";

// Initialize everything when DOM is loaded
    export function initializeApp() {
      const showreelVideo = document.querySelector('.showreel-video');
      if (showreelVideo && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        showreelVideo.pause();
        showreelVideo.removeAttribute('autoplay');
      }
      // Start intro animation
      enhancedIntro();
      
      // Setup intersection observer
      setupIntersectionObserver();
      
      // Setup hover effects
      setupHoverEffects();
      
      // Setup chat input functionality
      setupChatInput();
      
      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          e.preventDefault();
          const target = document.querySelector(this.getAttribute('href'));
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        });
      });

      // Add stagger animation to timeline items
      const timelineItems = document.querySelectorAll('.timeline-item');
      timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.2}s`;
      });

      // Enhanced typing effect for subtitle
      const subtitle = document.querySelector('.subtitle');
      if (subtitle && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const originalText = subtitle.textContent;
        setTimeout(() => typeWriter(subtitle, originalText, 45), 700);
      }

      // Parallax effect for background
      let ticking = false;
      function updateParallax() {
        const scrollTop = window.pageYOffset;
        const bgAnimated = document.querySelector('.bg-animated');
        
        if (bgAnimated) {
          bgAnimated.style.transform = `translateY(${scrollTop * 0.1}px)`;
        }
        
        ticking = false;
      }

      window.addEventListener('scroll', () => {
        updateScrollProgress();
        
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      });

      // Initialize scroll progress
      updateScrollProgress();

      // Add loading states to external links
      // No reemplazar el contenido de enlaces externos al hacer clic: hacerlo
      // podía borrar iconos/texto y provocar saltos de diseño antes de navegar.

      // Enhanced keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          document.body.classList.add('keyboard-nav');
        }
        
        // Add keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
          switch(e.key) {
            case 'h':
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              break;
            case 'c':
              e.preventDefault();
              scrollToContact();
              break;
          }
        }
      });

      document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
      });

      // Performance optimization: Intersection Observer for animations
      const animatedElements = document.querySelectorAll('.skill-tag, .tech-tag, .stat-card');
      const animationObserver = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
          } else {
            entry.target.style.animationPlayState = 'paused';
          }
        });
      }, { threshold: 0.1 }) : null;

      animatedElements.forEach(el => {
        if (animationObserver) animationObserver.observe(el);
      });

      // Add dynamic text highlight effect
      const textElements = document.querySelectorAll('p, li');
      textElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
          el.style.transition = 'all 0.3s ease';
          el.style.color = 'var(--pure-white)';
        });
        el.addEventListener('mouseleave', () => {
          el.style.color = '';
        });
      });

      // Enhanced particle interaction
      const canvas = document.getElementById('particles-canvas');
      let isMouseDown = false;
      
      if (canvas) {
        canvas.addEventListener('mousedown', () => { isMouseDown = true; });
        canvas.addEventListener('mouseup', () => { isMouseDown = false; });
        canvas.addEventListener('mouseleave', () => { isMouseDown = false; });
      }

      // Add section entrance animations
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      document.querySelectorAll('.section').forEach(section => {
        sectionObserver.observe(section);
      });

      // Add smooth reveal for timeline items
      const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateX(0)';
            }, index * 200);
          }
        });
      }, { threshold: 0.3 });

      document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-30px)';
        item.style.transition = 'all 0.6s ease';
        timelineObserver.observe(item);
      });

      // Enhanced project card interactions
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
          // Pause other animations when hovering
          projectCards.forEach(otherCard => {
            if (otherCard !== card) {
              otherCard.style.opacity = '0.7';
              otherCard.style.transform = 'scale(0.95)';
            }
          });
        });

        card.addEventListener('mouseleave', () => {
          // Restore other cards
          projectCards.forEach(otherCard => {
            otherCard.style.opacity = '1';
            otherCard.style.transform = 'scale(1)';
          });
        });
      });

      // Add gradient text animation to headings
      const headings = document.querySelectorAll('h1, h2, h3');
      headings.forEach(heading => {
        heading.addEventListener('mouseenter', () => {
          heading.style.backgroundSize = '200% 200%';
          heading.style.animation = 'gradientShift 2s ease infinite';
        });
        heading.addEventListener('mouseleave', () => {
          heading.style.animation = '';
        });
      });

      console.log('🚀 Portafolio mejorado inicializado');
      console.log('✨ Paleta Negro, Blanco y Azul aplicada');
      console.log('🔗 Header no fijo implementado');
      console.log('💫 Efectos avanzados activados');
}

    // Error handling for animations
    window.addEventListener('error', (e) => {
      console.warn('Animation error caught:', e.error);
    });

    // Preload optimization
    const preloadImages = () => {
      const imageUrls = [
        // Add any image URLs you want to preload
      ];
      
      imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
      });
    };

    // Call preload when appropriate
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', preloadImages);
    } else {
      preloadImages();
    }

    // Add performance monitoring
    window.addEventListener('load', () => {
      if ('performance' in window) {
        const loadTime = performance.now();
        console.log(`⚡ Portafolio cargado en ${Math.round(loadTime)}ms`);
      }
    });

    // Add theme transition effect
    function addThemeTransition() {
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    }

    addThemeTransition();
  
