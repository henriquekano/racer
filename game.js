"use strict";
function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
};

var ObstacleFactory = {
  initObstacleFactory: function(){
    this.hole = {
      width: 75,
      height: 75,
      sideEffect: function(scoreObject){
        scoreObject.score -= 100;
      }
    };
    this.hole.image = new Image();
    this.hole.image.src = 'hole.png';

    this.otherCar = {
      width: 93,
      height: 141,
      sideEffect: function(carObject){
        carObject.carStatus.destroyed = true;
      }
    };
    this.otherCar.image = new Image();
    this.otherCar.image.src = 'otherCar.png';

    this.oilSpill = {
      width: 80,
      height: 80,
      sideEffect: function(){

      }
    };
    this.oilSpill.image = new Image();
    this.oilSpill.image.src = 'oilSpill.png';
  },
  createObstacle: function(lane1MiddleX, lane2MiddleX, lane3MiddleX, lane4MiddleX){
    var randomLane = Math.floor((Math.random() * 4) + 1);
    var randomObstacle = Math.floor((Math.random() * 3) + 1);

    var obstacle;
    if(randomObstacle === 1){
      obstacle = Object.create(this.hole);
    }else if(randomObstacle === 2){
      obstacle = Object.create(this.otherCar);
    }else if(randomObstacle === 3){
      obstacle = Object.create(this.oilSpill);
    }

    if(randomLane === 1){
      obstacle.x = lane1MiddleX - obstacle.width / 2;
    }else if(randomLane === 2){
      obstacle.x = lane2MiddleX - obstacle.width / 2;
    }else if(randomLane === 3){
      obstacle.x = lane3MiddleX - obstacle.width / 2;
    }else if(randomLane === 4){
      obstacle.x = lane4MiddleX - obstacle.width / 2;
    }
    
    obstacle.y = -obstacle.height;
    return obstacle;
    
  }
};

var Road = Object.create(ObstacleFactory);
  //velocidade inicial
Road.initRoad = function(){
  this.velocity = 4;
  this.velocityAdd = 2;
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
  this.lane1MiddleX = 80;
  this.lane2MiddleX = 291;
  this.lane3MiddleX = 507;
  this.lane4MiddleX = 713;
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
    obs.y += this.velocity;

    //remove os elementos que ja sairam  da tela
    if(obs.y > frameHeight){
     this.obstacles.splice(i, 1);
    }
  }
  //summon um se precisar obstaculo
  if(cycles % 100 == 0){
    var newObs = this.createObstacle(this.lane1MiddleX, this.lane2MiddleX, this.lane3MiddleX, this.lane4MiddleX);
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
  this.carHeight = 141;
  this.carWidth = 93;   
  this.velocityX = 10;
  this.velocityY = 10;
  this.image = new Image();
  this.image.src = 'car.png';
  this.x = frameWidth / 2;
  this.y = frameHeight - this.carWidth;
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
    this.image, this.carWidth * (Math.ceil(cycles) % 4), 
    0, this.carWidth, this.carHeight, this.x, this.y, this.carWidth, this.carHeight);
};
Car.moveCar = function(frameHeight, frameWidth){
  var newX = this.x + (this.pressedKeys.right ? this.velocityX : 0) - (this.pressedKeys.left ? this.velocityX : 0);
  var newY = this.y + (this.pressedKeys.down ? this.velocityY : 0) - (this.pressedKeys.up ? this.velocityY : 0);

  //Ta saindo da tela!!
  if(newX > frameWidth - this.carWidth){
    this.x = frameWidth - this.carWidth;
  }else if(newX < 0){
    this.x = 0;
  }else{
    this.x = newX;
  }

  
  if(newY > frameHeight - this.carHeight){
    //ta saindo da tela por baixo!
    this.y = frameHeight - this.carHeight;
  }else if(newY < 0){
    //ta saindo da tela por cima!
    this.y = 0;
  }else{
    this.y = newY;
  }
};
Car.collision = function(obstacles){
  for(var i = 0; i < obstacles.length; i++){
    var obstacle = obstacles[i];
    //if collision
    if(!(this.x > obstacle.x + obstacle.width ||
      this.x + this.width < obstacle.x ||
      this.y > obstacle.y + obstacle.height ||
      this.height + this.y < obstacle.y)) {
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
  this.carContext = document.getElementById("car-canvas").getContext("2d");
  this.obstaclesContext = document.getElementById("obstacles-canvas").getContext("2d");
  this.roadContext = document.getElementById("road-canvas").getContext("2d");

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

  this.drawCar(this.carContext, this.cycles);

  this.drawRoad(this.obstaclesContext, this.roadContext, this.frameHeight);

  document.getElementById("score").innerHTML = Math.ceil(this.score / 20);
};


Game.update = function() {
  this.cycles ++;
  this.score ++;

  this.updateCar(
    this.frameHeight,
    this.frameWidth,
    this.obstacles);

  this.updateRoad(this.cycles, this.frameHeight, this.frameWidth);
};

Game.end = function(){
  return this.carStatus.destroyed === true;
};