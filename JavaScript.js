let dom = $(document);
const $Jugador1 = document.getElementById("Jugador1");
const $Jugador2 = document.getElementById("Jugador2");

let x = 0;
var myGamePiece;
var myGamePiece2;
var bullet1;
var bullet2;
var bullets = [];  // Array para manejar las balas


function startGame() {
    myGameArea.start();
    myGamePiece = new component(30, 30, "red", 685, 800);  // Jugador 1
    myGamePiece2 = new component(30, 30, "blue", 615, 800); // Jugador 2

}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1300;
        this.canvas.height = 900;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");            
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
}

// Esta función actualiza el área de juego, incluyendo el movimiento de los jugadores y las balas
function updateGameArea() {
    myGameArea.clear();
    
    myGamePiece.speedX = 0;
    myGamePiece2.speedX = 0;

    // Movimiento de los jugadores
    if (myGameArea.keys && myGameArea.keys[65]) {
        myGamePiece.speedX = -2; 
    }
    if (myGameArea.keys && myGameArea.keys[68]) {
        myGamePiece.speedX = 2; 
    }

    if (myGameArea.keys && myGameArea.keys[37]) {
        myGamePiece2.speedX = -2; 
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        myGamePiece2.speedX = 2; 
    }

    // Actualizar las posiciones de los jugadores
    myGamePiece.newPos();    
    myGamePiece.update();

    myGamePiece2.newPos();    
    myGamePiece2.update();

    // Llamar a la función para disparar las balas
    shoot();
}

// Funció per disparar al donar-li a les tecles corresponents
function shoot() {
    if (myGameArea.keys && myGameArea.keys[32]) {  // Espacio para disparar el jugador 1
        let bullet1 = new component(5, 5, "red", myGamePiece.x + myGamePiece.width / 2 - 5, myGamePiece.y);
        bullet1.speedY = -5;  // Movimiento hacia arriba
        bullets.push(bullet1); // Agregar la bala al array de balas
    }

    if (myGameArea.keys && myGameArea.keys[96]) {  // 0 del pad numeric per disparar el jugador 2
        let bullet2 = new component(5, 5, "blue", myGamePiece2.x + myGamePiece2.width / 2 - 5, myGamePiece2.y);
        bullet2.speedY = -5;  // Movimiento hacia arriba
        bullets.push(bullet2); // Agregar la bala al array de balas
        
    }
 

    // Mover y dibujar las balas
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].newPos();
        bullets[i].update();
    }
}






/*Jugador 1
document.addEventListener("keydown", (e)=>{
    console.log(e.code);
    if(e.code === "KeyA"){
        x=x-50;
        $Jugador1.style.left = x + "px";    
    }

    if(e.code === "KeyD"){
        x=x+50;
        $Jugador1.style.left = x + "px";    
    }

});*/
/*Jugador 2
document.addEventListener("keydown", (e) => {
    console.log(e.code);
    if (e.code === "ArrowRight") {
        x = x - 50;
        $Jugador2.style.right  = x + "px";
    }

    if (e.code === "ArrowLeft") {
        x = x + 50;
        $Jugador2.style.right = x + "px";
    }
});*/