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

/** Game value init */
let gravity = 1;
let score = 0;
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
        }
        if(gameState == GAME_STATE.MENU) gameState = GAME_STATE.START;
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

function borderDraw() {
    ctx.beginPath()
    ctx.moveTo(84,0);
    ctx.lineTo(84, GAME_HEIGHT);
    ctx.stroke();
    ctx.moveTo(500,0);
    ctx.lineTo(500, GAME_HEIGHT);
    ctx.stroke();
    ctx.closePath();
}//<-------------------------- drop

for (let i = 0; i < player.hp; i++) {
    let heart = new DrawImage(ctx,"images/heart.png", 10+sizeHeart, 10);
    heartArr.push(heart);
    console.log(heart.position.x);
    console.log(heart.position.y);
    sizeHeart +=20;
}

function displayHeart(){
    console.log(heartArr.length);
    heartArr.forEach(heart =>{
        heart.loadImage();
        console.log("x:" + heart.position.x + ", y:" +heart.position.y)
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

function gameOn(){
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
    // backgroundScroll();
    boss.drawEnemy();
    boss.specialAttack();
    displayHeart();
    clearCache();
    borderDraw();
    getUserInput();
    player.drawPlayer();
    player.moveVertical(gravity);
    bulletArr.forEach( bullet => {
        bullet.bulletDrop();
    });
    borderCheck()
    bulletTimeCount++;
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
    gameOn();
};
main();
