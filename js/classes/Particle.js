import Vector from './Vector.js';

export default class Particle {
  constructor(x, y) {
	this.location = new Vector(x, y);
	this.velocity = new Vector(0, 0);
	this.acceleration = new Vector(0, 0.05);
  }
  draw(ctx) {
	this.velocity.add(this.acceleration);
	this.location.add(this.velocity);
    ctx.fillStyle = `white`;
	ctx.fillRect(this.location.x-1, this.location.y-1, 2, 2);
  }
}
