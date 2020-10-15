import Vector from './Vector.js';
import {playerSpeed, numberOfSteps, level, humanPlaying} from '../globalV/gameSetting.js';
import Brain from './ai/Brain.js';
import Node from './ai/Node.js';



export default class Player {
    constructor(pos) {
        this.pos = pos.plus(new Vector(0, -0.5));
        this.size = new Vector(0.8, 1.5);
        this.speed = new Vector(0, 0);
        this.vel= new Vector(0,0);
        this.dead = false;
        this.reachedGoal = false;
        this.fadeCounter = 255;
        this.isBest = false;
        this.deathByDot = false;
        this.deathAtStep = 0;
        this.moveCount = 0;
        this.gen = 1;
        this.fitness = 0;
        this.nodes = [];
        this.fading = false;
        this.brain = new Brain(numberOfSteps);
        this.human = false;
        this.setNodes();


        this.width = level[0][0].length;
        this.height = level[0].length;
        this.grid = [];
        this.actors = [];


        for (let y = 0; y < this.height; y++) {
            let line = level[0][y], gridLine = [];
            for (let x = 0; x < this.width; x++) {
                let ch = line[x], fieldType = null;
                if (ch == `@`)
                    fieldType = `player`;
                else if(ch == `o`)
                fieldType = `goal`;
                else if (ch == `x`)
                    fieldType = `wall`;
                else if (ch == `!`)
                    fieldType = `lava`;
                gridLine.push(fieldType);
            }
            this.grid.push(gridLine);
        }

        this.player = this.actors.filter(actor => actor.type == `player`);
        this.status = this.finishDelay = null;
    }
    get type() {
        return `player`;
    }

    setNodes() {
        console.log(this.pos);
        this.nodes[0] = new Node(this.pos);
        this.nodes[1] = new Node(new Vector(37.2, 1.1));
        this.nodes[0].setDistanceToFinish(this.nodes[1]);
    }

    move(step, level, keys) {
        if (!this.human) {
            if (this.moveCount == 0) {//move in the direction for 6 frames
                if (this.brain.directions.length > this.brain.step) {//if there are still directions left then set the velocity as the next PVector in the direcitons array
                    this.vel = this.brain.directions[this.brain.step];
                    this.brain.step++;
                } else {//if at the end of 
                    this.dead = true;
                }
                this.moveCount = 6;
            } else {
                this.moveCount--;
            }
            this.speed.x = 0;
            if (this.vel.x==1) this.speed.x -= playerSpeed;
            if (this.vel.x==-1) this.speed.x += playerSpeed;

            this.speed.y = 0
            if (this.vel.y==1) this.speed.y -= playerSpeed;
            if (this.vel.y ==-1) this.speed.y += playerSpeed;

            let motionX = new Vector((this.speed.x) / 2 * step, 0);
            let motionY = new Vector(0, (this.speed.y * step) / 2);
            let motionXY = new Vector((this.speed.x * step) / 2, (this.speed.y * step) / 2);
            let newPos = this.pos.plus(motionXY);
            let newPosX = this.pos.plus(motionX);
            let newPosY = this.pos.plus(motionY);

            let obstacleX = level.obstacleAt(newPosX, this.size);
            let obstacleY = level.obstacleAt(newPosY, this.size);
            let obstacleXY = level.obstacleAt(newPos, this.size);
            const isObstacle = (obst, y, x) => {
                if (obst) {
                    if (y) {
                        const colisionY=level.playerTouched(obstacleY);
                        this.checkColision(colisionY);
                    } else {
                        this.pos = newPosY;
                    }
                    if (x) {
                        const colisionX=level.playerTouched(obstacleX);
                        this.checkColision(colisionX);
                    } else {
                        this.pos = newPosX;
                    }
                } else {
                    this.pos = newPos;
                }
            }
            isObstacle(obstacleXY, obstacleY, obstacleX);
            
        } else {
            this.speed.x = 0;
            if (keys.left) this.speed.x -= playerSpeed;
            if (keys.right) this.speed.x += playerSpeed;

            this.speed.y = 0
            if (keys.up) this.speed.y -= playerSpeed;
            if (keys.down) this.speed.y += playerSpeed;


            let motionX = new Vector((this.speed.x) / 2 * step, 0);
            let motionY = new Vector(0, (this.speed.y * step) / 2);
            let motionXY = new Vector((this.speed.x * step) / 2, (this.speed.y * step) / 2);
            let newPos = this.pos.plus(motionXY);
            let newPosX = this.pos.plus(motionX);
            let newPosY = this.pos.plus(motionY);

            console.log(newPosY);
            let obstacleX = level.obstacleAt(newPosX, this.size);
            let obstacleY = level.obstacleAt(newPosY, this.size);
            let obstacleXY = level.obstacleAt(newPos, this.size);
            const isObstacle = (obst, y, x) => {
                if (obst) {
                    if (y) {
                        level.playerTouched(obstacleY);
                    } else {
                        this.pos = newPosY;
                    }
                    if (x) {
                        level.playerTouched(obstacleX);
                    } else {
                        this.pos = newPosX;
                    }
                } else {
                    this.pos = newPos;
                }
            }
            isObstacle(obstacleXY, obstacleY, obstacleX);
        }
    }

    checkColision(colision){
        if(colision===`dead`){
            this.dead=true;
            this.deathByDot = true;
            this.deathAtStep = this.brain.step;
        }else if(colision===`reachedGoal`){
            this.reachedGoal=true;
        }
    }

    calculateFitness() {
        if (this.reachedGoal) {//if the dot reached the goal then the fitness is based on the amount of steps it took to get there
            this.fitness = 1.0 / 16.0 + 10000.0 / (this.brain.step * this.brain.step);
        } else {//if the dot didn't reach the goal then the fitness is based on how close it is to the goal
            let estimatedDistance = 0.0;//the estimated distance of the path from the player to the goal
            for (let i = this.nodes.length - 1; i >= 0; i--) {
                if (!this.nodes[i].reached) {
                    estimatedDistance = this.nodes[i].distToFinish;
                    estimatedDistance += dist(this.pos.x, this.pos.y, this.nodes[i].pos.x, this.nodes[i].pos.y);
                }
            }
            if (this.deathByDot) {
                estimatedDistance *= 0.9;
            }
            this.fitness = 1.0 / (estimatedDistance * estimatedDistance);
        }
        this.fitness *= this.fitness;
    }
    
    gimmeBaby() {
        let baby = new Player();
        baby.brain = this.brain.clone();
        baby.deathByDot = this.deathByDot;
        baby.deathAtStep = this.deathAtStep;
        baby.gen = this.gen;
        return baby;
    }

    act(step, level, keys) {
        if(this.human){
            this.move(step, level, keys);

            let otherActor = level.actorAt(this);
            if (otherActor)
                level.playerTouched(otherActor.type, otherActor);

            // Losing animation
            if (level.status == `lost`) {
                this.pos.y += step;
                this.size.y -= step;
            }
        } else{
            if (!this.dead && !this.reachedGoal) {
                this.move(step, level, keys);
            }

            let otherActor = level.actorAt(this);
            if (otherActor)
                level.playerTouched(otherActor.type, otherActor);

            if (level.status == `lost`) {
            }
        }
    }

}