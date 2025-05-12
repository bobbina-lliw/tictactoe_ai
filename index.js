const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let options = ["", "", "", "", "", "", "", "", ""];
let simulated_options = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;
let counter = 0;
let cellIndex = 0;
let a_temp;
initializeGame();

function initializeGame() {
  cells.forEach((cell) => cell.addEventListener("click", cellClicked));
  restartBtn.addEventListener("click", restartGame);
  statusText.textContent = `${currentPlayer}'s turn`;
  running = true;
}
function cellClicked() {
  if (currentPlayer === "X") {
    cellIndex = this.getAttribute("cellIndex");
    if (options[cellIndex] != "" || !running) {
      //if it is not an empty space dont allow placement
      return;
    }
    updateCell_human(this, cellIndex);
  } else if (currentPlayer == "O") {
    //write O's ai here
    //modify the cellIndex number
    simulated_options = [...options];
    a_temp = check_immediatewins(true);
    console.log(`${a_temp}`);
    if (a_temp == false) {
      cellIndex = best_move(0, true); //function
    } else {
      cellIndex = a_temp;
    }

    console.log(cellIndex);
    updateCell_ai(cellIndex);
  }
  //changePlayer();
  checkWinner();
}
function updateCell_human(cell, index) {
  options[index] = currentPlayer;
  cell.textContent = currentPlayer;
}
function updateCell_ai(index) {
  options[index] = currentPlayer;
  cells[index].textContent = currentPlayer;
}
function changePlayer() {
  currentPlayer = currentPlayer == "X" ? "O" : "X";
  statusText.textContent = `${currentPlayer}'s turn`;
}
function checkWinner() {
  let roundWon = false;
  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = options[condition[0]];
    const cellB = options[condition[1]];
    const cellC = options[condition[2]];

    if (cellA == "" || cellB == "" || cellC == "") {
      continue;
    }
    if (cellA == cellB && cellB == cellC) {
      roundWon = true;
      //alert(`roundwon`)
      break;
    }
  }
  if (roundWon == true) {
    //alert(`win`)
    statusText.textContent = `${currentPlayer} wins!`;
    running = false;
  } else if (!options.includes("")) {
    //alert(`Draw`)
    statusText.textContent = `Draw!`;
    running = false;
  } else {
    changePlayer();
    //        if(currentPlayer == "O"){
    //          alert(`O's turn`);
    //    }
  }
}
function restartGame() {
  currentPlayer = "X";
  options = ["", "", "", "", "", "", "", "", ""];
  statusText.textContent = `${currentPlayer}'s turn`;
  cells.forEach((cell) => (cell.textContent = ""));
  running = true;
  //alert(`restart game`);
}

function ai_checkwinner() {
  //let roundcheck=false;
  for (let i = 0; i < winConditions.length; i++) {
    const condition = winConditions[i];
    const cellA = simulated_options[condition[0]];
    const cellB = simulated_options[condition[1]];
    const cellC = simulated_options[condition[2]];

    if (cellA == "" || cellB == "" || cellC == "") {
      continue;
    }
    if (cellA == cellB && cellB == cellC) {
      return cellA; //returns the player that won
      //alert(`roundwon`)
      //break;
    }
  }
  return false;
}
function check_immediatewins(b) {
    // Check if AI can win immediately
    for (let i = 0; i < simulated_options.length; i++) {
      if (simulated_options[i] === "") {
        simulated_options[i] = "O";
        if (ai_checkwinner() === "O") {
          simulated_options[i] = "";
          console.log(`winning`);
          return i;
          // High score for immediate win
        }
        simulated_options[i] = "";
      }
    }
    // Check if human can win next move (needs blocking)
    for (let i = 0; i < simulated_options.length; i++) {
      if (simulated_options[i] === "") {
        simulated_options[i] = "X";
        if (ai_checkwinner() === "X") {
          simulated_options[i] = "";
          console.log(`losing`);
          console.log(`${i}`);
          return i; // Return blocking move
          //return -100; // High penalty if not blocked
        }
        simulated_options[i] = "";
      }
    }

  return false;
}
/*
create arr for the 4 possible moves
O moves +5 
x moves -5
O wins +15
x wins -15
start with the first move + 10 if its move -5 if x moves -10 if x wins
1st index in arr results in 0    +10 -10 =0   answer in depth 1
2nd index in arr results in 0    +10 -10 =0 looks for the one with the least scpore
*/
let temp = 0;

function best_move(depth, isMaximising) {
  let bestMove = -1;
  let result = ai_checkwinner(); //
  //console.log(`the depth is ${depth}`);
  /*for(let i=0;i<simulated_options.length;i++){
        if(simulated_options[i] == ''){
            simulated_options = "X";
            if(ai_checkwinner() == "X"){
                return i;
            }else{
                simulated_options[i]='';
            }
        }
    }*/
  if (result !== false) {
    //means it is a win or loss
    if (result === "X") {
      //console.log(`threat detected`);
      return -100 + depth + 1;
    } else if (result === "O") {
      return 40 - depth - 1;
    }
    return 0; //if it finds the optimal move
  }
  if (isMaximising) {
    let bestScore = -Infinity;
    for (let i = 0; i < simulated_options.length; i++) {
      if (simulated_options[i] == "") {
        simulated_options[i] = "O";
        let score = best_move(depth + 1, false); //no longer maximising
        simulated_options[i] = "";
        if (bestScore < score) {
          bestMove = i;
          bestScore = score;
        }
      }
    }
    if (depth === 0) {
      return bestMove;
    }
    return bestScore;
  }
  if (!isMaximising) {
    let bestScore = Infinity;
    for (let i = 0; i < simulated_options.length; i++) {
      if (simulated_options[i] === "") {
        simulated_options[i] = "X";
        let score = best_move(depth + 1, true); //no longer maximising
        simulated_options[i] = "";
        if (bestScore > score) {
          bestScore = score;
        }
      }
    }
    return bestScore;
  }

  console.log(`nothing running`);
  return 0;
}

/*
let roundWon= false;
    for(let i=0;i<winConditions.length;i++){
        const condition = winConditions[i];
        const cellA=options[condition[0]];
        const cellB=options[condition[1]];
        const cellC=options[condition[2]];

        if(cellA == "" || cellB == "" || cellC == ""){
            continue;
        }
        if(cellA== cellB && cellB == cellC){
            roundWon = true;
            break;
        }
    }
    if(roundWon == true){
        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
    }
    else if(!options.includes("")){
        statusText.textContent = `Draw!`;
        running = false;
    }else{
        changePlayer();
    }

*/
