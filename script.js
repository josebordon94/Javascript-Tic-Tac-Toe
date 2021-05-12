const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//El canvas es un cuadrado de 300x300
//Instanciamos los cuadrantes
const cuad = {
    //Atributos de los cuadrantes
    c1: 105,
    c2: 195,
    m1: 25,
    m2: 275,
    third: 50,
}

//Posiciones exactas de los circulos y cruces
const positions = [
    { x: cuad.c1 - cuad.third +5, y: cuad.c1 - cuad.third + 10 },
    { x: cuad.c1 + cuad.third -5, y: cuad.c1 - cuad.third + 10 },
    { x: cuad.c2 + cuad.third - 5, y: cuad.c1 - cuad.third + 10 },
    { x: cuad.c1 - cuad.third + 5, y: cuad.c1 + cuad.third -5},
    { x: cuad.c1 + cuad.third -5, y: cuad.c1 + cuad.third -5},
    { x: cuad.c2 + cuad.third - 5, y: cuad.c1 + cuad.third -5},
    { x: cuad.c1 - cuad.third + 5, y: cuad.c2 + cuad.third - 10 },
    { x: cuad.c1 + cuad.third -5, y: cuad.c2 + cuad.third - 10 },
    { x: cuad.c2 + cuad.third - 5, y: cuad.c2 + cuad.third - 10 },
]

//Estado del juego
//Variable turno: 1/2
//El tablero se corresponde con ceros para vacio, 1 para cruz, 2 para circulo
const gameState = {
    board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
    gameRunning: true,
    winner: 0,
    turn: 1
}

const message = document.getElementById('message')
const winner = document.getElementById('winner')
const btnNewGame = document.getElementById('newGame')

//Show in console
console.log(canvas)
console.log(cuad)
console.log(positions)

//New game function
function startNewGame(){
    gameState.board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    gameState.gameRunning = true
    gameState.winner = 0
    gameState.turn = 1
    message.innerHTML = "¡A jugar!"
    winner.innerHTML = "Turno jugador 1"
    winner.style.color = "black"
}

//Canvas correction on window size change
window.addEventListener("resize", ()=>{
    printGameState();
    console.log("Ventana cambiada")
})

function clearCanvas() {
    //Limpiamos canvas en blanco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function printGrid() {
    clearCanvas();
    ctx.strokeStyle = "black"
    //Colocamos la cuadricula
    ctx.lineWidth = '8'
    ctx.beginPath();
    //Lineas verticales
    ctx.moveTo(cuad.c1, cuad.m1);
    ctx.lineTo(cuad.c1, cuad.m2);

    ctx.moveTo(cuad.c2, cuad.m1);
    ctx.lineTo(cuad.c2, cuad.m2);

    //Lineas horizontales
    ctx.moveTo(cuad.m1, cuad.c1);
    ctx.lineTo(cuad.m2, cuad.c1);

    ctx.moveTo(cuad.m1, cuad.c2);
    ctx.lineTo(cuad.m2, cuad.c2);

    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 5;
}

//Coloca una X en la posición seleccionada
function putX(x, y) {
    ctx.strokeStyle = "blue"
    ctx.beginPath();
    ctx.moveTo(x - 19, y - 19)
    ctx.lineTo(x + 19, y + 19)
    ctx.moveTo(x + 19, y - 19)
    ctx.lineTo(x - 19, y + 19)
    ctx.stroke();
    ctx.closePath();
}

//Coloca un circulo en la posicion seleccionada
function putCircle(x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "red"
    ctx.arc(x, y, 23, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}

//Actualiza el canvas con el estado de la partida
function printGameState() {
    printGrid()
    for (let index = 0; index < gameState.board.length; index++) {
        const element = gameState.board[index];
        switch (element) {
            case 0:
                break;
            case 1:
                putX(positions[index].x, positions[index].y)
                break;
            case 2:
                putCircle(positions[index].x, positions[index].y)
                break;
            default:
                break;
        }
    }
}

//Obtenemos el click generado en el canvas para marcar las jugadas
function getMousePosition(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    console.log(x, y)
    return {x,y}
}

function getSelectedSquare(x,y){
    switch (true) {
        case ( (x > cuad.m1 && x < cuad.c1) && (y > cuad.m1 && y < cuad.c1) ): return 0; break;
        case ( (x > cuad.c1 && x < cuad.c2) && (y > cuad.m1 && y < cuad.c1) ): return 1; break;
        case ( (x > cuad.c2 && x < cuad.m2) && (y > cuad.m1 && y < cuad.c1) ): return 2; break;
        case ( (x > cuad.m1 && x < cuad.c1) && (y > cuad.c1 && y < cuad.c2) ): return 3; break;
        case ( (x > cuad.c1 && x < cuad.c2) && (y > cuad.c1 && y < cuad.c2) ): return 4; break;
        case ( (x > cuad.c2 && x < cuad.m2) && (y > cuad.c1 && y < cuad.c2) ): return 5; break;
        case ( (x > cuad.m1 && x < cuad.c1) && (y > cuad.c2 && y < cuad.m2) ): return 6; break;
        case ( (x > cuad.c1 && x < cuad.c2) && (y > cuad.c2 && y < cuad.m2) ): return 7; break;
        case ( (x > cuad.c2 && x < cuad.m2) && (y > cuad.c2 && y < cuad.m2) ): return 8; break;
        default: console.log("No se clickeo ningun cuadrante en el canvas"); break;
      }
}

canvas.addEventListener("mousedown", function(e)
{
    let mousePosition = getMousePosition(e)
    if(gameState.gameRunning == false){
        return
    }
    selectedSquare = getSelectedSquare(mousePosition.x, mousePosition.y)
    console.log(selectedSquare)
    //Controlamos que la casilla no se haya jugado previamente
    if(gameState.board[selectedSquare] == 0){
        playTurn(selectedSquare)
    } else {
        console.log("Casilla ya utilizada.")
        return
    }
});

function playTurn(selectedSquare){
    if(gameState.turn == 1){
        gameState.board[selectedSquare] = 1
    } else {
        gameState.board[selectedSquare] = 2
    }
    printGameState();
    gameStatus()
}

function gameStatus(){
    b = gameState.board
    if(
        b[0] == b[1] && b[0] == b[2] && b[0] != 0 ||
        b[3] == b[4] && b[3] == b[5] && b[3] != 0 ||
        b[6] == b[7] && b[6] == b[8] && b[6] != 0 ||
        b[0] == b[3] && b[0] == b[6] && b[0] != 0 ||
        b[1] == b[4] && b[1] == b[7] && b[1] != 0 ||
        b[2] == b[5] && b[2] == b[8] && b[2] != 0 ||
        b[0] == b[4] && b[0] == b[8] && b[0] != 0 ||
        b[2] == b[4] && b[2] == b[6] && b[2] != 0
        ){
        console.log("El juego termina por linea. Ganador: Jugador ", gameState.turn)
        wonGame()
        showWinner()
    } else{
        //Miramos el caso de un empate
        if (!b.includes(0)){
            //Si no existe ningun cero, implica que ya no quedan lugares disponibles para jugar
            console.log("Juego terminado por empate.")
            drawGame()
        } else{
            console.log("Se sigue");
            changeTurn()
        }
    }
}

function wonGame(){
    gameState.gameRunning = false;
    gameState.winner = gameState.turn;
}

function drawGame(){
    gameState.gameRunning = false;
    gameState.winner = 0;
    message.innerHTML= "¡Juego terminado!"
    winner.innerHTML= "Empate"
    winner.style.color = "black"
}

function showWinner(){
    message.innerHTML= "¡Juego terminado!"
    winner.innerHTML= "Ganador: Jugador " + gameState.winner
    if(gameState.winner == 1){
        winner.style.color = "blue"
    } else {
        winner.style.color = "red"
    }
}

function changeTurn(){
    if (gameState.turn == 1 ){
        gameState.turn = 2 ;
        winner.innerHTML = "Turno jugador 2";
        winner.style.color = "black "
    } else {
        gameState.turn = 1
        winner.innerHTML = "Turno jugador 1";
        winner.style.color = "black"
    }
}

//Crear nueva partida con el boton
btnNewGame.addEventListener('click', (e)=> {
    console.clear();
    startNewGame();
    printGameState();
})

startNewGame();
printGameState();
