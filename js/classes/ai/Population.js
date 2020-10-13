import Vector from '../Vector.js';


export default class Population{

    constructor(size) {
        this.players = [];
        this.fitnessSum = 0.0;
        this.gen = 1;
        this.bestPlayer = 0;
        this.minStep = 10000;
        this.genPlayers = [];
        this.bestFitness = 0;
        this.solutionFound = false;

        for (let i = 0; i < size; i++) {
            this.players[i] = new Player(new Vector(38, 19));
        }
    }

    show() {
        if (!showBest) {
            for (let i = 1; i < this.players.length; i++) {
                this.players[i].show();
            }
        }
        this.players[0].show();
    }

    update() {
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].brain.step > this.minStep) {//if the player has already taken more steps than the best player has taken to reach the goal
                this.players[i].dead = true;//then it dead
            } else {
                this.players[i].update();
            }
        }
    }

    allPlayersDead() {
        for (let i = 0; i < this.players.length; i++) {
            if (!this.players[i].dead && !this.players[i].reachedGoal) {
                return false;
            }
        }
        return true;
    }

    naturalSelection() {
        let newPlayers = [];//next gen
        this.setBestPlayer();
        this.calculateFitnessSum();

        //the champion lives on
        newPlayers[0] = this.players[this.bestPlayer].gimmeBaby();
        newPlayers[0].isBest = true;
        for (let i = 1; i < populationSize; i++) {
            //select parent based on fitness
            let parent = this.selectParent();

            //get baby from them
            newPlayers[i] = parent.gimmeBaby();
        }

        // this.players = newPlayers.slice();
        this.players = [];
        for (let i = 0; i < newPlayers.length; i++) {
            this.players[i] = newPlayers[i];
        }
        this.gen++;
    }

    calculateFitnessSum() {
        this.fitnessSum = 0;
        for (let i = 0; i < this.players.length; i++) {
            this.fitnessSum += this.players[i].fitness;
        }
    }

    setBestPlayer() {
        let max = 0;
        let maxIndex = 0;
        for (let i = 0; i < this.players.length; i++) {
            if (this.players[i].fitness > max) {
                max = this.players[i].fitness;
                maxIndex = i;
            }
        }

        this.bestPlayer = maxIndex;
        console.log(maxIndex);
        console.log(this.players[maxIndex].brain)

        if (max > this.bestFitness) {
            this.bestFitness = max;
            this.genPlayers.push(this.players[this.bestPlayer].gimmeBaby());
        }

        //if this player reached the goal then reset the minimum number of steps it takes to get to the goal
        if (this.players[this.bestPlayer].reachedGoal) {
            this.minStep = this.players[this.bestPlayer].brain.step;
            this.solutionFound = true;
        }
    }

    increaseMoves() {
        if (this.players[0].brain.directions.length < 120 && !this.solutionFound) {
            for (let i = 0; i < this.players.length; i++) {
                this.players[i].brain.increaseMoves();
            }
        }
    }

    mutateDemBabies() {
        for (let i = 1; i < this.players.length; i++) {
            this.players[i].brain.mutate(this.players[i].deathByDot, this.players[i].deathAtStep);
            this.players[i].deathByDot = false;
            this.players[i].gen = this.gen;
        }
        this.players[0].deathByDot = false;
        this.players[0].gen = this.gen;
    }

    selectParent() {
        let rand = random(this.fitnessSum);

        let runningSum = 0;
        for (let i = 0; i < this.players.length; i++) {
            runningSum += this.players[i].fitness;
            if (runningSum > rand) {
                return this.players[i];
            }
        }
        //should never get to this point

        return null;
    }
}