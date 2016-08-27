"use strict";
function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
};

var InputDict = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};

var Car = {
  carHeight: 141,
  carWidth: 93,
  rect_x: 0,
  rect_y: 0,
  velocityX: 10,
  velocityY: 10,
  image: new Image(),
  initCar: function(frameHeight, frameWidth){
    this.rect_x = frameWidth / 2;
    this.rect_y = frameHeight - this.carWidth;
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
  moveCar: function(right, left, up, down, frameHeight, frameWidth){
    var newX = this.rect_x + (right ? this.velocityX : 0) - (left ? this.velocityX : 0);
    var newY = this.rect_y + (down ? this.velocityY : 0) - (up ? this.velocityY : 0);

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
Car.image.src = 'car.png';

var Game = Object.create(Car);
Game.fps = 30;


Game.initialize = function() {
  this.entities = [];
  this.context = document.getElementById("canvas").getContext("2d");
  
  this.frameHeight = 600;
  this.frameWidth = 800;
  this.initCar(this.frameHeight, this.frameWidth);
  
  //numero de ciclos rodados do jogo
  this.cycles = 0;

  
  this.pressedKeys = {
    left: false,
    up: false,
    right: false,
    down: false
  };

  
  var onkeydown = function(e) {
    var keyCode = e.keyCode;
    if (InputDict[keyCode]) {
      e.preventDefault();
      this.pressedKeys[InputDict[keyCode]] = true;
    }
  }
  var onkeyup = function(e) {
    var keyCode = e.keyCode;
    if (InputDict[keyCode]) {
      e.preventDefault();
      this.pressedKeys[InputDict[keyCode]] = false;
    }
  }
  document.addEventListener("keydown", bind(this, onkeydown), false);
  document.addEventListener("keyup", bind(this, onkeyup), false);
  
};


Game.draw = function() {
  this.context.clearRect(0, 0, this.frameWidth, this.frameHeight);

  this.drawCar(this.context);
  // Your code goes here
 
  // =====
  // Example
  //=====
};


Game.update = function() {
  // Your code goes here
  this.cycles ++;
  // =====
  // Example
  this.moveCar(this.pressedKeys.right, 
    this.pressedKeys.left, 
    this.pressedKeys.up, 
    this.pressedKeys.down, 
    this.frameHeight,
    this.frameWidth);
  // =====
};


