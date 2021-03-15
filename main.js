import { Player } from './player.js';
import { Bullet } from "./bullet.js";
import { Enemy } from "./enemy.js";
import { DrawImage } from "./draw-image.js";
import { Boss } from "./boss.js";


/** Canvas Initialization */
let c = document.getElementById("myGame");
let ctx = c.getContext("2d");

/** Game State Initialization */
const GAME_WIDTH = 600;
const GAME_HEIGHT = 720;
const LEFT_BORDER = 100;
const RIGHT_BORDER = 500;
const GAME_STATE = {
    MENU:0,
    START:1,
    OVER:2
}
let gameState = GAME_STATE.MENU;

/** Musics and sounds */
let themeSong = document.createElement("audio");
themeSong.src = "sounds/themeSong.mp3";
let laserShoot = document.createElement("audio");
laserShoot.src = "sounds/Laser_Shoot.wav";
let explosion = document.createElement("audio");
explosion.src = "sounds/Explosion.wav";

/** Game value init */
let gravity = 1;
let bossAttack = true;
let score = 0;
let timeLoop = 0;
let bossShow = 0;
let difficult = 30;
let bulletTimeCount = 60;
let isShoot = true;
let keys = [];

/** 2D collision detective */
function isCollision (obj1, obj2){
    /** Object 1 position */
    let topObj1 = obj1.position.y;
    let bottomObj1 = obj1.position.y + obj1.size.h;
    let leftObj1 = obj1.position.x;
    let rightObj1 = obj1.position.x + obj1.size.w;

    /** Onject 2 position */
    let topObj2 = obj2.position.y;
    let bottomObj2 = obj2.position.y + obj2.size.h;
    let leftObj2 = obj2.position.x;
    let rightObj2 = obj2.position.x + obj2.size.w;

    /** AABB Collision Detection */
    let leftCheck = leftObj1 > leftObj2 && leftObj1 < rightObj2;
    let rightCheck = rightObj1 > leftObj2 && rightObj1 < rightObj2;
    let horizontalCheck = leftCheck || rightCheck;

    let topCheck = topObj1 > topObj2 && topObj1 < bottomObj2;
    let bottomCheck = bottomObj1 > topObj2 && bottomObj1 < bottomObj2;
    let verticalCheck = topCheck || bottomCheck;

    return  horizontalCheck && verticalCheck;
}


/** PLayer Initialization */
let player = new Player(ctx,GAME_WIDTH);
const bulletArr = [];
const enemyArr = [];
const backgroundArr = [];
const heartArr = [];
let sizeHeart = 0;

let maxJump = 10;
let isJump = false;
let speedPlayer = 3;
let goHorizontal = 0;
let goVertical = 0;
let turnLeftImgSrc = "images/left-player.png";
let turnRightImgSrc = "images/right-player.png";
let friction = 0.85;
function borderCheck() {
    if (player.position.x < LEFT_BORDER - player.size.w/2){
        goHorizontal = 0;
    }
    if (player.position.x > RIGHT_BORDER-player.size.w){
        goHorizontal = 0;
    }
    if(player.position.y < 10){
        player.position.y = player.position.y;
        isJump = false;
    }
}
function getUserInput() {
    /** Turn to left */
    if(keys[65]){
        if (player.position.x < LEFT_BORDER - player.size.w/2){
            goHorizontal = 0;
        }else if (goHorizontal > -speedPlayer){
            goHorizontal--;
        }
        player.changeImageSrc(turnLeftImgSrc);
    }
    /** Turn to right */
    if(keys[68]){
        if (player.position.x > RIGHT_BORDER-player.size.w){
            goHorizontal = 0;
        }else if (goHorizontal < speedPlayer){
            goHorizontal++;
        }
        player.changeImageSrc(turnRightImgSrc);
    }
    /** Jumping */
    if(keys[32]) {
        if(bulletTimeCount >= 15 && isShoot) {
            let bullet = new Bullet(player.position.x +16, player.position.y-10, 10,ctx);
            bulletArr.push(bullet);
            bulletTimeCount = 0;
            isShoot = false;
            isJump = true;
            laserShoot.play();
        }
        if(gameState == GAME_STATE.MENU) gameState = GAME_STATE.START;
        console.log("space");
    }

    /** Jump Check */
    if(isJump && goVertical < maxJump){
        goVertical+=3;
    }else {
        isJump = false;
    }

    goVertical *=friction;

    player.moveHorizontal(goHorizontal*friction);
    player.moveVertical(-goVertical);
}

/** Health Point draw */

for (let i = 0; i < player.hp; i++) {
    let heart = new DrawImage(ctx,"images/heart.png", 10+sizeHeart, 10);
    heartArr.push(heart);
    sizeHeart +=20;
}

function displayHeart(){
    console.log(player.hp);
    heartArr.forEach(heart =>{
        heart.loadImage();
    })
}

/** Spawn Enemy and check collision */
function spawnEnemy () {
    if (enemyArr.length <= 20 && timeLoop >= difficult){
        let enemy = new Enemy(ctx,32,3)
        enemyArr.push(enemy);
        timeLoop = 0;
    }
    enemyArr.forEach((enemy, index) => {
        enemy.move();
        if (isCollision(player,enemy)){
            enemyArr.splice(index,1);
            player.loseHp();
            heartArr.pop();
            explosion.play();
        }
        if (enemy.position.y < -300) {
            enemyArr.splice(index,1);
        }
        bulletArr.forEach((bullet, bulletCount)=>{
            if (isCollision(bullet,enemy) ){
                score+=50;
                enemyArr.splice(index,1);
                explosion.play();
                bulletArr.splice(bulletCount,1);
            }
        })
    })
}

/** Collision with boss and push back player */
function bossCollision(){
    if(isCollision(player,boss)){
        player.loseHp();
        heartArr.pop();
        explosion.play();
        if(goVertical < maxJump){
            goVertical+=20;
        }
    }
    bulletArr.forEach((bullet, bulletCount)=>{
        if (isCollision(bullet,boss) ){
            explosion.play();
            bulletArr.splice(bulletCount,1);
        }
    })
}

function backgroundScroll() {
    if (backgroundArr.length == 0) {
        let background = new DrawImage(ctx, "images/Background.png",0, 0);
        backgroundArr.push(background);
    }else if (backgroundArr.length < 4){
        let background = new DrawImage(ctx, "images/Background.png",0, 695);
        backgroundArr.push(background);
    }
    backgroundArr.forEach((item,index) => {
        item.loadImage();
        item.imageMove();
        if(item.position.y <-695){
            backgroundArr.shift();
        }
    })
}

function clearCache() {
    if(bulletArr.length >= 10){
        bulletArr.shift();
    }

}
let boss = new Boss(ctx);

function menuScreen(){
    ctx.rect(0,0,GAME_WIDTH,GAME_HEIGHT);
    ctx.fillStyle = "#000";
    ctx.fill();

    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Press SPACE To Start",GAME_WIDTH/2,GAME_HEIGHT/2)
}

function gameOn(){
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    backgroundScroll();
    spawnEnemy ();
    drawScore()
    bossCollision();
    if (bossShow > 100){
        boss.specialAttack();
        boss.drawEnemy();
        if(bossShow > 500){
            bossShow = 0;
            boss.showUp(true);
        }
    }
    console.log(bossShow);
    displayHeart();
    clearCache();
    player.drawPlayer();
    player.moveVertical(gravity);
    bulletArr.forEach( bullet => {
        bullet.bulletDrop();
    });
    borderCheck()
    bulletTimeCount++;
    timeLoop++;
    bossShow++;
    if(player.hp <=0 || player.position.y >= 760){
        gameState = GAME_STATE.OVER;
        explosion.play();
        themeSong.pause();
    }
}

function gameOver(){
    ctx.rect(0,0,GAME_WIDTH,GAME_HEIGHT);
    ctx.fillStyle = "#000";
    ctx.fill();
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER",GAME_WIDTH/2,GAME_HEIGHT/2)
    ctx.fillText(`Sore: ${score}`,GAME_WIDTH/2,GAME_HEIGHT/2+50);
}

function room(){
    switch (gameState) {
        case GAME_STATE.MENU:
            menuScreen();
            break;
        case GAME_STATE.START:
            gameOn();
            break;
        case GAME_STATE.OVER:
            gameOver();
            break;

    }
}


function drawScore(){
    ctx.font = "20px Arial";
    ctx.fillStyle = 'red';
    ctx.fillText(`Score: ${score}`,500,23);
}

/** Game loop */
document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
    isShoot = true;
});


window.main = function () {
    window.requestAnimationFrame(main);
    if(gameState == GAME_STATE.START){
        themeSong.play();
    }
    getUserInput();
    room();
};
main();
