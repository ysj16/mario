/**
 * Created by yu on 2015/6/24.
 */

resources.load("background1.png")
resources.load("marioR.png")

resources.onReady(function(){
    var map = new Map();
    var camera = new Camera(document.getElementById("stage").getContext("2d"))
    camera.drawBackground(map)
    var player = new Player({"moveR":{img:resources.get("marioR.png"),x:0,"width":240,"height":60,spiritW:60}},{x:0,y:0})
    var livings = [];
    livings.push(player);
    //camera.drawLivings(livings)
    var control = new Control();
    var loop = new GameLoop(function(){
        player.update(control);
        camera.drawLivings(livings);
    })
    loop.frame()

})