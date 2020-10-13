import {arrowCodes, level} from './globalV/gameSetting.js';
import Vector from './classes/Vector.js';
import CanvasDisplay from './classes/Canvas.js';
import Enemy from './classes/Enemy.js';
import Goal from './classes/Goal.js';
import Level from './classes/Level.js';
import Player from './classes/Player.js';



const $canvas = document.querySelector(`.canvas`),
  ctx = $canvas.getContext(`2d`),
  mouse = new Vector(0, 0);

let arrows;

const init = () => {
  arrows = trackKeys(arrowCodes);
  runGame(level, CanvasDisplay);

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
  let display = new Display(level, $canvas, ctx);
  runAnimation(function (step) {
    //console.log(step);
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
        const $buttonretry = document.querySelector(`.retry`)
        const buttonRetryHandler = e => {
          e.preventDefault
          startLevel(plans[n])
        }
        $buttonretry.addEventListener(`click`, buttonRetryHandler)
      } else if (n < plans.length - 1) {
        startLevel(n + 1);
      } else {
        const $title = document.querySelector(`.title`);
        const $buttonretry = document.querySelector(`.retry`);
        $buttonretry.textContent = ``;
        $title.textContent=`You win`;
      }
    });
  };

  startLevel(0);
};


init();
