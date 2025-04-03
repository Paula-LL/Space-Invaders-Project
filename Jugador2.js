let dom = $(document);
const $Jugador2 = document.getElementById("Jugador2");
let x = 0;

document.addEventListener("keydown", (e) => {
    console.log(e.code);
    if (e.code === "ArrowLeft") {
        x = x - 100;
        $Jugador2.style.right  = (-x) + "px";
    }

    if (e.code === "ArrowRight") {
        x = x + 100;
        $Jugador2.style.right = (-x) + "px";
    }
});

let livesPlayer2 = 5; 

Console.log(livesPlayer2);

/*document.getElementById("demo").onkeydown = function() {myFunction()};

function myFunction() {
  document.getElementById("demo").style.backgroundColor = "red";
}*/
