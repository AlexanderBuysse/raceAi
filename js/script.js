import Vector from './classes/Vector.js';
import Particle from './classes/Particle.js';
import CanvasDisplay from './classes/Canvas.js';
import Enemy from './classes/Enemy.js';
import Goal from './classes/Goal.js';
import Level from './classes/Level.js';
import Player from './classes/Player.js';



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
  arrows = trackKeys(arrowCodes);
  runGame(level, CanvasDisplay);
};

const elt = (name, className) => {
  let elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
};

const trackKeys = codes => {
  let pressed = {};
  const handler = event => {
    if (codes.hasOwnProperty(event.keyCode)) {
      let down = event.type == `keydown`;
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  };
  addEventListener(`keydown`, handler);
  addEventListener(`keyup`, handler);
  return pressed;
};

const runAnimation = frameFunc => {
  let lastTime = null;
  const frame = time => {
    let stop = false;
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop) {
      requestAnimationFrame(frame);
    }
  };
  requestAnimationFrame(frame);
};

const runLevel = (level, Display, andThen) => {
  let display = new Display(document.body, level);
  runAnimation(function (step) {
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();
      if (andThen) {
        andThen(level.status);
      }
      return false;
    }
  });
};

const runGame = (plans, Display) => {
  const startLevel = n => {
    runLevel(new Level(plans[n]), Display, status => {
      if (status == `lost`) {
        startLevel(n);
      } else if (n < plans.length - 1) {
        startLevel(n + 1);
      } else {
        console.log(`You win!`);
      }
    });
  };
  startLevel(0);
};


init();
