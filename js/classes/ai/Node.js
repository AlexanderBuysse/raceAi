import Vector from '../Vector.js';
import { scale } from '../../globalV/gameSetting.js';
import { dist } from '../../globalV/functions.js';


export default class Node {
  constructor(nodeTile) {
    this.reached = false;
    this.distToFinish = 0.0;
    this.pos = new Vector(nodeTile.x, nodeTile.y);
    this.w = scale ;
    this.h = scale;
    this.bottomRight = new Vector(this.pos.x + this.w, this.pos.y + this.h);
  }
   collision( ptl,  pbr) {//player dimensions
    if ((ptl.x <this.bottomRight.x && pbr.x > this.pos.x) &&( ptl.y < this.bottomRight.y && pbr.y > this.pos.y)) {
      this.reached = true;
      return true;
    }else if(pbr.x < this.pos.x){
      this.reached = false;

    }
    return false;
  }

  setDistanceToFinish(n) {
    this.distToFinish = n.distToFinish + dist(this.pos.x, this.pos.y, n.pos.x, n.pos.y);
    return this.distToFinish
  }
}
