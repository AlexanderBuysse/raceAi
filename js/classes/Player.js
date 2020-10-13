import Vector from './Vector.js';
import {playerSpeed} from '../globalV/gameSetting.js';

export default class Player {
    constructor(pos) {
        this.pos = pos.plus(new Vector(0, -0.5));
        this.size = new Vector(0.8, 1.5);
        this.speed = new Vector(0, 0);
    }
    get type() {
        return `player`;
    }

    move(step, level, keys) {
        this.speed.x = 0;
        if (keys.left) this.speed.x -= playerSpeed;
        if (keys.right) this.speed.x += playerSpeed;

        this.speed.y = 0
        if (keys.up) this.speed.y -= playerSpeed;
        if (keys.down) this.speed.y += playerSpeed;
        console.log(this.speed.y)
        console.log(this.speed.x)
        
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
                    console.log(`raar`)
                }
                if (x) {
                    level.playerTouched(obstacleX);
                } else {
                    this.pos = newPosX;
                    console.log(`raar2`)
                }
            } else{
                this.pos = newPos;
            }
            //console.log(`raar3`)
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