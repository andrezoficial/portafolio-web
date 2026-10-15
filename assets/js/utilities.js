    // Scroll Progress
    export function updateScrollProgress() {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      const progressBar = document.getElementById('scroll-progress-bar');
      if (progressBar) progressBar.style.width = progress + '%';
    }

    // Counter Animation
    export function animateCounters() {
      const counters = document.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        if (counter.dataset.animated === 'true') return;
        counter.dataset.animated = 'true';
        const target = Number.parseInt(counter.getAttribute('data-target'), 10);
        const suffix = counter.getAttribute('data-suffix') ?? '+';
        if (!Number.isFinite(target) || target < 0) return;
        const duration = 900;
        const start = performance.now();
        const update = now => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(target * eased);
          counter.textContent = value.toLocaleString('es-CO') + suffix;
          if (progress < 1) requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
      });
    }

    // Typing Effect
    export function typeWriter(element, text, speed = 50) {
      let i = 0;
      element.textContent = ''; 
      
      function type() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        }
      }
      
      type();
    }

    // Smooth scroll to contact
    export function scrollToContact() {
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }


// Safely encode text before placing it in HTML.
export function escapeHTML(value) {
  const element = document.createElement("div");
  element.textContent = String(value);
  return element.innerHTML;
}
