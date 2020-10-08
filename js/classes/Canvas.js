export default class CanvasDisplay {
    constructor(level, canvas, ctx) {
        this.canvas.width = canvas.width;
        this.canvas.height = canvas.height;
        this.ctx = ctx
        this.level = level;
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
        let margin = width / 3;

        let player = this.level.player;
        let center = player.pos.plus(player.size.times(0.5)).times(scale);

        this.ctx.translate(-center.x - margin + width, -center.y - margin + height);
    }
    clear() {
        this.canvas.parentNode.removeChild(this.canvas);
    }
}