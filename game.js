function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}

var InputStatus = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
}

var Game = {};

Game.fps = 30;


Game.initialize = function() {
  this.entities = [];
  this.context = document.getElementById("canvas").getContext("2d");

  this.car = new Image();
  this.car.src = 'car.png';
  this.context.drawImage(this.car, 0, 0);
  this.carHeight = 141;
  this.carWidth = 93;
  this.frameHeight = 600;
  this.frameWidth = 800;
  //numero de ciclos rodados do jogo
  this.cycles = 0;

  this.rect_x = this.frameWidth / 2;
  this.rect_y = this.frameHeight - this.carWidth;
  this.pressedKeys = {
    left: false,
    up: false,
    right: false,
    down: false
  };

  
  var onkeydown = function(e) {
    var keyCode = e.keyCode;
    if (InputStatus[keyCode]) {
      e.preventDefault();
      this.pressedKeys[InputStatus[keyCode]] = true;
    }
  }
  var onkeyup = function(e) {
    var keyCode = e.keyCode;
    if (InputStatus[keyCode]) {
      e.preventDefault();
      this.pressedKeys[InputStatus[keyCode]] = false;
    }
  }
  document.addEventListener("keydown", bind(this, onkeydown), false);
  document.addEventListener("keyup", bind(this, onkeyup), false);
  
};


Game.draw = function() {
  this.context.clearRect(0, 0, this.frameWidth, this.frameHeight);

  var drawCar = function(){
    //img
    //x de corte
    //y de corte
    //largura da imagem
    //altura da imagem
    //x de onde colocar no canvas
    //y ''
    //largura da imagem final
    //altura da imagem final
    this.context.drawImage(this.car, 93 * (Math.ceil(this.cycles) % 4), 0, 93, 141, this.rect_x, this.rect_y, 93, 141);
  }
  drawCar.apply(this);
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
  if(this.pressedKeys.left){
    this.rect_x = this.rect_x - 5;
  }
  if(this.pressedKeys.right){
    this.rect_x = this.rect_x + 5;
  }
  if(this.pressedKeys.up){
    this.rect_y = this.rect_y - 5;
  }
  if(this.pressedKeys.down){
    this.rect_y = this.rect_y  + 5 ;
  }
  // =====
};


