import Vector from './Vector.js';
import Player from './Player.js';
import Goal from './Goal.js';
import Enemy from './Enemy.js'; 
import Population from './ai/Population.js';
import { maxStep, populationSize,  humanPlaying} from '../globalV/gameSetting.js';

export default class Level {
    constructor(plan) {
        this.width = plan[0].length;
        this.height = plan.length;
        this.grid = [];
        this.actors = []
        this.population;

        const actorChars = {
            'o': Goal,
            '=': Enemy,
            '|': Enemy,
            'v': Enemy
        };
        for (let y = 0; y < this.height; y++) {
            let line = plan[y], gridLine = [];
            for (let x = 0; x < this.width; x++) {
                let ch = line[x], fieldType = null;
                let Actor = actorChars[ch];
                if (Actor) {
                    if(ch != `@`&& humanPlaying===false){
                        this.actors.push(new Actor(new Vector(x, y), ch));
                    }
                }
                else if (ch == `x`)
                    fieldType = `wall`;
                else if (ch == `!`)
                    fieldType = `lava`;
                gridLine.push(fieldType);
            }
            this.grid.push(gridLine);
        }
        this.status = this.finishDelay = null;
    }

    isFinished() {
        return this.status !== null && this.finishDelay < 0;
    }

    obstacleAt(pos, size) {
        let xStart = Math.floor(pos.x);
        let xEnd = Math.ceil(pos.x + size.x);
        let yStart = Math.floor(pos.y);
        let yEnd = Math.ceil(pos.y + size.y);

        if (xStart < 0 || xEnd > this.width || yStart < 0)
            return `wall`;
        if (yEnd > this.height)
            return `lava`;
        for (let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                let fieldType = this.grid[y][x];
                if (fieldType) return fieldType;
            }
        }
    }

    allPLayers(){
        return this.player;
    }

    newPlayer(newPlayers) {
        this.player=newPlayers;
    }

    actorAt(actor) {
        for (let i = 0; i < this.actors.length; i++) {
            let other = this.actors[i];
            if (other !== actor &&
                actor.pos.x + actor.size.x > other.pos.x &&
                actor.pos.x < other.pos.x + other.size.x &&
                actor.pos.y + actor.size.y > other.pos.y &&
                actor.pos.y < other.pos.y + other.size.y)
                return other;
        }
    }

    animate(step, keys) {
        if (this.status != null)
            this.finishDelay -= step;

        while (step > 0) {
            let thisStep = Math.min(step, maxStep);
            this.actors.forEach(actor => {
                actor.act(thisStep, this, keys);
            });
            this.player.forEach(actor => {
                actor.act(thisStep, this, keys);

            });
            step -= thisStep;
        }
    }

    playerTouched(type, actor) {
        if (type == `lava` && this.status == null) {
            this.status=`lost`;
            return `dead`;
        } else if (type == `coin`) {
            this.actors = this.actors.filter(function (other) {
                return other != actor;
            });
            if (!this.actors.some(function (actor) {
                return actor.type == `coin`;
            })) {
                return `reachedGoal`;
            }
        } else if(type == `outOfMoves`){
            if (this.population.allPlayersDead()){
                console.log(`reached`)
                this.status = `lost`;
            }
        }
    }

    statusReset(){
        this.status=null;
    }

    playerPopulation(plan){
        this.player=[];
        const actorChars = {
            '@': Player
        };
        for (let y = 0; y < this.height; y++) {
            let line = plan[y], gridLine = [];
            for (let x = 0; x < this.width; x++) {
                let ch = line[x], fieldType = null;
                let Actor = actorChars[ch];
                if (Actor) {
                    if (ch == `@` && humanPlaying === false) {
                        for (let i = 0; i < populationSize; i++) {
                            this.player.push(new Actor(new Vector(x, y), ch));
                        }
                    }
                }
            }
        }
        if(this.population== null){
            this.population = new Population(this.player);
        }
        //console.log(this.population)
        //console.log(this.population.allPlayersDead())

        if(this.population.allPlayersDead()){
            this.population.calculateFitness();
            this.population.naturalSelection();
            this.population.mutateDemBabies();
            console.log(this.population);
            if (this.population.gen % 5== 0) {
                this.population.increaseMoves();
            }
        }

        
    }

    allPlayersInLevelDead(){
        if (this.population.allPlayersDead()){
            return true;
        }else{
            return false;
        }
    }
}