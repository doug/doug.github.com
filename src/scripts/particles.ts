interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  opacity: number;
  radius: number;
  isFuschia: boolean;
  fuschiaLife?: number;
}

interface BoidsConfig {
  particleCount: number;
  maxSpeed: number;
  separationDistance: number;
  alignmentDistance: number;
  cohesionDistance: number;
  separationWeight: number;
  alignmentWeight: number;
  cohesionWeight: number;
  mouseRadius: number;
  mouseForce: number;
}

const COLORS = {
  grey: '#9CA3AF',
  green: '#A7C4A0',
  blue: '#A5C4D4',
  fuschia: '#E91E8C',
};

const CONFIG: BoidsConfig = {
  particleCount: 50,
  maxSpeed: 0.5,
  separationDistance: 30,
  alignmentDistance: 60,
  cohesionDistance: 80,
  separationWeight: 0.02,
  alignmentWeight: 0.01,
  cohesionWeight: 0.005,
  mouseRadius: 100,
  mouseForce: 0.3,
};

export function initParticles(canvas: HTMLCanvasElement): () => void {
  const context = canvas.getContext('2d');
  if (!context) return () => {};
  const ctx = context;

  let width = window.innerWidth;
  let height = window.innerHeight;
  let mouseX = -1000;
  let mouseY = -1000;
  let animationId: number;

  const particles: Particle[] = [];
  const normalColors = [COLORS.grey, COLORS.green, COLORS.blue];

  // Adjust particle count for mobile
  const isMobile = width < 768;
  const particleCount = isMobile ? Math.floor(CONFIG.particleCount * 0.6) : CONFIG.particleCount;

  function resize(): void {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createParticle(isFuschia = false): Particle {
    const color = isFuschia
      ? COLORS.fuschia
      : normalColors[Math.floor(Math.random() * normalColors.length)];

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * CONFIG.maxSpeed,
      vy: (Math.random() - 0.5) * CONFIG.maxSpeed,
      color,
      opacity: isFuschia ? 0.8 : 0.3 + Math.random() * 0.4,
      radius: isFuschia ? 3 : 2 + Math.random() * 2,
      isFuschia,
      fuschiaLife: isFuschia ? 300 + Math.random() * 200 : undefined,
    };
  }

  function init(): void {
    resize();
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
  }

  function separation(particle: Particle): { x: number; y: number } {
    let steerX = 0;
    let steerY = 0;
    let count = 0;

    for (const other of particles) {
      if (other === particle) continue;
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.separationDistance && dist > 0) {
        steerX += dx / dist;
        steerY += dy / dist;
        count++;
      }
    }

    if (count > 0) {
      steerX /= count;
      steerY /= count;
    }

    return { x: steerX * CONFIG.separationWeight, y: steerY * CONFIG.separationWeight };
  }

  function alignment(particle: Particle): { x: number; y: number } {
    let avgVx = 0;
    let avgVy = 0;
    let count = 0;

    for (const other of particles) {
      if (other === particle) continue;
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.alignmentDistance) {
        avgVx += other.vx;
        avgVy += other.vy;
        count++;
      }
    }

    if (count > 0) {
      avgVx /= count;
      avgVy /= count;
      return {
        x: (avgVx - particle.vx) * CONFIG.alignmentWeight,
        y: (avgVy - particle.vy) * CONFIG.alignmentWeight,
      };
    }

    return { x: 0, y: 0 };
  }

  function cohesion(particle: Particle): { x: number; y: number } {
    let avgX = 0;
    let avgY = 0;
    let count = 0;

    for (const other of particles) {
      if (other === particle) continue;
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONFIG.cohesionDistance) {
        avgX += other.x;
        avgY += other.y;
        count++;
      }
    }

    if (count > 0) {
      avgX /= count;
      avgY /= count;
      return {
        x: (avgX - particle.x) * CONFIG.cohesionWeight,
        y: (avgY - particle.y) * CONFIG.cohesionWeight,
      };
    }

    return { x: 0, y: 0 };
  }

  function mouseRepulsion(particle: Particle): { x: number; y: number } {
    const dx = particle.x - mouseX;
    const dy = particle.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < CONFIG.mouseRadius && dist > 0) {
      const force = (CONFIG.mouseRadius - dist) / CONFIG.mouseRadius;
      return {
        x: (dx / dist) * force * CONFIG.mouseForce,
        y: (dy / dist) * force * CONFIG.mouseForce,
      };
    }

    return { x: 0, y: 0 };
  }

  function update(): void {
    // Occasionally spawn a fuschia particle
    if (Math.random() < 0.002) {
      const fuschiaCount = particles.filter(p => p.isFuschia).length;
      if (fuschiaCount < 2) {
        particles.push(createParticle(true));
      }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];

      // Update fuschia lifetime
      if (p.isFuschia && p.fuschiaLife !== undefined) {
        p.fuschiaLife--;
        if (p.fuschiaLife <= 0) {
          particles.splice(i, 1);
          continue;
        }
        // Fade out near end of life
        if (p.fuschiaLife < 50) {
          p.opacity = (p.fuschiaLife / 50) * 0.8;
        }
      }

      const sep = separation(p);
      const ali = alignment(p);
      const coh = cohesion(p);
      const mouse = mouseRepulsion(p);

      p.vx += sep.x + ali.x + coh.x + mouse.x;
      p.vy += sep.y + ali.y + coh.y + mouse.y;

      // Limit speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > CONFIG.maxSpeed) {
        p.vx = (p.vx / speed) * CONFIG.maxSpeed;
        p.vy = (p.vy / speed) * CONFIG.maxSpeed;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }
  }

  function draw(): void {
    ctx.clearRect(0, 0, width, height);

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  }

  function animate(): void {
    update();
    draw();
    animationId = requestAnimationFrame(animate);
  }

  function handleMouseMove(e: MouseEvent): void {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleMouseLeave(): void {
    mouseX = -1000;
    mouseY = -1000;
  }

  // Initialize
  init();
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  animate();

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseleave', handleMouseLeave);
  };
}
