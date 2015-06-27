/**
 * Created by yu on 2015/6/24.
 */
function Control(){
    this.code = { 37: 'left', 39: 'right', 38: 'jump', 40: 'down'}
    this.status = { 'left': false, 'right': false, 'jump': false, 'down': false };
    document.addEventListener("keydown",function(e){
        var status = this.code[e.keyCode];
        if(!status) return;
        this.status[status] = true;
    }.bind(this))
    document.addEventListener("keyup",function(e){
        var status = this.code[e.keyCode];
        if(!status) return;
        this.status[status] = false;
    }.bind(this))

}
function Map(img,size){
    this.background = resources.get("background1.png")
    this.x=0;
}
function Camera(ctx){
    this.ctx = ctx;
}
Camera.prototype.drawBackground = function(map){
    var canvas = this.ctx.canvas;
    this.ctx.drawImage(map.background,0,0,709,600,-(map.x%canvas.width),0,canvas.width,canvas.height)
    this.ctx.drawImage(map.background,0,0,709,600,canvas.width-(map.x%canvas.width),0,canvas.width,canvas.height)
}
Camera.prototype.drawLivings = function(livings){
    var ctx = this.ctx;
    ctx.save();
    livings.forEach(function(item,index){
        var actImg = item.imgs[item.act];
        ctx.drawImage(actImg.img,actImg.x,0,60,60,0,0,40,40)
    })
    ctx.restore();
}
function Livings(imgs,position){
    this.imgs = imgs;
    this.position= position;
    this.act="moveR";
}
Livings.prototype.spirit = function(act){
    this.imgs[act].x += this.imgs[act].spiritW;
    if(this.imgs[act].x==this.imgs[act].width) this.imgs[act].x=0;

}
function Player(imgs,position){
    Livings.call(this,imgs,position);
    this.lifes = 3;
}
inheritPrototype(Player,Livings);
Player.prototype.update = function(control){
    if(control.status.left){

    }
    if(control.status.right){
        this.spirit("moveR");
    }
}
function GameLoop(callback,fps){
    var fps = fps||60;
    this.callback = callback;
    this.lastTime = 0;
    this.interval = 1000/fps;
}

GameLoop.prototype.frame = function(time){
    if(time-this.lastTime>this.interval){
        this.callback()
        this.lastTime = time;
    }
    requestAnimationFrame(this.frame.bind(this))
}

function inheritPrototype(subType,superType){
    var prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}