/**
 * Created by yu on 2015/6/24.
 */
resources.load(["background1.png","marioR.png","marioL.png","land1.gif","land2.gif","pipe.png","brick1.gif","marioJR.gif","marioJL.gif","monster.png","monsterD.gif"])
var DEFLENGTH = 40;//单位长度，以mario的高度为标准
var CWIDTH = 600;//CANVAS宽度
var CHEIGHT = 400;//CANVAS高度

resources.onReady(function(){
    var canvas = document.getElementById("stage");
    var map = new Map();
    Model.prototype.map = map;
    var camera = new Camera(canvas);
    var control = new Control();//实例化游戏控制类
    var modelsData = [{
        imgs:{
            default:{img:resources.get("land1.gif"),x:0,renderW:DEFLENGTH,renderH:DEFLENGTH}
        },
        position:[{x:0,y:360,width:12,height:1},{x:550,y:360,width:15,height:1},{x:1300,y:360,width:15,height:1}]
    },{
        imgs:{
            default:{img:resources.get("land2.gif"),x:0,renderW:DEFLENGTH,renderH:DEFLENGTH}
        },
        position:[{x:0,y:320,width:12,height:1},{x:550,y:320,width:15,height:1},{x:1300,y:320,width:15,height:1}]
    },{
        imgs:{
            default:{img:resources.get("land1.gif"),x:0,renderW:0.6*DEFLENGTH,renderH:0.6*DEFLENGTH}
        },
        position:[{x:450,y:296,width:1,height:1}]
    },{
        imgs:{
            default:{img:resources.get("pipe.png"),x:0,renderW:DEFLENGTH,renderH:1.5*DEFLENGTH}
        },
        position:[{x:430,y:400 -3.5*DEFLENGTH},{x:700,y:400-3.5*DEFLENGTH}]
    },{
        imgs:{
            default:{img:resources.get("brick1.gif"),x:0,renderW:0.6*DEFLENGTH,renderH:0.6*DEFLENGTH}
        },
        position:[{x:200,y:CHEIGHT-4*DEFLENGTH,width:5,height:1},{x:1225,y:180},{x:1450,y:150,width:7,height:1}]
    }]
    var livingsData = [{
        imgs:{
            default:{img:resources.get("monster.png"),x:0,spiritW:60,renderW:0.8*DEFLENGTH,renderH:0.8*DEFLENGTH},
            die:{img:resources.get("monsterD.gif"),x:0,spiritW:60,renderW:0.8*DEFLENGTH,renderH:0.8*DEFLENGTH,crushH:0.1*DEFLENGTH}
        },
        position:[{x:200,y:290},{x:300,y:290},{x:650,y:290}]
    }]
    var models = [];
    var livings = [];
    //实例化场景模型
    modelsData.forEach(function(modelsD,index){
        modelsD.position.forEach(function(position,index){
            var ii=position.width|| 1,
                jj=position.height||1;
            for(i=0;i<ii;i++){
                for(j=0;j<jj;j++){
                    var model = new Model(modelsD.imgs,{x:position.x+i*modelsD.imgs.default.renderW , y:position.y+j*modelsD.imgs.default.renderH})
                    models.push(model)
                }
            }
        })
    })
    //实例化野怪
    livingsData.forEach(function(livingsD,index){
        livingsD.position.forEach(function(position,index){
            var living = new Livings(livingsD.imgs,{x:position.x,y:position.y})
            livings.push(living)
        })
    })
    //实例化马里奥
    var player = new Player({
        moveR:{img:resources.get("marioR.png"),x:0,spiritW:60,renderW:DEFLENGTH,renderH:DEFLENGTH,crushW:0.8*DEFLENGTH},
        moveL:{img:resources.get("marioL.png"),x:0,spiritW:60,renderW:DEFLENGTH,renderH:DEFLENGTH,crushW:0.7*DEFLENGTH},
        jumpR:{img:resources.get("marioJR.gif"),x:0,renderW:DEFLENGTH,renderH:DEFLENGTH},
        jumpL:{img:resources.get("marioJL.gif"),x:0,renderW:DEFLENGTH,renderH:DEFLENGTH}
    },{x:0,y:220},{onCrush:onCrush})
    function onCrush(model){
        if(model.constructor==Livings&&model.crush.top){
            model.die();
            var index = livings.indexOf(model);
            livings.splice(index,1)
        }else if(model.constructor==Livings){
            this.die();

        }
    }

    //livings.push(player);
    var loop = new GameLoop(function(interTime){
        var renderModels = getRenderModels(models,map),
            renderLivings = getRenderModels(livings,map);
        renderLivings.forEach(function(living,item){
            living.autoMove(30);
        })
        renderLivings.push(player)
        Model.prototype.alls = Array.prototype.concat(renderLivings,renderModels);
        player.update(control,canvas,30);
        map.update(control,player,canvas,30);
        camera.drawBackground(map);
        camera.drawModels(renderModels,map);
        camera.drawLivings(renderLivings,map);
    },30)
    loop.frame()

})