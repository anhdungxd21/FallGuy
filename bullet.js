export { Bullet };
class Bullet {
    constructor(x, y, speed, ctx) {
        this.position = {
            x:x,
            y:y
        }
        this.size = {
            w:10,
            h:20
        }
        this.speed = speed;
        this.ctx = ctx;
    }
    bulletDrop = function (){
        this.position.y += this.speed;
        this.drawBullet();
    }
    drawBullet = function () {
        this.ctx.beginPath();
        this.ctx.fillStyle ="#ff7171";
        this.ctx.fillRect(this.position.x, this.position.y, this.size.w, this.size.h)
        this.ctx.closePath();
    }
}
