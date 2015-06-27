/**
 * Created by yu on 2015/6/24.
 */
resources.load("background1.png")
resources.load("marioR.png")
resources.load("marioL.png")
resources.load("land1.gif")
resources.load("land2.gif")

resources.onReady(function(){
    var canvas = document.getElementById("stage");
    var map = new Map();
    var camera = new Camera(canvas)
    var modelData = [{
        imgs:{
            default:{img:resources.get("land1.gif"),x:0,renderW:40,renderH:40}
        },
        position:[{x:0,y:360,width:5,height:1},{x:0,y:360},{x:250,y:360,width:5,height:1},{x:0,y:360},{x:500,y:360,width:5,height:1},{x:0,y:360}]
    },{
        imgs:{
            default:{img:resources.get("land2.gif"),x:0,renderW:40,renderH:40}
        },
        position:[{x:0,y:320,width:5,height:1},{x:0,y:360},{x:250,y:320,width:5,height:1},{x:0,y:360},{x:500,y:320,width:5,height:1},{x:0,y:360}]
    }]
    var models = [];
    modelData.forEach(function(item,index){
        var model = new Model(item.imgs,item.position)
        models.push(model)
    })
    var player = new Player({moveR:{img:resources.get("marioR.png"),x:0,spiritW:60,renderW:40,renderH:40},"moveL":{img:resources.get("marioL.png"),x:0,width:240,height:60,spiritW:60,renderW:40,renderH:40}},{x:0,y:0})
    var livings = [];
    livings.push(player);
    //camera.drawLivings(livings)
    var control = new Control();
    var loop = new GameLoop(function(time){
        player.update(control,canvas);
        map.update(control,player,canvas);
        camera.drawBackground(map);
        camera.drawModels(models,map);
        camera.drawLivings(livings,40,40);
    },30)
    loop.frame()

})