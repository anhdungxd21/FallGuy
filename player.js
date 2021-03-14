export { Player };
class Player{
    constructor(ctx, GAME_WIDTH) {
        this.hp = 4;
        this.position = {
            x: GAME_WIDTH/2-16,
            y:0
        }
        this.size = {
            w:32,
            h:32
        }
        this.ctx = ctx;
        this.imgSrc = "images/right-player.png"
    }
    getPlayerHp = function () {
        return this.hp;
    }
    loseHp = function () {
        this.hp--;
    }

    /** Player Movement */
    moveHorizontal = function (speed){
        this.position.x +=speed;
    }
    moveVertical = function (speed) {
        this.position.y += speed;
    }
    changeImageSrc = function (newSrc) {
        this.imgSrc = newSrc;
    }

    loadViewImage = function (){
        this.background = new Image();
        this.background.src = this.imgSrc;
        this.drawStatic();
    }
    drawStatic = function () {
        this.ctx.drawImage(
            this.background,
            this.position.x,
            this.position.y
        );
    }

    drawPlayer = function () {
        this.loadViewImage();
    }
}
