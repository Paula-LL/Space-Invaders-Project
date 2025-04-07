let dom = $(document);

let x = 0;
var myGamePiece;
var myGamePiece2;
var bullet1;
var bullet2;
var bullets = [];  // Array para manejar las balas

var lastShotTimePlayer1 = 0;  // Tiempo del último disparo para el jugador 1
var lastShotTimePlayer2 = 0;  // Tiempo del último disparo para el jugador 2
var shootCooldown = 500;  // Tiempo de espera entre disparos en milisegundos

function startGame() {
    myGameArea.start();
    myGamePiece = new component(100, 110, "Imagenes/Nave1.png", 695, 790);  // Jugador 1
    myGamePiece2 = new component(100, 110, "Imagenes/Player2.png", 580, 800); // Jugador 2
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
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
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, imageSrc, x, y) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.image = new Image();  // Crear un nuevo objeto de imagen
    this.image.src = imageSrc;  // Asignar la ruta de la imagen

    this.update = function () {
        ctx = myGameArea.context;
        // Dibujar la imagen en lugar de un rectángulo
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
}

function bulletComponent(width, height, color, x, y) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height); // Dibuja las balas como rectángulos
    }

    this.newPos = function () {
        this.y += this.speedY;  // Movimiento hacia arriba o hacia abajo
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

    // Actualizar las balas
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].newPos();
        bullets[i].update();
    }
}

// Función para disparar, con control de tiempo entre disparos
function shoot() {
    let currentTime = new Date().getTime(); // Obtener el tiempo actual

    if (myGameArea.keys && myGameArea.keys[32]) {  // Espacio para disparar el jugador 1
        if (currentTime - lastShotTimePlayer1 >= shootCooldown) {
            let bullet1 = new bulletComponent(5, 10, "red", myGamePiece.x + 2 + myGamePiece.width / 2 - 5, myGamePiece.y + 20);
            bullet1.speedY = -5;  // Movimiento hacia arriba
            bullets.push(bullet1); // Agregar la bala al array de balas
            lastShotTimePlayer1 = currentTime; // Registrar el tiempo del último disparo
        }
    }

    if (myGameArea.keys && myGameArea.keys[96]) {  // 0 del pad numérico para disparar el jugador 2
        if (currentTime - lastShotTimePlayer2 >= shootCooldown) {
            let bullet2 = new bulletComponent(5, 10, "blue", myGamePiece2.x + 2 + myGamePiece2.width / 2 - 5, myGamePiece2.y + 10);
            bullet2.speedY = -5;  // Movimiento hacia arriba
            bullets.push(bullet2); // Agregar la bala al array de balas
            lastShotTimePlayer2 = currentTime; // Registrar el tiempo del último disparo
        }
    }
}
