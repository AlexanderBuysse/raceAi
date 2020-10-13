import Vector from './Vector.js';
import {playerSpeed, numberOfSteps, level} from '../globalV/gameSetting.js';
import Brain from './ai/Brain.js';
import Node from './ai/Node.js';



export default class Player {
    constructor(pos) {
        console.log(pos);
        this.pos = pos.plus(new Vector(0, -0.5));
        this.size = new Vector(0.8, 1.5);
        this.speed = new Vector(0, 0);
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

        console.log(level[0][1].split(``));
        console.log(this.grid);
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
        console.log(this.nodes[0].setDistanceToFinish(this.nodes[1]))
    }

    move(step, level, keys) {
        this.speed.x = 0;
        if (keys.left) this.speed.x -= playerSpeed;
        if (keys.right) this.speed.x += playerSpeed;

        this.speed.y = 0
        if (keys.up) this.speed.y -= playerSpeed;
        if (keys.down) this.speed.y += playerSpeed;

        
        let motionX = new Vector((this.speed.x)/2 * step, 0);
        let motionY = new Vector(0, (this.speed.y * step)/2);
        let motionXY = new Vector((this.speed.x * step)/2, (this.speed.y * step)/2);
        let newPos = this.pos.plus(motionXY);
        let newPosX = this.pos.plus(motionX); 
        let newPosY = this.pos.plus(motionY);

        let obstacleX = level.obstacleAt(newPosX, this.size);
        let obstacleY = level.obstacleAt(newPosY, this.size);
        let obstacleXY = level.obstacleAt(newPos, this.size);
        const isObstacle =(obst,y ,x)=>{
            if (obst){
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
            } else{
                this.pos = newPos;
            }
        }
        isObstacle(obstacleXY, obstacleY, obstacleX);
    }

    act(step, level, keys) {
        this.move(step, level, keys);

        let otherActor = level.actorAt(this);
        if (otherActor)
            level.playerTouched(otherActor.type, otherActor);

        // Losing animation
        if (level.status == `lost`) {
            this.pos.y += step;
            this.size.y -= step;
        }
    }
}