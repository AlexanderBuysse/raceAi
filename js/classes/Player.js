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
    moveX(step, level, keys) {
        this.speed.x = 0;
        if (keys.left) this.speed.x -= playerSpeed;
        if (keys.right) this.speed.x += playerSpeed;

        let motion = new Vector(this.speed.x * step, 0);
        let newPos = this.pos.plus(motion);
        let obstacle = level.obstacleAt(newPos, this.size);
        //console.log(obstacle);
        if (obstacle)
            level.playerTouched(obstacle);
        else
            this.pos = newPos;
    }
    moveY(step, level, keys) {
        this.speed.y =0
        if (keys.up) this.speed.y -= playerSpeed;
        if (keys.down) this.speed.y += playerSpeed;
        
        let motion = new Vector(0, this.speed.y * step);
        let newPos = this.pos.plus(motion);
        let obstacle = level.obstacleAt(newPos, this.size);
        if (obstacle)
            level.playerTouched(obstacle);
        else
            this.pos = newPos;
    }
    act(step, level, keys) {
        this.moveX(step, level, keys);
        this.moveY(step, level, keys);

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