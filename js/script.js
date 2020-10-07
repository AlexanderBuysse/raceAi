import Vector from './classes/Vector.js';
import Particle from './classes/Particle.js';

const $canvas = document.querySelector(`.canvas`),
  ctx = $canvas.getContext(`2d`),
  mouse = new Vector(0, 0);
let particles = [];

const init = () => {
  $canvas.addEventListener(`mousemove`, mousemove);
  draw();
};

const mousemove = event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
};

const draw = () => {
  // Canvas zwart maken
  ctx.fillStyle = `black`;
  ctx.fillRect(0, 0, $canvas.width, $canvas.height);

	particles.push(new Particle(Math.random()* $canvas.width, 0));
  particles.forEach(particle => particle.draw(ctx));

  // Elke 60fps uitvoeren
  window.requestAnimationFrame(draw);
}

init();
