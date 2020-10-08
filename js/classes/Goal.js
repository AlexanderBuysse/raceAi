import Vector from './Vector.js';

export default class Goal {
    constructor(pos) {
        this.basePos = this.pos = pos.plus(new Vector(0.2, 0.1));
        this.size = new Vector(0.6, 0.6);
        this.wobble = Math.random() * Math.PI * 2;
    }
    get type() {
        return `coin`;
    }
    act(step) {
        this.wobble += step * wobbleSpeed;
        let wobblePos = Math.sin(this.wobble) * wobbleDist;
        this.pos = this.basePos.plus(new Vector(0, wobblePos));
    };
}