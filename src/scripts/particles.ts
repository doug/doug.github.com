// Natural, organic particle system
// Simulates gentle flow/drift like pollen or spores using a flow field

type Theme = 'light' | 'dark';

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;

  constructor(width: number, height: number, theme: Theme) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 3 + 1;
    
    // Theme-based colors
    const isLight = theme === 'light';
    const colors = isLight 
      ? ['104, 211, 145', '79, 209, 197', '213, 63, 140'] // Green, Teal, Pink
      : ['100, 255, 218', '255, 100, 200', '200, 200, 200']; 
    
    const rgb = colors[Math.floor(Math.random() * colors.length)];
    this.color = rgb;
    this.alpha = Math.random() * 0.4 + 0.2;
    this.life = 0;
    this.maxLife = Math.random() * 500 + 200;
  }

  update(width: number, height: number, time: number) {
    // Simple Perlin-like noise approximation for flow field
    const angle = (Math.sin(this.x * 0.002 + time * 0.001) + Math.cos(this.y * 0.002 + time * 0.001)) * Math.PI;
    
    // Add flow force to velocity
    this.vx += Math.cos(angle) * 0.02;
    this.vy += Math.sin(angle) * 0.02;

    // Dampen velocity to keep it gentle
    this.vx *= 0.98;
    this.vy *= 0.98;

    this.x += this.vx;
    this.y += this.vy;

    this.life++;

    // Wrap around screen
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    
    // Fade in at start, fade out at end
    const fadeInDuration = 100; // frames to reach full opacity
    const fadeIn = Math.min(1, this.life / fadeInDuration);
    const fadeOut = 1 - this.life / this.maxLife;
    
    const opacity = this.alpha * fadeIn * fadeOut;
    ctx.fillStyle = `rgba(${this.color}, ${opacity})`;
    ctx.fill();
  }
}

export function initParticles(canvas: HTMLCanvasElement) {
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;

  // Detect theme
  const getTheme = (): Theme => (document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
  let currentTheme = getTheme();

  const particles: Particle[] = [];
  const particleCount = Math.min(window.innerWidth / 5, 400); // Responsive count boosted

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(width, height, currentTheme));
  }

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Observe theme changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        currentTheme = getTheme();
        // Reset particles with new colors? Or just let them fade out/in?
        // Let's gradually shift them by just updating the new particles created
        particles.forEach(p => {
             // Force update color for immediate effect
             const isLight = currentTheme === 'light';
             const colors = isLight 
              ? ['104, 211, 145', '79, 209, 197', '213, 63, 140'] 
              : ['100, 255, 218', '255, 100, 200', '200, 200, 200'];
             p.color = colors[Math.floor(Math.random() * colors.length)];
        })
      }
    });
  });
  
  observer.observe(document.documentElement, { attributes: true });

  let time = 0;
  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    
    time += 1;
    particles.forEach((p, index) => {
      p.update(width, height, time);
      p.draw(ctx);
      
      // Respawn dead particles
      if (p.life > p.maxLife) {
        particles[index] = new Particle(width, height, currentTheme);
      }
    });

    requestAnimationFrame(animate);
  }

  animate();
}
