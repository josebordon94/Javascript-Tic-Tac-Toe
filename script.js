const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//Canvas is a 300x300 square
const cuad = {
    //Atributos de los cuadrantes
    c1: 105,
    c2: 195,
    m1: 25,
    m2: 275,
    third: 50,
}

//Cross and circles positions
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

// The current game board is represented by a 9-length array.
// 0: empty | 1: X | 2: Circle

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
    message.innerHTML = "¡Let's play!"
    winner.innerHTML = "Turn: Player 1"
    winner.style.color = "black"
}

//Canvas correction on window size change
window.addEventListener("resize", ()=>{
    printGameState();
})

//Set canvas to an empty white rectangle
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function printGrid() {
    clearCanvas();
    ctx.strokeStyle = "black"
    //Set the grid
    ctx.lineWidth = '8'
    ctx.beginPath();
    //Vertical lines
    ctx.moveTo(cuad.c1, cuad.m1);
    ctx.lineTo(cuad.c1, cuad.m2);

    ctx.moveTo(cuad.c2, cuad.m1);
    ctx.lineTo(cuad.c2, cuad.m2);

    //Horizontal lines
    ctx.moveTo(cuad.m1, cuad.c1);
    ctx.lineTo(cuad.m2, cuad.c1);

    ctx.moveTo(cuad.m1, cuad.c2);
    ctx.lineTo(cuad.m2, cuad.c2);

    ctx.stroke();
    ctx.closePath();
    ctx.lineWidth = 5;
}

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

function putCircle(x, y) {
    ctx.beginPath();
    ctx.strokeStyle = "red"
    ctx.arc(x, y, 23, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
}

function drawWinLine(winCondition){
    //Win condition is the display of the three line. There are 8 differents displays.
    gameState.winner==1 ? ctx.strokeStyle = "blue" : ctx.strokeStyle = "red"
    let plus = 40
    let diagonalPlus = 36
    ctx.lineWidth = 8;
    ctx.beginPath();
    switch (winCondition) {
        case 1:
        ctx.moveTo(positions[0].x - plus, positions[0].y)
        ctx.lineTo(positions[2].x + plus, positions[0].y)
        break;
        case 2:
        ctx.moveTo(positions[3].x - plus, positions[3].y)
        ctx.lineTo(positions[5].x + plus, positions[3].y)
        break;
        case 3:
        ctx.moveTo(positions[6].x - plus, positions[6].y)
        ctx.lineTo(positions[8].x + plus, positions[8].y)
        break;
        case 4:
        ctx.moveTo(positions[0].x, positions[0].y - plus)
        ctx.lineTo(positions[6].x, positions[6].y + plus)
        break;
        case 5:
        ctx.moveTo(positions[1].x, positions[1].y - plus)
        ctx.lineTo(positions[7].x, positions[7].y + plus)
        break;
        case 6:
        ctx.moveTo(positions[2].x, positions[2].y - plus)
        ctx.lineTo(positions[8].x, positions[8].y + plus)
        break;
        case 7:
        ctx.moveTo(positions[0].x - diagonalPlus, positions[0].y -diagonalPlus)
        ctx.lineTo(positions[8].x + diagonalPlus, positions[8].y + diagonalPlus)
        break;
        case 8:
        ctx.moveTo(positions[6].x - diagonalPlus, positions[6].y + diagonalPlus)
        ctx.lineTo(positions[2].x + diagonalPlus, positions[2].y - diagonalPlus)
        break;
        default:
        console.log("Game continues")
        break;
    }
    ctx.stroke();
    ctx.closePath()
    ctx.lineWidth = 5;
}

//Refresh the canvas to match the gameState
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
    let winCondition = detectWinCondition();
    drawWinLine(winCondition)
}

//Get the position of click event inside canvas
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
        default: console.log("Click outside of canvas"); break;
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
    //Check played cell
    if(gameState.board[selectedSquare] == 0){
        playTurn(selectedSquare)
    } else {
        console.log("Cell already used")
        return
    }
});

function playTurn(selectedSquare){
    if(gameState.turn == 1){
        gameState.board[selectedSquare] = 1
    } else {
        gameState.board[selectedSquare] = 2
    }
    endTurn()
    printGameState();
}

//Handles the 8 different ways to get a 3 line
function detectWinCondition(){
    b = gameState.board
    switch (true) {
        case (b[0] == b[1] && b[0] == b[2] && b[0] != 0): return 1; break;
        case (b[3] == b[4] && b[3] == b[5] && b[3] != 0): return 2; break;
        case (b[6] == b[7] && b[6] == b[8] && b[6] != 0): return 3; break;
        case (b[0] == b[3] && b[0] == b[6] && b[0] != 0): return 4; break;
        case (b[1] == b[4] && b[1] == b[7] && b[1] != 0): return 5; break;
        case (b[2] == b[5] && b[2] == b[8] && b[2] != 0): return 6; break;
        case (b[0] == b[4] && b[0] == b[8] && b[0] != 0): return 7; break;
        case (b[2] == b[4] && b[2] == b[6] && b[2] != 0): return 8; break;
        default: return 0; break;
    }
}

function endTurn(){
    //Detects game over
    if(detectWinCondition()){
        console.log("Game over. Winner: Player ", gameState.turn)
        wonGame()
        showWinner()
    } else{
        //Check for a draw game
        if (!b.includes(0)){
            //If there isn't a 0 in the board array, game is already over
            console.log("Draw game")
            drawGame()
        } else{
            //Game continues
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
    message.innerHTML= "¡Game over!"
    winner.innerHTML= "Draw game"
    winner.style.color = "black"
}

function showWinner(){
    message.innerHTML= "¡Game over!"
    winner.innerHTML= "Winner: Player " + gameState.winner
    if(gameState.winner == 1){
        winner.style.color = "blue"
    } else {
        winner.style.color = "red"
    }
}

function changeTurn(){
    if (gameState.turn == 1 ){
        gameState.turn = 2 ;
        winner.innerHTML = "Turn: Player 2";
        winner.style.color = "black "
    } else {
        gameState.turn = 1
        winner.innerHTML = "Turn: Player 1";
        winner.style.color = "black"
    }
}

//Create a new game
btnNewGame.addEventListener('click', (e)=> {
    console.clear();
    startNewGame();
    printGameState();
})

startNewGame();
printGameState();
