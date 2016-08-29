"use strict";
function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
};

var Animator = {
  animatorInit: function(){
    this.explosion = {
      image: new Image(),
      spriteWidth: 118.2,
      spriteHeight: 118,
      frames: 5,
      done: false
    }
    this.explosion.image.src = 'explosion.png';
  },
  explode: function(object, animationContext){
    var objectCenterX = (object.x + object.width) / 2;
    var objectCenterY = (object.y + object.height) / 2;

    var drawExplosion = function(image, xCut, yCut, width, height, canvasX, canvasY, finalWidth, finalHeight){
      animationContext.drawImage(
        image, //img
        xCut, yCut, //x, y de corte
        width, height, //largura e altura da imagem
        canvasX, canvasY, //x e y do canvas
        finalWidth, finalHeight)//largura e altura final
    };
      
    if(!this.explosion.done){
      for(var i = 0; i < this.explosion.frames; i++){
        var timeSpan = i === 0 ? 20 : 50;
        setTimeout(drawExplosion, timeSpan * (i + 1), this.explosion.image, //img
          i * this.explosion.spriteWidth, 0, //x, y de corte
          this.explosion.spriteWidth, this.explosion.spriteHeight, //largura e altura da imagem
          object.x, object.y, //x e y do canvas
          this.explosion.spriteWidth, this.explosion.spriteHeight);
      }
    }
    
  
  }
};
var CollisionDetector = Object.create(Animator);
CollisionDetector.collisionDetect = function(rect1, rect2){
  var xCollision;
  if(rect1.x >= rect2.x ){
    //rect1 esta a direita do obs
    xCollision = rect1.x <= rect2.x + rect2.width;
  }else if(rect1.x <= rect2.x ){
    //rect1 a esquerda do obs
    xCollision = rect1.x + rect1.width >= rect2.x;
  }
  var yCollision;
  if(rect1.y >= rect2.y){
    //rect1 abaixo do obs
    yCollision = rect1.y <= rect2.y + rect2.height
  }else if(rect1.y <= rect2.y){
    yCollision = rect1.y + rect1.height >= rect2.y;
  }

  return xCollision && yCollision;
  
};

var ObstacleFactory = Object.create(CollisionDetector);
ObstacleFactory.initObstacleFactory = function(){
  this.hole = {
    width: 75,
    velocity: 0,
    height: 75,
    sideEffect: function(scoreObject){
      scoreObject.score -= 1;
    }
  };
  this.hole.image = new Image();
  this.hole.image.src = 'hole.png';

  this.otherCar = {
    width: 93,
    height: 141,
    velocity: 5,
    sideEffect: function(scoreObject){
      scoreObject.carStatus.destroyed = true;
    }
  };
  this.otherCar.image = new Image();
  this.otherCar.image.src = 'otherCar.png';

  this.oilSpill = {
    width: 80,
    height: 80,
    velocity: 0,
    sideEffect: function(scoreObject){
      scoreObject.carStatus.oilSlide = true;
    }
  };
  this.oilSpill.image = new Image();
  this.oilSpill.image.src = 'oilSpill.png';
};
ObstacleFactory.createObstacle = function(lane1MiddleX, lane2MiddleX, lane3MiddleX, lane4MiddleX, lane5MiddleX){
  var randomObstacle = Math.floor((Math.random() * 3) + 1);
  var obstacle;
  if(randomObstacle === 1){
    obstacle = Object.create(this.hole);
  }else if(randomObstacle === 2){
    obstacle = Object.create(this.otherCar);
  }else if(randomObstacle === 3){
    obstacle = Object.create(this.oilSpill);
  }

  var randomLane = Math.floor((Math.random() * 5) + 1);
  if(randomLane === 1){
    obstacle.x = lane1MiddleX - obstacle.width / 2;
  }else if(randomLane === 2){
    obstacle.x = lane2MiddleX - obstacle.width / 2;
  }else if(randomLane === 3){
    obstacle.x = lane3MiddleX - obstacle.width / 2;
  }else if(randomLane === 4){
    obstacle.x = lane4MiddleX - obstacle.width / 2;
  }else if(randomLane === 5){
    obstacle.x = lane5MiddleX - obstacle.width / 2;
  }
  
  obstacle.y = -obstacle.height;
  return obstacle;
  
};

var Road = Object.create(ObstacleFactory);
  //velocidade inicial
Road.initRoad = function(){
  this.velocity = 10;
  this.velocityAdd = 1;
  this.obstacles = [];
  this.initObstacleFactory();
  this.background = {
    image: new Image(),
    x: 0,
    y: 0,
    height: 600,
    width: 800
  };
  this.background.image.src = 'background.png';
  this.lane1MiddleX = 67;
  this.lane2MiddleX = 231;
  this.lane3MiddleX = 400;
  this.lane4MiddleX = 563;
  this.lane5MiddleX = 725;
};
Road.updateRoad = function(cycles, frameHeight, frameWidth){
  //Aumenta a velocidade
  if(cycles % 100 == 0){
    this.velocity += this.velocityAdd;
  }

  //update background
  this.background.y += this.velocity;
  if (this.background.y >= frameHeight){
    this.background.y = 0;
  }
  
  for(var i = 0; i < this.obstacles.length; i++){

    //update a posicao dos obstaculos
    var obs = this.obstacles[i];
    obs.y += this.velocity - obs.velocity;

    //remove os elementos que ja sairam  da tela
    if(obs.y > frameHeight){
     this.obstacles.splice(i, 1);
    }
  }
  //summon um se precisar obstaculo
  if(cycles % 30 == 0){
    var newObs = this.createObstacle(this.lane1MiddleX, this.lane2MiddleX, this.lane3MiddleX, this.lane4MiddleX, this.lane5MiddleX);
    this.obstacles.push(newObs);
  }
};
Road.drawRoad = function(obstaclesContext, backgroundContext, frameHeight){

  backgroundContext.drawImage(this.background.image, this.background.x, this.background.y);
  backgroundContext.drawImage(this.background.image, this.background.x, this.background.y - this.background.height);

  for(var i = 0; i < this.obstacles.length; i++){
    var obs = this.obstacles[i];
    obstaclesContext.drawImage(
      obs.image, obs.x, obs.y, obs.width, obs.height
    );
  }
};

var Car = Object.create(Road);
Car.initCar = function(frameHeight, frameWidth){
  this.animatorInit();
  this.pressedKeys = {
    left: false,
    up: false,
    right: false,
    down: false
  };
  this.INPUT_DICT = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  };
  this.carStatus = {
    oilSlide: false,
    invincible: false,
    destroyed: false
  };
  this.height = 141;
  this.width = 93;   
  this.velocityX = 10;
  this.velocityY = 10;
  this.image = new Image();
  this.image.src = 'car.png';
  this.x = frameWidth / 2;
  this.y = frameHeight - this.height;
  var onkeydown = function(e) {
    var keyCode = e.keyCode;
    if (this.INPUT_DICT[keyCode]) {
      e.preventDefault();
      this.pressedKeys[this.INPUT_DICT[keyCode]] = true;
    }
  }
  var onkeyup = function(e) {
    var keyCode = e.keyCode;
    if (this.INPUT_DICT[keyCode]) {
      e.preventDefault();
      this.pressedKeys[this.INPUT_DICT[keyCode]] = false;
    }
  }
  document.addEventListener("keydown", bind(this, onkeydown), false);
  document.addEventListener("keyup", bind(this, onkeyup), false);
};
Car.drawCar = function(context, cycles){
  //img
  //x de corte
  //y de corte
  //largura da imagem
  //altura da imagem
  //x de onde colocar no canvas
  //y ''
  //largura da imagem final
  //altura da imagem final

  context.drawImage(
    this.image, this.width * (Math.ceil(cycles) % 4), 
    0, this.width, this.height, this.x, this.y, this.width, this.height);
};
Car.moveCar = function(frameHeight, frameWidth){
  var newX;
  var newY;
  if(!this.carStatus.oilSlide){
    newX = this.x + (this.pressedKeys.right ? this.velocityX : 0) - (this.pressedKeys.left ? this.velocityX : 0);
    newY = this.y + (this.pressedKeys.down ? this.velocityY : 0) - (this.pressedKeys.up ? this.velocityY : 0);
  }else{
    newX = this.x;
    newY = this.y - this.velocityY;

  }
  //Ta saindo da tela!!
  if(newX > frameWidth - this.width){
    this.carStatus.oilSlide = false;
    this.x = frameWidth - this.width;
  }else if(newX < 0){
    this.carStatus.oilSlide = false;
    this.x = 0;
  }else{
    this.x = newX;
  }

  
  if(newY > frameHeight - this.height){
    //ta saindo da tela por baixo!
    this.y = frameHeight - this.height;
    this.carStatus.oilSlide = false;
  }else if(newY < 0){
    //ta saindo da tela por cima!
    this.y = 0;
    this.carStatus.oilSlide = false;
  }else{
    this.y = newY;
  }
  
};
Car.collision = function(obstacles){
  for(var i = 0; i < obstacles.length; i++){
    var obstacle = obstacles[i];
    var collision = this.collisionDetect(this, obstacle);
    if(collision) {
      obstacle.sideEffect(this);
    }
  }
  
};
Car.updateCar = function(frameHeight, frameWidth, obstacles){
  this.moveCar(frameHeight, frameWidth);
  this.collision(obstacles);
};



//linca com o carro
var Game = Object.create(Car);
Game.fps = 30;


Game.initialize = function() {
  document.getElementById('end-card').className = "hide";
  this.carContext = document.getElementById("car-canvas").getContext("2d");
  this.obstaclesContext = document.getElementById("obstacles-canvas").getContext("2d");
  this.roadContext = document.getElementById("road-canvas").getContext("2d");
  this.animationContext = document.getElementById("animation-canvas").getContext("2d");

  this.frameHeight = 600;
  this.frameWidth = 800;
  this.initCar(this.frameHeight, this.frameWidth);
  this.initRoad();
  this.score = 0;
  
  //numero de ciclos rodados do jogo
  this.cycles = 0;  
};


Game.draw = function() {
  this.carContext.clearRect(0, 0, this.frameWidth, this.frameHeight);
  this.obstaclesContext.clearRect(0, 0, this.frameWidth, this.frameHeight);
  this.roadContext.clearRect(0, 0, this.frameWidth, this.frameHeight);
  this.animationContext.clearRect(0, 0, this.frameWidth, this.frameHeight);

  this.drawCar(this.carContext, this.cycles);
  this.drawRoad(this.obstaclesContext, this.roadContext, this.frameHeight);

  document.querySelector(".score-value").innerHTML = Math.ceil(this.score);
};


Game.update = function() {
  this.cycles ++;
  this.score += 1 / 20;

  this.updateCar(
    this.frameHeight,
    this.frameWidth,
    this.obstacles);

  this.updateRoad(this.cycles, this.frameHeight, this.frameWidth);
};

Game.end = function(){
  return this.carStatus.destroyed === true;
};

window.cancelRequestAnimFrame = ( function() {
    return window.cancelAnimationFrame          ||
        window.webkitCancelRequestAnimationFrame    ||
        window.mozCancelRequestAnimationFrame       ||
        window.oCancelRequestAnimationFrame     ||
        window.msCancelRequestAnimationFrame        ||
        clearTimeout
} )();
Game.finalize = function(end){
  if(end){
    var previousScore = localStorage.highscore || 0;
    if(previousScore < this.score){
      localStorage.setItem('highscore', Math.ceil(this.score));
    }else{
      localStorage.setItem('highscore', Math.ceil(previousScore));
    }
    document.querySelector(".score-value-end").innerHTML = Math.ceil(this.score);
    document.querySelector('.highscore').innerHTML = localStorage.highscore;
    document.getElementById('end-card').className = "show";
    this.explode(this, this.animationContext, this.cycles);
  }
  
};

Game.run = (function() {
  var loops = 0, skipTicks = 1000 / Game.fps,
  maxFrameSkip = 10,
  nextGameTick = (new Date).getTime();
  Game.initialize();
  return function() {
    loops = 0;
    var end = Game.end();
    if(!end){
      Game.draw();
      while ((new Date).getTime() > nextGameTick) {
        Game.update();
        nextGameTick += skipTicks;
        loops++;
      }
    }
    Game.finalize(end);
    
  };
})();

(function() {
    var onEachFrame;
    if (window.webkitRequestAnimationFrame) {
      onEachFrame = function(cb) {
        var _cb = function() { 
          cb(); 
          webkitRequestAnimationFrame(_cb); 
        }
        _cb();
      };
    }
    else if (window.mozRequestAnimationFrame) {
      onEachFrame = function(cb) {
        var _cb = function() { 
          cb(); 
          mozRequestAnimationFrame(_cb); 
        }
        _cb();
      };
    }
    else {
      onEachFrame = function(cb) {
        setInterval(cb, 1000 / 60);
      }
    }

    window.onEachFrame = onEachFrame;
})();
window.onEachFrame(Game.run);
document.getElementById("reset-button").addEventListener("click", function(){
  location.reload();
});