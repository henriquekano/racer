"use strict";
function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
};

var Car = {
  
  initCar: function(frameHeight, frameWidth){
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
    this.carHeight = 141;
    this.carWidth = 93;   
    this.velocityX = 10;
    this.velocityY = 10;
    this.image = new Image();
    this.image.src = 'car.png';
    this.rect_x = frameWidth / 2;
    this.rect_y = frameHeight - this.carWidth;
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
  },
  drawCar: function(context){
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
      this.image, this.carWidth * (Math.ceil(this.cycles) % 4), 
      0, this.carWidth, 141, this.rect_x, this.rect_y, this.carWidth, 141);
  },
  moveCar: function(frameHeight, frameWidth){
    var newX = this.rect_x + (this.pressedKeys.right ? this.velocityX : 0) - (this.pressedKeys.left ? this.velocityX : 0);
    var newY = this.rect_y + (this.pressedKeys.down ? this.velocityY : 0) - (this.pressedKeys.up ? this.velocityY : 0);

    //Ta saindo da tela!!
    if(newX > frameWidth - this.carWidth){
      this.rect_x = frameWidth - this.carWidth;
    }else if(newX < 0){
      this.rect_x = 0;
    }else{
      this.rect_x = newX;
    }

    
    if(newY > frameHeight - this.carHeight){
      //ta saindo da tela por baixo!
      this.rect_y = frameHeight - this.carHeight;
    }else if(newY < 0){
      //ta saindo da tela por cima!
      this.rect_y = 0;
    }else{
      this.rect_y = newY;
    }
  }
};

var ObstacleFactory = {
  initObstacleFactory: function(){
    this.hole = {
      width: 75,
      height: 75
    };
    this.hole.image = new Image();
    this.hole.image.src = 'hole.png';
  },
  createObstacle: function(){
    var obstacle = 
  }
};
var Road = Object.create(ObstacleFactory);
  //velocidade inicial
Road.initRoad = function(){
  this.velocity = 10;
  this.velocityAdd = 2;
  this.obstacles = [];
};
Road.updateRoad = function(cycles){
  //Aumenta a velocidade
  if(cycles % 100 == 0){
    this.velocity += this.velocityAdd;
  }

  //summon um obstaculo
  if(cycles % 1000 == 0){
    var newObs = initObstacleFactory();

  }
};


//linca com o carro
var Game = Object.create(Car);
Game.fps = 30;


Game.initialize = function() {
  this.context = document.getElementById("canvas").getContext("2d");
  
  this.frameHeight = 600;
  this.frameWidth = 800;
  this.initCar(this.frameHeight, this.frameWidth);
  
  //numero de ciclos rodados do jogo
  this.cycles = 0;  
};


Game.draw = function() {
  this.context.clearRect(0, 0, this.frameWidth, this.frameHeight);

  this.drawCar(this.context);
};


Game.update = function() {
  this.cycles ++;

  this.moveCar(
    this.frameHeight,
    this.frameWidth);
};