let dom = $(document);

let x = 0;
var Jugador1;
var Jugador2;
var bullets = [];         // ArrayList on guardar les bales dels jugadors
var enemyBullets = [];    // ArrayList on guardar les bales dels enemics

var ultimoDisparoDelJugador1 = 0;  // Temps de l'ultim dispar del jugador 1
var ultimoDisparoDelJugador2 = 0;  // Temps de l'ultim dispar del jugador 2
var coolDown = 500;      // Temps que posem entre dispar i dispar dels jugadors, perque no disparin seguit

var vidaJugador1 = 5;
var vidaJugador2 = 5;

var muertesJugador1 = 0;
var muertesJugador2 = 0;

function startGame() {
    myGameArea.start();
    Jugador1 = new component(120, 120, "Imagenes/Nave1.png", 500, 770);  // Jugador 1
    Jugador2 = new component(100, 110, "Imagenes/Player2.png", 695, 790); // Jugador 2
    grupoEnemigos = new Enemigos(); //Es crea el grup dels enemics cridant a la classe Enemigos
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 1300;
        this.canvas.height = 900;
        this.context = this.canvas.getContext("2d");
        document.getElementById("juego").appendChild(this.canvas);


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
        //Fondo transparent
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
    this.image = new Image();  // Es crea un objecte de tipus imatge
    this.image.src = imageSrc;  // Per asignar la ruta de la imatge (on esta)

    this.update = function () {
        ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    
        // Limit esquerra del canvas
        if (this.x < 0) this.x = 0;
    
        // Limit dret del canvas
        if (this.x + this.width > this.gamearea.canvas.width) {
            this.x = this.gamearea.canvas.width - this.width;
        }
    }
}
function bulletComponent(width, height, color, x, y, owner) {
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.color = color;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.owner = owner;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height); // Dibuixa les bales
    }

    this.newPos = function () {
        this.y += this.speedY;  // Moviment cap adalt o cap abaix
    }

    // Verifica si la bala a tocar algun enemic
    this.colisionaConEnemigos = function (enemigo) {
        return (this.x < enemigo.x + enemigo.width &&
                this.x + this.width > enemigo.x &&
                this.y < enemigo.y + enemigo.height &&
                this.y + this.height > enemigo.y);
    }

    this.colisionaConJugador = function (jugador) {
        return (this.x < jugador.x + jugador.width &&
                this.x + this.width > jugador.x &&
                this.y < jugador.y + jugador.height &&
                this.y + this.height > jugador.y);
    }
    
}
//Aquesta funcio actualitza l'area de joc:
function updateGameArea() {
    myGameArea.clear();

    // Actualitzem la velocitat dels jugadors
    Jugador1.speedX = 0;
    Jugador2.speedX = 0;

    // Movimiento de los jugadores
    if (myGameArea.keys && myGameArea.keys[37]) { // Moviment cap a la esquerra del jugador 1
        Jugador1.speedX = -2;
    }
    if (myGameArea.keys && myGameArea.keys[39]) { // Moviment cap a la dreta del jugador 1
        Jugador1.speedX = 2;
    }

    if (myGameArea.keys && myGameArea.keys[65]) { //  Moviment cap a la esquerra del jugador 2
        Jugador2.speedX = -2;
    }
    if (myGameArea.keys && myGameArea.keys[68]) { // Moviment cap a la dreta del jugador 2
        Jugador2.speedX = 2;
    }

    // Actualitza la posicio dels jugadors i els dibuixa
    Jugador1.newPos();
    Jugador1.update();

    Jugador2.newPos();
    Jugador2.update();

    // Crida a la funcio disparar
    disparar();

    // Actualiza las balas dels jugadors
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].newPos();
        bullets[i].update();
    }

    // Actualitzem els enemics
    grupoEnemigos.actualizar();

    // S'actualizen les bales dels enemics
    for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].newPos();
        enemyBullets[i].update();
    }

    // Es verifica si les bales i els enemics han sigut colisionats
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < grupoEnemigos.enemigos.length; j++) {
            if (bullets[i].colisionaConEnemigos(grupoEnemigos.enemigos[j])) {
                // Es sumen les morts
                if (bullets[i].owner === 1) {
                    muertesJugador1++;
                    document.getElementById("muertesJ1").textContent = muertesJugador1;
                    if(muertesJugador1 > 28){
                        alert("El jugador 1 ha echo mas de la mitad del total de aliens, ha ganado!");
                        detenerJuego();  // Para el joc
                        mostrarPantallaFinal(); // Mostra la pantalla de reiniciar el joc
                    }
                } else if (bullets[i].owner === 2) {
                    muertesJugador2++;
                    document.getElementById("muertesJ2").textContent = muertesJugador2;
                    if(muertesJugador2 > 28){
                        alert("El jugador 2 ha echo mas de la mitad del total de aliens, ha ganado!");
                        detenerJuego();
                        mostrarPantallaFinal();
                    }
                }
    
                bullets.splice(i, 1);
                grupoEnemigos.enemigos.splice(j, 1);
                i--;
                break;
            }
        }
    }
    


    //Es verifica si la bala dels enemics i el jugador s'han colisionat
    for(let i = 0; i < enemyBullets.length; i++){
        if(enemyBullets[i].colisionaConJugador(Jugador1)){
            enemyBullets.splice(i, 1);
            vidaJugador1 -= 1;
            document.getElementById("vidaJ1").textContent = vidaJugador1;
        
            if(vidaJugador1 == 0){
                alert("El jugador 1 ha perdido todas las vidas, ha ganado el jugador 2!");
                detenerJuego(); 
                mostrarPantallaFinal();  
            }
            i--;
            break;
        }
        if(enemyBullets[i].colisionaConJugador(Jugador2)){
            enemyBullets.splice(i, 1);
            vidaJugador2 -= 1;
            document.getElementById("vidaJ2").textContent = vidaJugador2;
            if(vidaJugador2 == 0){
                alert("El jugador 2 ha perdido todas las vidas, ha ganado el jugador 1!");
                detenerJuego(); 
                mostrarPantallaFinal(); 
            }
            i--;
            break;
        }
}




    
}

// Funcio de disparar dels jugadors
function disparar() {
    let tiempoActual = new Date().getTime(); // Agafem el temps actual

    if (myGameArea.keys && myGameArea.keys[96]) {  // El jugador disparara amb el 0 del pad numeric
        if (tiempoActual - ultimoDisparoDelJugador1 >= coolDown) {
            let bullet1 = new bulletComponent(5, 10, "red", Jugador1.x + 2 + Jugador1.width / 2 - 5, Jugador1.y + 20, 1); 
            bullet1.speedY = -5;
            bullets.push(bullet1); // Afegeix la bala dins del ArrayList creat
            ultimoDisparoDelJugador1 = tiempoActual; //Aixo es per guardar quan va ser la ultima vegada que el jugador va disparar
        }
    }

    if (myGameArea.keys && myGameArea.keys[32]) {  //El jugador disparara amb la tecla espai
        if (tiempoActual - ultimoDisparoDelJugador2 >= coolDown) {
            let bullet2 = new bulletComponent(5, 10, "blue", Jugador2.x + 2 + Jugador2.width / 2 - 5, Jugador2.y + 10, 2);
            bullet2.speedY = -5; 
            bullets.push(bullet2);
            ultimoDisparoDelJugador2 = tiempoActual; 
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
        this.ultimoDisparoEnemigos = 0; // Quan va ser la ultima vegada q va disparar un enemic
        this.inicializarEnemigos(); //Inicialitzem els enemics perque es mostrin
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

        //Aqui creem el grid per introduir les imatges dels aliens

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
        const tiempoActual = new Date().getTime();
        let cambioDireccion = false;

        // Solo mover si pasó el tiempo suficiente
        if (tiempoActual - this.lastMoveTime >= this.moveInterval) {
            this.lastMoveTime = tiempoActual;

            // Es verifica si els enemics han tocat el marge del canva
            for (const enemigo of this.enemigos) {
                if ((enemigo.x + enemigo.width >= myGameArea.canvas.width - this.margen && this.direccion > 0) || 
                    (enemigo.x <= this.margen && this.direccion < 0)) {
                    cambioDireccion = true;
                    break;
                }
            }

            // Si cal, cambiara de direcció tan verticalment com horitzontalment
            if (cambioDireccion) {
                this.direccion *= -1;
                this.velocidadY = 20;
            } else {
                this.velocidadY = 0;
            }

            // Com es mouran els enemics
            for (const enemigo of this.enemigos) {
                enemigo.x += this.velocidadX * this.direccion;
                enemigo.y += this.velocidadY;
            }
        }

        // Aqui actualitzem els enemics (dibuixar-los al canvas)
        for (const enemigo of this.enemigos) {
            enemigo.update();
        }

        // Cada cert temps dispararan
        if (tiempoActual - this.ultimoDisparoEnemigos > 1000) { // cada 1 segundo
            this.disparar();
            this.ultimoDisparoEnemigos = tiempoActual;
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
            bala.speedY = 4; // Movimient cap abaix
            enemyBullets.push(bala);  // Introduim la bala dins del ArrayList de bales dels enemics
        }
    }
}

function detenerJuego() {
    clearInterval(myGameArea.interval); // Para el joc
}

function mostrarPantallaFinal() {
    document.getElementById("pantallaFinal").style.display = "block"; // Muestra la pantalla final
}

function reiniciarJuego() {
    // Reiniciem totes les variables
    vidaJugador1 = 5;
    vidaJugador2 = 5;
    muertesJugador1 = 0;
    muertesJugador2 = 0;
    bullets = [];
    enemyBullets = [];
    // Truca a la funcio perque torni a començar el joc
    startGame();
    document.getElementById("pantallaFinal").style.display = "none";
}

function salir() {
    window.location.reload(); // Recarregar la pagina
}


