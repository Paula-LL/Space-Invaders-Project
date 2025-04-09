let dom = $(document);

let x = 0;
var myGamePiece;
var myGamePiece2;
var bullets = [];         // ArrayList on guardar les bales dels jugadors
var enemyBullets = [];    // ArrayList on guardar les bales dels enemics

var lastShotTimePlayer1 = 0;  // Temps de l'ultim dispar del jugador 1
var lastShotTimePlayer2 = 0;  // Temps de l'ultim dispar del jugador 2
var shootCooldown = 500;      // Temps que posem entre dispar i dispar dels jugadors, perque no disparin seguit

var vidaJugador1 = 5;
var vidaJugador2 = 5;

function startGame() {
    myGameArea.start();
    myGamePiece = new component(100, 110, "Imagenes/Nave1.png", 695, 790);  // Jugador 1
    myGamePiece2 = new component(100, 110, "Imagenes/Player2.png", 580, 800); // Jugador 2
    grupoEnemigos = new Enemigos(); //Es crea el grup dels enemics cridant a la classe Enemigos
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
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        });
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
//Aquesta funcio actualitza l'area de joc:
function updateGameArea() {
    myGameArea.clear();

    myGamePiece.speedX = 0;
    myGamePiece2.speedX = 0;

    // Movimiento de los jugadores
    if (myGameArea.keys && myGameArea.keys[37]) {
        myGamePiece.speedX = -2;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        myGamePiece.speedX = 2;
    }

    if (myGameArea.keys && myGameArea.keys[65]) {
        myGamePiece2.speedX = -2;
    }
    if (myGameArea.keys && myGameArea.keys[68]) {
        myGamePiece2.speedX = 2;
    }

    //Actualitza la posició dels jugadors
    myGamePiece.newPos();
    myGamePiece.update();

    myGamePiece2.newPos();
    myGamePiece2.update();

    // Crida a la funcio disparar perque els jugadors puguin disparar
    shoot();

    // Les bales dels jugadors s'actualitzen en l'arrayList creat per emmagatzemar-les dins d'aquest.
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].newPos();
        bullets[i].update();
    }

    grupoEnemigos.actualizar();

    // Les bales dels enemics s'actualitzen en l'arrayList creat per emmagatzemar-les dins d'aquest.
    for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].newPos();
        enemyBullets[i].update();
    }
}

// Funcio de disparar dels jugadors
function shoot() {
    let currentTime = new Date().getTime(); // Agafem el temps actual

    if (myGameArea.keys && myGameArea.keys[96]) {  // El jugador disparara amb el 0 del pad numeric
        if (currentTime - lastShotTimePlayer1 >= shootCooldown) {
            let bullet1 = new bulletComponent(5, 10, "red", myGamePiece.x + 2 + myGamePiece.width / 2 - 5, myGamePiece.y + 20);
            bullet1.speedY = -5;
            bullets.push(bullet1); // Afegeix la bala dins del ArrayList creat
            lastShotTimePlayer1 = currentTime; //Aixo es per guardar quan va ser la ultima vegada que el jugador va disparar
        }
    }

    if (myGameArea.keys && myGameArea.keys[32]) {  //El jugador disparara amb la tecla espai
        if (currentTime - lastShotTimePlayer2 >= shootCooldown) {
            let bullet2 = new bulletComponent(5, 10, "blue", myGamePiece2.x + 2 + myGamePiece2.width / 2 - 5, myGamePiece2.y + 10);
            bullet2.speedY = -5; 
            bullets.push(bullet2);
            lastShotTimePlayer2 = currentTime; 
        }
    }
}

class Enemigos {
    constructor() {
        this.lastMoveTime = 0; // Quan va ser l'ultim moment que es van moure els enemics
        this.moveInterval = 600; // L'interval de temps q li donem als enemics perque es moguin
        this.enemigos = []; // Guardem aqui els enemics
        this.direccion = 1; //La direcció on aniran: -1 cap a la esquerra, 1 cap a la dreta. Posem com a default cap a la dreta
        this.velocidadX = 15; // La velocitat horitzontal
        this.velocidadY = 0; // Quan toquen el borde del canva
        this.margen = 50; // El marge que donem al canvas perque quan aquest sigui tocat pels aliens, aquests baixin
        this.espacioX = 70; // L'espai que hi ha entre enemic i enemic horitzontalment
        this.espacioY = 60; // Espai que hi ha entre enmic i enemic verticalment
        this.lastShotTime = 0; // Quan va ser la ultima vegada q va disparar un enemic
        this.inicializarEnemigos();
    }

    inicializarEnemigos() {
        const filas = 5;
        const columnas = 11;
        const imgPaths = [
            "Imagenes/Enemigo1.png",
            "Imagenes/Enemigo2.png",
            "Imagenes/Enemigo3.png",
            "Imagenes/Enemigo4.png"
        ];

        for (let fila = 0; fila < filas; fila++) {
            for (let col = 0; col < columnas; col++) {
                const x = this.margen + col * this.espacioX;
                const y = this.margen + fila * this.espacioY;
                const imgIndex = Math.min(fila, imgPaths.length - 1);
                const enemigo = new component(50, 50, imgPaths[imgIndex], x, y);
                this.enemigos.push(enemigo);
            }
        }
    }

    actualizar() {
        const currentTime = new Date().getTime();
        let cambioDireccion = false;

        // Solo mover si pasó el tiempo suficiente
        if (currentTime - this.lastMoveTime >= this.moveInterval) {
            this.lastMoveTime = currentTime;

            // Verificar si algún enemigo toca bordes
            for (const enemigo of this.enemigos) {
                if ((enemigo.x + enemigo.width >= myGameArea.canvas.width - this.margen && this.direccion > 0) || 
                    (enemigo.x <= this.margen && this.direccion < 0)) {
                    cambioDireccion = true;
                    break;
                }
            }

            // Cambiar dirección si hace falta
            if (cambioDireccion) {
                this.direccion *= -1;
                this.velocidadY = 20;
            } else {
                this.velocidadY = 0;
            }

            // Mover enemigos
            for (const enemigo of this.enemigos) {
                enemigo.x += this.velocidadX * this.direccion;
                enemigo.y += this.velocidadY;
            }
        }

        // Actualizar (dibujar) en cada frame, aunque no se muevan
        for (const enemigo of this.enemigos) {
            enemigo.update();
        }

        // Cada cierto tiempo disparan
        if (currentTime - this.lastShotTime > 1000) { // cada 1 segundo
            this.disparar();
            this.lastShotTime = currentTime;
        }
    }

    disparar() {
        if (this.enemigos.length === 0);

        // Com posem els enemics
        const columnas = {};

        for (let enemigo of this.enemigos) {
            let col = Math.floor((enemigo.x - this.margen) / this.espacioX);
            if (!columnas[col] || enemigo.y > columnas[col].y) {
                columnas[col] = enemigo;
            }
        }

        const keys = Object.keys(columnas); //Obte els indices de les columnes (1, 2 ,3 ,4, 5)

        if (keys.length > 0) {
            const colRandom = keys[Math.floor(Math.random() * keys.length)];
            const enemigoElegido = columnas[colRandom];

            // Es crea la bala
            let bala = new bulletComponent(5, 10, "green", enemigoElegido.x + enemigoElegido.width / 2 - 2.5, enemigoElegido.y + enemigoElegido.height);
            bala.speedY = 4; // Movimiento hacia abajo
            enemyBullets.push(bala);  // Introduim la bala dins del ArrayList de bales dels enemics
        }
    }
}
