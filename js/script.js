import { arrowCodes, level, populationSize, evolutionSpeed } from './globalV/gameSetting.js';
import Vector from './classes/Vector.js';
import Population from './classes/ai/Population.js';
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
  for (let j = 0; j < evolutionSpeed; j++) {
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
  }
};

const runLevel = (level, Display, andThen) => {
  let display = new Display(level, $canvas, ctx);
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
  const levelOne = new Level(plans[0]);
  const startLevel = () => {
    levelOne.playerPopulation(plans[0]);

      runLevel(levelOne, Display, status => {
        if (status==`lost`) {
          let display = new Display(levelOne, $canvas, ctx);
          runAnimation(function (step) {
            levelOne.animate(step, arrows);
            display.drawFrame(step);
          });
          
          levelOne.playerPopulation(plans[0]);
        } else if (status == null) {
          console.log(`You win!`);
        }else{
        }
      });
  };
  //levelOne.playerPopulation(plans[0]);
  startLevel();
};

init();
