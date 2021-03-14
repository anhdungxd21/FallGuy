export { DrawImage };
class DrawImage {
    constructor(ctx, img, x, y) {
        this.ctx = ctx;
        this.img = img;
        this.move = -5;
        this.position = {
            x: x,
            y: y
        };
    }


    imageMove = function () {
        this.position.y += this.move;
    }
    loadImage = function () {
        this.background = new Image();
        this.background.src = this.img;
        this.drawStatic();
    }
    drawStatic = function () {
        this.ctx.drawImage(
            this.background,
            this.position.x,
            this.position.y
        )
    }
}
