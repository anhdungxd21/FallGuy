export { Boss };
class Boss {
    constructor(ctx) {
        this.ctx = ctx;
        this.size = {
            w:500,
            h:500
        };
        this.defaultPosition = {
            x:42,
            y:541
        }
        this.position = {
            x: 42,
            y: 760
        };
        this.isShowUp = true;
    }

    specialAttack(){
        if (this.position.y > 280 && this.isShowUp){
            this.position.y -=5;
            if(this.position.y <= 280) this.showUp(false);
        } else {
            if(this.position.y <= 540){
                this.position.y += 2;
            }else {
                this.position.y = 541;
            }
        }
    }
    showUp(condition){
        this.isShowUp = condition;
    }
    move = function () {
        this.position.y -= this.speed;
        this.drawEnemy();
    }

    loadImage = function () {
        this.background = new Image();
        this.background.src = "images/boss.png";
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
