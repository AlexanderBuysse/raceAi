import {scale} from '../globalV/gameSetting.js';

export default class CanvasDisplay {
    constructor(level, canvas, ctx) {
        this.canvas= canvas;
        this.ctx = ctx
        this.level = level;
        console.log(level)
        this.drawFrame();
    }
    drawBackground() {
        this.level.grid.forEach((row, y) => {
            row.forEach((type, x) => {
                switch (type) {
                    case 'enemy':
                        this.ctx.fillStyle = 'rgb(255, 100, 100)';
                        this.ctx.fillRect(x * scale, y * scale, scale, scale);
                        break;
                    case 'wall':
                        this.ctx.fillStyle = 'rgb(0,0,139)';
                        this.ctx.fillRect(x * scale, y * scale, scale, scale);
                        break;
                }
            });
        });
    }
    drawActors() {
        this.level.actors.forEach(actor => {
            switch (actor.type) {
                case 'lava':
                    this.ctx.fillStyle = 'rgb(255, 100, 100)';
                    break;
                case 'coin':
                    this.ctx.fillStyle = 'rgb(241, 229, 89)';
                    break;
                case 'player':
                    this.ctx.fillStyle = 'rgb(64, 64, 64)';
                    break;
            }
            this.ctx.fillRect(actor.pos.x * scale, actor.pos.y * scale, actor.size.x * scale, actor.size.y * scale);
        });
    }
    drawFrame() {
        this.ctx.fillStyle = `black`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.scrollPlayerIntoView();
        this.drawBackground();
        this.drawActors();
        this.ctx.restore();
    }
    scrollPlayerIntoView() {
        let width = this.canvas.width;
        let height = this.canvas.height;
        let margin = width/3;

        console.log(width, height, margin)
        //console.log(this.level)
        let player = this.level.player[0];
        console.log(this.canvas.width);
        let center = player.pos.plus(player.size.times(1)).times(scale);
        console.log(center);
        
        this.ctx.translate(-center.x - margin + width-200, -center.y - margin + height);
    }
    clear() {
        console.log(this.canvas);
        //this.canvas.parentElement.removeChild(this.canvas);
    }
}