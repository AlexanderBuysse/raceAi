import Vector from '../Vector.js';

export default class Brain {
  constructor(size){
    this.directions = [];
    this.step =0;
    this.randomize(size);
    
  }

  randomize(size) {
    for (let i = 0; i< size; i++) {
      this.directions[i] = this.getRandomDirection();
    }
  }

//---------------------------------------------------------------------------------------------------------------------------------------------------------------

getRandomDirection() {
    let randomNumber = Math.floor(Math.random() * 9); 
    switch(randomNumber) {
    case 0:
      return new Vector(0, 1);
    case 1:
      return new Vector(1, 1);
    case 2:
      return new Vector(1, 0);
    case 3:
      return new Vector(1, -1);
    case 4:
      return new Vector(0, -1);
    case 5:
      return new Vector(-1, -1);
    case 6:
      return new Vector(-1, 0);
    case 7:
      return new Vector(-1, 1);
    case 8:
      return new Vector(0, 0);
    }

    return new Vector();
  }

  //-------------------------------------------------------------------------------------------------------------------------------------
  //returns a perfect copy of this brain object
  clone() {
    let clone = new Brain(this.directions.length);
    for (let i = 0; i < this.directions.length; i++) {
      clone.directions[i] = this.directions[i]
    } 
    console.log(clone.directions)
    return clone;
  }

  //----------------------------------------------------------------------------------------------------------------------------------------

  //mutates the brain by setting some of the directions to random vectors
  mutate(died, deathStep) {
    //chance that any vector in directions gets changed
    for (let i =0; i< this.directions.length; i++) {
      let rand = Math.floor(Math.random() *1);
      if (died && i > deathStep - 10) {
        rand = Math.floor(Math.random() *0.2);
      }

      const mutationRate=0.1;
      if (rand < mutationRate) {
        //set this direction as a random direction
        this.directions[i] = this.getRandomDirection();
      }
    }
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------------------
  //increases the number of elements in directions by 5
 increaseMoves() {
   let increaseMovesBy=1;
   for(let i = 0 ; i< increaseMovesBy ;i++){
     this.directions.push(this.getRandomDirection());
   }
  }
}
