import Vector from "../classes/Vector.js";

export const scale = 20;
export const maxStep = 0.05;
export const playerSpeed =10;
export const wobbleSpeed = 8, wobbleDist = 0.07;
export const arrowCodes = { 37: `left`, 38: `up`, 39: `right`, 40: `down`};
export let numberOfSteps= 10;
export const level = [[
    `                                 xxxxxxxxxx                                  `,
    `      xxxxxxxxxxxxxxxxxxxxxxxxxxxx   o    xxxxxxxxxxxxxxxxxxxxxxxxxx         `,
    `      x   v                      x        x                  |  |  x         `,
    `      x                                                            x         `,
    `      x                                                            x         `,
    `      x      xxxxxxxxxxxxxxx                       xxxxxxxxxx      x         `,
    `      x                    xxxxxxxxxxxxxxxxxxxxxxxxx               x         `,
    `      x                    x                       x               xxxxxxxx  `,
    `      xxxxxxxxxxxxxxx      x                       x               x!!!!!!x  `,
    `      x                    x                       xxxxxxxxxx      x      x  `,
    `      x                    x      x       x                 x      x      x  `,
    `      x      x             x      x       x                 x      x      x  `,
    `      x      x             x      x       x                 x      x      x  `,
    `      x      x   xxxxxxxxxxx      x       xxxxxxxxxxxx      x             x  `,
    `      x      x   x                x                  x      x             x  `,
    `      x      x   x                x                  x      x             x  `,
    `      x      x|||x                x                  x      x      x      x  `,
    `  xxxxx      xxxxx         xxxxxxxx       xxxxxxx    x             x      x  `,
    `  x                               x       x     x    x             x      x  `,
    `  x                               x    @  x          x             x      x  `,
    `  x                               x       x          x         |  |x||||||x  `,
    `  xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  `,
    `                                                                             `,
    `                                                                             `,
    `                                                                             `,
    `                                                                             `,
    `                                                                             `,
    `                                                                             `
    ]];
export  let humanPlaying= false;
export const winArea = new Vector(37.2, 1.1);