import Vector from './classes/Vector.js';
import Particle from './classes/Particle.js';
import CanvasDisplay from './classes/Canvas.js';


const $canvas = document.querySelector(`.canvas`),
  ctx = $canvas.getContext(`2d`),
  mouse = new Vector(0, 0);

const scale = 20;
const maxStep = 0.05;
const wobbleSpeed = 8, wobbleDist = 0.07;
const playerXSpeed = 7;
const arrowCodes = { 37: `left`, 38: `up`, 39: `right` };
let arrows;
const level=[];

const init = () => {
  $canvas.addEventListener(`mousemove`, mousemove);
  draw();
};

const mousemove = event => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
};

const draw = () => {

  window.requestAnimationFrame(draw);
}

init();
