var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided, trex_duck;
var ground, groundImage, invisibleGround;

var crow, crowAnimation;

var cloudImage, cloudsGroup;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obstaclesGroup

var score;

var jumpSound, dieSound, checkPointSound;

var gameoverImage, restartImage;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");
  trex_duck = loadImage("trex_duck.png");
  groundImage = loadImage("ground.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  crowAnimation = loadAnimation("taro_1.png", "taro_2.png");
  gameoverImage = loadImage("gameOver.png");
  restartImage = loadImage("restart.png");
}

function setup () {
  createCanvas(windowWidth, windowHeight);
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
  ground = createSprite(300, 190, 10, 10);
  ground.addImage("ground", groundImage);
  ground.x = ground.width/2
  trex = createSprite(50, 150, 10, 10);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("duck", trex_duck);
  trex.scale = 0.5;
  
  gameover = createSprite(250, 100);
  gameover.addImage(gameoverImage);
  gameover.scale = 0.5;
  
  restart = createSprite(250, 140);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  
  gameover.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(200, 193, 500, 10);
  

}

function draw() {
  background("white");
  
  if(gameState === PLAY){
    
    ground.velocityX = -6;
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    score = score+Math.round(frameCount/30);
    
    if(keyDown("space") && trex.y >= 150){
      trex.velocityY = -12;
      jumpSound.play();
    }
    
    if(keyDown("d")){
      trex.changeImage("duck", trex_duck)
    }else {
      trex.changeAnimation("running", trex_running)
    }
    
    if(score%100 === 0 && score>0){
      checkPointSound.play();
    }
    
    if(trex.isTouching(obstaclesGroup)){
      gameState = END;
      dieSound.play();
    }
    
    trex.velocityY = trex.velocityY + 0.8;
    
    spawnClouds();
    spawnObstacles();
    spawnCrows();
    
    text("score:" + score, 450, 100);
    
  } else if(gameState === END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    
    gameover.visible = true;
    restart.visible = true;
    
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided", trex_collided);
    
    if(touches.length>0 || keyDown("SPACE")){
      touches = [];
    }
    
    if(mousePressedOver(restart)){
      reset();
    }
  }
  
  invisibleGround.visible = false;
  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnClouds(){
  if(frameCount%60 === 0){
    var cloud = createSprite(550, 10, 10, 10);
    cloud.y = Math.round(random(10, 30));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -4;
    cloud.lifetime = 200
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if(frameCount%60 === 0){
    var obstacle = createSprite(400, 170, 10, 10);
    obstacle.velocityX = -6;
    
    var rand = Math.round(random(1, 6));
    
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
    }
    
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    
    obstaclesGroup.add(obstacle);
  }
}

function spawnCrows(){
   if(frameCount%500 === 0){
     crow = createSprite(550, 50, 10, 10);
     crow.addAnimation("flying", crowAnimation);
     crow.y = Math.round(random(30, 100));
     crow.velocityX = -6;
     crow.lifetime = 200;
     
     obstaclesGroup.add(crow);
   }
} 

function reset(){
  gameState = PLAY;
  gameover.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  
  score = 0;
}