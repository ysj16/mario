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
Map.prototype.update = function(control,player,canvas,interTime){
    if(control.status.right){
        if(player.position.x-this.x>=canvas.width/2)
            this.x += player.speed.x*interTime/1000;
    }
}

//模型类
function Model(imgs,position){
    this.imgs = deepClone(imgs);
    this.position = position;
    this.act = "default";
}
Model.prototype.alls = [];//画面中需要被检测渲染的所有模型，包括生物，场景
Model.prototype.map;//所在的地图
//生物类，继承模型类
function Livings(imgs,position){
    Model.call(this,imgs,position)
    this.crush = {left:false,right:false,top:false,bottom:false};
    this.speed = {x:-30,y:0};
    this.act="default";
    this.isAlive = true;
}
inheritPrototype(Livings,Model)
Livings.prototype.spirit = function(act){
    this.imgs[act].x += this.imgs[act].spiritW;
    if(this.imgs[act].x == this.imgs[act].img.width) this.imgs[act].x=0;

}
Livings.prototype.move = function(x,y){
    if(this.isAlive) this.collide(Livings.prototype.onCrush);
    if(x>0&&!this.crush.right)
        this.position.x += x;
    else if(x<0&&!this.crush.left)
        this.position.x += x;
    if(y>0&&!this.crush.bottom||!this.isAlive)
        this.position.y +=y;
    else if(y<0&&!this.crush.top)
        this.position.y +=y;
    //console.log(this.speed)
}
Livings.prototype.autoMove = function(interTime){
    //if(this.crush.left) this.speed.x = -this.speed.x;
    this.move(this.speed.x*interTime/1000,0);
    this.spirit("default");
    this.gravity(400, interTime / 1000)
    //console.log(this.imgs["default"])
}
Livings.prototype.die =function(){
    if(this.isAlive) {
        this.isAlive = false;
        this.act= "die";
    }
}
Livings.prototype.gravity = function(g,interTime){//添加重力
    if(this.position.y<CHEIGHT+100&&!this.crush.bottom||!this.isAlive){
        this.move(0,this.speed.y*interTime + g*interTime*interTime/2);
        this.speed.y += g*interTime;
    }
}
Livings.prototype.collide = function(callback){//碰撞检测
    var tImg = this.imgs[this.act],
        tCenter = {x:this.position.x + tImg.renderW/2,y:this.position.y + tImg.renderH/2},
        that = this;
    var tCrushW = tImg.crushW||tImg.renderW,
        tCrushH = tImg.crushH||tImg.renderH;
    this.crush = {left:false,right:false,top:false,bottom:false};
    this.alls.forEach(function(model,index){
        if(model!==that) {
            var mImg = model.imgs[model.act],
                mCrushW = mImg.crushW || mImg.renderW,
                mCrushH = mImg.crushH || mImg.renderH;
            var mCenter = {x: model.position.x + mImg.renderW / 2, y: model.position.y + mImg.renderH / 2};
            if (Math.abs(tCenter.x - mCenter.x) < (tCrushW / 2 + mCrushW / 2) && Math.abs(tCenter.y - mCenter.y) < (tCrushH / 2 + mCrushH / 2)+2) {
                //if(model.constructor==Player) console.log(tCenter.y - mCenter.y > 0, tCenter.y - mCenter.y <= tCrushH / 2 + mCrushH / 2  , Math.abs(tCenter.x - mCenter.x) < (tCrushW / 2 + mCrushW / 2)-12)
                if (tCenter.x - mCenter.x > 0 && tCenter.x - mCenter.x < tCrushW / 2 + mCrushW / 2 && Math.abs(tCenter.y - mCenter.y) < (tCrushH / 2 + mCrushH / 2)) {
                    that.crush.left = true;
                }
                if (tCenter.x - mCenter.x < 0 && mCenter.x - tCenter.x < tCrushW / 2 + mCrushW / 2 && Math.abs(tCenter.y - mCenter.y) < (tCrushH / 2 + mCrushH / 2)) {
                    that.crush.right = true;
                }
                if (tCenter.y - mCenter.y > 0 && tCenter.y - mCenter.y <= tCrushH / 2 + mCrushH / 2  && Math.abs(tCenter.x - mCenter.x) < (tCrushW / 2 + mCrushW / 2)-12) {
                    that.crush.top = true;
                    that.speed.y = 0;
                    that.position.y +=1;
                }
                if (tCenter.y - mCenter.y < 0 && mCenter.y - tCenter.y < tCrushH / 2 + mCrushH / 2+2 && Math.abs(tCenter.x - mCenter.x) < (tCrushW / 2 + mCrushW / 2)-12) {
                    that.crush.bottom = true;
                    that.position.y = model.position.y-tImg.renderH;//修正碰撞之后物体的位置
                }

                that.onCrush&&that.onCrush(model);

            }
        }

    })
}
//玩家类，继承生物类
function Player(imgs,position,callbacks){
    Livings.call(this,imgs,position);
    this.speed = {x:80,y:0};
    this.lifes = 3;
    this.act="moveR";
    this.onCrush = callbacks.onCrush
}
inheritPrototype(Player,Livings);
Player.prototype.die =function(){
    if(this.isAlive) {
        this.isAlive = false;
        this.speed = {x: 0, y: -400};
    }
}
Player.prototype.update = function(control,canvas,interTime,loop){//更新状态
    var moveX=0,moveY= 0,direction = this.act.slice(-1),ctx = canvas.getContext("2d");
    //控制左右行走，跳跃
    if(control.status.left){
        moveX = -this.speed.x * interTime / 1000;
        direction = "L";
        this.spirit("move"+direction)
    }
    if(control.status.right){
        if (this.position.x-this.map.x < canvas.width / 2) {
            moveX = this.speed.x * interTime / 1000;
            direction = "R";
        }
        this.spirit("move"+direction)
    }
    if(control.status.jump){
        if(this.crush.bottom) {
            this.speed.y = -256;
            moveY = this.speed.y * interTime / 1000;
        }
    }
    if(this.crush.bottom){
        this.act = "move"+direction;
    }
    else{
        this.act = "jump"+direction;
    }

    this.move(moveX, moveY)
    this.gravity(400, interTime / 1000)
    if(this.position.y>CHEIGHT){
        this.die();
    }
    if(!this.isAlive){
        loop.info.gameover=true;
    }
    //console.log(this.position)
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
Camera.prototype.drawLivings = function(livings,map){
    var ctx = this.ctx;
    livings.forEach(function(item,index){
        var actImg = item.imgs[item.act];
        var renderW = actImg.renderW||actImg.img.width,
            renderH = actImg.renderH||actImg.img.height,
            spiritW = actImg.spiritW||actImg.img.width;
        //console.log(actImg.img,actImg.x,0,spiritW,actImg.img.height,item.position.x,item.position.y,renderW,renderH)
        ctx.drawImage(actImg.img,actImg.x,0,spiritW,actImg.img.height,item.position.x-map.x,item.position.y,renderW,renderH)
    })
}
Camera.prototype.drawModels = function(models,map){
    var ctx = this.ctx;
    models.forEach(function(item,index){
        var actImg = item.imgs[item.act];
        var renderW = actImg.renderW||actImg.img.width,
            renderH = actImg.renderH||actImg.img.height;
        ctx.drawImage(actImg.img,item.position.x-map.x,item.position.y,renderW,renderH)
    })
}
Camera.prototype.drawGameInfos = function(infos){
    var ctx = this.ctx;
    if(infos.gameover){
        ctx.font = "30px Arial";
        ctx.fillStyle="#f00";
        ctx.fillText('Game Over',230,180);
    }
}
//游戏循环类，用于控制游戏循环
function GameLoop(callback,fps){
    var fps = fps||60;
    this.callback = callback;
    this.lastTime = 0;
    this.interval = 1000/fps;
    this.info = {};
}

GameLoop.prototype.frame = function(time){
    var interTime = time - this.lastTime;
    if(interTime>this.interval){
        this.callback(interTime)
        this.lastTime = time;
    }
    requestAnimationFrame(this.frame.bind(this))
}

//获取参与渲染计算的模型
function getRenderModels(models,map){
    var arr = [];
    models.forEach(function(item,index){
       if(item.position.x-map.x >= -DEFLENGTH && item.position.x-map.x <= CWIDTH){
           arr.push(item)
       }

    })
    return arr;
}

//组合寄生式继承类的原型
function inheritPrototype(subType,superType){
    var prototype = Object.create(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
//对象深复制
function deepClone(obj){
    var clone = obj.constructor==Object?{}:[];
    for(var i in obj){
        if(obj[i].constructor == Object||obj[i].constructor == Array){
            clone[i] = deepClone(obj[i]);
        }else{
            clone[i] = obj[i]
        }
    }
    return clone;
}