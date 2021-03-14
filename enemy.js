export { Enemy };
class Enemy {
    constructor(ctx, size, speed) {
        this.ctx = ctx;
        this.speed = speed;
        this.size = {
            w:size,
            h:size
        };
        this.position = {
            x:Math.floor(Math.random()*380 + 100),
            y: 700
        };
    }

    move = function () {
        this.position.y -= this.speed;
        this.drawEnemy();
    }

    loadImage = function () {
        this.background = new Image();
        this.background.src = "images/Enemy.png";
        this.drawStatic();
    }
    drawStatic = function () {
        this.ctx.drawImage(
            this.background,
            this.position.x,
            this.position.y
        );
    }
    drawEnemy = function () {
        this.loadImage();
    }
}
