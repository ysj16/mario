/**
 * Created by yu on 2015/6/24.
 */
resources.load("background1.png")
resources.load("marioR.png")
resources.load("marioL.png")
resources.load("land1.gif")
resources.load("land2.gif")
resources.load("pipe.png")
resources.load("brick1.gif")
var DEFLENGTH = 40;//单位长度，以mario的高度为标准
var CWIDTH = 600;//CANVAS宽度
var CHEIGHT = 400;//CANVAS高度

resources.onReady(function(){
    var canvas = document.getElementById("stage");
    var map = new Map();
    var camera = new Camera(canvas)
    var modelsData = [{
        imgs:{
            default:{img:resources.get("land1.gif"),x:0,renderW:DEFLENGTH,renderH:DEFLENGTH}
        },
        position:[{x:0,y:360,width:10,height:1},{x:450,y:360,width:5,height:1},{x:700,y:360,width:5,height:1}]
    },{
        imgs:{
            default:{img:resources.get("land2.gif"),x:0,renderW:DEFLENGTH,renderH:DEFLENGTH}
        },
        position:[{x:0,y:320,width:10,height:1},{x:450,y:320,width:5,height:1},{x:700,y:320,width:5,height:1}]
    },{
        imgs:{
            default:{img:resources.get("pipe.png"),x:0,renderW:DEFLENGTH,renderH:1.5*DEFLENGTH}
        },
        position:[{x:100,y:400 -3.5*DEFLENGTH}]
    },{
        imgs:{
            default:{img:resources.get("brick1.gif"),x:0,renderW:0.7*DEFLENGTH,renderH:0.7*DEFLENGTH}
        },
        position:[{x:100,y:CHEIGHT-4*DEFLENGTH,width:5,height:1}]
    }]
    var models = [];
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
    console.log(models)
    //实例化马里奥
    var player = new Player({moveR:{img:resources.get("marioR.png"),x:0,spiritW:60,renderW:DEFLENGTH,renderH:DEFLENGTH,crushW:0.8*DEFLENGTH},"moveL":{img:resources.get("marioL.png"),x:0,spiritW:60,renderW:DEFLENGTH,renderH:DEFLENGTH}},{x:0,y:250})

    var livings = [];
    livings.push(player);
    var control = new Control();//实例化游戏控制类
    var loop = new GameLoop(function(interTime){
        var renderModels = getRenderModels(models,map),
            renderLivings = getRenderModels(livings,map);
        Model.prototype.alls = Array.concat(renderLivings,renderModels);
        //console.log(renderLivings,renderModels)
        player.update(control,canvas,interTime);
        map.update(control,player,canvas);
        camera.drawBackground(map);
        camera.drawModels(renderModels,map);
        camera.drawLivings(renderLivings,40,40);
    },30)
    loop.frame()

})