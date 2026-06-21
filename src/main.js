// ── FONDO INTERACTIVO ──────────────────────────────────────────
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
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('touchmove', e => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; }, { passive: true });
window.addEventListener('touchend', () => { mouse.x = -999; mouse.y = -999; });

class Particula {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.r = 8 + Math.random() * 28;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.alpha = 0.12 + Math.random() * 0.25;
  }

  update() {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 130 && dist > 0) {
      const f = (130 - dist) / 130;
      this.vx += (dx / dist) * f * 2;
      this.vy += (dy / dist) * f * 2;
    }
    this.vx *= 0.94;
    this.vy *= 0.94;
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
    ctx.fillStyle = `rgba(100, 180, 240, ${this.alpha})`;
    ctx.fill();
  }
}

for (let i = 0; i < 40; i++) particulas.push(new Particula());

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particulas.length; i++) {
    for (let j = i + 1; j < particulas.length; j++) {
      const dx = particulas[i].x - particulas[j].x;
      const dy = particulas[i].y - particulas[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.beginPath();
        ctx.moveTo(particulas[i].x, particulas[i].y);
        ctx.lineTo(particulas[j].x, particulas[j].y);
        ctx.strokeStyle = `rgba(46,134,193,${0.12 * (1 - d / 110)})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
  particulas.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(loop);
}

loop();

// ── AUDIO ──────────────────────────────────────────────────────
const audio = document.getElementById('audio');
audio.volume = 0.5;

function iniciarAudio() {
  audio.play().catch(() => {});
  document.removeEventListener('click', iniciarAudio);
  document.removeEventListener('touchstart', iniciarAudio);
}

document.addEventListener('click', iniciarAudio);
document.addEventListener('touchstart', iniciarAudio);

// ── CARRUSEL ───────────────────────────────────────────────────
const slides = document.querySelectorAll('.slide');
const contenedorPuntos = document.getElementById('puntos');
const mensajeEl = document.getElementById('mensaje');
let actual = 0;

const mensajes = [
  'Todos sabemos que eres el mejor papá del mundo pero...',
  'Papá, solo quiero que sepas que me siento orgulloso de ser tu hijo',
  'Que aunque no lo digo mucho, te admiro',
  'Y aunque no lo expreso tanto, te quiero',
  'Que comienzo a entender muchas cosas, que de niño no entendía',
  'Valorar lo que vi y lo que no vi que hiciste por la familia',
  'Y es que como no valorar que hayas amado a la mejor mujer del mundo',
  'Como no valorar que nos hayas enseñado a cuidar de las personas que amas',
  'Como no valorar que nos hayas hecho hinchas del mejor equipo del Ecuador',
  'Como no valorar cada foto que nos obligaste a tomarnos juntos',
  'Gracias a eso ahora quedan como un hermoso recuerdo',
  'Como no valorar que nos hayas enseñado tambien a ser hijos',
  'Como no valorar todas las veces que nos hacias reir con tus locuras',
  'Mientras vivías tus propias batallas internas; mientras nos hacías sentir seguro a todos',
  'Ahora entiendo, tus silecios, tus consejos y tu manera de ver la vida',
  'Y aunque evites aceptar estas palabras y digas que lo hiciste con gusto para restarle importancia',
  'Es importante para mi y para todos decirte',
  'Gracias Papá',
];

slides.forEach((_, i) => {
  const punto = document.createElement('div');
  punto.classList.add('punto');
  if (i === 0) punto.classList.add('active');
  punto.onclick = () => irA(i);
  contenedorPuntos.appendChild(punto);
});

mensajeEl.textContent = mensajes[0];

function irA(n) {
  slides[actual].classList.remove('active');
  contenedorPuntos.children[actual].classList.remove('active');
  actual = (n + slides.length) % slides.length;
  slides[actual].classList.add('active');
  contenedorPuntos.children[actual].classList.add('active');
  mensajeEl.style.opacity = '0';
  setTimeout(() => {
    mensajeEl.textContent = mensajes[actual];
    mensajeEl.style.opacity = '1';
  }, 200);
}

document.getElementById('prev').onclick = () => irA(actual - 1);
document.getElementById('next').onclick = () => irA(actual + 1);