const canvas = document.getElementById('nubes-canvas');
const ctx = canvas.getContext('2d');

let mouse = { x: -999, y: -999 };
let particulas = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('touchmove', e => {
  e.preventDefault();
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
}, { passive: false });

window.addEventListener('touchend', () => {
  mouse.x = -999;
  mouse.y = -999;
});

class Particula {
  constructor() {
    this.init();
  }

  init() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.r = 8 + Math.random() * 30;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = 0.15 + Math.random() * 0.3;
    this.color = Math.random() > 0.5 ? '180,220,255' : '255,255,255';
  }

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const repulsion = 120;

    if (dist < repulsion && dist > 0) {
      const f = (repulsion - dist) / repulsion;
      this.vx += (dx / dist) * f * 2;
      this.vy += (dy / dist) * f * 2;
    }

    this.vx *= 0.95;
    this.vy *= 0.95;

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < -this.r) this.x = window.innerWidth + this.r;
    if (this.x > window.innerWidth + this.r) this.x = -this.r;
    if (this.y < -this.r) this.y = window.innerHeight + this.r;
    if (this.y > window.innerHeight + this.r) this.y = -this.r;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 35; i++) {
  particulas.push(new Particula());
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Líneas de conexión entre partículas cercanas
  for (let i = 0; i < particulas.length; i++) {
    for (let j = i + 1; j < particulas.length; j++) {
      const dx = particulas[i].x - particulas[j].x;
      const dy = particulas[i].y - particulas[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particulas[i].x, particulas[i].y);
        ctx.lineTo(particulas[j].x, particulas[j].y);
        ctx.strokeStyle = `rgba(100,180,240,${0.15 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }

  particulas.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(loop);
}

loop();