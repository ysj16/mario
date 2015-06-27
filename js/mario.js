/**
 * Created by yu on 2015/6/24.
 */
//游戏控制类
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
//游戏地图类
function Map(img,size){
    this.background = resources.get("background1.png")
    this.x=0;
}
Map.prototype.update = function(control,player,canvas){
    if(control.status.right){
        if(player.position.x>=canvas.width/2)
            this.x += player.speedX;
    }
}
//camera类，用于渲染游戏画面
function Camera(canvas){
    this.ctx = canvas.getContext("2d");
}
Camera.prototype.drawBackground = function(map){
    var canvas = this.ctx.canvas;
    this.ctx.drawImage(map.background,0,0,709,600,-(map.x%canvas.width),0,canvas.width,canvas.height)
    this.ctx.drawImage(map.background,0,0,709,600,canvas.width-(map.x%canvas.width),0,canvas.width,canvas.height)
}
Camera.prototype.drawLivings = function(livings){
    var ctx = this.ctx;
    livings.forEach(function(item,index){
        var actImg = item.imgs[item.act];
        var renderW = actImg.renderW||actImg.img.width,
            renderH = actImg.renderH||actImg.img.height;
        ctx.drawImage(actImg.img,actImg.x,0,actImg.spiritW,actImg.img.height,item.position.x,0,renderW,renderH)
    })
}
Camera.prototype.drawModels = function(models,map){
    var ctx = this.ctx;
    models.forEach(function(item,index){
        var actImg = item.imgs[item.act];
        var renderW = actImg.renderW||actImg.img.width,
            renderH = actImg.renderH||actImg.img.height;
        item.position.forEach(function(position,index){
            for(var i = 0;i<position.width;i++){
                for(var j=0;j<position.height;j++){
                    ctx.drawImage(actImg.img,position.x+i*renderW-map.x,position.y+j*renderH,renderW,renderH)
                }
            }
        })

    })
}
//模型类
function Model(imgs,position){
    this.imgs = imgs;
    this.position = position;
    this.act = "default";
}
//生物类，继承模型类
function Livings(imgs,position){
    Model.call(this,imgs,position)
    this.act="moveR";
}
inheritPrototype(Model,Livings)
Livings.prototype.spirit = function(act){
    this.imgs[act].x += this.imgs[act].spiritW;
    if(this.imgs[act].x == this.imgs[act].img.width) this.imgs[act].x=0;

}
Livings.prototype.move = function(x,y){
    this.position.x += x;
    this.position.y +=y;
}
//玩家类，继承生物类
function Player(imgs,position){
    Livings.call(this,imgs,position);
    this.lifes = 3;
    this.speedX = 3;
}
inheritPrototype(Player,Livings);
Player.prototype.update = function(control,canvas){
    if(control.status.left){
        this.act = "moveL";
        this.move(-this.speedX,0)
        this.spirit("moveL")
    }
    if(control.status.right){
        this.act = "moveR";
        if(this.position.x<canvas.width/2) {
            this.move(this.speedX, 0)
        }
        this.spirit("moveR");
    }
}
//游戏循环类，用于控制游戏循环
function GameLoop(callback,fps){
    var fps = fps||60;
    this.callback = callback;
    this.lastTime = 0;
    this.interval = 1000/fps;
}
GameLoop.prototype.start = function(callback){
    this.callback = callback
    requestAnimationFrame(this.frame.bind(this))
}
GameLoop.prototype.frame = function(time){
    if(time-this.lastTime>this.interval){
        this.callback(time)
        this.lastTime = time;
    }
    requestAnimationFrame(this.frame.bind(this))
}

//组合寄生式继承类的原型
function inheritPrototype(subType,superType){
    var prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}