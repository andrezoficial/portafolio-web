    // Particles System with blue theme
    export class ParticleSystem {
      constructor() {
        this.canvas = document.getElementById('particles-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.init();
      }

      init() {
        this.resize();
        this.createParticles();
        this.bindEvents();
        this.animate();
      }

      resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }

      createParticles() {
        const particleCount = Math.min(100, window.innerWidth / 15);
        for (let i = 0; i < particleCount; i++) {
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
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
          this.mouse.x = e.clientX;
          this.mouse.y = e.clientY;
        });
      }

      animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Mouse interaction
          const dx = this.mouse.x - particle.x;
          const dy = this.mouse.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 120) {
            const force = (120 - distance) / 120;
            particle.vx += dx * force * 0.002;
            particle.vy += dy * force * 0.002;
          }

          // Boundary check
          if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
          if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

          // Draw particle
          this.ctx.save();
          this.ctx.globalAlpha = particle.opacity;
          this.ctx.fillStyle = particle.color;
          this.ctx.shadowBlur = 10;
          this.ctx.shadowColor = particle.color;
          this.ctx.beginPath();
          this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          this.ctx.fill();
          this.ctx.restore();

          // Connect nearby particles
          this.particles.slice(index + 1).forEach(otherParticle => {
            const dx2 = particle.x - otherParticle.x;
            const dy2 = particle.y - otherParticle.y;
            const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
            
            if (distance2 < 100) {
              this.ctx.save();
              this.ctx.globalAlpha = (100 - distance2) / 100 * 0.4;
              this.ctx.strokeStyle = particle.color;
              this.ctx.lineWidth = 0.5;
              this.ctx.shadowBlur = 5;
              this.ctx.shadowColor = particle.color;
              this.ctx.beginPath();
              this.ctx.moveTo(particle.x, particle.y);
              this.ctx.lineTo(otherParticle.x, otherParticle.y);
              this.ctx.stroke();
              this.ctx.restore();
            }
          });
        });

        requestAnimationFrame(() => this.animate());
      }
    }

