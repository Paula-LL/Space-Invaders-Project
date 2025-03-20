let dom = $(document);
const $Jugador1 = document.getElementById("Jugador1");

let x = 0;

document.addEventListener("keydown", (e)=>{
    console.log(e.code);
    if(e.code === "ArrowLeft"){
        x=x-100;
        $Jugador1.style.left = x + "px";    
    }

    if(e.code === "ArrowRight"){
        x=x+100;
        $Jugador1.style.left = x + "px";    
    }

});

/*var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var img = document.getElementById("Jugador1");
ctx.drawImage(img, 10, 10);*/
